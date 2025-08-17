
/**
 * [キー候補とpayload例]
 *
 * mealRecords, seizureRecords,
 * seizure_records_YYYY-MM-DD, expression_records_YYYY-MM-DD, activity_records_YYYY-MM-DD,
 * hydration_records_YYYY-MM-DD, excretion_records_YYYY-MM-DD,
 * tube_feeding_records_YYYY-MM-DD, medication_records_YYYY-MM-DD,
 * vitals_records_YYYY-MM-DD, behavioral_records_YYYY-MM-DD,
 * communication_records_YYYY-MM-DD, other_records_YYYY-MM-DD など。
 *
 * payload例:
 * { id, date/record_date, user_id, recorder, ...カテゴリ固有フィールド }
 *
 * userIdはpayload内のuser_id等で判別。日付はdateまたはrecord_date。
 * 配列/単一/オブジェクト混在あり。
 */

// カテゴリID型
export type CategoryId =
  | 'seizure' | 'expression' | 'hydration' | 'positioning' | 'activity' | 'excretion'
  | 'oralCare' | 'condition' | 'sleep' | 'coughAspiration' | 'tubeFeeding' | 'medication'
  | 'vital' | 'behavior' | 'communication' | 'rehab' | 'other';

const DEBUG_DAILY_SHEET = false;

// カテゴリID→既存ストレージキー候補
export function resolveKeyCandidates(categoryId: CategoryId, userId: string, dateISO: string): string[] {
  const keys: string[] = [];
  // 日付付き
  keys.push(`${categoryId}_records_${dateISO}`);
  // 旧グローバル
  if (categoryId === 'seizure') keys.push('seizureRecords');
  if (categoryId === 'hydration') keys.push('mealRecords'); // 水分は食事記録に含まれる場合あり
  // 追加候補（過去の形式）
  // keys.push(`logs-${userId}-${dateISO}`);
  // keys.push(`daily-log-${userId}-${dateISO}`);
  // keys.push(`dailyLog:${userId}:${dateISO}`);
  return keys;
}

// 破損JSON/配列/単一/オブジェクト混在を吸収
export function loadArrayFromStorage(key: string): any[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === 'object') return [parsed];
    return null;
  } catch {
    return null;
  }
}

// カテゴリごとに当日データを返す
export async function readCategory(categoryId: CategoryId, userId: string, dateISO: string): Promise<any[]> {
  const candidates = resolveKeyCandidates(categoryId, userId, dateISO);
  if (DEBUG_DAILY_SHEET) console.debug('resolveKeyCandidates', {categoryId, userId, dateISO, candidates});
  for (const key of candidates) {
    const arr = loadArrayFromStorage(key);
    if (arr && arr.length > 0) {
      // userId/dateで絞り込み
      const filtered = arr.filter(item => {
        const uid = item.user_id || item.userId || item.uid;
        const d = item.date || item.record_date;
        return (!userId || uid === userId) && (!dateISO || d === dateISO);
      });
      if (DEBUG_DAILY_SHEET) console.debug('readCategory hit', {key, count: filtered.length});
      if (filtered.length > 0) return filtered;
    }
  }
  return [];
}

// 全カテゴリ集約
export async function getDailyLogs(userId: string, dateISO: string): Promise<{ categoryId: CategoryId, items: any[] }[]> {
  if ((window as any).DEBUG_DAILY_SHEET) {
    console.debug('[DLQ] getDailyLogs', {userId, dateISO});
  }
  const CATS: CategoryId[] = [
    'seizure','expression','hydration','positioning','activity','excretion',
    'oralCare','condition','sleep','coughAspiration','tubeFeeding','medication',
    'vital','behavior','communication','rehab','other'
  ];
  const results: { categoryId: CategoryId, items: any[] }[] = [];
  for (const cat of CATS) {
    const candidates = resolveKeyCandidates(cat, userId, dateISO);
    if ((window as any).DEBUG_DAILY_SHEET) {
      console.debug('[DLQ] candidates', cat, candidates);
    }
    let hitKey = null;
    let arr: any[] | null = null;
    for (const key of candidates) {
      arr = loadArrayFromStorage(key);
      if (arr && arr.length > 0) {
        hitKey = key;
        break;
      }
    }
    if ((window as any).DEBUG_DAILY_SHEET) {
      console.debug('[DLQ] hit', cat, { hitKey, count: arr?.length ?? 0 });
    }
    // userId/dateで絞り込み
    const filtered = (arr || []).filter(item => {
      const uid = item.user_id || item.userId || item.uid;
      const d = item.date || item.record_date;
      return (!userId || uid === userId) && (!dateISO || d === dateISO);
    });
    results.push({ categoryId: cat, items: filtered });
  }
  if ((window as any).DEBUG_DAILY_SHEET) {
    console.debug('[DLQ] getDailyLogs result', results);
  }
  return results;
}

