
// AssistanceLevel: 介助レベル区分（仮定義）
export enum AssistanceLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// DisabilityLevel: 障害区分レベル（仮定義）
export enum DisabilityLevel {
  LEVEL_1 = 'level_1',
  LEVEL_2 = 'level_2',
  LEVEL_3 = 'level_3',
  LEVEL_4 = 'level_4',
  LEVEL_5 = 'level_5',
  LEVEL_6 = 'level_6'
}

// Gender: 性別区分（仮定義）
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}


// Name: 氏名型（仮定義）
export type Name = string;

// HandbookType: ハンドブック種別（仮定義）
export enum HandbookType {
  LIFE = 'life',
  DAY = 'day',
  RESPITE = 'respite'
}

// SeizureType: 発作タイプ区分（仮定義）
export enum SeizureType {
  TONIC = 'tonic', // 強直発作
  CLONIC = 'clonic', // 間代発作
  TONIC_CLONIC = 'tonic_clonic', // 強直間代発作
  MYOCLONIC = 'myoclonic', // ミオクローヌス発作
  ATONIC = 'atonic', // 無緊張発作
  ABSENCE = 'absence', // 欠神発作
  FOCAL = 'focal', // 部分発作
  OTHER = 'other' // その他
}

// MedicalCare: 医療的ケア種別（仮定義）
export enum MedicalCare {
  TUBE_FEEDING = 'tube_feeding',
  SUCTION = 'suction',
  SUCTIONING = 'suctioning',
  SEIZURE_MEDICATION = 'seizure_medication',
  OXYGEN = 'oxygen',
  CATHETER = 'catheter',
  NEBULIZER = 'nebulizer',
  ENEMA = 'enema',
  OTHER = 'other'
}

// School: 学校区分（仮定義、constants.ts用のダミー実装）
export enum School {
  ELEMENTARY = 'elementary',
  JUNIOR_HIGH = 'junior_high',
  HIGH = 'high',
  SPECIAL = 'special',
  NONE = 'none'
}

// ServiceType: サービス種別（仮定義）
export enum ServiceType {
  LIFE_CARE = 'life_care',
  DAY_SERVICE = 'day_service',
  RESPITE = 'respite'
}

// UserProfile: 利用者プロフィール型（簡易仮定義）
export interface UserProfile {
  id: string;
  name: Name;
  gender: Gender;
  disabilityLevel: DisabilityLevel;
  assistanceLevel: AssistanceLevel;
  medicalCare: MedicalCare[];
  serviceType: ServiceType[];
}

// CareEventType: ケアイベント種別（仮定義）
export type CareEventType =
  | 'seizure'
  | 'expression'
  | 'hydration'
  | 'positioning'
  | 'activity'
  | 'excretion'
  | 'skin_oral_care'
  | 'illness'
  | 'sleep'
  | 'cough_choke'
  | 'tube_feeding'
  | 'medication'
  | 'vitals'
  | 'behavioral'
  | 'communication';
