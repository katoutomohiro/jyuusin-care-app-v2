// サンプルログ生成（24名利用者・職員対応）
import { v4 as uuidv4 } from 'uuid';
const getSampleLogs = (): any[] => {
  if (SEVERE_DISABILITY_USERS.length < 2 || STAFF_MEMBERS.length < 2) return [];
  return SAMPLE_LOGS_BASE.map((baseLog, index) => {
    const userIndex = index % SEVERE_DISABILITY_USERS.length;
    const staffIndex = index % STAFF_MEMBERS.length;
    return {
      ...baseLog,
      id: uuidv4(),
      log_id: uuidv4(),
      userId: SEVERE_DISABILITY_USERS[userIndex].id,
      user_id: SEVERE_DISABILITY_USERS[userIndex].id,
      staff_id: STAFF_MEMBERS[staffIndex].id,
      recorder_name: STAFF_MEMBERS[staffIndex].name,
      author: STAFF_MEMBERS[staffIndex].name,
      authorId: STAFF_MEMBERS[staffIndex].id,
    };
  });
};
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 本番用の利用者データ（24名）
import { SEVERE_DISABILITY_USERS, STAFF_MEMBERS, FACILITY_INFO, SAMPLE_LOGS_BASE } from '../../constants';
const initialUsers = SEVERE_DISABILITY_USERS;

import type { User } from '../../types';

type DataContextType = {
  users: User[];
  dailyLogsByUser: Record<string, any[]>;
  getUserById: (id: string) => User | undefined;
  getDailyLogsByUser: (userId: string) => any[];
  getFrequentTags: (userId: string, eventType: string, limit?: number) => string[];
  addDailyLog: (logData: any) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem('users');
      return storedUsers ? JSON.parse(storedUsers) : initialUsers;
    } catch (error) {
      console.error('Failed to parse users from localStorage', error);
      return initialUsers;
    }
  });

  // dailyLogsByUserステートを追加
  const [dailyLogsByUser, setDailyLogsByUser] = useState<Record<string, any[]>>(() => {
    const logs: Record<string, any[]> = {};
    // 起動時にlocalStorageからすべてのユーザーの日誌を読み込み
    for (const user of initialUsers) {
      try {
        const userLogs = JSON.parse(localStorage.getItem(`dailyLogs_${user.id}`) || '[]');
        logs[user.id] = userLogs;
      } catch (error) {
        console.error(`Failed to load logs for user ${user.id}:`, error);
        logs[user.id] = [];
      }
    }
    return logs;
  });

  // DataContext初期化時にlocalStorageのusersキーも必ず24名で上書き
  useEffect(() => {
    if (!users || users.length === 0) {
      const initialData = SEVERE_DISABILITY_USERS;
      setUsers(initialData);
      localStorage.setItem('users', JSON.stringify(initialData));
      if (import.meta.env.DEV) console.debug('初期利用者データを投入しました', initialData);
    } else {
      // 起動時に現在のusersステートをlocalStorageに保存する
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, []); // 初回レンダリング時にのみ実行

  const getUserById = (id: string) => users.find((u) => u.id === id);
  
  // dailyLogsByUserステートから該当ユーザーの日誌全件を取得
  const getDailyLogsByUser = (userId: string) => {
    return dailyLogsByUser[userId] || [];
  };
  
  // ダミー実装: よく使うタグを返す（本実装は日誌データ集計）
  const getFrequentTags = (userId: string, eventType: string, limit: number = 5) => {
    if (eventType === 'seizure') return ['強直', '間代', '眼球上転', 'チアノーゼ', '流涎多量'].slice(0, limit);
    if (eventType === 'hydration') return ['むせ込みあり', '顔色変化あり', '嘔吐・逆流', '口腔内残渣あり', '流涎多い'].slice(0, limit);
    return [];
  };

  // userIdがSEVERE_DISABILITY_USERSのIDと一致する場合のみ保存
  const addDailyLog = async (logData: any) => {
    const validUser = users.find(u => u.id === logData.userId);
    if (!validUser) {
      throw new Error(`Invalid userId: ${logData.userId}`);
    }
    
    // 新しいログエントリにユニークIDとタイムスタンプを確保
    const newLog = {
      ...logData,
      id: logData.id || Date.now().toString(),
      log_id: logData.log_id || Date.now().toString(),
      created_at: logData.created_at || new Date().toISOString(),
      event_timestamp: logData.event_timestamp || new Date().toISOString()
    };
    
    // localStorageに保存
    const key = `dailyLogs_${logData.userId}`;
    const currentLogs = dailyLogsByUser[logData.userId] || [];
    const updatedLogs = [...currentLogs, newLog];
    localStorage.setItem(key, JSON.stringify(updatedLogs));
    
    // ステート更新（重要: UI再レンダリング用）
    setDailyLogsByUser(prev => {
      const newState = {
        ...prev,
        [logData.userId]: updatedLogs
      };
      
      if (import.meta.env.DEV) {
        if (import.meta.env.DEV) console.debug('DEBUG – dailyLogsByUser updated for userId:', logData.userId, 'new count:', updatedLogs.length);
      }
      
      return newState;
    });
    
    if (import.meta.env.DEV) {
      if (import.meta.env.DEV) console.debug('DEBUG – addDailyLog saved:', newLog);
    }
  };

  return (
    <DataContext.Provider value={{ users, dailyLogsByUser, getUserById, getDailyLogsByUser, getFrequentTags, addDailyLog }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
 