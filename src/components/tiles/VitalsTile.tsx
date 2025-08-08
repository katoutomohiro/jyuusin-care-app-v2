import React from "react";
import { VITAL_DEFAULTS, VITAL_LIMITS } from "../../config/vitalsDefaults";
import { getPatientSpecById } from "../../config/patientProfiles";
import { useNotification, NotificationType } from "../../contexts/NotificationContext";

type Vital = {
  id?: string;
  time: string;      // "YYYY/MM/DD HH:mm"
  tempC?: number;    // 30.0-45.0
  bpSys?: number;    // 50-250
  bpDia?: number;    // 30-150
  spo2?: number;     // 50-100
  hr?: number;       // 0-250
  rr?: number;       // 5-60
  note?: string;
};

export type VitalsTileProps = {
  userId: string;                 // 利用者内部ID（例: "ns"）
  date: Date | string;            // 当日
  onSaved?: (saved: Vital) => void;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
};

// "今すぐ"（ローカル）
function nowLabel(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  const hh = String(d.getHours()).padStart(2,"0");
  const mm = String(d.getMinutes()).padStart(2,"0");
  return `${y}/${m}/${day} ${hh}:${mm}`;
}

export default function VitalsTile({ userId, date, onSaved, open, onOpenChange }: VitalsTileProps){
  const [isOpen, setIsOpen] = React.useState(!!open);
  const { showNotification } = useNotification();

  // 個別仕様の上書き（現状は N・S さんのみ想定、必要に応じて overrides を展開）
  const spec = getPatientSpecById(userId);
  const defaults = { ...VITAL_DEFAULTS, ...(spec?.overrides?.vitals ?? {}) };

  const [form, setForm] = React.useState<Vital>({
    time: nowLabel(),
    tempC: defaults.tempC,
    bpSys: defaults.bpSys,
    bpDia: defaults.bpDia,
    spo2:  defaults.spo2,
    hr:    defaults.hr,
    rr:    defaults.rr,
    note:  "",
  });

  React.useEffect(()=>{ setIsOpen(!!open); },[open]);
  const setOpen = (v:boolean)=>{ setIsOpen(v); onOpenChange?.(v); };

  const clamp = (v:number|undefined, min:number, max:number)=> (v==null?undefined:Math.min(max, Math.max(min, v)));

  async function handleSave(){
    const payload: Vital = {
      ...form,
      tempC: clamp(form.tempC, VITAL_LIMITS.tempC.min, VITAL_LIMITS.tempC.max),
      bpSys: clamp(form.bpSys, VITAL_LIMITS.bpSys.min, VITAL_LIMITS.bpSys.max),
      bpDia: clamp(form.bpDia, VITAL_LIMITS.bpDia.min, VITAL_LIMITS.bpDia.max),
      spo2:  clamp(form.spo2,  VITAL_LIMITS.spo2.min,  VITAL_LIMITS.spo2.max),
      hr:    clamp(form.hr,    VITAL_LIMITS.hr.min,    VITAL_LIMITS.hr.max),
      rr:    clamp(form.rr,    VITAL_LIMITS.rr.min,    VITAL_LIMITS.rr.max),
    };

    // フロントエンド即時反映（DataContext 経由の onSaved -> addDailyLog）に切替
    const saved: Vital = { id: Date.now().toString(), ...payload };
    onSaved?.(saved);
    showNotification('バイタルを保存しました', NotificationType.SUCCESS);
    setOpen(false);
  }

  return (
    <div className="tile">
      {/* タイル */}
      <button
        className="flex flex-col items-center justify-center bg-white border-2 border-gray-200 hover:border-blue-300 rounded-lg p-4 min-h-[120px] w-full transition-all duration-200 hover:shadow-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onClick={()=>setOpen(true)}
        aria-label="バイタル"
      >
        <div className="text-3xl mb-1">🩺</div>
        <div className="text-sm font-medium text-gray-800">バイタル</div>
        <div className="text-xs mt-1 text-gray-600">時間/体温/血圧/SpO₂/HR/RR を記録</div>
      </button>

      {/* 入力モーダル */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[560px] max-w-[92vw] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">バイタル記録</div>
              <button onClick={()=>setOpen(false)} aria-label="close">✕</button>
            </div>

            {/* 時間＋今すぐ */}
            <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
              <label className="text-sm">時間</label>
              <button
                type="button"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                onClick={()=>setForm(f=>({...f, time: nowLabel()}))}
                aria-label="今すぐの時刻を入力"
              >
                今すぐ
              </button>
              <input className="col-span-2 rounded border p-2" value={form.time} onChange={e=>setForm(f=>({...f, time:e.target.value}))}/>
            </div>

            {/* 温度 / SpO2 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm">体温（℃）</label>
                <input type="number"
                  step={VITAL_LIMITS.tempC.step} min={VITAL_LIMITS.tempC.min} max={VITAL_LIMITS.tempC.max}
                  className="w-full rounded border p-2"
                  value={form.tempC ?? ""}
                  onChange={e=>setForm(f=>({...f, tempC: e.target.value===""?undefined:parseFloat(e.target.value)}))}
                />
              </div>
              <div>
                <label className="text-sm">SpO₂（%）</label>
                <input type="number"
                  step={VITAL_LIMITS.spo2.step} min={VITAL_LIMITS.spo2.min} max={VITAL_LIMITS.spo2.max}
                  className="w-full rounded border p-2"
                  value={form.spo2 ?? ""}
                  onChange={e=>setForm(f=>({...f, spo2: e.target.value===""?undefined:parseInt(e.target.value)}))}
                />
              </div>
            </div>

            {/* 血圧 上/下 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm">血圧（mmHg）上</label>
                <input type="number"
                  step={VITAL_LIMITS.bpSys.step} min={VITAL_LIMITS.bpSys.min} max={VITAL_LIMITS.bpSys.max}
                  className="w-full rounded border p-2"
                  value={form.bpSys ?? ""}
                  onChange={e=>setForm(f=>({...f, bpSys: e.target.value===""?undefined:parseInt(e.target.value)}))}
                />
              </div>
              <div>
                <label className="text-sm">血圧（mmHg）下</label>
                <input type="number"
                  step={VITAL_LIMITS.bpDia.step} min={VITAL_LIMITS.bpDia.min} max={VITAL_LIMITS.bpDia.max}
                  className="w-full rounded border p-2"
                  value={form.bpDia ?? ""}
                  onChange={e=>setForm(f=>({...f, bpDia: e.target.value===""?undefined:parseInt(e.target.value)}))}
                />
              </div>
            </div>

            {/* HR / RR */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm">HR（bpm）</label>
                <input type="number"
                  step={VITAL_LIMITS.hr.step} min={VITAL_LIMITS.hr.min} max={VITAL_LIMITS.hr.max}
                  className="w-full rounded border p-2"
                  value={form.hr ?? ""}
                  onChange={e=>setForm(f=>({...f, hr: e.target.value===""?undefined:parseInt(e.target.value)}))}
                />
              </div>
              <div>
                <label className="text-sm">RR（/min）</label>
                <input type="number"
                  step={VITAL_LIMITS.rr.step} min={VITAL_LIMITS.rr.min} max={VITAL_LIMITS.rr.max}
                  className="w-full rounded border p-2"
                  value={form.rr ?? ""}
                  onChange={e=>setForm(f=>({...f, rr: e.target.value===""?undefined:parseInt(e.target.value)}))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button className="px-3 py-1 rounded border" onClick={()=>setOpen(false)}>キャンセル</button>
              <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={handleSave}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
