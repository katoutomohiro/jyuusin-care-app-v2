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
  initials: string;
  age: number;
  gender: Gender;
  serviceType: ServiceType[];
  disabilityLevel?: DisabilityLevel | string;
  disabilityType?: string;
  underlyingConditions?: string[];
  medicalCare?: MedicalCare[] | string[];
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
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  provided_care: string[];
}
export interface SpecialNote {
  category: string;
  details: string;
}

/**
 * 重症心身障害児者特化の食事摂取方法
 */
export enum IntakeMethod {
  ORAL_CUP = '経口（コップ・スプーン）',
  ORAL_THICKENED = '経口（トロミ付き）',
  TUBE_NASAL = '経管栄養（経鼻）',
  TUBE_GASTROSTOMY = '経管栄養（胃ろう）',
  SYRINGE = 'シリンジ使用',
  OTHER = 'その他'
}

/**
 * 重症心身障害児者特化の食事形態
 */
export enum MealForm {
  MIXER = 'ミキサー食',
  CHOPPED = 'きざみ食',
  PASTE = 'ペースト食',
  LIQUID = '流動食',
  PUREE = 'ピューレ食',
  SOFT = '軟食',
  REGULAR = '普通食'
}

/**
 * 重症心身障害児者特化の食事摂取量
 */
export enum MealAmount {
  FULL = '全量',
  NINETY_PERCENT = '9割',
  EIGHTY_PERCENT = '8割',
  SEVENTY_PERCENT = '7割',
  SIXTY_PERCENT = '6割',
  HALF = '半分',
  FORTY_PERCENT = '4割',
  THIRTY_PERCENT = '3割',
  TWENTY_PERCENT = '2割',
  TEN_PERCENT = '1割',
  ONE_BITE = '一口のみ',
  REFUSED = '拒否'
}

/**
 * 重症心身障害児者特化の食事の様子
 */
export enum MealStatus {
  GOOD_APPETITE = '摂食意欲良好',
  NO_RESIDUE = '口腔内残渣なし',
  CHOKING = 'むせ込みあり',
  DROOLING = '流涎多い',
  DOZING = '途中でウトウト',
  RESISTANCE = '介助に抵抗あり',
  VOMITING = '嘔吐・逆流',
  COLOR_CHANGE = '顔色変化あり',
  RESIDUE = '口腔内残渣あり',
  OTHER = 'その他'
}

/**
 * 重症心身障害児者特化の排泄の様子
 */
export enum ExcretionStatus {
  STRONG_STRAINING = 'いきみ強い',
  NO_SKIN_TROUBLE = '皮膚トラブルなし',
  MUCUS = '粘液混入',
  URINE_CLOUDY = '尿の混濁',
  BLOOD_STOOL = '血便',
  BLACK_STOOL = '黒色便',
  WHITE_STOOL = '白色便',
  BAD_ODOR = '異臭あり',
  BLOOD_URINE = '血尿',
  UNDIGESTED = '不消化物あり',
  SKIN_REDNESS = '皮膚の発赤あり',
  DIAPER_RASH = 'オムツかぶれ',
  OTHER = 'その他'
}

/**
 * 重症心身障害児者特化の睡眠の様子
 */
export enum SleepStatus {
  SMOOTH_SLEEP = 'スムーズに入眠',
  SLEEP_DIFFICULTY = '寝付きが悪い',
  MIDDLE_AWAKENING = '中途覚醒あり',
  MUCH_MOVEMENT = '睡眠中の体動多い',
  RIGIDITY = '睡眠中に硬直あり',
  SNORING = 'いびき・無呼吸様呼吸あり',
  PEACEFUL = '穏やかな睡眠',
  LIMB_TWITCHING = '手足のピクつき',
  SOUND_REACTION = '物音に反応',
  OTHER = 'その他'
}

/**
 * 重症心身障害児者特化の発作の種類（詳細解説付き）
 */
export enum SeizureType {
  TONIC = '強直発作（突っ張る）',
  CLONIC = '間代発作（ガクガクする）',
  TONIC_CLONIC = '強直間代発作',
  ATONIC = '脱力発作（力が抜ける）',
  MYOCLONIC = 'ミオクロニー発作（ピクッとする）',
  EPILEPTIC_SPASM = 'てんかん性スパズム（シリーズ形成）',
  ATYPICAL_ABSENCE = '非定型欠神発作（ぼーっとする）',
  FOCAL_IMPAIRED = '焦点意識減損発作（動作が止まる・自動症）',
  OTHER = 'その他'
}

/**
 * 発作の詳細解説
 */
