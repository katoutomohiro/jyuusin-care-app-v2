import React from 'react';
import { useData } from '../contexts/DataContext';
import { User } from '../../types';

// ステータス色分け用
const statusColor = {
  draft: 'bg-yellow-100 text-yellow-800',
  submitted: 'bg-green-100 text-green-800',
  missing: 'bg-red-100 text-red-800',
};

const getStatus = (log: any) => {
  if (log?.isDraft) return 'draft';
  if (log) return 'submitted';
  return 'missing';
};

const DailyLogListPage: React.FC = () => {
  const { users, getDailyLogsByUser } = useData();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">日誌提出状況一覧</h1>
      <table className="w-full border rounded-lg bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">利用者名</th>
            <th className="p-2">提出状況</th>
            <th className="p-2">下書き</th>
            <th className="p-2">最終更新</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => {
            // 今日の日誌データ取得
            const logs = getDailyLogsByUser(user.id).filter(l => l.record_date === today);
            const log = logs[0];
            // 下書き有無
            const draftKey = `draft_${user.id}_seizure`;
            const draft = localStorage.getItem(draftKey);
            const status = log ? 'submitted' : draft ? 'draft' : 'missing';
            return (
              <tr key={user.id}>
                <td className="p-2 font-semibold">{user.name}</td>
                <td className={`p-2 font-bold ${statusColor[status]}`}>{status === 'submitted' ? '提出済' : status === 'draft' ? '下書きあり' : '未提出'}</td>
                <td className="p-2">{draft ? '◯' : '-'}</td>
                <td className="p-2 text-xs">{log?.updatedAt || log?.createdAt || '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 text-sm text-gray-500">※「下書きあり」は保存前の一時データが存在する状態です。未提出は記録漏れ注意。</div>
    </div>
  );
};

export default DailyLogListPage;
