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
import React, { createContext, useContext, useState, ReactNode } from 'react';

// 本番用の利用者データ（24名）
import { SEVERE_DISABILITY_USERS, STAFF_MEMBERS, FACILITY_INFO, SAMPLE_LOGS_BASE } from '../../constants';
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

  // DataContext初期化時にlocalStorageのusersキーも必ず24名で上書き
  React.useEffect(() => {
    if (!users || users.length === 0) {
      localStorage.setItem('users', JSON.stringify(SEVERE_DISABILITY_USERS));
      console.log('初期利用者データを再投入しました', SEVERE_DISABILITY_USERS);
    } else {
      localStorage.setItem('users', JSON.stringify(users));
      console.log('users:', users);
      if (users.length > 0) {
        console.log('users[0]詳細:', users[0]);
        Object.entries(users[0]).forEach(([key, value]) => {
          console.log(`users[0].${key}:`, value);
        });
        users.forEach((u, i) => {
          if (!u.id || !u.name) {
            console.warn(`users[${i}]にidまたはnameがありません`, u);
          }
        });
      }
    }
  }, [users]);

  const getUserById = (id: string) => users.find((u) => u.id === id);
  // localStorageから該当ユーザーの日誌全件を取得
  const getDailyLogsByUser = (userId: string) => {
    const logs = JSON.parse(localStorage.getItem(`dailyLogs_${userId}`) || '[]');
    return logs;
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
 