export const SEIZURE_EXPLANATIONS: Record<SeizureType, string> = {
  [SeizureType.TONIC]: '全身の筋肉が突っ張り、硬直する発作。意識は失われることが多い。',
  [SeizureType.CLONIC]: '全身または一部の筋肉がリズミカルにガクガクと震える発作。',
  [SeizureType.TONIC_CLONIC]: '強直発作と間代発作が連続して起こる。最も一般的な発作の一つ。',
  [SeizureType.ATONIC]: '全身、あるいは首や顎、足などの筋緊張が突然失われ、カクンと力が抜ける。立っている場合は崩れ落ちるように倒れる（ドロップアタック）。頭部だけがカクンと垂れることもある。持続時間は1〜2秒と非常に短い。',
  [SeizureType.MYOCLONIC]: '瞬間的に筋肉が収縮し、ピクッとした動きをする。意識は保たれることが多い。',
  [SeizureType.EPILEPTIC_SPASM]: '短時間の筋収縮がシリーズを形成して起こる。特に乳児期に多い。',
  [SeizureType.ATYPICAL_ABSENCE]: '意識がぼんやりとして、一点を凝視したり、動作が止まったりする。',
  [SeizureType.FOCAL_IMPAIRED]: '意識が部分的に失われ、自動症（無意識の動作）を伴うことがある。',
  [SeizureType.OTHER]: '上記に当てはまらない発作'
};

/**
 * 重症心身障害児者特化の発作の詳細
 */
export enum SeizureDetail {
  EYEBALL_ROLLING = '眼球上転',
  EYEBALL_DEVIATION_RIGHT = '眼球偏位（右）',
  EYEBALL_DEVIATION_LEFT = '眼球偏位（左）',
  FACIAL_PALLOR = '顔面蒼白',
  CYANOSIS = 'チアノーゼあり',
  MUCH_DROOLING = '多量の流涎',
  VOMITING = '嘔吐あり',
  INCONTINENCE = '失禁あり',
  SYMMETRICAL = '左右対称の動き',
  ASYMMETRICAL = '左右非対称の動き',
  OTHER = 'その他'
}

/**
 * 重症心身障害児者特化の活動参加の様子
 */
export enum ActivityParticipation {
  SMILE = '笑顔が見られた',
  VOCALIZATION = '発声・クーイングあり',
  VISUAL_TRACKING = '目で対象を追う（追視）',
  SOUND_REACTION = '音に反応',
  LIGHT_REACTION = '光に反応',
  REACH_TOUCH = '物に手を伸ばす・触れる',
  TRUST_CAREGIVER = '介助者に体を預ける',
  RELAXED = 'リラックスした様子',
  UNCOMFORTABLE = '不快な表情・声',
  RIGID_BODY = '体をこわばらせる',
  MUSIC_REACTION = '音楽に反応',
  BODY_SWAYING = '体を揺らす',
  OTHER = 'その他'
}

/**
 * 重症心身障害児者特化の表情・気分
 */
export enum MoodStatus {
  CALM = '穏やか',
  HAPPY = '笑顔・機嫌が良い',
  ENERGETIC = '活気がある',
  IRRITABLE = '不機嫌・ぐずり',
  ANXIOUS = '不安・緊張気味',
  DOZING = 'ウトウトしている',
  EXPRESSIONLESS = '無表情',
  EXCITED = '興奮気味',
  SAD = '悲しそう',
  OTHER = 'その他'
}

/**
 * 重症心身障害児者特化の医療ケア種別
 */
export enum MedicalCare {
  SUCTION = '吸引',
  TUBE_FEEDING = '経管栄養',
  VENTILATOR = '人工呼吸器',
  INHALATION = '吸入',
  ENEMA = '浣腸',
  CATHETERIZATION = '導尿',
  IVH = '中心静脈栄養',
  OTHER = 'その他'
}

/**
 * 重症心身障害児者特化の特記事項カテゴリー
 */
export enum SpecialNoteCategory {
  FAMILY_CONTACT = '家族への連絡事項',
  NEAR_MISS = 'ヒヤリハット',
  STAFF_OBSERVATION = '職員からの気づき',
  UNUSUAL_BEHAVIOR = 'いつもと違う様子',
  OBSERVATION_NEEDED = '要観察事項',
  MEDICAL_CONSULTATION = '医療相談',
  EQUIPMENT_ISSUE = '機器トラブル',
  OTHER = 'その他'
}

/**
 * 重症心身障害児者特化の利用者詳細情報
 */
export interface SevereDisabilityUser extends User {
  // 基本情報
  birthDate: string;
  admissionDate: string;
  
  // 障害・疾患情報
  disabilityLevel: DisabilityLevel;
  underlyingConditions: string[];
  medicalCare: MedicalCare[];
  handbooks: HandbookType[];
  assistanceLevel: AssistanceLevel;
  
  // 重症心身障害特化情報
  seizureTypes?: SeizureType[];
  seizureFrequency?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    emergencyPhone?: string;
  };
  
  // 医療ケア詳細
  medicalCareDetails?: {
    suctionFrequency?: string;
    tubeFeedingType?: string;
    medicationSchedule?: string;
    specialCare?: string;
  };
  
  // 家族情報
  familyInfo?: {
    parents: string[];
    siblings?: string[];
    livingSituation: string;
    supportNeeds: string;
  };
  
  // 個別支援計画
  carePlan?: {
    longTermGoals: string[];
    shortTermGoals: string[];
    currentFocus: string[];
    evaluationDate: string;
  };
  
  // 緊急時対応
  emergencyResponse?: {
    seizureAction: string;
    medicalInstitution: string;
    transportMethod: string;
    specialInstructions: string;
  };
}

