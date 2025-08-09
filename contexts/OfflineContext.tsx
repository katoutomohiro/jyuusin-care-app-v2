import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DailyLog, User, Staff } from '../types';

export interface OfflineData {
  pendingLogs: DailyLog[];
  pendingUpdates: Array<{
    id: string;
    type: 'create' | 'update' | 'delete';
    data: any;
    timestamp: string;
  }>;
  cachedData: {
    users: User[];
    dailyLogs: DailyLog[];
    lastSync: string;
  };
  syncStatus: 'idle' | 'syncing' | 'error';
  lastOnlineCheck: string;
}

export interface OfflineContextType {
  isOnline: boolean;
  offlineData: OfflineData;
  addPendingLog: (log: DailyLog) => void;
  addPendingUpdate: (id: string, type: 'create' | 'update' | 'delete', data: any) => void;
  syncData: () => Promise<void>;
  clearPendingData: () => void;
  getCachedData: <T>(key: keyof OfflineData['cachedData']) => T | null;
  setCachedData: <T>(key: keyof OfflineData['cachedData'], data: T) => void;
  checkOnlineStatus: () => Promise<boolean>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

interface OfflineProviderProps {
  children: React.ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData>({
    pendingLogs: [],
    pendingUpdates: [],
    cachedData: {
      users: [],
      dailyLogs: [],
      lastSync: new Date().toISOString()
    },
    syncStatus: 'idle',
    lastOnlineCheck: new Date().toISOString()
  });

  // オンライン状態の監視
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (import.meta.env.DEV) console.debug('オンラインに復帰しました');
      // オンライン復帰時に自動同期
      syncData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (import.meta.env.DEV) console.debug('オフラインになりました');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ローカルストレージからの初期化
  useEffect(() => {
    const loadOfflineData = () => {
      try {
        const stored = localStorage.getItem('offlineData');
        if (stored) {
          const parsed = JSON.parse(stored);
          setOfflineData(prev => ({ ...prev, ...parsed }));
        }
      } catch (error) {
        console.error('オフラインデータの読み込みエラー:', error);
      }
    };

    loadOfflineData();
  }, []);

  // オフラインデータの永続化
  useEffect(() => {
    const saveOfflineData = () => {
      try {
        localStorage.setItem('offlineData', JSON.stringify(offlineData));
      } catch (error) {
        console.error('オフラインデータの保存エラー:', error);
      }
    };

    saveOfflineData();
  }, [offlineData]);

  // 定期的なオンライン状態チェック
  useEffect(() => {
    const checkInterval = setInterval(() => {
      checkOnlineStatus();
    }, 30000); // 30秒ごと

    return () => clearInterval(checkInterval);
  }, []);

  const checkOnlineStatus = useCallback(async (): Promise<boolean> => {
    try {
      // 実際のネットワーク接続をテスト
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      const online = response.ok;
      setIsOnline(online);
      setOfflineData(prev => ({
        ...prev,
        lastOnlineCheck: new Date().toISOString()
      }));
      return online;
    } catch (error) {
      setIsOnline(false);
      return false;
    }
  }, []);

  const addPendingLog = useCallback((log: DailyLog) => {
    setOfflineData(prev => ({
      ...prev,
      pendingLogs: [...prev.pendingLogs, log]
    }));
      if (import.meta.env.DEV) console.debug('オフラインログを追加:', log);
  }, []);

  const addPendingUpdate = useCallback((
    id: string, 
    type: 'create' | 'update' | 'delete', 
    data: any
  ) => {
    setOfflineData(prev => ({
      ...prev,
      pendingUpdates: [...prev.pendingUpdates, {
        id,
        type,
        data,
        timestamp: new Date().toISOString()
      }]
    }));
    console.log('オフライン更新を追加:', { id, type, data });
  }, []);

