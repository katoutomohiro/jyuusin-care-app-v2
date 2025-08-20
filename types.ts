
// AssistanceLevel: 介助レベル区分（仮定義）
export enum AssistanceLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
  // Backwards-compat aliases used in constants.ts
  ,FULL = 'high'
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
  // alias
  ,GIRL = 'female',
  BOY = 'male'
}


// Name: 氏名型（仮定義）
export type Name = string;

// HandbookType: ハンドブック種別（仮定義）
export enum HandbookType {
  LIFE = 'life',
  DAY = 'day',
  RESPITE = 'respite'
  // aliases for older constants
  ,REHABILITATION = 'respite'
  ,PHYSICAL = 'respite'
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
  // legacy aliases
  ,IVH = 'other'
  ,VENTILATOR = 'oxygen'
  ,INHALATION = 'nebulizer'
  ,CATHETERIZATION = 'catheter'
}

// School: 学校区分（仮定義、constants.ts用のダミー実装）
export enum School {
  ELEMENTARY = 'elementary',
  JUNIOR_HIGH = 'junior_high',
  HIGH = 'high',
  SPECIAL = 'special',
  NONE = 'none'
  // alias used in constants
  ,SPECIAL_SUPPORT = 'special'
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

// Minimal user and related types used across the app (shims to reduce TS noise)
export interface User {
  id: string;
  name: string;
  displayName?: string;
  initials?: string;
  age?: number;
  gender?: Gender;
  serviceType?: ServiceType[];
  birthDate?: string;
  admissionDate?: string;
  disabilityLevel?: DisabilityLevel;
  assistanceLevel?: AssistanceLevel;
  medicalCare?: MedicalCare[];
  handbooks?: HandbookType[];
  status?: string;
  profile?: UserProfile;
}

export interface Staff {
  id: string;
  name: string;
}

export interface FacilityInfo {
  id: string;
  name: string;
}

export interface Vitals {
  temperature?: number | null;
  pulse?: number | null;
  spo2?: number | null;
}

export interface Seizure {
  type: string;
  notes?: string;
}

export interface DailyLog {
  id: string;
  userId: string;
  createdAt?: string;
  record_date?: string; // legacy alias
  author?: string; // legacy alias
  vitals?: Vitals | null;
  seizure?: Seizure[];
  expression?: any;
  medication?: any;
  special_notes?: any[];
  other?: any;
}

export interface ActivityRecord {}
export interface SpecialNote {}
export interface SevereDisabilityUser {}

// AuthState minimal shim
export interface AuthState {
  isAuthenticated?: boolean;
  user?: User | null;
  isLoading?: boolean;
}
