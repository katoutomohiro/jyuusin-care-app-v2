import React, { createContext, useContext, useState, ReactNode } from 'react';

// 本番用の利用者データ（24名）
import { SEVERE_DISABILITY_USERS } from '../../constants';
const initialUsers = SEVERE_DISABILITY_USERS;

import type { User } from '../../types';

type DataContextType = {
  users: User[];
  getUserById: (id: string) => User | undefined;
  getDailyLogsByUser: (userId: string) => any[];
  getFrequentTags: (userId: string, eventType: string, limit?: number) => string[];
  addDailyLog: (logData: any) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [users] = useState<User[]>(initialUsers);


  const getUserById = (id: string) => users.find((u) => u.id === id);
  // localStorageから該当ユーザーの日誌全件を取得
  const getDailyLogsByUser = (userId: string) => {
    const logs = JSON.parse(localStorage.getItem(`dailyLogs_${userId}`) || '[]');
    return logs;
  };
  // ダミー実装: よく使うタグを返す（本実装は日誌データ集計）
  const getFrequentTags = (userId: string, eventType: string, limit: number = 5) => {
    // eventTypeごとにサンプルタグを返す
    if (eventType === 'seizure') return ['強直', '間代', '眼球上転', 'チアノーゼ', '流涎多量'].slice(0, limit);
    if (eventType === 'hydration') return ['むせ込みあり', '顔色変化あり', '嘔吐・逆流', '口腔内残渣あり', '流涎多い'].slice(0, limit);
    return [];
  };

  // ダミー実装: localStorageに保存するだけ
  const addDailyLog = async (logData: any) => {
    const key = `dailyLogs_${logData.userId}`;
    const logs = JSON.parse(localStorage.getItem(key) || '[]');
    logs.push(logData);
    localStorage.setItem(key, JSON.stringify(logs));
  };

  return (
    <DataContext.Provider value={{ users, getUserById, getDailyLogsByUser, getFrequentTags, addDailyLog }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
 