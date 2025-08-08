// EventType definition (should match existing types.ts)
export type EventType = 
  | 'vitals'
  | 'seizure' 
  | 'expression' 
  | 'hydration' 
  | 'positioning' 
  | 'activity' 
  | 'excretion' 
  | 'skin_oral_care' 
  | 'tube_feeding';

// Record category configuration
export interface RecordCategory {
  key: EventType;
  label: string;
  icon: string;
}

export const CATEGORIES: RecordCategory[] = [
  // 1行目（lg:4列）: バイタル, 発作, 水分摂取, ポジショニング
  {
    key: 'vitals',
    label: 'バイタル',
    icon: '🩺'
  },
  {
    key: 'seizure',
    label: '発作',
    icon: '⚡'
  },
  {
    key: 'hydration',
    label: '水分摂取',
    icon: '💧'
  },
  {
    key: 'positioning',
    label: 'ポジショニング',
    icon: '🛏️'
  },

  // 2行目: 表情・反応（バイタルの下）, 活動, 排泄, 皮膚・口腔ケア
  {
    key: 'expression',
    label: '表情・反応',
    icon: '😊'
  },
  {
    key: 'activity',
    label: '活動',
    icon: '🎯'
  },
  {
    key: 'excretion',
    label: '排泄',
    icon: '🚽'
  },
  {
    key: 'skin_oral_care',
    label: '皮膚・口腔ケア',
    icon: '🧼'
  },

  // 3行目以降: 経管栄養（その他の順は現状維持）
  {
    key: 'tube_feeding',
    label: '経管栄養',
    icon: '🍼'
  }
];
