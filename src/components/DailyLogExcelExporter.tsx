
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { LocalStorageService } from '../hooks/useLocalStorage';

// PROJECT_SOUL.mdのconvertToExcelFormatに準拠した全利用者・全日誌Excel出力
export const DailyLogExcelExporter: React.FC = () => {
  // localStorage内の"dailyLogs_"で始まる全キーを自動で集約
  const users = LocalStorageService.get('users') || [];
  let logs: any[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('dailyLogs_')) {
      try {
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(arr)) logs = logs.concat(arr);
      } catch {}
    }
  }

  // データ検証: 利用者・日誌が1件もなければ警告
  const [error, setError] = useState<string | null>(null);
  const validateData = () => {
    if (!users.length) return '利用者データがありません。記録前に利用者登録してください。';
    if (!logs.length) return '日誌データがありません。記録を追加してください。';
    return null;
  };

  // PROJECT_SOUL.mdのconvertToExcelFormatに近い形でデータ整形
  const header = [
    ['氏名', '日付', '体温', '血圧', '脈拍', 'SpO2', '排尿', '排便', '水分補給', '食事', '入浴', '課題', '特記', '署名'],
  ];
  const rows = logs.map((log: any) => [
    users.find((u: any) => u.id === (log.user_id || log.userId))?.name || (log.user_id || log.userId),
    log.record_date || log.created_at || log.date || '',
    log.vitals?.temp || log.vitals?.temperature || '',
    log.vitals?.bpSystolic && log.vitals?.bpDiastolic ? `${log.vitals.bpSystolic}/${log.vitals.bpDiastolic}` : (log.vitals?.bloodPressure ? `${log.vitals.bloodPressure.systolic}/${log.vitals.bloodPressure.diastolic}` : ''),
    log.vitals?.pulse || '',
    log.vitals?.spo2 || log.vitals?.spO2 || '',
    (log.excretion?.map?.((e: any) => `${e.time || ''}:${e.urine || ''}`).join('\n') || ''),
    (log.excretion?.map?.((e: any) => `${e.time || ''}:${e.stool || ''}`).join('\n') || ''),
    (log.hydration?.map?.((h: any) => `${h.time || ''}:${h.type || ''}:${h.amount || ''}`).join('\n') || ''),
    [log.meal?.breakfast, log.meal?.lunch, log.meal?.dinner].filter(Boolean).join('\n'),
    log.bath || '',
    log.tasks?.body || '',
    log.notes || '',
    log.signature || '',
  ]);

  // グラフ用データ: 日別・利用者別サマリー
  const graphHeader = [
    '日付', '氏名', '水分摂取量合計', '排尿回数', '排便回数', '平均体温', '平均脈拍', '平均SpO2', '最高血圧', '最低血圧', '朝食', '昼食', '夕食'
  ];
  // 日付・利用者ごとに集計
  const graphRows: any[] = [];
  const summaryMap: Record<string, any> = {};
  logs.forEach((log: any) => {
    const date = log.record_date || log.created_at || log.date || '';
    const userId = log.user_id || log.userId;
    const userName = users.find((u: any) => u.id === userId)?.name || userId;
    const key = `${date}_${userId}`;
    if (!summaryMap[key]) {
      summaryMap[key] = {
        date,
        userName,
        hydration: 0,
        urine: 0,
        stool: 0,
        tempSum: 0,
        tempCount: 0,
        pulseSum: 0,
        pulseCount: 0,
        spo2Sum: 0,
        spo2Count: 0,
        bpSystolicMax: null,
        bpDiastolicMin: null,
        breakfast: '',
        lunch: '',
        dinner: ''
      };
    }
    // 水分
    if (Array.isArray(log.hydration)) {
      summaryMap[key].hydration += log.hydration.reduce((sum: number, h: any) => sum + Number(h.amount || 0), 0);
    }
    // 排尿・排便
    if (Array.isArray(log.excretion)) {
      summaryMap[key].urine += log.excretion.filter((e: any) => e.urine).length;
      summaryMap[key].stool += log.excretion.filter((e: any) => e.stool).length;
    }
    // 体温
    const temp = log.vitals?.temp || log.vitals?.temperature;
    if (temp) {
      summaryMap[key].tempSum += Number(temp);
      summaryMap[key].tempCount++;
    }
    // 脈拍
    const pulse = log.vitals?.pulse;
    if (pulse) {
      summaryMap[key].pulseSum += Number(pulse);
      summaryMap[key].pulseCount++;
    }
    // SpO2
    const spo2 = log.vitals?.spo2 || log.vitals?.spO2;
    if (spo2) {
      summaryMap[key].spo2Sum += Number(spo2);
      summaryMap[key].spo2Count++;
    }
    // 血圧
    const sys = log.vitals?.bpSystolic || log.vitals?.bloodPressure?.systolic;
    const dia = log.vitals?.bpDiastolic || log.vitals?.bloodPressure?.diastolic;
    if (sys) {
      summaryMap[key].bpSystolicMax = summaryMap[key].bpSystolicMax === null ? Number(sys) : Math.max(summaryMap[key].bpSystolicMax, Number(sys));
    }
    if (dia) {
      summaryMap[key].bpDiastolicMin = summaryMap[key].bpDiastolicMin === null ? Number(dia) : Math.min(summaryMap[key].bpDiastolicMin, Number(dia));
    }
    // 食事
    if (log.meal?.breakfast) summaryMap[key].breakfast = log.meal.breakfast;
    if (log.meal?.lunch) summaryMap[key].lunch = log.meal.lunch;
    if (log.meal?.dinner) summaryMap[key].dinner = log.meal.dinner;
  });
  Object.values(summaryMap).forEach((s: any) => {
    graphRows.push([
      s.date,
      s.userName,
      s.hydration,
      s.urine,
      s.stool,
      s.tempCount ? (s.tempSum / s.tempCount).toFixed(1) : '',
      s.pulseCount ? Math.round(s.pulseSum / s.pulseCount) : '',
      s.spo2Count ? Math.round(s.spo2Sum / s.spo2Count) : '',
      s.bpSystolicMax ?? '',
      s.bpDiastolicMin ?? '',
      s.breakfast,
      s.lunch,
      s.dinner
    ]);
  });

  // Excel出力
  const handleExport = () => {
    const err = validateData();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      localStorage.setItem('daily_logs', JSON.stringify(logs));
    } catch {}
    const wb = XLSX.utils.book_new();
    // 1シートに全員分まとめて出力
    const sheetData = [
      ...header,
      ...rows,
      [],
      graphHeader,
      ...graphRows,
      [],
      ['ご家族署名：', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['職員署名：', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['ご家族署名：', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['職員署名：', '', '', '', '', '', '', '', '', '', '', '', '', '']
    ];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    // 印刷レイアウト（A4横）推奨: 列幅調整
    const wscols = [
      { wch: 12 }, { wch: 12 }, { wch: 8 }, { wch: 10 }, { wch: 8 }, { wch: 8 },
      { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 8 }, { wch: 8 }, { wch: 16 }, { wch: 12 }
    ];
    ws['!cols'] = wscols;
    wb.SheetNames.push('全利用者日誌');
    wb.Sheets['全利用者日誌'] = ws;
    XLSX.writeFile(wb, `jyushin_care_daily_logs_all_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <section className="bg-blue-50 p-4 rounded-lg shadow max-w-xl mx-auto my-8">
      <h2 className="text-lg font-bold mb-2 text-blue-700">全利用者・全日誌Excel出力</h2>
      {error && (
        <div className="bg-red-100 text-red-700 rounded p-2 mb-2">{error}</div>
      )}
      <button className="bg-blue-600 text-white rounded px-4 py-2" onClick={handleExport}>
        Excel（A4印刷レイアウト・署名欄・グラフ用データ付き）出力
      </button>
      <div className="text-xs text-gray-500 mt-2">※グラフはExcelで自動生成できます。印刷時はA4横向き推奨</div>
    </section>
  );
};

export default DailyLogExcelExporter;
