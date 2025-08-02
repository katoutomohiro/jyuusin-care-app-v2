/**
 * サービス種別
 */
export enum ServiceType {
  LIFE_CARE = '生活介護',
  DAY_SERVICE = '放課後等デイサービス',
}

/**
 * 性別
 */
export enum Gender {
  MALE = '男性',
  FEMALE = '女性',
  BOY = '男児',
  GIRL = '女児',
  UNKNOWN = '記載なし',
}

/**
 * 通知タイプ
 */
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * 利用者情報
 */
export type User = {
  id: string;
  name: string;
  initials?: string;
  age: number;
  gender: '男性' | '女性' | '男児' | '女児' | '不明';
  disabilityType: string;
  disabilityLevel: string;
  underlyingDiseases: string;
  medicalCare: MedicalCare[];
  certificates: string;
  careLevel: string;
  serviceType: ServiceType[];
  underlyingConditions?: string[];
  handbooks?: HandbookType[] | string[];
  assistanceLevel?: AssistanceLevel | string;
  school?: School | string;
  notes?: string;
  familyContact?: { name: string; relationship: string; phone: string };
  admissionDate?: string;
  status?: 'active' | 'inactive' | 'pending';
};

/**
 * スタッフの役職
 */
export type StaffRole = 'admin' | 'manager' | 'nurse' | 'caregiver' | 'therapist' | 'coordinator';

/**
 * スタッフのステータス
 */
export type StaffStatus = 'active' | 'inactive' | 'leave' | 'retired';

/**
 * 職員情報
 */
export interface Staff {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: string;
  isFullTime: boolean;
  permissions: string[];
  avatarUrl?: string;
  templateId: string;
  templateName: string;
}

/**
 * 日々の記録（デイリーログ）
 */
export type DailyLog = {
  id: string;
  log_id?: string;
  userId: string;
  user_id?: string;
  staff_id: string;
  author: string;
  authorId: string;
  record_date: string;
  date?: string;
  recorder_name: string;
  weather: string;
  mood: string[];
  meal_intake: {
    breakfast: string;
    lunch: string;
    snack: string;
    dinner: string;
  };
  hydration: number;
  toileting: {
    time: string;
    type: 'urine' | 'feces' | 'both';
    amount: 'small' | 'medium' | 'large';
    notes?: string;
  }[];
  activity: ActivityRecord;
  special_notes: SpecialNote[];
  special_notes_details?: string;
  createdAt?: string;
  updatedAt?: string;
  vitals?: VitalSigns;
  intake?: IntakeRecord;
  excretion?: ExcretionRecord;
  sleep?: SleepRecord;
  seizures?: SeizureRecord[];
  care_provided?: CareRecord;
  // 拡張: 各イベントフィールド
  expression?: any;
  positioning?: any;
  skin_oral_care?: any;
  illness?: any;
  cough_choke?: any;
  tube_feeding?: any;
  medication?: any;
  behavioral?: any;
  communication?: any;
  other?: any;
};

/**
 * 定型文テンプレート
 */
