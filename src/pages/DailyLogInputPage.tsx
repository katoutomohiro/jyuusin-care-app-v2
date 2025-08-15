import React, { useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import SeizureForm from '../components/forms/SeizureForm';
import ExpressionForm from '../components/forms/ExpressionForm';
import { HydrationForm } from '../components/forms/HydrationForm';
import { PositioningForm } from '../components/forms/PositioningForm';
import { ExcretionForm } from '../components/forms/ExcretionForm';
import { SkinOralCareForm } from '../components/forms/SkinOralCareForm';
import MedicationForm from '../components/forms/MedicationForm';
import CommunicationForm from '../components/forms/CommunicationForm';
// import { exportDailyLogPdf } from "@/services/DailyLogExportService";
import { exportDailyLogPdf } from "../services/DailyLogExportService";
// import DailyLogA4Print from "@/components/DailyLogA4Print";
import DailyLogA4Print from "../components/DailyLogA4Print";
import { useReactToPrint } from "react-to-print";

const DailyLogInputPage: React.FC = () => {
  const { users, getUserById } = useData();
  const [selectedUserId, setSelectedUserId] = useLocalStorage<string>('dailyLogInputUserId', '');
  const user = getUserById(selectedUserId);

  // 日誌イベント保存ハンドラ
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const handleSaveEvent = async (eventData: any) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const newEvent = {
        id: Date.now().toString(),
        user_id: user.id,
        event_type: eventData.event_type,
        created_at: new Date().toISOString(),
        ...eventData
      };
      // localStorage保存
      const key = `daily_log_${user.id}`;
      const logs = JSON.parse(localStorage.getItem(key) || '[]');
      logs.push(newEvent);
      localStorage.setItem(key, JSON.stringify(logs));
      alert('日誌イベントを保存しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedUserId || !user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">日誌入力</h1>
        <p className="mb-4 text-red-600 font-semibold">必要な項目が未選択です。日誌トップから利用者を選んでください。</p>
        <div className="mb-4">
          <label>利用者選択：</label>
          <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} className="border p-2 rounded">
            <option value="">選択してください</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        <div className="mt-6">
          <a href="#/daily-log" className="text-blue-600 underline">日誌トップへ戻る</a>
        </div>
      </div>
    );
  }
  // 印刷用refとハンドラ
  const printRef = useRef<HTMLDivElement | null>(null);
  // @ts-ignore 型定義不一致回避（react-to-printの型が合わない場合）
  const handlePrint = useReactToPrint({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    content: () => printRef.current,
    documentTitle: "daily-log",
  });

  const handleExportPdf = async () => {
    try {
      if (!user) return;
      const key = `daily_log_${user.id}`;
      const logs = JSON.parse(localStorage.getItem(key) || '[]');
      const latestLog = logs.length > 0 ? logs[logs.length - 1] : {};
      const payload = {
        user: user,
        date: latestLog.created_at ? latestLog.created_at.slice(0, 10) : '',
        entries: logs,
        notes: latestLog.notes || '',
        ...latestLog
      };
      await exportDailyLogPdf(payload);
    } catch (e) { console.error(e); }
  };
  // 印刷用logとuser
  let printLog = null;
  if (user) {
    const key = `daily_log_${user.id}`;
    const logs = JSON.parse(localStorage.getItem(key) || '[]');
    printLog = logs.length > 0 ? logs[logs.length - 1] : null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">日誌入力</h1>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">印刷</button>
          <button onClick={handleExportPdf} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">PDF保存</button>
        </div>
      </div>
      <div className="mb-4">
        <label>利用者選択：</label>
        <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} className="border p-2 rounded">
          <option value="">選択してください</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        <SeizureForm onSave={handleSaveEvent} />
        <ExpressionForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />
        <HydrationForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />
        <PositioningForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />
        <ExcretionForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />
        <SkinOralCareForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />
        <MedicationForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />
        <CommunicationForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />
      </div>
      {/* 印刷用 hidden領域 */}
      <div style={{position:"absolute", left:-9999, top:-9999}}>
        <div ref={printRef}>
          {user && printLog && (
            <DailyLogA4Print user={user} log={printLog} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyLogInputPage;
