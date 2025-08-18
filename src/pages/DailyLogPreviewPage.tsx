import React from 'react';
import { useData } from '../contexts/DataContext';

// 印刷用スタイル
const printStyle = `
@media print {
  @page { size: A4; margin: 12mm; }
  .no-print { display: none !important; }
}
`;

const DailyLogPreviewPage: React.FC = () => {
  const { dailyLogsByUser, users } = useData();
  const today = new Date().toISOString().slice(0, 10);
  // 全ユーザー分の本日分を抽出
  const todayLogs = Object.values(dailyLogsByUser).flat().filter((log: any) => (log.created_at || '').slice(0, 10) === today);

  return (
    <div className="p-6">
      <style>{printStyle}</style>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">A4日誌プレビュー（本日分）</h1>
        <button className="no-print px-4 py-2 bg-blue-600 text-white rounded" onClick={() => window.print()}>印刷</button>
      </div>
      {todayLogs.length === 0 ? (
        <div className="text-gray-500">本日分の日誌データがありません。</div>
      ) : (
        <div className="bg-white shadow rounded p-4 print:p-0">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">利用者</th>
                <th className="border px-2 py-1">記録者</th>
                <th className="border px-2 py-1">内容</th>
                <th className="border px-2 py-1">時刻</th>
              </tr>
            </thead>
            <tbody>
              {todayLogs.map((log: any) => (
                <tr key={log.log_id}>
                  <td className="border px-2 py-1">{log.userId || log.user_id}</td>
                  <td className="border px-2 py-1">{log.recorder_name || log.author}</td>
                  <td className="border px-2 py-1">{log.content || log.summary || '-'}</td>
                  <td className="border px-2 py-1">{(log.created_at || log.event_timestamp || '').slice(11, 16)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DailyLogPreviewPage;
