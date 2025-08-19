import React from "react";

const makeDummy = (year:number) =>
  Array.from({length:12}, (_,i)=>({ month:i+1, total:0, seizure:0, water:0, posture:0 }));

const DailyLogYearlyStockPage: React.FC = () => {
  const [year,setYear] = React.useState(new Date().getFullYear());
  const data = makeDummy(year);
  return (
    <div style={{maxWidth:900, margin:"16px auto", background:"#fff", padding:16}}>
      <h1>年間ストック（ダミー）</h1>
      <label>年: <input type="number" value={year} onChange={e=>setYear(Number(e.target.value))} style={{width:100}}/></label>
      <table border={1} cellPadding={6} style={{width:"100%", marginTop:12}}>
        <thead><tr><th>月</th><th>件数</th><th>発作</th><th>水分</th><th>体位</th></tr></thead>
        <tbody>
          {data.map(m=>(
            <tr key={m.month}><td>{m.month}</td><td>{m.total}</td><td>{m.seizure}</td><td>{m.water}</td><td>{m.posture}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default DailyLogYearlyStockPage;
