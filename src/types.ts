export type User = {
  id: string;
  name: string;
  initials: string;
  age: number;
  gender: string;
  serviceType: string[];
  birthDate?: string;
  admissionDate?: string;
  disabilityLevel?: string;
  underlyingConditions?: string[];
  medicalCare?: string[];
  handbooks?: string[];
  assistanceLevel?: string;
  seizureTypes?: string[];
  seizureFrequency?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    emergencyPhone?: string;
  };
  status?: string;
  underlyingDiseases?: string;
  certificates?: string;
  careLevel?: string;
  school?: string;
  medicalCareDetails?: Record<string, any>;
};

// ==================================================================
// PDFおよび日誌データ構造の型定義
// ==================================================================

export interface Vitals {
  temperature: number | null;
  pulse: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  spo2: number | null;
  respiratory_rate: number | null;
  measurement_time: string; // ISO 8601 format
  measurement_position?: string;
  measurement_location?: string;
  vital_status?: string;
  special_finding?: string;
}

export interface Hydration {
  time: string; // HH:mm
  type: 'oral' | 'tube';
  content: string;
  amount: number; // ml
  method?: string;
}

export interface Excretion {
  time: string; // HH:mm
  type: 'urine' | 'stool';
  amount: string; // e.g., '少量', '中量', '多量'
  color?: string;
  properties?: string;
  notes?: string;
}

export interface Sleep {
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  duration: number; // minutes
  quality: 'good' | 'fair' | 'poor';
  notes?: string;
}

export interface Seizure {
  time: string; // HH:mm
  duration: number; // seconds
  type: string;
  symptoms: string[];
  postIctalState: string;
  notes?: string;
}

export interface Activity {
  time: string; // HH:mm
  title: string;
  description: string;
  mood?: string;
}

export interface Care {
  time: string; // HH:mm
  type: 'suction' | 'medication' | 'skin_care' | 'oral_care' | 'other';
  details: string;
}

export interface DailyLog {
  userId: string;
  userName: string;
  date: string;          // YYYY-MM-DD
  vitals: Vitals | null;
  hydration: Hydration[];   // 水分・食事
  excretion: Excretion[];   // 排泄
  sleep?: Sleep | null;
  seizure?: Seizure[];      // 発作
  activity?: Activity[];    // 活動
  care?: Care[];            // 医療ケア
  notes?: string;
}
