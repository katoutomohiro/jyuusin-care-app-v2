import React, { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';

export type YearlyStockSummary = {
  month: number;
  count: number;
  categoryCounts: Record<string, number>;
};

const getYear = (dateStr: string) => dateStr?.slice(0, 4);
const getMonth = (dateStr: string) => parseInt(dateStr?.slice(5, 7) || '0', 10);

const thisYear = new Date().getFullYear();

const DailyLogYearlyStockPage: React.FC = () => {
  const { dailyLogsByUser } = useData();
  const [year, setYear] = useState<number>(thisYear);

  // 全ユーザー分を集計
  const logs = useMemo(() => Object.values(dailyLogsByUser).flat(), [dailyLogsByUser]);
  const filtered = logs.filter((log: any) => getYear(log.created_at || '') === String(year));

  // 月ごと・カテゴリごと集計
  const summary: YearlyStockSummary[] = useMemo(() => {
    const byMonth: Record<number, YearlyStockSummary> = {};
    for (let m = 1; m <= 12; m++) {
      byMonth[m] = { month: m, count: 0, categoryCounts: {} };
    }
    filtered.forEach((log: any) => {
      const m = getMonth(log.created_at || '');
      if (!m) return;
      byMonth[m].count++;
      const cat = log.event_type || '未分類';
      byMonth[m].categoryCounts[cat] = (byMonth[m].categoryCounts[cat] || 0) + 1;
    });
    return Object.values(byMonth);
  }, [filtered]);

  // 年リスト（ダミー: 直近5年）
  const years = Array.from({ length: 5 }, (_, i) => thisYear - i);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">年間ストック</h1>
        <select value={year} onChange={e => setYear(Number(e.target.value))} className="border rounded px-2 py-1">
          {years.map(y => <option key={y} value={y}>{y}年</option>)}
        </select>
      </div>
      <div className="bg-white shadow rounded p-4">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">月</th>
              <th className="border px-2 py-1">件数</th>
              <th className="border px-2 py-1">カテゴリ別内訳</th>
            </tr>
          </thead>
          <tbody>
            {summary.map(row => (
              <tr key={row.month}>
                <td className="border px-2 py-1">{row.month}月</td>
                <td className="border px-2 py-1">{row.count}</td>
                <td className="border px-2 py-1">
                  {Object.entries(row.categoryCounts).map(([cat, cnt]) => (
                    <span key={cat} className="inline-block mr-2">{cat}: {cnt}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyLogYearlyStockPage;
