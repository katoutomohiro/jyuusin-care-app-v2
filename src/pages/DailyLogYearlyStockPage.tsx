import React from "react";

const DailyLogYearlyStockPage = () => {
  return (
    <div style={{ padding: 32 }}>
      <h2>年間ストック</h2>
      <div style={{ marginTop: 24, background: "#fff", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px #0001" }}>
        <p>ここに年間ストックのダミー表が表示されます。</p>
      </div>
    </div>
  );
};

export default DailyLogYearlyStockPage;
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
// 不要な残骸を削除済み（ダミーのみ）
