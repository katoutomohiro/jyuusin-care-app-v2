
import React from 'react';
import type { User as UserType } from '../../types';
import ExcelJS from 'exceljs';
import { useData } from '../contexts/DataContext';

const UserCareExcelTemplateExporter: React.FC<{ userId: string }> = ({ userId }) => {
  const { users, getDailyLogsByUser } = useData();
  const user = users.find(u => u.id === userId);
  const logs = getDailyLogsByUser(userId);
  // 最新の日誌を取得（配列末尾）
  const latestLog = logs && logs.length > 0 ? logs[logs.length - 1] : null;

  // 各種イベントの最新データ取得ユーティリティ
  const getLatest = (arr: any[] | undefined) => (arr && arr.length > 0 ? arr[arr.length - 1] : null);

  const exportToExcel = async () => {
    if (!user || !latestLog) {
      alert('利用者データまたは日誌データがありません');
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`${user.name} ケース記録`);

    // タイトル
    sheet.mergeCells('A1', 'I1');
    sheet.getCell('A1').value = `${user.name} 様　ケース記録`;
    sheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

    // 日付・担当
    sheet.getCell('A2').value = `日付: ${latestLog.record_date || ''}`;
    sheet.getCell('D2').value = `担当: `;
    sheet.mergeCells('G2', 'I2');
    sheet.getCell('G2').value = `記録者: `;

    // バイタル
    sheet.mergeCells('A3', 'A4');
    sheet.getCell('A3').value = 'バイタル';
    sheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('B3').value = '体温';
    sheet.getCell('C3').value = '脈拍';
    sheet.getCell('D3').value = '血圧';
    sheet.getCell('E3').value = 'SpO2';
    sheet.getCell('F3').value = '呼吸';
    sheet.getCell('G3').value = '意識';
    sheet.getCell('H3').value = 'その他';
    sheet.getCell('I3').value = '';
    // バイタルデータ
    const vitals = latestLog.vitals || {};
    sheet.getCell('B4').value = vitals.temperature ?? '記録なし';
    sheet.getCell('C4').value = vitals.pulse ?? '記録なし';
    sheet.getCell('D4').value = vitals.bloodPressure ? `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}` : '記録なし';
    sheet.getCell('E4').value = vitals.spO2 ?? '記録なし';
    sheet.getCell('F4').value = vitals.respiration ?? '';
    sheet.getCell('G4').value = vitals.consciousness ?? '';
    sheet.getCell('H4').value = vitals.other ?? '';

    // 発作
    const seizure = getLatest(latestLog.seizure_events);
    sheet.getCell('A5').value = '発作';
    sheet.mergeCells('B5', 'I5');
    sheet.getCell('B5').value = seizure ? `${seizure.seizure_type} (${seizure.duration_seconds}s) ${seizure.notes || ''}` : 'なし';

    // 表情・反応
    const expression = getLatest(latestLog.expression_events);
    sheet.getCell('A6').value = '表情・反応';
    sheet.mergeCells('B6', 'I6');
    sheet.getCell('B6').value = expression ? `${expression.specific_expression || ''} (${expression.expression_score}/5) ${expression.notes || ''}` : '記録なし';

    // 水分
    const hydration = getLatest(latestLog.hydration_events);
    sheet.getCell('A7').value = '水分';
    sheet.mergeCells('B7', 'E7');
    sheet.getCell('B7').value = hydration ? `${hydration.volume_ml}ml (${hydration.fluid_type})` : '記録なし';

    // 食事
    sheet.getCell('F7').value = '食事';
    sheet.mergeCells('F7', 'I7');
    sheet.getCell('F8').value = latestLog.meal_intake ? Object.entries(latestLog.meal_intake).map(([k,v]) => `${k}:${v}`).join(', ') : '記録なし';

    // 排泄
    sheet.getCell('A8').value = '排泄';
    sheet.mergeCells('B8', 'I8');
    sheet.getCell('B8').value = latestLog.toileting && latestLog.toileting.length > 0 ? latestLog.toileting.map((t: any) => `${t.time} ${t.type} ${t.amount}`).join(', ') : '記録なし';

    // 睡眠
    const sleep = getLatest(latestLog.sleep_events);
    sheet.getCell('A9').value = '睡眠';
    sheet.mergeCells('B9', 'I9');
    sheet.getCell('B9').value = sleep ? `${sleep.duration_minutes}分 (${sleep.quality_score}/5) ${sleep.notes || ''}` : '記録なし';

    // 咳・ムセ
    const cough = getLatest(latestLog.cough_choke_events);
    sheet.getCell('A10').value = '咳・ムセ';
    sheet.mergeCells('B10', 'I10');
    sheet.getCell('B10').value = cough ? `${cough.event_type} (${cough.severity}) ${cough.notes || ''}` : '記録なし';

    // 活動
    const activity = getLatest(latestLog.activity_events);
    sheet.getCell('A11').value = '活動';
    sheet.mergeCells('B11', 'I11');
    sheet.getCell('B11').value = activity ? `${activity.activity_type} (${activity.participation_level}/5) ${activity.mood_during_activity || ''} ${activity.notes || ''}` : '記録なし';

    // 経管栄養
    const tube = getLatest(latestLog.tube_feeding_events);
    sheet.getCell('A12').value = '経管栄養';
    sheet.mergeCells('B12', 'I12');
    sheet.getCell('B12').value = tube ? `${tube.volume_ml}ml (${tube.formula_type}) ${tube.notes || ''}` : '記録なし';

    // ポジショニング
    const pos = getLatest(latestLog.positioning_events);
    sheet.getCell('A13').value = 'ポジショニング';
    sheet.mergeCells('B13', 'I13');
    sheet.getCell('B13').value = pos ? `${pos.position_type} ${pos.duration_minutes}分 ${pos.notes || ''}` : '記録なし';

    // 特記
    sheet.getCell('A14').value = '特記';
    sheet.mergeCells('B14', 'I14');
    sheet.getCell('B14').value = latestLog.special_notes_details || (latestLog.special_notes && latestLog.special_notes.length > 0 ? latestLog.special_notes.map((n: any) => n.details).join(' / ') : '記録なし');

    // その他
    sheet.getCell('A15').value = 'その他';
    sheet.mergeCells('B15', 'I15');
    sheet.getCell('B15').value = latestLog.other_notes || '';

    // 署名欄
    sheet.getCell('A17').value = 'ご家族署名:';

    // 罫線・列幅・高さ
    for (let row = 1; row <= 17; row++) {
      sheet.getRow(row).height = 22;
      for (let col = 1; col <= 9; col++) {
        const cell = sheet.getCell(row, col);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    }
    sheet.columns = [
      { width: 12 }, { width: 16 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }
    ];

    // ファイル保存
    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.name || 'user'}_case_record_${latestLog.record_date || ''}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!user || !latestLog) {
    return (
      <div className="text-red-600 p-4">利用者データまたは日誌データがありません</div>
    );
  }
  return (
    <section className="bg-blue-50 p-4 rounded-lg shadow max-w-xl mx-auto my-8">
      <h2 className="text-lg font-bold mb-2 text-blue-700">帳票型Excel出力</h2>
      <button className="bg-blue-600 text-white rounded px-4 py-2" onClick={exportToExcel}>
        帳票型Excel出力（この利用者）
      </button>
      <div className="text-xs text-gray-500 mt-2">※帳票レイアウト・項目は現場要望に応じて調整可能です。</div>
    </section>
  );
};

export default UserCareExcelTemplateExporter;
