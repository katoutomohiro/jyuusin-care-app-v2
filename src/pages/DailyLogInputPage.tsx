import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const DailyLogInputPage: React.FC = () => {
  const nav = useNavigate();
  const { selectedUserId, getUserById } = useData();
  const user = selectedUserId ? getUserById(selectedUserId) : undefined;

  useEffect(() => {
    if (!selectedUserId) {
      nav('/daily-log', { replace: true });
    }
  }, [selectedUserId, nav]);

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold">日誌入力（仮実装）</h1>
      {user && (
        <div className="mt-2 mb-4 p-2 rounded bg-blue-50 text-blue-700 text-sm">
          選択中: {user.name}（ID: {user.id}）
        </div>
      )}
      <p className="mt-4 text-gray-600">このページは暫定の最小実装です。実装を段階的に戻していきます。</p>
    </div>
  );
};

export default DailyLogInputPage;
