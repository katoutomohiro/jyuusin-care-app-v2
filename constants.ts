import { Home, Users, FileText, Plus, BarChart3 } from 'lucide-react';

export const navigation = [
  { name: 'ダッシュボード', subtitle: 'ホーム', href: '/', icon: Home },
  { name: '利用者管理', subtitle: '利用者一覧', href: '/users', icon: Users },
  { name: '日誌（ホーム）', subtitle: '利用者タイル', href: '/daily-log', icon: FileText },
  { name: '日誌入力', subtitle: '新規入力', href: '/daily-log/input', icon: Plus },
  { name: '日誌一覧', subtitle: '過去の記録', href: '/daily-log/list', icon: FileText },
  { name: 'A4プレビュー', subtitle: 'A4 出力プレビュー', href: '/daily-log/preview', icon: FileText },
  { name: '年間ストック', subtitle: '年次集計', href: '/daily-log/preview/yearly', icon: BarChart3 },
];
import { Gender, ServiceType, DisabilityLevel, HandbookType, AssistanceLevel, School, SeizureType, MedicalCare } from './types';
import type { User, Staff, FacilityInfo, DailyLog, ActivityRecord, SpecialNote, SevereDisabilityUser } from './types';

export const APP_NAME = '重心ケアアプリ';

export const SAMPLE_USERS: User[] = [
    {
      id: 'user-001',
      name: '重心 太郎',
      initials: 'JT',
      age: 12,
      gender: Gender.BOY,
      serviceType: [ServiceType.DAY_SERVICE],
      disabilityLevel: DisabilityLevel.LEVEL_5,
      disabilityType: '脳性麻痺',
      underlyingConditions: ['てんかん', '側弯症'],
      medicalCare: [MedicalCare.SUCTION, MedicalCare.TUBE_FEEDING],
      handbooks: [HandbookType.PHYSICAL, HandbookType.REHABILITATION],
      assistanceLevel: AssistanceLevel.FULL,
      school: School.SPECIAL_SUPPORT,
      notes: '日中の傾眠傾向あり。コミュニケーションは主に視線と発声で行う。',
      familyContact: { name: '重心 花子', relationship: '母', phone: '090-1234-5678' },
      admissionDate: '2022-04-01',
      status: 'active'
    },
    {
      id: 'user-002',
      name: 'ケア 次郎',
      initials: 'CJ',
      age: 25,
      gender: Gender.MALE,
      serviceType: [ServiceType.LIFE_CARE],
      disabilityLevel: DisabilityLevel.LEVEL_6,
      disabilityType: 'ミトコンドリア病',
      underlyingConditions: ['呼吸器機能障害', '睡眠障害'],
      medicalCare: [MedicalCare.VENTILATOR, MedicalCare.SUCTION],
      handbooks: [HandbookType.PHYSICAL, HandbookType.MENTAL],
      assistanceLevel: AssistanceLevel.FULL,
      school: School.NONE,
      notes: '音楽療法に良い反応を示す。特にクラシック音楽が好き。',
      familyContact: { name: 'ケア 三郎', relationship: '父', phone: '080-8765-4321' },
      admissionDate: '2020-10-01',
      status: 'active'
    },
];

