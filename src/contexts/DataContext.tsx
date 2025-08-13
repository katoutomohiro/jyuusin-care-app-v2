// 利用者データ（現場情報）
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export function useData() {
  return {
    users: [] as any[],
    getDailyLog: (_?: any) => null,
    saveDailyLog: (_: any, __: any) => {},
  };
}

export default {};

interface DataState {
  users: User[];
  dailyLogs: DailyLog[];
  facilities: FacilityInfo[];
  staff: Staff[];
  isLoading: boolean;
  error: string | null;
}
// 利用者データ（現場情報）
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ServiceType, DailyLog, FacilityInfo, User, Staff, MedicalCare } from '../types';
import { SAMPLE_STAFF } from '../../constants';

// 利用者データ（現場情報）- 24名分
export const initialUsers: User[] = [
  // 8.1 生活介護利用者（14名）
  {
    id: 'user-01',
    name: '田中太郎',
    initials: 'T',
    age: 45,
    gender: '男性',
    disabilityType: '重症心身障害者',
    disabilityLevel: '区分6',
    underlyingDiseases: '脳性麻痺、てんかん、遠視性弱視、側湾症、両上下肢機能障害',
    medicalCare: [MedicalCare.TUBE_FEEDING, MedicalCare.SUCTION],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.LIFE_CARE],
    notes: '音楽療法への反応が良好。午後の活動参加時に笑顔が多く見られる。',
  },
  {
    id: 'user-02',
    name: 'I・K',
    initials: 'I',
    age: 47,
    gender: '女性',
    disabilityType: '重症心身障害者',
    disabilityLevel: '区分6',
    underlyingDiseases: '脳性麻痺、側湾症、体幹四肢機能障害',
    medicalCare: [],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.LIFE_CARE],
  },
  {
    id: 'user-03',
    name: 'O・S',
    initials: 'O',
    age: 40,
    gender: '女性',
    disabilityType: '重症心身障害者',
    disabilityLevel: '区分6',
    underlyingDiseases: '脳性麻痺、体幹四肢機能障害',
    medicalCare: [],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.LIFE_CARE],
  },
  {
    id: 'user-04',
    name: 'S・M',
    initials: 'S',
    age: 43,
    gender: '男性',
    disabilityType: '重症心身障害者',
    disabilityLevel: '区分6',
    underlyingDiseases: '脳性麻痺、脳炎後遺症、てんかん（現在も服用中）、精神遅滞、側湾症、両上下肢機能障害',
    medicalCare: [MedicalCare.SUCTION],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.LIFE_CARE],
  },
  {
    id: 'user-05',
    name: 'N・M',
    initials: 'N',
    age: 32,
    gender: '男性',
    disabilityType: '重症心身障害者',
    disabilityLevel: '区分6',
    underlyingDiseases: '痙性四肢麻痺、重度知的障害、てんかん（強直間代発作がほぼ毎日1～5回の頻度で出現）',
    medicalCare: [MedicalCare.TUBE_FEEDING, MedicalCare.SUCTION, MedicalCare.INHALATION, MedicalCare.ENEMA],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.LIFE_CARE],
  },
  {
    id: 'user-06',
    name: 'W・M',
    initials: 'W',
    age: 32,
    gender: '女性',
    disabilityType: '重症心身障害者',
    disabilityLevel: '区分6',
    underlyingDiseases: '脳原生上肢機能障害、脳原生上肢移動障害、上下肢機能障害',
    medicalCare: [],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.LIFE_CARE],
  },
  {
    id: 'user-07',
    name: 'S・Y',
    initials: 'S',
    age: 41,
    gender: '女性',
    disabilityType: '重症心身障害者',
    disabilityLevel: '区分6',
    underlyingDiseases: '脳原生上肢機能障害、脳原生上肢移動障害',
    medicalCare: [MedicalCare.TUBE_FEEDING],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.LIFE_CARE],
  },
  {
    id: 'user-08',
    name: 'Y・K',
    initials: 'Y',
    age: 22,
    gender: '男性',
    disabilityType: '重症心身障害者',
    disabilityLevel: '区分6',
    underlyingDiseases: '二分脊椎症、水頭症（シャント内臓）、急性脳症後遺症、膀胱機能障害者、両上下肢機能障害、体幹機能障害、自閉症スペクトラム障害',
    medicalCare: [MedicalCare.CATHETERIZATION],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.LIFE_CARE],
  },
  {
    id: 'user-09',
    name: 'I・K',
    initials: 'I',
    age: 40,
    gender: '男性',
    disabilityType: '重症心身障害者',
    disabilityLevel: '区分6',
    underlyingDiseases: '脳性麻痺、体幹四肢機能障害',
    medicalCare: [],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.LIFE_CARE],
  },
  {
    id: 'user-10',
    name: 'O・M',
    initials: 'O',
    age: 23,
    gender: '男性',
    disabilityType: '重症心身障害者',
    disabilityLevel: '区分6',
    underlyingDiseases: '脳性麻痺、視覚障害（全盲）、難聴、網膜症、脳原生移動障害',
    medicalCare: [],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.LIFE_CARE],
  },
  {
    id: 'user-11',
    name: 'U・S',
    initials: 'U',
    age: 19,
    gender: '男性',
    disabilityType: '障がい程度区分6',
    disabilityLevel: '区分6',
    underlyingDiseases: 'クリッペファイル症候群、高度難聴、気管狭窄症、両下肢機能障害',
    medicalCare: [MedicalCare.SUCTION, MedicalCare.INHALATION, MedicalCare.ENEMA],
    certificates: '身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.LIFE_CARE],
  },
  {
    id: 'user-12',
    name: 'I・T',
    initials: 'I',
    age: 24,
    gender: '男性',
    disabilityType: '重症心身障害者',
    disabilityLevel: '区分6',
    underlyingDiseases: '脳性麻痺',
    medicalCare: [MedicalCare.TUBE_FEEDING],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.LIFE_CARE],
  },
  {
    id: 'user-13',
    name: 'M・S',
    initials: 'M',
    age: 18,
    gender: '男性',
    disabilityType: '重症心身障害者',
    disabilityLevel: '区分6',
    underlyingDiseases: '水頭症、脳原生上肢機能障害、脳原生上肢移動障害、側湾症、発作（5分以上けいれん発作が持続は救急搬送）',
    medicalCare: [],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.LIFE_CARE],
  },
  {
    id: 'user-14',
    name: 'M・O',
    initials: 'M',
    age: 18,
    gender: '女性',
    disabilityType: '重症心身障害者',
    disabilityLevel: '区分6',
    underlyingDiseases: '脳原生上肢機能障害、脳原生上肢移動障害、発作（四肢、顔面のミオクローヌスあり）',
    medicalCare: [MedicalCare.TUBE_FEEDING, MedicalCare.SUCTION, MedicalCare.IVH],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.LIFE_CARE],
  },

  // 8.2 重心型放課後等デイサービス利用者（10名）
  {
    id: 'user-15',
    name: 'M・I',
    initials: 'M',
    age: 17,
    gender: '男児',
    disabilityType: '重症心身障害児',
    disabilityLevel: '特別支援学校在学中',
    underlyingDiseases: '慢性肺疾患、先天性性疾患、染色体異常、脳の形成不全、抗てんかん（ミオクロニー発作あり）',
    medicalCare: [MedicalCare.TUBE_FEEDING],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.DAY_SERVICE],
  },
  {
    id: 'user-16',
    name: 'S・K',
    initials: 'S',
    age: 15,
    gender: '男児',
    disabilityType: '重症心身障害児',
    disabilityLevel: '特別支援学校在学中',
    underlyingDiseases: '脳腫瘍適切後遺症、脳原生上肢機能障害、脳原始移動機能障害、アレルギー性鼻炎、食物アレルギー',
    medicalCare: [],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.DAY_SERVICE],
  },
  {
    id: 'user-17',
    name: 'M・M',
    initials: 'M',
    age: 15,
    gender: '女児',
    disabilityType: '知的障がい',
    disabilityLevel: '特別支援学校在学中、発作あり',
    underlyingDiseases: '記載なし',
    medicalCare: [],
    certificates: '療育手帳1級',
    careLevel: '一部介助あり',
    serviceType: [ServiceType.DAY_SERVICE],
  },
  {
    id: 'user-18',
    name: 'K・S',
    initials: 'K',
    age: 7,
    gender: '女児',
    disabilityType: '重症心身障害児',
    disabilityLevel: '特別支援学校在学中',
    underlyingDiseases: '発達遅延、肢体不自由、けいれん発作（5分以上続くようなら救急搬送）',
    medicalCare: [],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.DAY_SERVICE],
  },
  {
    id: 'user-19',
    name: 'Y・S',
    initials: 'Y',
    age: 6,
    gender: '女児',
    disabilityType: '重症心身障害児',
    disabilityLevel: '特別支援学校在学中',
    underlyingDiseases: '症候性てんかん、脳原生上肢機能障害、脳原始移動機能障害',
    medicalCare: [],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.DAY_SERVICE],
  },
  {
    id: 'user-20',
    name: 'F・M',
    initials: 'F',
    age: 13,
    gender: '女児',
    disabilityType: '重症心身障害児',
    disabilityLevel: '特別支援学校在学中',
    underlyingDiseases: '症候性てんかん、股関節亜脱臼、脳原生上肢機能障害、脳原始移動機能障害、側湾症',
    medicalCare: [],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.DAY_SERVICE],
  },
  {
    id: 'user-21',
    name: 'N・T',
    initials: 'N',
    age: 9,
    gender: '男児',
    disabilityType: '重症心身障害児',
    disabilityLevel: '特別支援学校在学中',
    underlyingDiseases: '発達遅滞、神経セロイドリポフスチン8型、両上肢・体感機能障害、てんかん（ミオクローヌスなど重積発作リスクあり）',
    medicalCare: [MedicalCare.TUBE_FEEDING],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.DAY_SERVICE],
  },
  {
    id: 'user-22',
    name: 'I・K',
    initials: 'I',
    age: 9,
    gender: '不明',
    disabilityType: '重症心身障害児',
    disabilityLevel: '特別支援学校在学中',
    underlyingDiseases: '脳性麻痺、側弯あり、吸引頻回（呼吸筋が脆弱のため）、籠り熱の際は嘔吐リスクあり',
    medicalCare: [MedicalCare.TUBE_FEEDING],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.DAY_SERVICE],
  },
  {
    id: 'user-23',
    name: 'K・Y',
    initials: 'K',
    age: 9,
    gender: '女児',
    disabilityType: '重症心身障害児',
    disabilityLevel: '特別支援学校在学中',
    underlyingDiseases: '脳性麻痺、脳原生上肢機能障害、脳原始移動機能障害、側湾症',
    medicalCare: [],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.DAY_SERVICE],
  },
  {
    id: 'user-24',
    name: 'S・K',
    initials: 'S',
    age: 14,
    gender: '女児',
    disabilityType: '重症心身障害児',
    disabilityLevel: '特別支援学校在学中',
    underlyingDiseases: '滑脳症（TUBA1A遺伝子異常）、小脳底形成、上腸間膜症候群、症候性てんかん、重度精神運動発達遅滞',
    medicalCare: [MedicalCare.TUBE_FEEDING],
    certificates: '療育手帳A、身体障害者手帳1級',
    careLevel: '全介助',
    serviceType: [ServiceType.DAY_SERVICE],
  },
];