// カテゴリID→表示名
const CATEGORY_LABELS: Record<CategoryId, string> = {
  seizure: '発作',
  expression: '表情・反応',
  hydration: '水分',
  positioning: '体位',
  activity: '活動',
  excretion: '排泄',
  oralCare: '皮膚・口腔ケア',
  condition: '体調・発熱',
  sleep: '睡眠',
  coughAspiration: '咳・誤嚥',
  tubeFeeding: '経管栄養',
  medication: '投薬',
  vital: 'バイタル',
  behavior: '行動',
  communication: 'コミュニケーション',
  rehab: 'リハビリ',
  other: 'その他',
};

// カテゴリごとの要約ルール
export function normalizeForSheet(logs: { categoryId: CategoryId, items: any[] }[]): string[] {
  const result: string[] = [];
  let rawCount = 0;
  for (const { categoryId, items } of logs) {
    if (!items || items.length === 0) continue;
    rawCount += items.length;
    let summary = '';
    switch (categoryId) {
      case 'seizure':
        summary = items.map(item => {
          const t = item.seizureStartTime ?? item.time ?? '';
          const typ = item.seizureType ?? item.type ?? '';
          const dur = item.seizureDuration ?? item.duration ?? '';
          const note = item.seizureFreeText ?? item.note ?? '';
          return `[発作] ` + [t, typ, dur, note].filter(Boolean).join(' ');
        }).join('\n');
        break;
      case 'hydration':
        summary = items.map(item => {
          const t = item.time ?? '';
          const typ = item.waterType ?? item.type ?? '';
          const amt = item.waterAmount ?? item.amount ?? '';
          return `[水分] ` + [t, typ, amt ? amt + 'ml' : ''].filter(Boolean).join(' ');
        }).join('\n');
        break;
      case 'positioning':
        summary = items.map(item => {
          const t = item.time ?? '';
          const pos = item.position ?? '';
          const assist = item.assist ?? '';
          return `[体位] ` + [t, pos, assist].filter(Boolean).join(' ');
        }).join('\n');
        break;
      case 'medication':
        summary = items.map(item => {
          const t = item.time ?? '';
          const drug = item.drugName ?? item.name ?? '';
          const dose = item.dose ?? '';
          const route = item.route ?? '';
          return `[投薬] ` + [t, drug, dose, route].filter(Boolean).join(' ');
        }).join('\n');
        break;
      case 'vital':
        summary = items.map(item => {
          const t = item.time ?? '';
          const temp = item.temperature ? `体温${item.temperature}℃` : '';
          const pulse = item.pulse ? `脈拍${item.pulse}` : '';
          const spO2 = item.spO2 ? `SpO2${item.spO2}` : '';
          const bp = item.bloodPressure ? `血圧${item.bloodPressure.systolic}/${item.bloodPressure.diastolic}` : '';
          return `[バイタル] ` + [t, temp, pulse, spO2, bp].filter(Boolean).join(' ');
        }).join('\n');
        break;
      default:
        summary = items.map(item => {
          // 代表的な自由記述 or内容
          return `[${CATEGORY_LABELS[categoryId]}] ` + (item.note ?? item.freeText ?? item.details ?? item.text ?? item.value ?? '');
        }).filter(Boolean).join('\n');
        break;
    }
    if (summary) result.push(summary);
  }
  if (result.length === 0 && rawCount > 0 && (window as any).DEBUG_DAILY_SHEET) {
    console.warn('[DLQ] normalized 0 but raw >0', logs);
  }
  return result;
}
