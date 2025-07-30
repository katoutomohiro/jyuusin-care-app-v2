import React from 'react';
import { useData } from '../contexts/DataContext';

const DailyLogListPage: React.FC = () => {
  const { users } = useData();
  // 全ユーザーの日誌をlocalStorageから取得
  const getLogs = (userId: string) => {
    const logs = JSON.parse(localStorage.getItem(`daily_log_${userId}`) || '[]');
    return logs;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">日誌一覧</h1>
      {users.map(user => (
        <div key={user.id} className="mb-8">
          <h2 className="font-semibold text-lg mb-2">{user.name}</h2>
          <table className="w-full bg-white rounded shadow text-sm mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">記録日時</th>
                <th className="p-2">イベント種別</th>
                <th className="p-2">詳細</th>
              </tr>
            </thead>
            <tbody>
              {getLogs(user.id).map((log: any) => (
                <tr key={log.id} className="border-t">
                  <td className="p-2">{log.created_at}</td>
                  <td className="p-2">{log.event_type}</td>
                  <td className="p-2">{JSON.stringify(log.data)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default DailyLogListPage;