export interface Template {
  id: string;
  category: 'meal' | 'excretion' | 'sleep' | 'seizure' | 'activity' | 'special';
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

/**
 * デフォルトの定型文テンプレート
 */
export const DEFAULT_TEMPLATES: Template[] = [
  // 食事・水分関連
  {
    id: 'meal-001',
    category: 'meal',
    title: '意欲的な食事',
    content: 'スプーンを向けると意欲的に開口していた。全量摂取できた。',
    tags: ['意欲的', '全量摂取'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'meal-002',
    category: 'meal',
    title: 'むせ込みあり',
    content: 'むせ込みが多かったが、ゆっくりと介助することで安全に摂取できた。',
    tags: ['むせ込み', '安全摂取'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'meal-003',
    category: 'meal',
    title: '疲れが見られる',
    content: '後半、少し疲れが見られたが全量摂取できた。',
    tags: ['疲労', '全量摂取'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'meal-004',
    category: 'meal',
    title: 'ウトウトしながら',
    content: '食事中にウトウトしていたが、声かけで目を覚まして摂取を継続した。',
    tags: ['ウトウト', '声かけ'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'meal-005',
    category: 'meal',
    title: '口腔ケア',
    content: '口腔内に残渣が多かったため、食後の口腔ケアを丁寧に行った。',
    tags: ['残渣', '口腔ケア'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // 排泄関連
  {
    id: 'excretion-001',
    category: 'excretion',
    title: 'スムーズな排便',
    content: '腹部膨満なく、スムーズな排便だった。',
    tags: ['スムーズ', '正常'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'excretion-002',
    category: 'excretion',
    title: '便が固い',
    content: '少し便が固く、いきみがちだった。',
    tags: ['固い便', 'いきみ'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'excretion-003',
    category: 'excretion',
    title: '皮膚トラブル',
    content: '皮膚の発赤が見られたため、オムツ交換を頻回に行った。',
    tags: ['発赤', 'オムツ交換'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'excretion-004',
    category: 'excretion',
    title: '尿の色が濃い',
    content: '尿の色が濃かったため、水分摂取を促した。',
    tags: ['濃い尿', '水分摂取'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'excretion-005',
    category: 'excretion',
    title: '排便時の痛み',
    content: '排便時に痛がる様子が見られた。',
    tags: ['痛み', '排便'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // 睡眠関連
  {
    id: 'sleep-001',
    category: 'sleep',
    title: 'ぐっすり睡眠',
    content: '物音にも反応せず、ぐっすりと眠れていた。',
    tags: ['ぐっすり', '深い睡眠'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'sleep-002',
    category: 'sleep',
    title: 'ピクつきあり',
    content: '時折、手足にピクつきが見られた。',
    tags: ['ピクつき', '体動'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'sleep-003',
    category: 'sleep',
    title: 'いびきあり',
    content: 'いびきが気になったが、呼吸は安定していた。',
    tags: ['いびき', '呼吸安定'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'sleep-004',
    category: 'sleep',
    title: '中途覚醒',
    content: '中途覚醒が多かったが、声かけで再入眠できた。',
    tags: ['中途覚醒', '再入眠'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'sleep-005',
    category: 'sleep',
    title: '体動多い',
    content: '睡眠中の体動が多く、体位交換を頻回に行った。',
    tags: ['体動', '体位交換'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // 発作関連
  {
    id: 'seizure-001',
    category: 'seizure',
    title: '首の前倒れ',
    content: '食事中に突然、首がカクンと前に倒れた。すぐに意識は戻った。',
    tags: ['脱力発作', '首'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'seizure-002',
    category: 'seizure',
    title: '一点凝視',
    content: '呼びかけに反応なく、一点を凝視していた。',
    tags: ['欠神発作', '凝視'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'seizure-003',
    category: 'seizure',
    title: '全身震え',
    content: '全身がガクガクと震え、約30秒間続いた。',
    tags: ['間代発作', '全身'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'seizure-004',
    category: 'seizure',
    title: '眼球上転',
    content: '眼球が上転し、顔面蒼白が見られた。',
    tags: ['眼球上転', '顔面蒼白'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'seizure-005',
    category: 'seizure',
    title: '発作後の様子',
    content: '発作後、しばらくぼんやりとした様子が続いた。',
    tags: ['発作後', 'ぼんやり'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // 活動・様子関連
  {
    id: 'activity-001',
    category: 'activity',
    title: '音楽に反応',
    content: '音楽に合わせて体を揺らし、心地よさそうな表情だった。',
    tags: ['音楽', '体動', '笑顔'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'activity-002',
    category: 'activity',
    title: '音に反応',
    content: '大きな音がした際に、体をこわばらせていた。',
    tags: ['音', 'こわばり'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'activity-003',
    category: 'activity',
    title: '笑顔を見せた',
    content: '職員の顔を見て笑顔を見せてくれた。',
    tags: ['笑顔', '職員'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'activity-004',
    category: 'activity',
    title: 'おもちゃに興味',
    content: 'おもちゃに手を伸ばそうとする意欲的な様子が見られた。',
    tags: ['おもちゃ', '意欲的'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'activity-005',
    category: 'activity',
    title: 'リラックス',
    content: 'リラックスした様子で、介助者に体を預けていた。',
    tags: ['リラックス', '介助'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // 特記事項関連
  {
    id: 'special-001',
    category: 'special',
    title: '家族への連絡',
    content: '本日の様子について、家族に連絡した。',
    tags: ['家族連絡'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'special-002',
    category: 'special',
    title: 'ヒヤリハット',
    content: '食事中にむせ込みがあったが、すぐに回復した。',
    tags: ['ヒヤリハット', 'むせ込み'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'special-003',
    category: 'special',
    title: '職員の気づき',
    content: 'いつもと違う様子が見られたため、注意深く観察した。',
    tags: ['気づき', '観察'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'special-004',
    category: 'special',
    title: '要観察',
    content: '体調に変化が見られるため、引き続き観察が必要。',
    tags: ['要観察', '体調変化'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'special-005',
    category: 'special',
    title: 'その他',
    content: 'その他の特記事項を記録する。',
    tags: ['その他'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

/**
 * 日誌テンプレート
 */
export interface DailyLogTemplate {
  template_id: string;
  user_id: string; // 利用者ごとにテンプレートを持てる
  name: string; // テンプレート名
  data: Partial<DailyLog>; // 記録内容の雛形
  created_at: string;
  updated_at: string;
}

/**
 * 日誌下書き（Draft）
 */
export interface DailyLogDraft {
  draft_id: string;
  user_id: string;
  data: Partial<DailyLog>;
  last_saved: string;
}

// 他の既存の型 (AuthContextType, DataContextTypeなど) は
// この後、新しいデータ構造に合わせて修正していきます。
export type AuthContextType = {
  user: Staff | null;
  currentUser: Staff | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
  isAdmin: boolean;
};

export type DataContextType = {
  users: User[];
  dailyLogs: DailyLog[];
  staff: Staff[];
  facilityInfo: FacilityInfo | null;
  notices: Notice[];
  isLoading: boolean;
  error: string | null;
  dailyLogTemplates: DailyLogTemplate[];
  addDailyLogTemplate: (template: DailyLogTemplate) => Promise<void>;
  updateDailyLogTemplate: (template: DailyLogTemplate) => Promise<void>;
  deleteDailyLogTemplate: (templateId: string) => Promise<void>;
  getTemplatesByUser: (userId: string) => Promise<DailyLogTemplate[]>;
  clearError: () => Promise<void>;
  addUser: (user: Partial<User>) => Promise<void>;
  updateUser: (updatedUser: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addStaff: (staffMember: Partial<Staff>) => Promise<void>;
  updateStaff: (updatedStaff: Staff) => Promise<void>;
  addDailyLog: (log: DailyLog) => Promise<void>;
  updateDailyLog: (logId: string, updates: Partial<DailyLog>) => Promise<void>;
  deleteDailyLog: (logId: string) => Promise<void>;
  getDailyLog: (logId: string) => Promise<DailyLog | null>;
  getStaffById: (staffId: string) => Promise<Staff | null>;
  getUserById: (userId: string) => Promise<User | null>;
  saveUser: (user: User) => Promise<void>;
  saveDailyLog: (log: DailyLog) => Promise<void>;
  saveStaff: (staffMember: Staff) => Promise<void>;
  deleteStaff: (staffId: string) => Promise<void>;
  updateFacilityInfo: (info: FacilityInfo) => Promise<void>;
  createBackup: () => Promise<void>;
  importData: (data: any) => Promise<void>;
  clearAllData: () => Promise<void>;
  getStorageUsage: () => Promise<{ used: number; total: number; }>;
  dailyLogDrafts: DailyLogDraft[];
  saveDailyLogDraft: (draft: DailyLogDraft) => Promise<void>;
  deleteDailyLogDraft: (draftId: string) => Promise<void>;
  getDraftByUser: (userId: string) => Promise<DailyLogDraft | null>;
  addNotice: (notice: Notice) => Promise<void>;
  markNoticeAsRead: (noticeId: string, userId: string) => Promise<void>;
};

export enum HandbookType {
  PHYSICAL = '身体障害者手帳',
  MENTAL = '精神障害者保健福祉手帳',
  REHABILITATION = '療育手帳',
}

export enum MedicalCare {
  SUCTION = '吸引',
  TUBE_FEEDING = '経管栄養',
  VENTILATOR = '人工呼吸器',
  INHALATION = '吸入',
  ENEMA = '浣腸',
  CATHETERIZATION = '導尿',
  IVH = 'IVH埋め込み',
}

export enum DisabilityLevel {
  LEVEL_1 = '区分1',
  LEVEL_2 = '区分2',
  LEVEL_3 = '区分3',
  LEVEL_4 = '区分4',
  LEVEL_5 = '区分5',
  LEVEL_6 = '区分6',
}

export enum AssistanceLevel {
  FULL = '全介助',
  PARTIAL = '一部介助',
  INDEPENDENT = '自立',
}

export enum School {
  SPECIAL_SUPPORT = '特別支援学校',
  NONE = 'なし',
}

export type Report = {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
};

export type CarePlan = {
  id: string;
  userId: string;
  title: string;
  goals: string[];
  tasks: string[];
  startDate: string;
  endDate: string;
};

export type Notice = {
  id: string;
  title: string;
  content: string;
  date: string;
  readBy: string[];
  isPinned?: boolean;
};

export type FacilityInfo = {
  name: string;
  address: string;
  phone: string;
  operationForm: string;
  contractNumbers: {
    lifeCare: number;
    dayService: number;
    afterSchool?: number;
  };
  dailyAverageUsers: {
    lifeCare: number;
    dayService: number;
    afterSchool?: number;
  };
  locationInfo: string;
  operatingDays?: string;
  operatingHours: string;
  closedDays: string;
  serviceHours: {
    lifeCare: string;
    dayServiceWeekdays: string;
    dayServiceHolidays: string;
    shortStay: string;
    afterSchoolWeekdays?: string;
    afterSchoolHolidays?: string;
  };
  details?: Array<{
    category: string;
    items: Array<{
      label: string;
      value: string;
    }>;
  }>;
  lifeCareSystem: {
    capacity: number;
    capacityScale: string;
    personnelPlacementType: string;
    hasPlacementSystem: boolean;
    fullTimeNurses: number;
    hasSevereDisabilitySupport: boolean;
    hasTransportationSupport: boolean;
    hasBathingSupport: boolean;
    treatmentImprovementKaizen: string;
  };
  dayServiceSystem: {
    capacity: number;
    mainDisabilityType: string;
    hasNurseAddition: boolean;
  };
};

// --- 日誌記録の詳細な型定義 ---
export interface VitalSigns {
  temperature: number;
  pulse: number;
  spO2: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
}
export interface IntakeRecord {
  methods: string[];
  amount_ml: number;
  meal_form: string;
  meal_amount: string;
  status: string[];
  notes: string;
}
export interface ExcretionRecord {
  bristol_scale: number;
  status: string[];
  notes: string;
}
export interface SleepRecord {
  duration_minutes: number;
  status: string;
  notes: string;
}
export interface SeizureRecord {
  type: string;
  duration_sec: number;
  details: string[];
  notes: string;
}
export interface ActivityRecord {
  participation: string[];
  mood: string;
  notes: string;
}
export interface CareRecord {
  provided_care: MedicalCare[];
}
export interface SpecialNote {
  category: string;
  details: string;
}

// --- Project Nexus 第3章準拠: 構造化ケアログデータ型 ---

/**
 * 発作記録（Seizure Events）
 */
export interface SeizureEvent {
  id: string;
  userId: string;
  event_timestamp: string; // ISO 8601 timestamp
  duration_seconds: number;
  seizure_type: 'tonic-clonic' | 'absence' | 'myoclonic' | 'atonic' | 'focal' | 'other';
  severity?: 1 | 2 | 3 | 4 | 5; // 軽度から重度
  notes?: string;
  pre_seizure_signs?: string[];
  post_seizure_condition?: 'normal' | 'confused' | 'tired' | 'sleeping';
  created_by: string; // staff ID
  created_at: string;
}

/**
 * 表情・感情記録（Expression/Mood）
 */
export interface ExpressionEvent {
  id: string;
  userId: string;
  observation_time: string;
  expression_score: 1 | 2 | 3 | 4 | 5; // 1:苦痛 → 5:喜び
  context: 'activity' | 'rest' | 'meal' | 'care' | 'interaction' | 'other';
  specific_expression?: 'smile' | 'laugh' | 'cry' | 'frown' | 'neutral' | 'pain';
  trigger?: string; // 表情の引き金となった出来事
  notes?: string;
  created_by: string;
  created_at: string;
}

/**
 * 体調不良記録（Illness/Health Issues）
 */
export interface IllnessEvent {
  id: string;
  userId: string;
  symptom_timestamp: string;
  symptom_types: ('fever' | 'vomiting' | 'diarrhea' | 'rash' | 'cough' | 'breathing_difficulty' | 'pain' | 'other')[];
  body_temperature?: number; // 摂氏
  pain_level?: 1 | 2 | 3 | 4 | 5;
  location?: string; // 痛みや症状の場所
  severity: 'mild' | 'moderate' | 'severe';
  interventions?: string[]; // 実施したケア
  notes?: string;
  created_by: string;
  created_at: string;
}

/**
 * 水分摂取記録（Hydration）
 */
export interface HydrationEvent {
  id: string;
  userId: string;
  intake_timestamp: string;
  volume_ml: number;
  fluid_type: 'water' | 'tea' | 'juice' | 'tube_feeding' | 'thickened_water' | 'other';
  method: 'oral' | 'tube' | 'iv';
  temperature?: 'hot' | 'warm' | 'room_temp' | 'cold';
  notes?: string;
  created_by: string;
  created_at: string;
}

/**
 * 睡眠記録（Sleep）
 */
export interface SleepEvent {
  id: string;
  userId: string;
  sleep_start_time: string;
  sleep_end_time?: string; // まだ起きていない場合はnull
  night_wakings: number;
  quality_score: 1 | 2 | 3 | 4 | 5; // 1:不穏 → 5:安眠
  position?: 'supine' | 'prone' | 'left_side' | 'right_side' | 'sitting';
  environment_notes?: string; // 部屋の状況など
  notes?: string;
  created_by: string;
  created_at: string;
}

/**
 * 咳き込み・ムセ込み記録（Cough/Choke）
 */
export interface CoughChokeEvent {
  id: string;
  userId: string;
  event_timestamp: string;
  event_type: 'cough' | 'choke';
  context: 'meal' | 'drink' | 'rest' | 'activity' | 'other';
  severity: 'mild' | 'moderate' | 'severe';
  duration_seconds?: number;
  intervention_needed: boolean;
  interventions?: string[]; // 吸引、体位変換など
  notes?: string;
  created_by: string;
  created_at: string;
}

/**
 * 活動参加記録（Activity Participation）
 */
export interface ActivityEvent {
  id: string;
  userId: string;
  activity_start_time: string;
  activity_end_time?: string;
  activity_type: 'rehabilitation' | 'recreation' | 'music_therapy' | 'walk' | 'craft' | 'cooking' | 'bathing' | 'other';
  participation_level: 1 | 2 | 3 | 4 | 5; // 1:消極的 → 5:積極的
  mood_during_activity: 'happy' | 'calm' | 'neutral' | 'reluctant' | 'distressed';
  assistance_level: 'full' | 'partial' | 'minimal' | 'independent';
  achievements?: string[]; // その日の成果
  notes?: string;
  created_by: string;
  created_at: string;
}

/**
 * 注入経過記録（Tube Feeding）
 */
export interface TubeFeedingEvent {
  id: string;
  userId: string;
  infusion_start_time: string;
  infusion_end_time?: string;
  volume_ml: number;
  formula_type: string;
  rate_ml_per_hour?: number;
  complications?: ('vomiting' | 'abdominal_distension' | 'diarrhea' | 'reflux' | 'none')[];
  position_during_feeding: 'upright' | 'semi_upright' | 'side_lying';
  post_feeding_position_duration?: number; // 分
  notes?: string;
  created_by: string;
  created_at: string;
}

/**
 * ポジショニング記録（Positioning）
 */
export interface PositioningEvent {
  id: string;
  userId: string;
  positioning_time: string;
  position_type: 'supine' | 'prone' | 'left_side' | 'right_side' | 'sitting' | 'standing';
  duration_minutes: number;
  support_equipment?: string[]; // クッション、枕など
  skin_condition?: 'normal' | 'redness' | 'pressure_mark' | 'breakdown';
  comfort_level?: 1 | 2 | 3 | 4 | 5;
  reason: 'routine' | 'pressure_relief' | 'comfort' | 'medical' | 'activity';
  notes?: string;
  created_by: string;
  created_at: string;
}

/**
 * 統合デイリーログ - Project Nexus版
 */
export interface StructuredDailyLog {
  id: string;
  userId: string;
  record_date: string; // YYYY-MM-DD
  staff_id: string;
  created_at: string;
  updated_at: string;
  
  // 各種イベント配列
  seizure_events: SeizureEvent[];
  expression_events: ExpressionEvent[];
  illness_events: IllnessEvent[];
  hydration_events: HydrationEvent[];
  sleep_events: SleepEvent[];
  cough_choke_events: CoughChokeEvent[];
  activity_events: ActivityEvent[];
  tube_feeding_events: TubeFeedingEvent[];
  positioning_events: PositioningEvent[];
  
  // 一日の総括
  daily_summary?: {
    overall_condition: 'excellent' | 'good' | 'fair' | 'poor' | 'concerning';
    key_observations: string[];
    staff_notes: string;
    family_communication?: string;
    follow_up_needed?: boolean;
    follow_up_notes?: string;
  };
  
  // 添付ファイル（写真・動画）
  attachments?: {
    id: string;
    type: 'photo' | 'video';
    url: string;
    description?: string;
    event_reference?: string; // どのイベントに関連するか
  }[];
}

/**
 * ケアログ入力用の各種Enum定義
 */
export enum SeizureType {
  TONIC_CLONIC = 'tonic-clonic',
  ABSENCE = 'absence', 
  MYOCLONIC = 'myoclonic',
  ATONIC = 'atonic',
  FOCAL = 'focal',
  OTHER = 'other'
}

export enum ExpressionContext {
  ACTIVITY = 'activity',
  REST = 'rest',
  MEAL = 'meal',
  CARE = 'care',
  INTERACTION = 'interaction',
  OTHER = 'other'
}

export enum ActivityType {
  REHABILITATION = 'rehabilitation',
  RECREATION = 'recreation',
  MUSIC_THERAPY = 'music_therapy',
  WALK = 'walk',
  CRAFT = 'craft',
  COOKING = 'cooking',
  BATHING = 'bathing',
  OTHER = 'other'
}

export enum PositionType {
  SUPINE = 'supine',
  PRONE = 'prone',
  LEFT_SIDE = 'left_side',
  RIGHT_SIDE = 'right_side',
  SITTING = 'sitting',
  STANDING = 'standing'
}