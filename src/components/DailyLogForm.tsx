import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// UI設計思想：
// ・現場での“迷いゼロ”を目指し、1画面1目的・大きなボタン・色分け・直感的な入力
// ・バイタル・排泄・水分・食事・活動・発作・医療ケア・特記事項・署名を1画面で完結
// ・緊急時はどこからでも「緊急対応」ボタンで即アラート
// ・署名はタッチ入力（canvas）
// ・Excel出力はワンタップ

const initialLog = {
  userId: '',
  date: new Date().toISOString().slice(0, 10),
  vitals: { temp: '', pulse: '', spo2: '', bpSystolic: '', bpDiastolic: '' },
  excretion: [],
  hydration: [],
  meal: { breakfast: '', lunch: '', dinner: '' },
  bath: '',
  tasks: { body: '' },
  notes: '',
  signature: '',
};

export default function DailyLogForm() {
  const { users, getUserById } = useData();
  const [log, setLog] = useState(initialLog);
  const [logs, setLogs] = useState([]);
  const [showSignature, setShowSignature] = useState(false);

  // Excel出力
  const handleExportExcel = () => {
    // PROJECT_SOUL.md記載の変換関数を利用
    // getUserByIdがPromise<User>の場合、事前に全ユーザーをMap化して参照
    const userMap = new Map(users.map(u => [u.id, u.name]));
    const convertToExcelFormat = (logs) => {
      const header = [
        ['氏名', '日付', '体温', '血圧', '脈拍', 'SpO2', '排尿', '排便', '水分補給', '食事', '入浴', '課題', '特記', '署名'],
      ];
      const rows = logs.map(log => [
        userMap.get(log.userId) || '',
        log.date,
        log.vitals.temp,
        `${log.vitals.bpSystolic}/${log.vitals.bpDiastolic}`,
        log.vitals.pulse,
        log.vitals.spo2,
        log.excretion.map(e => `${e.time}:${e.urine}`).join('\n'),
        log.excretion.map(e => `${e.time}:${e.stool}`).join('\n'),
        log.hydration.map(h => `${h.time}:${h.type}:${h.amount}`).join('\n'),
        `${log.meal.breakfast}\n${log.meal.lunch}\n${log.meal.dinner}`,
        log.bath,
        log.tasks.body,
        log.notes,
        log.signature,
      ]);
      // グラフ用データ
      const graphHeader = [
        '日付', '氏名', '水分摂取量合計', '排尿回数', '排便回数', '平均体温', '平均脈拍', '平均SpO2', '最高血圧', '最低血圧', '朝食', '昼食', '夕食'
      ];
      const graphRows = logs.map(log => [
        log.date,
        userMap.get(log.userId) || '',
        log.hydration.reduce((sum, h) => sum + Number(h.amount), 0),
        log.excretion.filter(e => e.urine).length,
        log.excretion.filter(e => e.stool).length,
        log.vitals.temp,
        log.vitals.pulse,
        log.vitals.spo2,
        log.vitals.bpSystolic,
        log.vitals.bpDiastolic,
        log.meal.breakfast,
        log.meal.lunch,
        log.meal.dinner,
      ]);
      return [...header, ...rows, [], graphHeader, ...graphRows];
    };
    const ws = XLSX.utils.aoa_to_sheet(convertToExcelFormat(logs));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '日誌');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'care-daily-log.xlsx');
  };

  // 緊急対応ボタン
  const handleEmergency = () => {
    alert('緊急対応アラートを発信しました！\n（実装例：管理者・看護師に即時通知）');
  };

  // 署名入力（canvas）
  // ...省略（サンプルUIのみ）

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-2">日誌入力フォーム</h1>
      <button
        className="bg-red-500 text-white text-2xl p-6 rounded-lg min-h-[80px] min-w-[200px]"
        onClick={handleEmergency}
        aria-label="緊急時対応ボタン"
      >
        🚨 緊急対応
      </button>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-lg shadow p-4">
        {/* 利用者選択 */}
        <div>
          <label className="font-bold">利用者</label>
          <select
            className="w-full p-2 border rounded"
            value={log.userId}
            onChange={e => setLog({ ...log, userId: e.target.value })}
          >
            <option value="">選択してください</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        {/* 日付 */}
        <div>
          <label className="font-bold">日付</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={log.date}
            onChange={e => setLog({ ...log, date: e.target.value })}
          />
        </div>
        {/* バイタル */}
        <div>
          <label className="font-bold">体温</label>
          <input type="number" step="0.1" min="34" max="42" className="w-full p-2 border rounded" value={log.vitals.temp} onChange={e => setLog({ ...log, vitals: { ...log.vitals, temp: e.target.value } })} />
        </div>
        <div>
          <label className="font-bold">脈拍</label>
          <input type="number" min="40" max="180" className="w-full p-2 border rounded" value={log.vitals.pulse} onChange={e => setLog({ ...log, vitals: { ...log.vitals, pulse: e.target.value } })} />
        </div>
        <div>
          <label className="font-bold">SpO₂</label>
          <input type="number" min="80" max="100" className="w-full p-2 border rounded" value={log.vitals.spo2} onChange={e => setLog({ ...log, vitals: { ...log.vitals, spo2: e.target.value } })} />
        </div>
        <div>
          <label className="font-bold">血圧（上/下）</label>
          <div className="flex gap-2">
            <input type="number" min="60" max="240" className="w-1/2 p-2 border rounded" placeholder="上" value={log.vitals.bpSystolic} onChange={e => setLog({ ...log, vitals: { ...log.vitals, bpSystolic: e.target.value } })} />
            <input type="number" min="30" max="140" className="w-1/2 p-2 border rounded" placeholder="下" value={log.vitals.bpDiastolic} onChange={e => setLog({ ...log, vitals: { ...log.vitals, bpDiastolic: e.target.value } })} />
          </div>
        </div>
        {/* 排泄・水分・食事・入浴・課題・特記・署名欄などは省略（実装例） */}
        {/* ... */}
      </form>
      <div className="flex gap-4 mt-4">
        <button
          className="bg-blue-600 text-white text-xl px-8 py-4 rounded-lg shadow"
          onClick={handleExportExcel}
        >
          Excel出力
        </button>
        <button
          className="bg-gray-400 text-white text-xl px-8 py-4 rounded-lg shadow"
          onClick={() => setShowSignature(true)}
        >
          署名入力
        </button>
      </div>
      {/* 署名入力UI例 */}
      {showSignature && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <p>（ここにcanvasで署名入力UIを実装）</p>
          <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded" onClick={() => setShowSignature(false)}>署名完了</button>
        </div>
      )}
    </div>
  );
}
