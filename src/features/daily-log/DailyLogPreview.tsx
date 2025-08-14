import React from "react";

// まずはエイリアス版（@ が使える場合）
import data from "@/data/dailyLog.sample.json";

// 予備：@ が解決できない環境向け（コメントのまま残す）
// import data from "../../data/dailyLog.sample.json";

type Row = {
  id: number | string;
  date: string;
  name: string;
  summary: string;
};

export default function DailyLogPreview() {
  const items = (data as Row[]) ?? [];

  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>日誌プレビュー</h1>

      {items.length === 0 ? (
        <p>データがありません。</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((row) => (
            <li
              key={row.id}
              style={{
                padding: 12,
                marginBottom: 8,
                border: "1px solid #ddd",
                borderRadius: 8,
              }}
            >
              <div style={{ fontWeight: 700 }}>{row.date}</div>
              <div>
                <span style={{ fontWeight: 600 }}>{row.name}</span>
                <span>：{row.summary}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
