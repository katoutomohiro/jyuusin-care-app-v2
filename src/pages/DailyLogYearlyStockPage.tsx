import React from "react";
const makeDummy=(y:number)=>Array.from({length:12},(_,i)=>({m:i+1,t:0,s:0,w:0,p:0}));
export default function DailyLogYearlyStockPage(){
  const [year,setYear]=React.useState(new Date().getFullYear());
  const data=makeDummy(year);
  return (<div style={{maxWidth:900, margin:"16px auto", background:"#fff", padding:16}}>
    <h1>年間ストック（ダミー）</h1>
    <label>年: <input type="number" value={year} onChange={e=>setYear(Number(e.target.value))} style={{width:100}}/></label>
    <table border={1} cellPadding={6} style={{width:"100%", marginTop:12}}>
      <thead><tr><th>月</th><th>件数</th><th>発作</th><th>水分</th><th>体位</th></tr></thead>
      <tbody>{data.map(x=>(<tr key={x.m}><td>{x.m}</td><td>{x.t}</td><td>{x.s}</td><td>{x.w}</td><td>{x.p}</td></tr>))}</tbody>
    </table>
  </div>);
}
