/**
 * readPacked: 指定日付の packed 配列を localStorage から取得
 */
function readPacked(dateISO: string): any[] {
  try {
    const raw = localStorage.getItem("null_records_" + dateISO);
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/**
 * summarizeSeizure: 発作レコードを1行要約
 */
function summarizeSeizure(rec: any): string {
  return `[発作] ${(rec.seizure_duration||"")} ${(rec.seizure_phenomenon||rec.seizure_type||"")} ${(rec.event_notes||"")}`.trim();
}

/**
 * summarizeVitals: バイタルレコードを1行要約
 */
function summarizeVitals(rec: any): string {
  return `[バイタル] 体温:${rec.vitals_temp||""} 脈:${rec.vitals_pulse||""} SpO2:${rec.vitals_spo2||""} BP:${rec.vitals_bp||""} ${(rec.event_notes||"")}`.trim();
}

/**
 * getDailyLogRows: packedから発作/バイタルのみ抽出し要約
 */
export async function getDailyLogRows(params: { userId: string; dateISO: string }): Promise<string[]> {
  const { userId, dateISO } = params;
  const keys = [
    `${userId}_records_${dateISO}`,
    `null_records_${dateISO}`,
  ];

  const rows: string[] = [];

  for (const k of keys) {
    const raw = localStorage.getItem(k);
    if (!raw) continue;

    let val: any;
    try { val = JSON.parse(raw); } catch { continue; }

    const arr: any[] =
      Array.isArray(val) ? val :
      Array.isArray(val?.data) ? val.data :
      Array.isArray(val?.records) ? val.records :
      Array.isArray(val?.rows) ? val.rows :
      Array.isArray(val?.items) ? val.items : [];

    for (const item of arr) {
      const cat: string = (item?.category || item?.cat || item?.type || "").toString();
      const isSeizure = /発作|seizure/i.test(cat);
      const isVitals  = /バイタル|vital/i.test(cat);
      if (!isSeizure && !isVitals) continue;

      // Common fields
      const time   = item?.time || item?.at || item?.timestamp || item?.created_at || "";
      const note   = item?.note || item?.notes || item?.memo || "";

      if (isSeizure) {
        const phe = item?.phenomenon || item?.detail || item?.desc || "";
        const dur = item?.duration || item?.seizureDuration || "";
        rows.push(`【発作】${time ? time + " " : ""}${phe || "現象未入力"}${dur ? `（${dur}）` : ""}${note ? " / " + note : ""}`);
      }
      if (isVitals) {
        const hr   = item?.hr ?? item?.heart_rate;
        const bp   = item?.bp ?? item?.blood_pressure;
        const temp = item?.temp ?? item?.temperature;
        const brief = [
          hr != null ? `脈${hr}` : "",
          bp ? `血圧${bp}` : "",
          temp ? `体温${temp}` : "",
        ].filter(Boolean).join(" ");
        rows.push(`【バイタル】${time ? time + " " : ""}${brief || "記載なし"}${note ? " / " + note : ""}`);
      }
    }
  }

  return rows;
}
function filterByUser(arr: any[], userId: string) {
  return arr.filter(r => isSameUser(r, userId));
}

function normalize(category: string, rec: any): string {
  switch (category) {
    case "seizure":
      return `${rec.startTime ?? ""} ${rec.type ?? rec.phenomenon ?? ""} ${rec.duration ?? ""}`.trim();
    case "expression":
      return `${rec.mood ?? rec.reaction ?? ""} ${rec.note ?? ""}`.trim();
    case "hydration":
      return `${rec.waterType ?? rec.drink ?? ""} ${rec.amount ?? rec.volume ?? ""}`.trim();
    case "positioning":
      return `${rec.position ?? ""}`.trim();
    case "activity":
      return `${rec.activity ?? rec.content ?? ""}`.trim();