/**
 * 重症心身障害児者特化の日々の記録
 */
export interface SevereDisabilityDailyLog extends DailyLog {
  // バイタルサイン（詳細）
  vitals: {
    temperature: number; // 0.1単位
    pulse: number; // 1単位
    spO2: number; // 1単位
    bloodPressure: {
      systolic: number; // 1単位
      diastolic: number; // 1単位
    };
    notes?: string;
  };
  
  // 食事・水分摂取（重症心身障害特化）
  intake: {
    methods: IntakeMethod[];
    amount_ml: number; // 5ml単位
    meal_form: MealForm;
    meal_amount: MealAmount;
    status: MealStatus[];
    notes: string;
  };
  
  // 排泄記録（重症心身障害特化）
  excretion: {
    bristol_scale: number; // 1-7
    status: ExcretionStatus[];
    notes: string;
  };
  
  // 睡眠記録（重症心身障害特化）
  sleep: {
    duration_minutes: number; // 30分単位
    status: SleepStatus;
    quality?: string;
    notes: string;
  };
  
  // 発作記録（重症心身障害特化）
  seizures: {
    type: SeizureType;
    duration_sec: number; // 1秒単位
    details: SeizureDetail[];
    notes: string;
    time?: string;
  }[];
  
  // 活動・様子（重症心身障害特化）
  activity: {
    participation: ActivityParticipation[];
    mood: MoodStatus;
    notes: string;
  };
  
  // 医療ケア提供（重症心身障害特化）
  care_provided: {
    provided_care: MedicalCare[];
    notes: string;
  };
  
  // 特記事項（重症心身障害特化）
  special_notes: {
    category: SpecialNoteCategory;
    details: string;
  }[];
  
  // 家族連絡
  family_contact?: {
    content: string;
    method: 'phone' | 'note' | 'direct';
    time: string;
  };
  
  // 緊急対応
  emergency_response?: {
    occurred: boolean;
    type: string;
    action: string;
    outcome: string;
  };
}

// 追加の型定義
export type SeizurePredictionWithAlias = {
  id: string;
  userId: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  predictedTime: string;
  factors: string[];
  recommendations: string[];
  timestamp: string;
};

export type HealthPredictionWithAlias = {
  id: string;
  userId: string;
  predictionType: 'seizure' | 'vital_signs' | 'mood' | 'activity';
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  description: string;
  recommendations: string[];
  timestamp: string;
};

export enum CarePlanStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum CarePlanPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum CarePlanCategory {
  MEDICAL = 'medical',
  DAILY_CARE = 'daily_care',
  REHABILITATION = 'rehabilitation',
  SOCIAL = 'social',
  EDUCATION = 'education'
}

export type CareGoal = {
  id: string;
  type: string;
  title: string;
  description: string;
  targetDate: string;
  status: string;
  priority: string;
  measurable: boolean;
  measurementCriteria: string;
  progress: number;
  notes: string[];
};

export type CareService = {
  id: string;
  type: string;
  name: string;
  frequency: string;
  duration: string;
  provider: string;
  status: string;
  notes: string;
};

export type RehabilitationPlan = {
  id: string;
  userId: string;
  title: string;
  description: string;
  goals: string[];
  exercises: {
    id: string;
    name: string;
    type: string;
    frequency: string;
    duration: string;
    equipment: string[];
    notes: string;
  }[];
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  evaluations: {
    date: string;
    evaluator: string;
    score: number;
    notes: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

export type Meal = {
  id: string;
  userId: string;
  date: string;
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  temperature: 'hot' | 'warm' | 'cold' | 'room_temperature';
  foodItems: FoodItem[];
  totalNutrition: NutritionInfo;
  amount: string;
  notes: string;
  createdBy: string;
  createdAt: string;
  consumedAt?: string;
  satisfaction?: number;
  reactions?: string[];
};

export type FoodItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  nutrition: NutritionInfo;
  allergens: string[];
  texture: string;
  temperature: string;
  notes?: string;
};

export type NutritionInfo = {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  sodium: number;
  vitamins?: { [key: string]: number };
  minerals?: { [key: string]: number };
};

export type NutritionGoal = {
  id: string;
  userId: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyFat: number;
  dailyCarbohydrates: number;
  dailySodium: number;
  restrictions: DietaryRestriction[];
  allergies: UserAllergy[];
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type UserAllergy = {
  id: string;
  userId: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  symptoms: string[];
  notes: string;
  detectedAt: string;
};

export type DietaryRestriction = {
  id: string;
  userId: string;
  type: string;
  description: string;
  reason: string;
  startDate: string;
  endDate?: string;
  notes: string;
};

export type FoodAllergy = {
  id: string;
  userId: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  symptoms: string[];
  notes: string;
  detectedAt: string;
};

// NotificationContextType の修正
export type NotificationContextType = {
  notifications: Notification[];
  showNotification: (message: string, type?: NotificationType) => void;
  hideNotification: (id: string) => void;
  clearNotifications: () => void;
};