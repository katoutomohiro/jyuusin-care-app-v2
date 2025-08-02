import React from 'react';
import { DailyLog, User } from '../types';

interface Props {
  user: User;
  log: DailyLog;
}

/**
 * 日誌A4印刷用コンポーネント
 * - 1日分の利用者日誌をA4レイアウトで美しく表示
 * - 印刷/保存ボタンでPDF化も可能
 */
const DailyLogA4Print: React.FC<Props> = ({ user, log }) => {
  return (
    <div className="a4-print bg-white p-8 rounded shadow-xl" style={{ width: '210mm', minHeight: '297mm', margin: 'auto' }}>
      <h1 className="text-2xl font-bold mb-2">{user.name} 様 日誌記録</h1>
      <div className="mb-2 text-sm text-gray-600">日付: {log.record_date}　記録者: {log.author}</div>
      <table className="w-full border mb-4 text-sm">
        <tbody>
          <tr><th className="bg-gray-100 w-32">バイタル</th><td>{log.vitals ? `${log.vitals.temperature}℃ / ${log.vitals.pulse}拍 / SpO2:${log.vitals.spO2}` : '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">発作</th><td>{log.seizures && log.seizures.length > 0 ? log.seizures.map(s => s.type).join(', ') : 'なし'}</td></tr>
          <tr><th className="bg-gray-100">表情・反応</th><td>{log.expression ? JSON.stringify(log.expression) : '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">水分</th><td>{log.hydration ? `${log.hydration}ml` : '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">排泄</th><td>{log.excretion ? JSON.stringify(log.excretion) : '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">睡眠</th><td>{log.sleep ? JSON.stringify(log.sleep) : '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">活動</th><td>{log.activity ? JSON.stringify(log.activity) : '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">服薬</th><td>{log.medication ? JSON.stringify(log.medication) : '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">特記事項</th><td>{log.special_notes && log.special_notes.length > 0 ? log.special_notes.map(n => n.details).join(' / ') : 'なし'}</td></tr>
          <tr><th className="bg-gray-100">その他</th><td>{log.other ? JSON.stringify(log.other) : 'なし'}</td></tr>
        </tbody>
      </table>
      <div className="mt-8 flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded print:hidden" onClick={() => window.print()}>印刷 / PDF保存</button>
      </div>
    </div>
  );
};

export default DailyLogA4Print;
