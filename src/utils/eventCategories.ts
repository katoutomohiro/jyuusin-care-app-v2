// EventType definition (should match existing types.ts)
export type EventType = 
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
  {
    key: 'seizure',
    label: '発作',
    icon: '⚡'
  },
  {
    key: 'expression',
    label: '表情・反応',
    icon: '😊'
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
  {
    key: 'tube_feeding',
    label: '経管栄養',
    icon: '🍼'
  }
];
