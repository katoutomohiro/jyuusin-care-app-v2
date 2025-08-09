/**
 * ローカルタイム基準の "YYYY-MM-DD" キーを返す
 * - UTCズレ防止（00:00跨ぎ問題対策）
 * - 保存時/取得時/フィルタ時で必ずこの関数を使うこと
 */
export function localDateKey(d: Date | number | string = new Date()): string {
  const dt = (d instanceof Date) ? d : new Date(d);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1).toString().padStart(2, '0');
  const day = dt.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}
