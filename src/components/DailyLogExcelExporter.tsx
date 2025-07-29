import React from 'react';
import ExcelJS from 'exceljs';
import { LocalStorageService } from '../hooks/useLocalStorage';

// 1日分のA4レイアウトをExcelで出力（全利用者・全日誌対応、グラフ付き）
interface DailyLogExcelExporterProps {
  selectedUserId: string;
}

export const DailyLogExcelExporter: React.FC<DailyLogExcelExporterProps> = ({ selectedUserId }) => {
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
  const handleExport = async () => {
    // 全利用者分まとめて出力
    if (users.length === 0) {
      alert('利用者データがありません');
      return;
    }
    try {
      localStorage.setItem('daily_logs', JSON.stringify(logs));
      alert('全利用者分の日誌データをローカルストレージ（daily_logs）に保存しました。');
    } catch (e) {
      alert('ローカルストレージ保存に失敗しました');
    }

    // ExcelJSで新規ワークブック作成
    const workbook = new ExcelJS.Workbook();
    users.forEach((user: any) => {
      const userName = user.name || user.displayName || user.fullName || user.id || '利用者';
      const userLogs = logsByUserDate[user.id] || {};
      Object.entries(userLogs).forEach(([date, logs]: [string, any[]]) => {
        const sheet = workbook.addWorksheet(`${userName}_${date}`.slice(0, 31));
        sheet.addRow([`${userName} さん 日誌（${date}）`]);
        sheet.addRow([]);

        // ▼▼▼ 重症心身障害児者に特化した医療ケア項目の集計 ▼▼▼
        // 発作
        const seizureLogs = logs.filter(l => l.event_type === 'seizure');
        const seizureCount = seizureLogs.length;
        const seizureTimes = seizureLogs.map(l => l.data?.time || l.created_at || '').join(', ');
        const seizureSeverity = seizureLogs.map(l => l.data?.severity || '').join(', ');

        // 水分摂取量
        const hydrationLogs = logs.filter(l => l.event_type === 'hydration');
        const hydrationTotal = hydrationLogs.reduce((sum, l) => sum + (Number(l.data?.value) || 0), 0);

        // 排泄回数
        const excretionLogs = logs.filter(l => l.event_type === 'excretion');
        const excretionTotal = excretionLogs.reduce((sum, l) => sum + (Number(l.data?.count) || 0), 0);

        // 睡眠時間
        const sleepLogs = logs.filter(l => l.event_type === 'sleep');
        const sleepTotal = sleepLogs.reduce((sum, l) => sum + (Number(l.data?.hours) || 0), 0);

        // ▼▼▼ 表形式で出力 ▼▼▼
        sheet.addRow(['医療ケア項目', '値', '詳細']);
        sheet.addRow(['発作回数', seizureCount, `時間: ${seizureTimes} / 重症度: ${seizureSeverity}`]);
        sheet.addRow(['水分摂取量(ml)', hydrationTotal, '']);
        sheet.addRow(['排泄回数', excretionTotal, '']);
        sheet.addRow(['睡眠時間(h)', sleepTotal, '']);
        sheet.addRow([]);

        // ▼▼▼ グラフ用データ（Excelでグラフ化しやすい形式） ▼▼▼
        sheet.addRow(['グラフ用データ']);
        sheet.addRow(['項目', '値']);
        sheet.addRow(['発作回数', seizureCount]);
        sheet.addRow(['水分摂取量(ml)', hydrationTotal]);
        sheet.addRow(['排泄回数', excretionTotal]);
        sheet.addRow(['睡眠時間(h)', sleepTotal]);
        sheet.addRow([]);
        // VBAマクロコードをテキストとして出力（Excelで開いた後、標準モジュールに貼り付けて実行可能）
        sheet.addRow(['--- 以下を標準モジュールに貼り付けるとグラフが自動生成されます ---']);
        sheet.addRow(['Sub CreateCarePieChart()']);
        sheet.addRow(['    Dim ws As Worksheet']);
        sheet.addRow(['    Set ws = ActiveSheet']);
        sheet.addRow(['    Dim chartObj As ChartObject']);
        sheet.addRow(['    Set chartObj = ws.ChartObjects.Add(Left:=300, Width:=400, Top:=100, Height:=300)']);
        sheet.addRow(['    chartObj.Chart.ChartType = xlPie']);
        sheet.addRow(['    chartObj.Chart.SetSourceData Source:=ws.Range("B12:B15")']);
        sheet.addRow(['    chartObj.Chart.SeriesCollection(1).XValues = ws.Range("A12:A15")']);
        sheet.addRow(['    chartObj.Chart.HasTitle = True']);
        sheet.addRow(['    chartObj.Chart.ChartTitle.Text = "医療ケア項目グラフ"']);
        sheet.addRow(['End Sub']);
        sheet.addRow(['--- ここまで ---']);

        // ▼▼▼ イベント件数グラフ用データ（従来通り） ▼▼▼
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
        const eventCounts: { [key: string]: number } = {};
        fields.forEach(f => {
          eventCounts[f.label] = logs.filter(l => l.event_type === f.key).length;
        });
        sheet.addRow(['イベント別記録件数']);
        sheet.addRow(['イベント', '件数']);
        Object.entries(eventCounts).forEach(([label, count]) => {
          sheet.addRow([label, count]);
        });
        sheet.addRow([]);

        // ▼▼▼ ご家族署名欄 ▼▼▼
        sheet.addRow(['ご家族署名：', '', '', '', '', '', '', '', '', '', '', '']);
      });
    });
    // ファイル保存
    await workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jyushin_care_daily_logs_all_users_${new Date().toISOString().slice(0,10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  // JSX部分（1クリックで全利用者分出力）
  return (
    <section className="bg-blue-50 p-4 rounded-lg shadow max-w-xl mx-auto my-8">
      <h2 className="text-lg font-bold mb-2 text-blue-700">全利用者分Excel出力</h2>
      <button className="bg-blue-600 text-white rounded px-4 py-2" onClick={handleExport}>
        Excel（A4印刷レイアウト・署名欄・グラフ用データ付き）全員分出力
      </button>
      <div className="text-xs text-gray-500 mt-2">※全利用者分が出力されます。印刷時はA4横向き推奨</div>
    </section>
  );

}
export default DailyLogExcelExporter;
