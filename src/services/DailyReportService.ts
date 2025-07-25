// 日次レポート生成・保存サービス

export interface DailyEventRecord {
  id: string;
  userId: string;
  timestamp: string;
  data: any;
  type: string;
}

export interface DailyReport {
  date: string;                // yyyy-mm-dd
  userId: string;
  events: Record<string, DailyEventRecord[]>;
  summary: {
    total: number;
    counts: Record<string, number>;
  };
  createdAt: string;
}

const STORAGE_KEY = 'daily_reports';
const EVENT_TYPES = [
  'seizure',
  'expression',
  'vital',
  'meal',
  'excretion',
  'sleep',
  'activity',
  'care'
];

// 指定日の指定利用者のイベントをlocalStorageから集計
export function generateDailyReportForUser(date: string, userId: string): DailyReport {
  const events: Record<string, DailyEventRecord[]> = {};
  const counts: Record<string, number> = {};

  EVENT_TYPES.forEach(type => {
    const key = `${type}_records_${date}`;
    const all: DailyEventRecord[] = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = all.filter(r => r.userId === userId);
    events[type] = filtered;
    counts[type] = filtered.length;
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return {
    date,
    userId,
    events,
    summary: { total, counts },
    createdAt: new Date().toISOString()
  };
}

// 保存（既存があれば置き換え）
export function saveDailyReport(report: DailyReport) {
  const list: DailyReport[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const idx = list.findIndex(r => r.date === report.date && r.userId === report.userId);
  if (idx >= 0) list[idx] = report; else list.push(report);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// 日次レポート取得（date指定でその日のみ）
export function getDailyReports(date?: string): DailyReport[] {
  const list: DailyReport[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!date) return list;
  return list.filter(r => r.date === date);
}

// 6か月分の個別支援計画（簡易版）
export function generateIndividualSupportPlan(userId: string, baseDate: string) {
  const all = getDailyReports();
  const targetDate = new Date(baseDate);
  const sixMonthsAgo = new Date(targetDate);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const rangeReports = all.filter(r =>
    r.userId === userId &&
    new Date(r.date) >= sixMonthsAgo &&
    new Date(r.date) <= targetDate
  );

  const aggregate: Record<string, number> = {};
  EVENT_TYPES.forEach(t => aggregate[t] = 0);
  rangeReports.forEach(r => {
    Object.entries(r.summary.counts).forEach(([k, v]) => {
      aggregate[k] = (aggregate[k] || 0) + v;
    });
  });

  return {
    userId,
    periodStart: sixMonthsAgo.toISOString().split('T')[0],
    periodEnd: baseDate,
    totalDays: rangeReports.length,
    eventTotals: aggregate,
    draftGoals: [
      '発作頻度の安定化を図る',
      '活動参加の機会を増やしQOL向上を目指す',
      'バイタル異常の早期検知体制を維持する'
    ]
  };
}
