export default function DailyLogPreviewPage(){
  return (<div className="a4" style={{maxWidth:800, margin:"0 auto", background:"#fff", padding:16}}>
    <div style={{display:"flex",justifyContent:"flex-end"}}><button onClick={()=>window.print()}>印刷</button></div>
    <h1>本日の記録（A4プレビュー・ダミー）</h1>
    <ul><li>発作:0</li><li>水分:0</li><li>体位:0</li></ul>
  </div>);
}
