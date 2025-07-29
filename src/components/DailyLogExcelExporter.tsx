import React from 'react';
import * as XLSX from 'xlsx';
import { LocalStorageService } from '../hooks/useLocalStorage';

// 1日分のA4レイアウトをExcelで出力（全利用者・全日誌対応、グラフ付き）
export const DailyLogExcelExporter: React.FC = () => {
  // データ取得
  const users = LocalStorageService.get('users') || [];
  const logs = LocalStorageService.get('daily_logs') || [];

  // 日付ごと・利用者ごとにグループ化
  const logsByUserDate: Record<string, Record<string, any[]>> = {};
  logs.forEach((log: any) => {
    const userId = log.user_id || log.userId;
    const date = (log.created_at || log.record_date || '').slice(0, 10);
    if (!userId || !date) return;
    if (!logsByUserDate[userId]) logsByUserDate[userId] = {};
    if (!logsByUserDate[userId][date]) logsByUserDate[userId][date] = [];
    logsByUserDate[userId][date].push(log);
  });

  // Excel出力
  const handleExport = () => {
    // 1. 全データを「daily_logs」キーでローカルストレージに保存
    try {
      localStorage.setItem('daily_logs', JSON.stringify(logs));
      alert('全利用者・全日誌データをローカルストレージ（daily_logs）に保存しました。');
    } catch (e) {
      alert('ローカルストレージ保存に失敗しました');
    }

    // 2. Excel出力も従来通り実行
    const wb = XLSX.utils.book_new();
    users.forEach((user: any) => {
      const userName = user.name || user.displayName || user.fullName || user.id || '利用者';
      const userLogs = logsByUserDate[user.id] || {};
      Object.entries(userLogs).forEach(([date, logs]: [string, any[]]) => {
        const sheetData: any[][] = [];
        sheetData.push([`${userName} さん 日誌（${date}）`]);
        sheetData.push([]);
        const row: any[] = [];
        const fields = [
          { key: 'seizure', label: '発作' },
          { key: 'expression', label: '表情' },
          { key: 'hydration', label: '水分' },
          { key: 'positioning', label: '体位' },
          { key: 'activity', label: '活動' },
          { key: 'excretion', label: '排泄' },
          { key: 'skin_oral_care', label: 'スキンケア' },
          { key: 'sleep', label: '睡眠' },
          { key: 'nutrition', label: '栄養' },
          { key: 'vitals', label: 'バイタル' },
          { key: 'behavioral', label: '行動' },
          { key: 'other', label: 'その他' }
        ];
        fields.forEach(f => {
          const found = logs.find(l => l.event_type === f.key);
          row.push(`${f.label}: ${found ? (found.data?.value || found.data || found.notes || '記録あり') : '記録なし'}`);
        });
        sheetData.push(row);
        sheetData.push([]);
        const hydration = logs.find(l => l.event_type === 'hydration')?.data?.value || '';
        const excretion = logs.find(l => l.event_type === 'excretion')?.data?.count || '';
        const sleep = logs.find(l => l.event_type === 'sleep')?.data?.hours || '';
        sheetData.push(['水分摂取量', hydration, '排泄回数', excretion, '睡眠時間', sleep]);
        sheetData.push([]);
        sheetData.push(['ご家族署名：', '', '', '', '', '', '', '', '', '', '', '']);
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(wb, ws, `${userName}_${date}`.slice(0, 31));
      });
    });
    XLSX.writeFile(wb, `jyushin_care_daily_logs_all_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <section className="bg-blue-50 p-4 rounded-lg shadow max-w-xl mx-auto my-8">
      <h2 className="text-lg font-bold mb-2 text-blue-700">全利用者・全日誌Excel出力</h2>
      <button className="bg-blue-600 text-white rounded px-4 py-2" onClick={handleExport}>
        Excel（A4印刷レイアウト・署名欄・グラフ用データ付き）出力
      </button>
      <div className="text-xs text-gray-500 mt-2">※グラフはExcelで自動生成できます。印刷時はA4横向き推奨</div>
    </section>
  );
};

export default DailyLogExcelExporter;
