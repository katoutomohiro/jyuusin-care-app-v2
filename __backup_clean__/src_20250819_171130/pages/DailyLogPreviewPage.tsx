import React from "react";

const DailyLogPreviewPage: React.FC = () => {
  const onPrint = () => window.print();
  return (
    <div className="a4">
      <div className="no-print" style={{display:"flex",justifyContent:"flex-end",gap:8,margin:"8px 0"}}>
        <button onClick={onPrint}>印刷</button>
      </div>
      <h1>本日の記録（A4プレビュー・ダミー）</h1>
      <ul>
        <li>発作: 0</li>
        <li>水分: 0</li>
        <li>体位: 0</li>
      </ul>
      <style>{`
        @media print{ @page{ size:A4; margin:12mm } .no-print{ display:none !important } }
        .a4{ max-width:800px; margin:0 auto; background:#fff; padding:16px; }
      `}</style>
    </div>
  );
};
export default DailyLogPreviewPage;