export const SAMPLE_STAFF: Staff[] = [
    { 
      id: 'staff-001',
      username: 'admin',
      name: '管理者 太郎',
      role: 'admin',
      isFullTime: true,
      permissions: ['admin', 'reports', 'data_management'],
      templateId: 'admin-template',
      templateName: '管理者用テンプレート',
    },
    { 
      id: 'staff-002',
      username: 'staff',
      name: '支援員 次郎',
      role: 'staff',
      isFullTime: true,
      permissions: ['reports'],
      templateId: 'staff-template',
      templateName: '支援員用テンプレート',
    },
    // 24名の職員データ（重心ケアセンター）
    { id: 'staff-003', username: 'tanaka', name: '田中 美咲', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-004', username: 'sato', name: '佐藤 健一', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-005', username: 'suzuki', name: '鈴木 恵子', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-006', username: 'takahashi', name: '高橋 正男', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-007', username: 'watanabe', name: '渡辺 由美', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-008', username: 'ito', name: '伊藤 博文', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-009', username: 'yamamoto', name: '山本 真理', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-010', username: 'nakamura', name: '中村 誠', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-011', username: 'kobayashi', name: '小林 香織', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-012', username: 'kato', name: '加藤 勇', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-013', username: 'yoshida', name: '吉田 美穂', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-014', username: 'yamada', name: '山田 隆', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-015', username: 'sasaki', name: '佐々木 愛', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-016', username: 'yamaguchi', name: '山口 正義', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-017', username: 'saito', name: '斎藤 恵美', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-018', username: 'matsumoto', name: '松本 健太', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-019', username: 'inoue', name: '井上 美香', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-020', username: 'kimura', name: '木村 正人', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-021', username: 'hayashi', name: '林 由美子', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-022', username: 'shimizu', name: '清水 健一', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-023', username: 'yamazaki', name: '山崎 美咲', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-024', username: 'mori', name: '森 正義', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-025', username: 'abe', name: '阿部 恵美', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
    { id: 'staff-026', username: 'okada', name: '岡田 健太', role: 'staff', isFullTime: true, permissions: ['reports'], templateId: 'staff-template', templateName: '支援員用テンプレート' },
];

export const FACILITY_INFO: FacilityInfo = {
    name: "重心ケアセンター",
    address: "東京都中央区重心1-2-3",
    phone: "03-1234-5678",
    operationForm: "社会福祉法人重心会",
    contractNumbers: { lifeCare: 20, dayService: 10 },
    dailyAverageUsers: { lifeCare: 18, dayService: 8 },
    locationInfo: "ビル2階",
    operatingDays: "月曜日～金曜日",
    operatingHours: "9:00-18:00",
    closedDays: "土日祝",
    serviceHours: { lifeCare: "9:30-15:30", dayServiceWeekdays: "13:00-17:00", dayServiceHolidays: "10:00-16:00", shortStay: "非対応"},
    lifeCareSystem: { capacity: 20, capacityScale: 'I', personnelPlacementType: '1.5:1', hasPlacementSystem: true, fullTimeNurses: 2, hasSevereDisabilitySupport: true, hasTransportationSupport: true, hasBathingSupport: true, treatmentImprovementKaizen: 'I' },
    dayServiceSystem: { capacity: 10, mainDisabilityType: '重症心身障害児', hasNurseAddition: true }
};

export const SAMPLE_LOGS_BASE: Omit<DailyLog, 'id' | 'log_id' | 'userId' | 'user_id' | 'staff_id' | 'recorder_name' | 'author' | 'authorId'>[] = [
  {
    record_date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
    vitals: { temperature: 36.8, pulse: 88, spO2: 98, bloodPressure: { systolic: 110, diastolic: 70 } },
    intake: { methods: ['経口'], amount_ml: 1200, meal_form: 'ペースト', meal_amount: '全量', status: ['良好'], notes: 'スプーンを持つと意欲的に開口。' },
    excretion: { bristol_scale: 4, status: ['スムーズ'], notes: '' },
    sleep: { duration_minutes: 480, status: '良好', notes: '夜間、ぐっすり眠れていた。'},
    seizures: [],
    activity: { participation: ['音楽活動'], mood: '笑顔', notes: '音楽に合わせて体を揺らしていた。' },
    care_provided: { provided_care: [MedicalCare.SUCTION] },
    special_notes: [{ category: '申し送り', details: '特変なし。元気に過ごせました。' }],
    weather: '晴れ',
    mood: ['穏やか'],
    meal_intake: { breakfast: '全量', lunch: '全量', snack: '全量', dinner: ''},
    hydration: 1200,
    toileting: [{time: '10:00', type: 'urine', amount: 'medium'}],
    special_notes_details: '特変なし。'
  },
  {
    record_date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
    vitals: { temperature: 37.2, pulse: 102, spO2: 96, bloodPressure: { systolic: 100, diastolic: 65 } },
    intake: { methods: ['経管'], amount_ml: 1500, meal_form: '流動食', meal_amount: '全量', status: ['良好'], notes: '' },
    excretion: { bristol_scale: 5, status: ['普通'], notes: '' },
    sleep: { duration_minutes: 420, status: '時々覚醒', notes: '夜間に数回、体動が見られた。'},
    seizures: [
      { type: '強直発作', duration_sec: 30, details: ['眼球上転'], notes: 'すぐに収束' }
    ],
    activity: { participation: ['個別活動'], mood: '普通', notes: '穏やかに過ごせていた。' },
    care_provided: { provided_care: [MedicalCare.SUCTION, MedicalCare.TUBE_FEEDING, MedicalCare.VENTILATOR] },
    special_notes: [{ category: '連絡事項', details: 'ご家族へ発作の様子を連絡済み。' }],
    weather: '晴れ',
    mood: ['普通'],
    meal_intake: { breakfast: '全量', lunch: '全量', snack: '全量', dinner: ''},
    hydration: 1500,
    toileting: [{time: '11:00', type: 'both', amount: 'large'}],
    special_notes_details: '発作の様子を要観察。'
  }
];

// --- 日誌入力フォーム用の選択肢データ ---
export const SEIZURE_TYPES = [ "強直間代発作", "焦点意識減損発作", "脱力発作", "ミオクロニー発作", "その他"];
export const SEIZURE_DETAILS = ["目の動き", "意識の状態", "体の動き", "呼吸の変化", "発作後の様子"];
export const MEAL_AMOUNTS = ["全量", "半分", "1/3", "ほとんど食べず"];
export const MEAL_FORMS = ["常食", "刻み食", "ミキサー食", "流動食"];
export const MEAL_STATUS = ["良好", "むせ込みあり", "拒否", "嘔吐"];
export const WATER_INTAKE_METHODS = ["経口", "経管"];
export const BRISTOL_SCALE = ["1:コロコロ", "2:硬い", "3:ひび割れ", "4:普通", "5:柔らかい", "6:泥状", "7:水様"];
export const EXCRETION_STATUS = ["スムーズ", "いきみあり", "失禁", "なし"];
export const SLEEP_STATUS = ["良好", "寝つき悪い", "中途覚醒", "体動多い"];
export const ACTIVITY_PARTICIPATION = ["積極的に参加", "促され参加", "見学", "不参加"];
export const MOOD_STATUS = ["穏やか", "笑顔", "活気あり", "不機嫌", "不安"];
export const MEDICAL_CARE_PROVIDED = ["吸引", "吸入", "経管栄養", "導尿", "体位交換"];
export const SPECIAL_NOTE_CATEGORIES = ["家族への連絡", "ヒヤリハット", "職員からの気づき", "要観察事項"];

// とんさんの事業所情報に基づく利用者データ
export const SEVERE_DISABILITY_USERS: User[] = [
  // 生活介護利用者（14名）
  {
    id: '1',
    name: 'A・T',
    initials: 'AT',
    age: 36,
    gender: Gender.MALE,
    serviceType: [ServiceType.LIFE_CARE],
    birthDate: '1987-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['脳性麻痺', 'てんかん', '遠視性弱視', '側湾症', '両上下肢機能障害'],
    medicalCare: [],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    seizureTypes: [SeizureType.TONIC, SeizureType.CLONIC],
    emergencyContact: {
      name: 'A・T 家族',
      relationship: '母親',
      phone: '090-0000-0001',
      emergencyPhone: '090-0000-0001'
    },
    status: 'active',
    underlyingDiseases: '',
    certificates: '',
    careLevel: ''
  },
  {
    id: '2',
    name: 'I・K',
    initials: 'IK',
    age: 47,
    gender: Gender.FEMALE,
    serviceType: [ServiceType.LIFE_CARE],
    birthDate: '1976-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['脳性麻痺', '側湾症', '体幹四肢機能障害'],
    medicalCare: [],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    seizureTypes: [],
    emergencyContact: {
      name: 'I・K 家族',
      relationship: '母親',
      phone: '090-0000-0002',
      emergencyPhone: '090-0000-0002'
    },
    status: 'active',
    underlyingDiseases: '',
    certificates: '',
    careLevel: ''
  },
  {
    id: '3',
    name: 'O・S',
    initials: 'OS',
    age: 40,
    gender: Gender.FEMALE,
    serviceType: [ServiceType.LIFE_CARE],
    birthDate: '1983-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['脳性麻痺', '体幹四肢機能障害'],
    medicalCare: [],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    seizureTypes: [],
    emergencyContact: {
      name: 'O・S 家族',
      relationship: '母親',
      phone: '090-0000-0003',
      emergencyPhone: '090-0000-0003'
    },
    status: 'active',
    underlyingDiseases: '',
    certificates: '',
    careLevel: ''
  },
  {
    id: '4',
    name: 'S・M',
    initials: 'SM',
    age: 43,
    gender: Gender.MALE,
    serviceType: [ServiceType.LIFE_CARE],
    birthDate: '1980-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['脳性麻痺', '脳炎後遺症', 'てんかん', '精神遅滞', '側湾症', '両上下肢機能障害'],
    medicalCare: [MedicalCare.SUCTION],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    seizureTypes: [SeizureType.TONIC_CLONIC],
    seizureFrequency: '頻回（腸瘻トラブル多発）',
    emergencyContact: {
      name: 'S・M 家族',
      relationship: '母親',
      phone: '090-0000-0004',
      emergencyPhone: '090-0000-0004'
    },
    medicalCareDetails: {
      suctionFrequency: '必要時',
      specialCare: '腸瘻バルーン管理'
    },
    status: 'active',
    underlyingDiseases: '',
    certificates: '',
    careLevel: ''
  },
  {
    id: '5',
    name: 'N・M',
    initials: 'NM',
    age: 32,
    gender: Gender.MALE,
    serviceType: [ServiceType.LIFE_CARE],
    birthDate: '1991-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['痙性四肢麻痺', '重度知的障害', 'てんかん'],
    medicalCare: [MedicalCare.TUBE_FEEDING, MedicalCare.SUCTION, MedicalCare.INHALATION, MedicalCare.ENEMA],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    seizureTypes: [SeizureType.TONIC_CLONIC],
    seizureFrequency: 'ほぼ毎日1～5回',
    emergencyContact: {
      name: 'N・M 家族',
      relationship: '母親',
      phone: '090-0000-0005',
      emergencyPhone: '090-0000-0005'
    },
    medicalCareDetails: {
      tubeFeedingType: '胃ろう注入',
      medicationSchedule: '抗てんかん薬',
      specialCare: 'エアウェイ装着、カフアシスト使用、グリセリン浣腸（火・木）'
    },
    status: 'active'
  },
  {
    id: '6',
    name: 'W・M',
    initials: 'WM',
    age: 32,
    gender: Gender.FEMALE,
    serviceType: [ServiceType.LIFE_CARE],
    birthDate: '1991-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['脳原生上肢機能障害', '脳原生上肢移動障害', '上下肢機能障害'],
    medicalCare: [],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    seizureTypes: [],
    emergencyContact: {
      name: 'W・M 家族',
      relationship: '母親',
      phone: '090-0000-0006',
      emergencyPhone: '090-0000-0006'
    },
    status: 'active'
  },
  {
    id: '7',
    name: 'S・Y',
    initials: 'SY',
    age: 41,
    gender: Gender.FEMALE,
    serviceType: [ServiceType.LIFE_CARE],
    birthDate: '1982-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['脳原生上肢機能障害', '脳原生上肢移動障害'],
    medicalCare: [MedicalCare.TUBE_FEEDING],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    seizureTypes: [],
    emergencyContact: {
      name: 'S・Y 家族',
      relationship: '母親',
      phone: '090-0000-0007',
      emergencyPhone: '090-0000-0007'
    },
    medicalCareDetails: {
      tubeFeedingType: '鼻腔栄養注入'
    },
    status: 'active'
  },
  {
    id: '8',
    name: 'Y・K',
    initials: 'YK',
    age: 22,
    gender: Gender.MALE,
    serviceType: [ServiceType.LIFE_CARE],
    birthDate: '2001-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['二分脊椎症', '水頭症', '急性脳症後遺症', '膀胱機能障害者', '両上下肢機能障害', '体幹機能障害', '自閉症スペクトラム障害'],
    medicalCare: [MedicalCare.CATHETERIZATION],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    seizureTypes: [],
    emergencyContact: {
      name: 'Y・K 家族',
      relationship: '母親',
      phone: '090-0000-0008',
      emergencyPhone: '090-0000-0008'
    },
    medicalCareDetails: {
      specialCare: '鼻腔チューブ使用（内服時のみ）、導尿'
    },
    status: 'active'
  },
  {
    id: '9',
    name: 'I・K',
    initials: 'IK2',
    age: 40,
    gender: Gender.MALE,
    serviceType: [ServiceType.LIFE_CARE],
    birthDate: '1983-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['脳性麻痺', '体幹四肢機能障害'],
    medicalCare: [],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    seizureTypes: [],
    emergencyContact: {
      name: 'I・K 家族',
      relationship: '母親',
      phone: '090-0000-0009',
      emergencyPhone: '090-0000-0009'
    },
    status: 'active'
  },
  {
    id: '10',
    name: 'O・M',
    initials: 'OM',
    age: 23,
    gender: Gender.MALE,
    serviceType: [ServiceType.LIFE_CARE],
    birthDate: '2000-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['脳性麻痺', '視覚障害（全盲）', '難聴', '網膜症', '脳原生移動障害'],
    medicalCare: [],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    seizureTypes: [],
    emergencyContact: {
      name: 'O・M 家族',
      relationship: '母親',
      phone: '090-0000-0010',
      emergencyPhone: '090-0000-0010'
    },
    status: 'active'
  },
  {
    id: '11',
    name: 'U・S',
    initials: 'US',
    age: 19,
    gender: Gender.MALE,
    serviceType: [ServiceType.LIFE_CARE],
    birthDate: '2004-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['クリッペファイル症候群', '高度難聴', '気管狭窄症', '両下肢機能障害'],
    medicalCare: [MedicalCare.SUCTION, MedicalCare.INHALATION, MedicalCare.ENEMA],
    handbooks: [HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    seizureTypes: [],
    emergencyContact: {
      name: 'U・S 家族',
      relationship: '母親',
      phone: '090-0000-0011',
      emergencyPhone: '090-0000-0011'
    },
    medicalCareDetails: {
      specialCare: '気管切開、気管内吸引、浣腸'
    },
    status: 'active'
  },
  {
    id: '12',
    name: 'I・T',
    initials: 'IT',
    age: 24,
    gender: Gender.MALE,
    serviceType: [ServiceType.LIFE_CARE],
    birthDate: '1999-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['脳性麻痺'],
    medicalCare: [MedicalCare.TUBE_FEEDING],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    seizureTypes: [],
    emergencyContact: {
      name: 'I・T 家族',
      relationship: '母親',
      phone: '090-0000-0012',
      emergencyPhone: '090-0000-0012'
    },
    medicalCareDetails: {
      tubeFeedingType: '胃ろう注入'
    },
    status: 'active'
  },
  {
    id: '13',
    name: 'M・S',
    initials: 'MS',
    age: 18,
    gender: Gender.MALE,
    serviceType: [ServiceType.LIFE_CARE],
    birthDate: '2005-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['水頭症', '脳原生上肢機能障害', '脳原生上肢移動障害', '側湾症'],
    medicalCare: [],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    seizureTypes: [SeizureType.TONIC_CLONIC],
    seizureFrequency: '発作あり（5分以上けいれん発作が持続は救急搬送）',
    emergencyContact: {
      name: 'M・S 家族',
      relationship: '母親',
      phone: '090-0000-0013',
      emergencyPhone: '090-0000-0013'
    },
    status: 'active'
  },
  {
    id: '14',
    name: 'M・O',
    initials: 'MO',
    age: 18,
    gender: Gender.FEMALE,
    serviceType: [ServiceType.LIFE_CARE],
    birthDate: '2005-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['脳原生上肢機能障害', '脳原生上肢移動障害'],
    medicalCare: [MedicalCare.TUBE_FEEDING, MedicalCare.SUCTION, MedicalCare.IVH],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    seizureTypes: [SeizureType.MYOCLONIC],
    seizureFrequency: '四肢、顔面のミオクローヌスあり',
    emergencyContact: {
      name: 'M・O 家族',
      relationship: '母親',
      phone: '090-0000-0014',
      emergencyPhone: '090-0000-0014'
    },
    medicalCareDetails: {
      tubeFeedingType: '胃ろう注入',
      specialCare: 'IVH埋め込み'
    },
    status: 'active'
  },

  // 重心型放課後等デイサービス利用者（10名）
  {
    id: '15',
    name: 'M・I',
    initials: 'MI',
    age: 17,
    gender: Gender.BOY,
    serviceType: [ServiceType.DAY_SERVICE],
    birthDate: '2006-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['慢性肺疾患', '先天性性疾患', '染色体異常', '脳の形成不全'],
    medicalCare: [MedicalCare.TUBE_FEEDING],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    school: School.SPECIAL_SUPPORT,
    seizureTypes: [SeizureType.MYOCLONIC],
    seizureFrequency: 'ミオクロニー発作あり',
    emergencyContact: {
      name: 'M・I 家族',
      relationship: '母親',
      phone: '090-0000-0015',
      emergencyPhone: '090-0000-0015'
    },
    medicalCareDetails: {
      tubeFeedingType: '鼻腔注入',
      medicationSchedule: '抗てんかん薬'
    },
    status: 'active'
  },
  {
    id: '16',
    name: 'S・K',
    initials: 'SK',
    age: 15,
    gender: Gender.BOY,
    serviceType: [ServiceType.DAY_SERVICE],
    birthDate: '2008-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['脳腫瘍適切後遺症', '脳原生上肢機能障害', '脳原始移動機能障害', 'アレルギー性鼻炎', '食物アレルギー'],
    medicalCare: [],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    school: School.SPECIAL_SUPPORT,
    seizureTypes: [],
    emergencyContact: {
      name: 'S・K 家族',
      relationship: '母親',
      phone: '090-0000-0016',
      emergencyPhone: '090-0000-0016'
    },
    medicalCareDetails: {
      specialCare: 'シャント内臓'
    },
    status: 'active'
  },
  {
    id: '17',
    name: 'M・M',
    initials: 'MM',
    age: 15,
    gender: Gender.GIRL,
    serviceType: [ServiceType.DAY_SERVICE],
    birthDate: '2008-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_1,
    underlyingConditions: ['知的障がい'],
    medicalCare: [],
    handbooks: [HandbookType.REHABILITATION],
    assistanceLevel: AssistanceLevel.PARTIAL,
    school: School.SPECIAL_SUPPORT,
    seizureTypes: [SeizureType.TONIC_CLONIC],
    seizureFrequency: '発作あり',
    emergencyContact: {
      name: 'M・M 家族',
      relationship: '母親',
      phone: '090-0000-0017',
      emergencyPhone: '090-0000-0017'
    },
    status: 'active'
  },
  {
    id: '18',
    name: 'K・S',
    initials: 'KS',
    age: 7,
    gender: Gender.GIRL,
    serviceType: [ServiceType.DAY_SERVICE],
    birthDate: '2016-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['発達遅延', '肢体不自由'],
    medicalCare: [],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    school: School.SPECIAL_SUPPORT,
    seizureTypes: [SeizureType.TONIC_CLONIC],
    seizureFrequency: 'けいれん発作（5分以上続くようなら救急搬送）',
    emergencyContact: {
      name: 'K・S 家族',
      relationship: '母親',
      phone: '090-0000-0018',
      emergencyPhone: '090-0000-0018'
    },
    status: 'active'
  },
  {
    id: '19',
    name: 'Y・S',
    initials: 'YS',
    age: 6,
    gender: Gender.GIRL,
    serviceType: [ServiceType.DAY_SERVICE],
    birthDate: '2017-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['症候性てんかん', '脳原生上肢機能障害', '脳原始移動機能障害'],
    medicalCare: [],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    school: School.SPECIAL_SUPPORT,
    seizureTypes: [SeizureType.TONIC_CLONIC],
    seizureFrequency: '症候性てんかん',
    emergencyContact: {
      name: 'Y・S 家族',
      relationship: '母親',
      phone: '090-0000-0019',
      emergencyPhone: '090-0000-0019'
    },
    medicalCareDetails: {
      specialCare: '筋緊張（ITB療法中）'
    },
    status: 'active'
  },
  {
    id: '20',
    name: 'F・M',
    initials: 'FM',
    age: 13,
    gender: Gender.GIRL,
    serviceType: [ServiceType.DAY_SERVICE],
    birthDate: '2010-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['症候性てんかん', '股関節亜脱臼', '脳原生上肢機能障害', '脳原始移動機能障害', '側湾症'],
    medicalCare: [],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    school: School.SPECIAL_SUPPORT,
    seizureTypes: [SeizureType.TONIC_CLONIC],
    seizureFrequency: '症候性てんかん',
    emergencyContact: {
      name: 'F・M 家族',
      relationship: '母親',
      phone: '090-0000-0020',
      emergencyPhone: '090-0000-0020'
    },
    status: 'active'
  },
  {
    id: '21',
    name: 'N・T',
    initials: 'NT',
    age: 9,
    gender: Gender.BOY,
    serviceType: [ServiceType.DAY_SERVICE],
    birthDate: '2014-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['発達遅滞', '神経セロイドリポフスチン8型', '両上肢・体感機能障害', 'てんかん'],
    medicalCare: [MedicalCare.TUBE_FEEDING],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    school: School.SPECIAL_SUPPORT,
    seizureTypes: [SeizureType.MYOCLONIC],
    seizureFrequency: 'ミオクローヌスなど重積発作リスクあり',
    emergencyContact: {
      name: 'N・T 家族',
      relationship: '母親',
      phone: '090-0000-0021',
      emergencyPhone: '090-0000-0021'
    },
    medicalCareDetails: {
      tubeFeedingType: '胃ろう注入'
    },
    status: 'active'
  },
  {
    id: '22',
    name: 'I・K',
    initials: 'IK3',
    age: 9,
    gender: Gender.UNKNOWN,
    serviceType: [ServiceType.DAY_SERVICE],
    birthDate: '2014-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['脳性麻痺', '側弯'],
    medicalCare: [MedicalCare.TUBE_FEEDING, MedicalCare.SUCTION],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    school: School.SPECIAL_SUPPORT,
    seizureTypes: [],
    emergencyContact: {
      name: 'I・K 家族',
      relationship: '母親',
      phone: '090-0000-0022',
      emergencyPhone: '090-0000-0022'
    },
    medicalCareDetails: {
      tubeFeedingType: '胃ろう注入',
      suctionFrequency: '吸引頻回（呼吸筋が脆弱のため）',
      specialCare: '籠り熱の際は嘔吐リスクあり'
    },
    status: 'active'
  },
  {
    id: '23',
    name: 'K・Y',
    initials: 'KY',
    age: 9,
    gender: Gender.GIRL,
    serviceType: [ServiceType.DAY_SERVICE],
    birthDate: '2014-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['脳性麻痺', '脳原生上肢機能障害', '脳原始移動機能障害', '側湾症'],
    medicalCare: [],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    school: School.SPECIAL_SUPPORT,
    seizureTypes: [],
    emergencyContact: {
      name: 'K・Y 家族',
      relationship: '母親',
      phone: '090-0000-0023',
      emergencyPhone: '090-0000-0023'
    },
    status: 'active'
  },
  {
    id: '24',
    name: 'S・K',
    initials: 'SK2',
    age: 14,
    gender: Gender.GIRL,
    serviceType: [ServiceType.DAY_SERVICE],
    birthDate: '2009-01-01',
    admissionDate: '2020-01-01',
    disabilityLevel: DisabilityLevel.LEVEL_6,
    underlyingConditions: ['滑脳症（TUBA1A遺伝子異常）', '小脳底形成', '上腸間膜症候群', '症候性てんかん', '重度精神運動発達遅滞'],
    medicalCare: [MedicalCare.TUBE_FEEDING, MedicalCare.IVH],
    handbooks: [HandbookType.REHABILITATION, HandbookType.PHYSICAL],
    assistanceLevel: AssistanceLevel.FULL,
    school: School.SPECIAL_SUPPORT,
    seizureTypes: [SeizureType.TONIC_CLONIC],
    seizureFrequency: '症候性てんかん',
    emergencyContact: {
      name: 'S・K 家族',
      relationship: '母親',
      phone: '090-0000-0024',
      emergencyPhone: '090-0000-0024'
    },
    medicalCareDetails: {
      tubeFeedingType: '経胃ろう十二指腸チューブからの経管栄養とポートからのCV栄養注入併用'
    },
    status: 'active'
  }
];

// 職員データ（とんさんの事業所情報に基づく）
export const STAFF_MEMBERS = [
  {
    id: 'staff-1',
    username: 'ton-san',
    name: 'とんさん',
    role: '管理者兼児童発達管理責任者',
    isFullTime: true,
    permissions: ['admin', 'manager', 'view_reports', 'edit_users', 'edit_staff'],
    avatarUrl: '/avatars/ton-san.jpg',
    templateId: 'template-admin',
    templateName: '管理者テンプレート'
  },
  {
    id: 'staff-2',
    username: 'service-manager',
    name: 'サービス管理責任者',
    role: 'サービス管理責任者兼生活支援員兼児童指導員',
    isFullTime: true,
    permissions: ['manager', 'view_reports', 'edit_users'],
    avatarUrl: '/avatars/service-manager.jpg',
    templateId: 'template-manager',
    templateName: 'サービス管理責任者テンプレート'
  },
  {
    id: 'staff-3',
    username: 'nurse-1',
    name: '常勤看護師1',
    role: '常勤看護師',
    isFullTime: true,
    permissions: ['nurse', 'medical_care', 'view_reports'],
    avatarUrl: '/avatars/nurse-1.jpg',
    templateId: 'template-nurse',
    templateName: '看護師テンプレート'
  },
  {
    id: 'staff-4',
    username: 'nurse-2',
    name: '常勤看護師2',
    role: '常勤看護師',
    isFullTime: true,
    permissions: ['nurse', 'medical_care', 'view_reports'],
    avatarUrl: '/avatars/nurse-2.jpg',
    templateId: 'template-nurse',
    templateName: '看護師テンプレート'
  },
  {
    id: 'staff-5',
    username: 'nurse-3',
    name: '常勤看護師3',
    role: '常勤看護師',
    isFullTime: true,
    permissions: ['nurse', 'medical_care', 'view_reports'],
    avatarUrl: '/avatars/nurse-3.jpg',
    templateId: 'template-nurse',
    templateName: '看護師テンプレート'
  },
  {
    id: 'staff-6',
    username: 'nurse-4',
    name: '常勤看護師4',
    role: '常勤看護師',
    isFullTime: true,
    permissions: ['nurse', 'medical_care', 'view_reports'],
    avatarUrl: '/avatars/nurse-4.jpg',
    templateId: 'template-nurse',
    templateName: '看護師テンプレート'
  },
  {
    id: 'staff-7',
    username: 'part-time-nurse-1',
    name: '非常勤看護師1',
    role: '非常勤看護師',
    isFullTime: false,
    permissions: ['nurse', 'medical_care'],
    avatarUrl: '/avatars/part-time-nurse-1.jpg',
    templateId: 'template-nurse',
    templateName: '看護師テンプレート'
  },
  {
    id: 'staff-8',
    username: 'part-time-nurse-2',
    name: '非常勤看護師2',
    role: '非常勤看護師',
    isFullTime: false,
    permissions: ['nurse', 'medical_care'],
    avatarUrl: '/avatars/part-time-nurse-2.jpg',
    templateId: 'template-nurse',
    templateName: '看護師テンプレート'
  },
  {
    id: 'staff-9',
    username: 'part-time-nurse-3',
    name: '非常勤看護師3',
    role: '非常勤看護師',
    isFullTime: false,
    permissions: ['nurse', 'medical_care'],
    avatarUrl: '/avatars/part-time-nurse-3.jpg',
    templateId: 'template-nurse',
    templateName: '看護師テンプレート'
  },
  {
    id: 'staff-10',
    username: 'part-time-childcare',
    name: '非常勤保育士',
    role: '非常勤保育士',
    isFullTime: false,
    permissions: ['caregiver', 'childcare'],
    avatarUrl: '/avatars/part-time-childcare.jpg',
    templateId: 'template-caregiver',
    templateName: '保育士テンプレート'
  },
  {
    id: 'staff-11',
    username: 'support-staff-1',
    name: '生活支援員1',
    role: '生活支援員兼その他の従事者',
    isFullTime: true,
    permissions: ['caregiver'],
    avatarUrl: '/avatars/support-staff-1.jpg',
    templateId: 'template-caregiver',
    templateName: '生活支援員テンプレート'
  },
  {
    id: 'staff-12',
    username: 'support-staff-2',
    name: '生活支援員2',
    role: '生活支援員兼その他の従事者',
    isFullTime: true,
    permissions: ['caregiver'],
    avatarUrl: '/avatars/support-staff-2.jpg',
    templateId: 'template-caregiver',
    templateName: '生活支援員テンプレート'
  },
  {
    id: 'staff-13',
    username: 'part-time-support',
    name: '非常勤支援員',
    role: '非常勤支援員',
    isFullTime: false,
    permissions: ['caregiver'],
    avatarUrl: '/avatars/part-time-support.jpg',
    templateId: 'template-caregiver',
    templateName: '支援員テンプレート'
  },
  {
    id: 'staff-14',
    username: 'driver',
    name: '非常勤運転手',
    role: '非常勤運転手',
    isFullTime: false,
    permissions: ['driver'],
    avatarUrl: '/avatars/driver.jpg',
    templateId: 'template-driver',
    templateName: '運転手テンプレート'
  }
];

// 既存の定数も保持
export const USERS: User[] = SEVERE_DISABILITY_USERS;
export const STAFF = STAFF_MEMBERS;

// --- 食事記録フォーム改善用の選択肢データ ---

// 指令2: 経管栄養の摂取量選択肢
export const TUBE_FEEDING_AMOUNT_OPTIONS = [
  '指示通り、全量注入完了',
  '〇〇ml残して終了',
  '嘔吐のため、途中で中断',
  '腹部膨満のため、途中で中断',
  '咳き込み・むせ込みのため、途中で中断',
  '自己抜去のため、中断',
  '注入速度を、半分に変更',
  '白湯フラッシュのみ実施',
  '時間変更して実施',
  '実施せず（理由：〇〇）'
];

// 指令3: 経管栄養の食事の様子選択肢
export const TUBE_FEEDING_CONDITION_OPTIONS = [
  '表情、穏やか',
  '顔色、良好',
  '呼吸状態、安定',
  '腹部膨満なし',
  '蠕動運動（お腹の動き）、良好',
  '注入漏れなし',
  '皮膚トラブルなし',
  '嘔気・嘔吐なし',
  'むせ込み・咳き込みなし',
  '流涎（よだれ）少ない',
  '穏やかに入眠',
  '少し、落ち着かない様子',
  '顔をしかめる',
  '腹部が、少し張っている',
  '注入速度に、抵抗あり'
];

// 指令4: 食事自由記述・対話型テンプレート（30個の魂の言葉）
export const MEAL_FREE_TEXT_TEMPLATES = [
  // 《経口摂取・ポジティブな物語》
  '〇〇（好物）を、目を輝かせながら、美味しそうに完食しました。',
  '介助者の目を見て、にこっと笑う場面があり、心が通じ合ったように感じました。',
  '飲み込みのペースも良く、とてもスムーズに食事ができました。',
  '咀嚼（もぐもぐする動き）が、いつもより力強く、意欲が感じられました。',
  '食後、満足そうな、穏やかな表情で、リラックスしていました。',
  '新しい食材（〇〇）に、興味津々な様子で、抵抗なく口にしました。',
  
  // 《経口摂取・課題とケアの物語》
  '後半、少し疲れが見えましたが、声かけで、最後まで頑張って食べることができました。',
  'むせ込みが見られたため、一度、休憩し、体位を調整したところ、落ち着きました。',
  '口腔内に、少し食べかすが残りやすかったため、食後に、丁寧な口腔ケアを行いました。',
  '食事よりも、周りの物音に、気を取られているご様子でした。',
  'スプーンに対して、舌で押し返す動きが、時折、見られました。',
  '体調が優れないのか、今日は、あまり食事が進みませんでした。',
  
  // 《経管栄養・ポジティブな物語》
  '注入中、腹部膨満や、不快な様子は見られず、穏やかに過ごされていました。',
  '蠕動運動（お腹の動き）も良好で、スムーズに注入完了しました。',
  '注入開始後、〇分で、心地よさそうに、穏やかに入眠されました。',
  '注入中、職員の声かけに、穏やかな表情で、応えてくれているようでした。',
  '胃ろう（あるいは、腸瘻）周囲の、皮膚トラブルは、ありません。',
  
  // 《経管栄養・課題とケアの物語》
  '注入中、少し、眉間にしわを寄せる様子が見られましたが、速度を調整すると、落ち着かれました。',
  '腹部が、少し張っている様子だったため、体位を工夫し、注入しました。',
  '注入中に、嘔気（吐き気）が見られたため、一時、中断し、様子を観察しました。',
  '注入チューブ周囲から、微量の漏れが見られたため、保護テープで補強しました。',
  '注入後、ゲップがうまく出せず、少し、苦しそうな様子でした。',
  
  // 《共通の観察とケアの物語》
  '顔色、バイタルサイン共に、変化なく、安定しています。',
  '食事（注入）前の、丁寧な口腔ケアを、実施しました。',
  '食事（注入）後の、口腔ケアと、歯磨きを、実施しました。',
  'ご家族に、本日の食事のご様子を、連絡帳（写真付き）で、お伝えします。',
  '水分も、指示通り、しっかりと、摂取できています。',
  '〇〇（薬）も、確実に、与薬できています。',
  'アレルギー食材（〇〇）に、細心の注意を払い、提供しました。',
  'アレルギー反応や、体調の変化は、見られませんでした。'
];

// 指令5: 水分の種類選択肢
export const WATER_TYPE_OPTIONS = [
  '水',
  'お茶',
  'ポカリ',
  '経口補水液',
  'その他'
];

// 水分量の選択肢（0mlから250mlまで、10ml単位）
export const WATER_AMOUNT_OPTIONS = Array.from({ length: 26 }, (_, i) => i * 10);