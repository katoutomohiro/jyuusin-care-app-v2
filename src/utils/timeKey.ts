/**
 * 入力が Date / ISO / "YYYY/MM/DD HH:mm" / "HH:mm" でも "HH:mm" に正規化して返す
 */
export function minuteKey(input?: string | number | Date): string {
  if (!input) {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  // Date or timestamp/ISO
  const d = input instanceof Date ? input : new Date(input);
  if (!Number.isNaN(d.getTime())) {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  // fallback: parse "YYYY/MM/DD HH:mm" or "HH:mm"
  const s = String(input);
  const m = s.match(/(\d{1,2}):(\d{2})/);
  if (m) return `${m[1].padStart(2, '0')}:${m[2]}`;
  return '00:00';
}