interface DataState {
  users: User[];
  dailyLogs: DailyLog[];
  facilities: FacilityInfo[];
  staff: Staff[];
  isLoading: boolean;
  error: string | null;
}

interface DataContextType extends DataState {
  addUser: (user: Partial<User>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  removeUser: (userId: string) => void;
  deleteUser: (id: string) => void;
  addDailyLog: (log: Omit<DailyLog, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDailyLog: (id: string, updates: Partial<DailyLog>) => void;
  deleteDailyLog: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  getDailyLogsByUser: (userId: string) => DailyLog[];
  getDailyLogsByDate: (date: string) => DailyLog[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);
  
 export function useData() {
   return {
     users: [] as any[],
     getDailyLog: (_id?: any) => null as any,
     saveDailyLog: (_id: any, _v: any) => {},
   };
 }
 export default {};

type DataAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: { id: string; updates: Partial<User> } }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_DAILY_LOGS'; payload: DailyLog[] }
  | { type: 'ADD_DAILY_LOG'; payload: DailyLog }
  | { type: 'UPDATE_DAILY_LOG'; payload: { id: string; updates: Partial<DailyLog> } }
  | { type: 'DELETE_DAILY_LOG'; payload: string }
  | { type: 'SET_FACILITIES'; payload: FacilityInfo[] }
  | { type: 'SET_STAFF'; payload: Staff[] };

const dataReducer = (state: DataState, action: DataAction): DataState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id
            ? { ...user, ...action.payload.updates }
            : user
        ),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      };
    case 'SET_DAILY_LOGS':
      return { ...state, dailyLogs: action.payload };
    case 'ADD_DAILY_LOG':
      return { ...state, dailyLogs: [...state.dailyLogs, action.payload] };
    case 'UPDATE_DAILY_LOG':
      return {
        ...state,
        dailyLogs: state.dailyLogs.map(log =>
          log.id === action.payload.id
            ? { ...log, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : log
        ),
      };
    case 'DELETE_DAILY_LOG':
      return {
        ...state,
        dailyLogs: state.dailyLogs.filter(log => log.id !== action.payload),
      };
    case 'SET_FACILITIES':
      return { ...state, facilities: action.payload };
    case 'SET_STAFF':
      return { ...state, staff: action.payload };
    default:
      return state;
  }
};

