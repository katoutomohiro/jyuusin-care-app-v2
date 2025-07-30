import React from 'react';
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">日誌入力</h1>
      <div className="mb-4">
        <label>利用者選択：</label>
        <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} className="border p-2 rounded">
          <option value="">選択してください</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>
      {user && (
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
      )}
    </div>
  );
};

export default DailyLogInputPage;