  const syncData = useCallback(async () => {
    if (!isOnline) {
      console.log('オフラインのため同期をスキップ');
      return;
    }

    setOfflineData(prev => ({ ...prev, syncStatus: 'syncing' }));

    try {
      // 保留中のログを同期
      for (const log of offlineData.pendingLogs) {
        try {
          await fetch('/api/daily-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(log)
          });
          console.log('ログを同期しました:', log.id);
        } catch (error) {
          console.error('ログ同期エラー:', error);
          throw error;
        }
      }

      // 保留中の更新を同期
      for (const update of offlineData.pendingUpdates) {
        try {
          const method = update.type === 'create' ? 'POST' : 
                        update.type === 'update' ? 'PUT' : 'DELETE';
          
          await fetch(`/api/daily-logs/${update.id}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: update.type !== 'delete' ? JSON.stringify(update.data) : undefined
          });
          console.log('更新を同期しました:', update.id);
        } catch (error) {
          console.error('更新同期エラー:', error);
          throw error;
        }
      }

      // 同期成功後、保留データをクリア
      setOfflineData(prev => ({
        ...prev,
        pendingLogs: [],
        pendingUpdates: [],
        syncStatus: 'idle',
        cachedData: {
          ...prev.cachedData,
          lastSync: new Date().toISOString()
        }
      }));

      console.log('オフラインデータの同期が完了しました');
    } catch (error) {
      console.error('データ同期エラー:', error);
      setOfflineData(prev => ({ ...prev, syncStatus: 'error' }));
    }
  }, [isOnline, offlineData.pendingLogs, offlineData.pendingUpdates]);

  const clearPendingData = useCallback(() => {
    setOfflineData(prev => ({
      ...prev,
      pendingLogs: [],
      pendingUpdates: []
    }));
    console.log('保留データをクリアしました');
  }, []);

  const getCachedData = useCallback(<T,>(key: keyof OfflineData['cachedData']): T | null => {
    return offlineData.cachedData[key] as T || null;
  }, [offlineData.cachedData]);

  const setCachedData = useCallback(<T,>(key: keyof OfflineData['cachedData'], data: T) => {
    setOfflineData(prev => ({
      ...prev,
      cachedData: {
        ...prev.cachedData,
        [key]: data
      }
    }));
  }, []);

  const value: OfflineContextType = {
    isOnline,
    offlineData,
    addPendingLog,
    addPendingUpdate,
    syncData,
    clearPendingData,
    getCachedData,
    setCachedData,
    checkOnlineStatus
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};

// オフライン状態インジケーターコンポーネント
export const OfflineIndicator: React.FC = () => {
  const { isOnline, offlineData } = useOffline();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>オフライン</span>
        {offlineData.pendingLogs.length > 0 && (
          <span className="text-sm">
            ({offlineData.pendingLogs.length}件の未同期データ)
          </span>
        )}
      </div>
    </div>
  );
};

// オフライン同期ボタンコンポーネント
export const SyncButton: React.FC = () => {
  const { isOnline, offlineData, syncData } = useOffline();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!isOnline || isSyncing) return;
    
    setIsSyncing(true);
    try {
      await syncData();
    } finally {
      setIsSyncing(false);
    }
  };

  const hasPendingData = offlineData.pendingLogs.length > 0 || offlineData.pendingUpdates.length > 0;

  if (!hasPendingData) {
    return null;
  }

  return (
    <button
      onClick={handleSync}
      disabled={!isOnline || isSyncing}
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-full shadow-lg z-50 ${
        isOnline 
          ? 'bg-blue-500 hover:bg-blue-600 text-white' 
          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
      }`}
    >
      {isSyncing ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>同期中...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>同期</span>
          <span className="bg-white text-blue-500 rounded-full px-2 py-1 text-xs">
            {offlineData.pendingLogs.length + offlineData.pendingUpdates.length}
          </span>
        </div>
      )}
    </button>
  );
};

export default OfflineContext; 
 