const initialState: DataState = {
  users: initialUsers,
  dailyLogs: [],
  facilities: [],
  staff: SAMPLE_STAFF,
  isLoading: false,
  error: null,
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  
  // デバッグ：初期データの確認
  // ...不要なログ出力を自動削除...

  // ローカルストレージからデータを復元
  useEffect(() => {
    const loadData = () => {
      try {
        const savedUsers = localStorage.getItem('users');
        const savedDailyLogs = localStorage.getItem('dailyLogs');
        const savedFacilities = localStorage.getItem('facilities');

        if (savedUsers) {
          dispatch({ type: 'SET_USERS', payload: JSON.parse(savedUsers) });
        }
        if (savedDailyLogs) {
          dispatch({ type: 'SET_DAILY_LOGS', payload: JSON.parse(savedDailyLogs) });
        }
        if (savedFacilities) {
          dispatch({ type: 'SET_FACILITIES', payload: JSON.parse(savedFacilities) });
        }
      } catch (error) {
        // エラー抑制: データの読み込み失敗時も握りつぶす
        // ...existing code...
      }
    };

    loadData();
  }, []);

  // データが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(state.users));
  }, [state.users]);

  useEffect(() => {
    localStorage.setItem('dailyLogs', JSON.stringify(state.dailyLogs));
  }, [state.dailyLogs]);

  useEffect(() => {
    localStorage.setItem('facilities', JSON.stringify(state.facilities));
  }, [state.facilities]);

  const addUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      initials: userData.initials || (userData.name ? userData.name[0] : ''),
      age: userData.age || 0,
      gender: userData.gender || '不明',
      disabilityType: userData.disabilityType || '-',
      disabilityLevel: userData.disabilityLevel || '-',
      underlyingDiseases: userData.underlyingDiseases || '-',
      medicalCare: userData.medicalCare || [],
      certificates: userData.certificates || '-',
      careLevel: userData.careLevel || '-',
      serviceType: userData.serviceType || [ServiceType.LIFE_CARE],
      notes: userData.notes || '',
      ...userData
    };
    dispatch({ type: 'ADD_USER', payload: newUser });
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: { id: userId, updates } });
  };

  const removeUser = (userId: string) => {
    dispatch({ type: 'DELETE_USER', payload: userId });
  };

  const deleteUser = (id: string) => {
    dispatch({ type: 'DELETE_USER', payload: id });
  };

  const addDailyLog = (logData: Omit<DailyLog, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLog: DailyLog = {
      id: Date.now().toString(),
      ...logData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_DAILY_LOG', payload: newLog });
  };

  const updateDailyLog = (id: string, updates: Partial<DailyLog>) => {
    dispatch({ type: 'UPDATE_DAILY_LOG', payload: { id, updates } });
  };

  const deleteDailyLog = (id: string) => {
    dispatch({ type: 'DELETE_DAILY_LOG', payload: id });
  };

  const getUserById = (id: string) => {
    return state.users.find(user => user.id === id);
  };

  const getDailyLogsByUser = (userId: string) => {
    return state.dailyLogs.filter(log => log.userId === userId);
  };

  const getDailyLogsByDate = (date: string) => {
    return state.dailyLogs.filter(log => log.record_date === date);
  };

  const value: DataContextType = {
    ...state,
    addUser,
    updateUser,
    removeUser,
    deleteUser,
    addDailyLog,
    updateDailyLog,
    deleteDailyLog,
    getUserById,
    getDailyLogsByUser,
    getDailyLogsByDate,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}; 