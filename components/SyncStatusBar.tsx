import React from 'react';
import { useData } from '../contexts/DataContext';

const statusMap: Record<string, { label: string; color: string }> = {
  idle: { label: '同期待機中', color: 'bg-gray-400' },
  syncing: { label: '同期中…', color: 'bg-blue-400 animate-pulse' },
  success: { label: '同期完了', color: 'bg-green-500' },
  error: { label: '同期エラー', color: 'bg-red-500' },
};

export const SyncStatusBar: React.FC<{ onManualSync?: () => void; lastSyncTime?: string }> = ({ onManualSync, lastSyncTime }) => {
  const { syncStatus } = useData();
  const status = statusMap[syncStatus || 'idle'];
  return (
    <div className={`flex items-center gap-4 p-2 rounded ${status.color} text-white mb-2`}>
      <span>{status.label}</span>
      {lastSyncTime && <span className="text-xs">最終同期: {lastSyncTime}</span>}
      {onManualSync && (
        <button
          className="ml-2 px-3 py-1 bg-white text-blue-700 rounded shadow hover:bg-blue-100"
          onClick={onManualSync}
        >
          手動同期
        </button>
      )}
    </div>
  );
};
