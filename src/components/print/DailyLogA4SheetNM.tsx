import React from 'react';
import { User } from '../../types';
import { LogEntry, normalizeForSheet } from '../../services/DailyLogQuery';

interface Props {
  user: User;
  logs: LogEntry[];
  date: string;
  rows?: string[];
}

/**
 * N・M様式 A4日誌シート
 * - 全カテゴリ網羅・印刷/プレビュー用
 */

// rowsからカテゴリ要約を抽出
function pick(rows: string[]|undefined, tag: string): string {
  if (!rows || rows.length===0) return '';
  const hits = rows.filter(r => r.startsWith(`[${tag}]`)).map(r => r.replace(`[${tag}] `,''));
  return hits.join(' ・ ');
}

const DailyLogA4SheetNM: React.FC<Props> = ({ user, logs, date, rows }) => {
  // rows優先、なければ従来方式
  const entry = logs[0];
  return (
    <div className="a4-print bg-white p-8 rounded shadow-xl" style={{ width: '210mm', minHeight: '297mm', margin: 'auto', fontSize: '12px' }}>
      <h1 className="text-xl font-bold mb-2">{user.name} 様 日誌記録（N・M様式）</h1>
      <div className="mb-2 text-sm text-gray-600">日付: {date}　記録者: {entry?.author ?? '---'}</div>
      <table className="w-full border mb-4 text-xs">
        <tbody>
          <tr><th className="bg-gray-100 w-32">バイタル</th><td>{pick(rows,'バイタル') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">発作</th><td>{pick(rows,'発作') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">表情・反応</th><td>{pick(rows,'表情・反応') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">水分</th><td>{pick(rows,'水分') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">経管栄養</th><td>{pick(rows,'経管栄養') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">体位</th><td>{pick(rows,'体位') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">活動</th><td>{pick(rows,'活動') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">排泄</th><td>{pick(rows,'排泄') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">皮膚・口腔ケア</th><td>{pick(rows,'皮膚・口腔ケア') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">体調・発熱</th><td>{pick(rows,'体調・発熱') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">咳・誤嚥</th><td>{pick(rows,'咳・誤嚥') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">投薬</th><td>{pick(rows,'投薬') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">睡眠</th><td>{pick(rows,'睡眠') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">行動</th><td>{pick(rows,'行動') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">コミュニケーション</th><td>{pick(rows,'コミュニケーション') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">リハビリ</th><td>{pick(rows,'リハビリ') || '記録なし'}</td></tr>
          <tr><th className="bg-gray-100">その他</th><td>{pick(rows,'その他') || '記録なし'}</td></tr>
        </tbody>
      </table>

      {/* デバッグ: rows配列の内容を下部に小さく表示（開発時のみ） */}
      {process.env.NODE_ENV === 'development' && rows && (
        <div style={{ fontSize: '10px', color: '#888', marginTop: 12, wordBreak: 'break-all', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
          <div>rows.length: {rows.length}</div>
          <div>{rows.slice(0, 8).join('\n')}</div>
        </div>
      )}
    </div>
  );
};

export default DailyLogA4SheetNM;
