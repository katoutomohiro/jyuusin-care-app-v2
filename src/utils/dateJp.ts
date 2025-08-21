/**
 * 令和表記 + 曜日
 * 例: 令和7年 8月8日（金）
 */
export function formatReiwaWithWeekday(d: Date | string | number = new Date()): string {
  const dt = (d instanceof Date) ? d : new Date(d);
  const y = dt.getFullYear();
  const m = dt.getMonth() + 1;
  const day = dt.getDate();
  const wk = ['日','月','火','水','木','金','土'][dt.getDay()];

  // 令和は 2019-05-01 以降
  const reiwaStart = new Date(2019, 4, 1); // month:0-based
  let era = '';
  let eraYear = y;
  if (dt >= reiwaStart) {
    era = '令和';
    eraYear = y - 2018; // 2019→令和1
  } else {
    // 必要なら平成等を追加。現状は令和のみ想定。
    era = '平成以前';
  }
  return `${era}${eraYear}年 ${m}月${day}日（${wk}）`;
}
