import React, { useEffect, useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import SeizureForm from '../components/forms/SeizureForm';
import ExpressionForm from '../components/forms/ExpressionForm';
import VitalSignsInput from '../components/forms/VitalSignsInput';
import { HydrationForm } from '../components/forms/HydrationForm';
import ExcretionInput from '../components/forms/ExcretionInput';
import SleepInput from '../components/forms/SleepInput';
import ActivityInput from '../components/forms/ActivityInput';
import CareInput from '../components/forms/CareInput';
import MedicationInput from '../components/forms/MedicationInput';
import OtherInput from '../components/forms/OtherInput';
import AIAnalysisDisplay from '../components/AIAnalysisDisplay';
import DailyLogExcelExporter from '../components/DailyLogExcelExporter';
import AIPredictionService from '../../services/AIPredictionService';
import ErrorBoundary from '../components/ErrorBoundary';
import InlineEditText from '../components/InlineEditText';
import InlineEditableList from '../components/InlineEditableList';
import DailyLogA4SheetNM from "../components/print/DailyLogA4SheetNM";
import DailyLogA4SheetNM from "../components/print/DailyLogA4SheetNM";
import { useData } from '../contexts/DataContext';
import { useAdmin } from '../contexts/AdminContext';
import { useConfigurableComponent } from '../../services/DynamicConfigSystem';

/** localStorageから "◯◯_records_YYYY-MM-DD" を集約し、指定userのA4サマリ行(string[])を返す */
function collectA4RowsFromLocalStorage(userId: string, dateISO: string): string[] {
  const rows: string[] = [];
  const keys = Object.keys(localStorage).filter(k => k.endsWith(`_records_${dateISO}`));

  // カテゴリ推定: key 先頭のプレフィクス → 日本語ラベル
  const labelMap: Record<string, string> = {
    seizure: "発作",
    expression: "表情・反応",
    hydration: "水分",
    positioning: "体位",
    activity: "活動",
    excretion: "排泄",
    skin_oral_care: "皮膚・口腔ケア",
    illness: "体調・発熱",
    sleep: "睡眠",
    cough_choke: "咳・誤嚥",
    tube_feeding: "経管栄養",
    medication: "投薬",
    vitals: "バイタル",
    behavioral: "行動",
    communication: "コミュニケーション",
    rehabilitation: "リハビリ",
    other: "その他",
    // 安全側: 不明プレフィクス
    null: "その他", unknown: "その他"
  };

  for (const key of keys) {
    let arr: any[] = [];
    try {
      const v = JSON.parse(localStorage.getItem(key) || "null");
      if (Array.isArray(v)) arr = v;
      else if (v && typeof v === "object" && Array.isArray(v.data)) arr = v.data;
      else if (v && typeof v === "object" && Array.isArray(v.records)) arr = v.records;
    } catch {/* ignore */}
    if (!arr.length) continue;

    // 推定カテゴリラベル
    const prefix = key.split("_records_")[0] || "other";
    const label = labelMap[prefix as keyof typeof labelMap] || "その他";

    for (const item of arr) {
      try {
        if (item?.user_id && item.user_id !== userId) continue;

        // 簡易フォーマッタ（カテゴリ別に代表的な項目だけ拾う。無ければ自由文/JSONの一部）
        const parts: string[] = [];

        // 発作
        if (prefix === "seizure") {
          if (item.seizureType) parts.push(String(item.seizureType));
          if (item.seizurePhenomenon) parts.push(String(item.seizurePhenomenon));
          if (item.seizureDuration) parts.push(`発作 ${item.seizureDuration}`);
        }

        // バイタル
        if (prefix === "vitals") {
          if (item.bodyTemperature) parts.push(`体温 ${item.bodyTemperature}`);
          if (item.spo2) parts.push(`SpO₂ ${item.spo2}`);
          if (item.heartRate) parts.push(`脈拍 ${item.heartRate}`);
          if (item.bpSystolic && item.bpDiastolic) parts.push(`血圧 ${item.bpSystolic}/${item.bpDiastolic}`);
        }

        // 共通の自由記述
        const free = item.notes || item.note || item.comment || item.freeText || item.event_notes;
        if (free && String(free).trim()) parts.push(String(free).trim());

        // 何も拾えなければ id だけ落とす簡易要約（長文防止）
        if (!parts.length) {
          const pick = (k: string) => (item?.[k] ? `${k}:${String(item[k])}` : "");
          const skim = [pick("type"), pick("status"), pick("value")].filter(Boolean).join(" / ");
          parts.push(skim || "記述あり");
        }

        const line = `【${label}】 ${parts.join(" / ")}`;
        rows.push(line);
      } catch {/* ignore */}
    }
  }

  // 重複除去＆短文化
  return Array.from(new Set(rows)).map(s => s.length > 120 ? s.slice(0, 117) + "…" : s);
}

// --- A4 rows helpers (collision-free, local only) ---
type A4Rows = string[];

function _a4_getSelectedDateISO(): string {
  const el = document.querySelector('input[type="date"]') as HTMLInputElement | null;
  const v = (el?.value || '').trim();
  if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const d = new Date();
  const pad = (n:number)=>String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

function _a4_uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function _a4_buildRowsFromPacked(userId: string, dateISO: string): A4Rows {
  const rows: string[] = [];
  try {
    const raw = localStorage.getItem(`null_records_${dateISO}`);
    const parsed = raw ? JSON.parse(raw) : null;
    const items: any[] =
      Array.isArray(parsed) ? parsed :
      (parsed && Array.isArray(parsed.data) ? parsed.data : []);

    const mine = items.filter(it => (it.user_id || it.userId) === userId);

    // seizure
    mine.filter(it =>
      it.category === 'seizure' ||
      it.seizureType || it.seizure_type || it.seizure_start || it.seizure_duration
    ).forEach(it => {
      const t1 = it.seizureType || it.seizure_type;
      const t2 = it.seizure_phenomenon || it.phenomenon;
      const t3 = it.seizure_start || it.start || it.time;
      const t4 = it.seizure_duration || it.duration;
      const txt = ['発作', t1, t2, t3, t4].filter(Boolean).join(' / ');
      rows.push(`【発作】${txt}`);
    });

    // vitals
    mine.filter(it =>
      it.category === 'vitals' || it.bt || it.bp || it.hr || it.rr || it.spo2
    ).forEach(it => {
      const bt = it.bt ? `体温:${it.bt}` : '';
      const bp = it.bp ? `血圧:${it.bp}` : '';
      const hr = it.hr ? `脈拍:${it.hr}` : '';
      const rr = it.rr ? `呼吸:${it.rr}` : '';
      const sp = it.spo2 ? `SpO2:${it.spo2}` : '';
      const txt = [bt,bp,hr,rr,sp].filter(Boolean).join(' / ');
      rows.push(`【バイタル】${txt || '記入あり'}`);
    });
  } catch (e) {
    console.debug('#A4 packed parse error', e);
  }
  return _a4_uniq(rows);
}

const StructuredDailyLogPage: React.FC = () => {
  // ...既存のstate/useEffect...

  // --- A4データ作成ボタン用ハンドラ（localStorage集約→window.__A4_set）---
  function handleBuildA4Rows() {
    try {
      const userId = selectedUserId || "user-01";
      const user = users.find(u => u.id === userId);
      const dateISO = today; // 日付選択がなければtodayで代用
      const rows = collectA4RowsFromLocalStorage(userId, dateISO);

      // window.__A4_setをanyで吸収
      if (typeof window !== "undefined" && typeof (window as any).__A4_set === "function") {
        (window as any).__A4_set({
          date: new Date(dateISO),
          user: { id: userId, name: user?.name || "（選択中の利用者）" },
          logs: [],
          rows
        });
        console.debug("#A4 rows", dateISO, userId, rows.length, rows.slice(0,3));
      }
    } catch (e) {
      console.error("handleBuildA4Rows failed", e);
    }
  }

  // --- A4 re-render hook (minimal) ---
  const [, __forceA4Rerender] = useState(0);
  useEffect(() => {
    // グローバル helper: コンソール等から window.__A4_set({...}) を呼べば再描画される
    (window as any).__A4_set = (payload: any) => {
      (window as any).__A4 = payload;
      __forceA4Rerender(v => v + 1);
    };
  }, []);
  // --- /A4 re-render hook ---

  // --- A4 build handler (collision-free) ---
  const _a4_handleBuild = () => {
    try {
      const userId = (selectedUserId || 'user-01');
      const dateISO = _a4_getSelectedDateISO();
      const rows = _a4_buildRowsFromPacked(userId, dateISO);
      (window as any).__A4 = { userId, dateISO, rows };
      console.info('#A4 built', { userId, dateISO, count: rows.length, sample: rows.slice(0,3) });
      alert(`A4データ作成: ${rows.length}件`);
    } catch {}
  };
  const navigate = useNavigate();
  const { users, addDailyLog, updateUser } = useData();
  const { isAdminMode, isAuthenticated, autoSaveEnabled } = useAdmin();
  const { eventTypes, systemSettings, facilityName } = useConfigurableComponent('structuredDailyLog');
  const [activeEventType, setActiveEventType] = useLocalStorage<string | null>('activeEventType', null);
  const [isSubmitting, setIsSubmitting] = useLocalStorage<boolean>('isSubmitting', false);
  const [selectedUserId, setSelectedUserId] = useLocalStorage<string>('selectedUserId', '');
  const [todayEventCounts, setTodayEventCounts] = useLocalStorage<{ [key: string]: number }>('todayEventCounts', {});
  const [showAdminWarning, setShowAdminWarning] = useLocalStorage<boolean>('showAdminWarning', false);
  const [showAIAnalysis, setShowAIAnalysis] = useLocalStorage<boolean>('showAIAnalysis', false);
  const [showSeizureRiskModal, setShowSeizureRiskModal] = useState(false);
  const [aiSeizureRiskResult, setAISeizureRiskResult] = useState<{ riskLevel: string; message: string } | null>(null);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [logsJson, setLogsJson] = useState('');
  const [lastSaved, setLastSaved] = useState<string>('');
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showEventEditor, setShowEventEditor] = useState(false);
  const [editableEventTypes, setEditableEventTypes] = useState(eventTypes.length > 0 ? eventTypes : []);
  const [editingEventType, setEditingEventType] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const defaultEventTypes = [
    { id: 'seizure', name: '発作', icon: '⚡', color: 'bg-red-500' },
    { id: 'expression', name: '表情・反応', icon: '😊', color: 'bg-blue-500' },
    { id: 'vital', name: 'バイタル', icon: '🌡️', color: 'bg-green-500' },
    { id: 'meal', name: '食事・水分', icon: '🍽️', color: 'bg-orange-500' },
    { id: 'excretion', name: '排泄', icon: '🚽', color: 'bg-purple-500' },
    { id: 'sleep', name: '睡眠', icon: '😴', color: 'bg-indigo-500' },
    { id: 'activity', name: '活動', icon: '🎯', color: 'bg-teal-500' },
    { id: 'care', name: 'ケア', icon: '🤲', color: 'bg-pink-500' },
    { id: 'medication', name: '服薬', icon: '💊', color: 'bg-cyan-500' },
    { id: 'other', name: 'その他', icon: '📝', color: 'bg-gray-500' }
  ];

  const currentEventTypes = eventTypes.length > 0 ? eventTypes : defaultEventTypes;
  const eventTypeLabels = currentEventTypes.map(t => t.name);
  const eventTypeIds = currentEventTypes.map(t => t.id);
  const eventTypeColors = currentEventTypes.map(t => t.color.replace('bg-', '').replace('-500', ''));

  const eventCounts = useMemo(() => {
    try {
      const logs = JSON.parse(localStorage.getItem('daily_logs') || '[]');
      const counts: { [key: string]: number } = {};
      eventTypeIds.forEach(id => { counts[id] = 0; });
      logs.forEach((log: any) => {
        if (log.event_type && counts[log.event_type] !== undefined) {
          counts[log.event_type]++;
        }
      });
      return eventTypeIds.map(id => counts[id]);
    } catch {
      return eventTypeIds.map(() => 0);
    }
  }, [showLogsModal]);

  useEffect(() => {
    const counts: { [key: string]: number } = {};
    currentEventTypes.forEach(type => {
      counts[type.id] = 0;
    });
    try {
      users.forEach(user => {
        const userRecords = JSON.parse(localStorage.getItem(`dailyLogs_${user.id}`) || '[]');
        const todayRecords = userRecords.filter((record: any) =>
          record.timestamp && record.timestamp.split('T')[0] === today
        );
        todayRecords.forEach((record: any) => {
          if (counts[record.event_type] !== undefined) {
            counts[record.event_type]++;
          }
        });
      });
    } catch (error) {
      // エラー抑制
    }
    setTodayEventCounts(counts);
  }, [users, today, currentEventTypes]);

  useEffect(() => {
    if (!autoSaveEnabled && !isAdminMode) {
      setShowAdminWarning(true);
      const timer = setTimeout(() => setShowAdminWarning(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [autoSaveEnabled, isAdminMode]);

  const handleShowLogs = () => {
    try {
      const logs = localStorage.getItem('daily_logs');
      setLogsJson(logs ? JSON.stringify(JSON.parse(logs), null, 2) : 'データなし');
      const savedAt = localStorage.getItem('daily_logs_saved_at');
      setLastSaved(savedAt ? new Date(savedAt).toLocaleString('ja-JP') : '未保存');
    } catch (e) {
      setLogsJson('取得エラー');
      setLastSaved('取得エラー');
    }
    setShowLogsModal(true);
  };

  const showSaveCompleteToast = () => {
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const handleSaveEvent = async (eventData: any) => {
    if (!selectedUserId) return;
    setIsSubmitting(true);
    try {
      const logData = {
        userId: selectedUserId,
        staff_id: 'current-staff',
        author: '記録者',
        authorId: 'current-staff',
        record_date: today,
        recorder_name: '記録者',
        weather: '記録なし',
        mood: [],
        meal_intake: {
          breakfast: '記録なし',
          lunch: '記録なし',
          snack: '記録なし',
          dinner: '記録なし'
        },
        hydration: 0,
        toileting: [],
        activity: {
          participation: ['記録なし'],
          mood: '記録なし',
          notes: ''
        },
        special_notes: [{
          category: activeEventType || 'general',
          details: JSON.stringify({
            event_type: activeEventType,
            timestamp: new Date().toISOString(),
            data: eventData,
            notes: eventData.notes || '',
            admin_created: isAdminMode && isAuthenticated
          })
        }]
      };
      await addDailyLog(logData);
      const eventKey = `${activeEventType}_records_${today}`;
      const existingRecords = JSON.parse(localStorage.getItem(eventKey) || '[]');
      const newRecord = {
        id: Date.now().toString(),
        user_id: selectedUserId,
        event_type: activeEventType,
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        data: eventData,
        notes: eventData.notes || '',
        admin_created: isAdminMode && isAuthenticated,
        auto_saved: autoSaveEnabled && !isAdminMode
      };
      existingRecords.push(newRecord);
      localStorage.setItem(eventKey, JSON.stringify(existingRecords));
      const allLogs = JSON.parse(localStorage.getItem('daily_logs') || '[]');
      allLogs.push(newRecord);
      localStorage.setItem('daily_logs', JSON.stringify(allLogs));
      localStorage.setItem('daily_logs_saved_at', new Date().toISOString());
      showSaveCompleteToast();
      setActiveEventType(null);
      setTodayEventCounts({
        ...todayEventCounts,
        [activeEventType!]: (todayEventCounts[activeEventType!] || 0) + 1
      });
    } catch (error) {
      alert('記録の保存中にエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- JSX return部 ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-2 sm:p-4">
      {/* --- A4データ作成ボタン（印刷/PDFの直前）--- */}
      <div className="flex flex-row gap-2 mb-2">
        <button onClick={_a4_handleBuild} className="btn a4-build">A4データ作成</button>
      </div>
      {/* 保存完了トースト通知 */}
      {showSaveToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-lg font-semibold print:hidden">
          ✅ 全日誌データをローカルストレージに保存しました
        </div>
      )}
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">📋 構造化日誌入力</h1>
          <p className="text-gray-600 text-sm sm:text-base">{facilityName} - 利用者の日常記録を構造化して記録します</p>
        </div>
        {/* 利用者一覧 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {users.map(u => (
            <button
              key={u.id}
              className={`border rounded-lg p-4 text-center shadow hover:bg-blue-100 transition-all ${selectedUserId === u.id ? 'bg-blue-200 border-blue-500' : 'bg-white'}`}
              onClick={() => setSelectedUserId(u.id)}
            >
              <div className="font-bold text-lg mb-1">{u.name}</div>
              <div className="text-xs text-gray-500">{u.serviceType?.join(', ')}</div>
              <div className="mt-2 text-xs text-gray-400">{u.medicalCare?.join(', ')}</div>
            </button>
          ))}
        </div>
        {/* 本日のイベント集計 */}
        {selectedUserId && (
          <>
            {/* --- A4プレビュー（本日の記録件数の直前）--- */}
            {typeof window !== "undefined" && !!(Array.isArray((window as any).__A4?.rows) && (window as any).__A4?.rows?.length) && (
              <div style={{ marginBottom: "16px" }}>
                <DailyLogA4SheetNM
                  user={((window as any).__A4?.user ?? ({})) as any}
                  logs={((window as any).__A4?.logs ?? []) as any[]}
                  date={(window as any).__A4?.date ?? new Date().toISOString().slice(0, 10)}
                  rows={((window as any).__A4?.rows as string[]) || undefined}
                />
              </div>
            )}
            {/* --- /A4プレビュー --- */}
            <div className="mb-6">
              <h2 className="font-semibold text-base mb-2">本日の記録件数</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {currentEventTypes.map((type, idx) => (
                  <div key={type.id} className={`rounded px-2 py-1 text-xs font-bold text-white ${type.color}`}>
                    {type.icon} {type.name}: {todayEventCounts[type.id] || 0}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {/* イベントフォーム群 */}
        {selectedUserId && (
          <div className="space-y-4">
            <SeizureForm onSave={handleSaveEvent} />
            <ExpressionForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />
            <VitalSignsInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
            <HydrationForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />
            <ExcretionInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
            <SleepInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
            <ActivityInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
            <CareInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
            <MedicationInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
            <OtherInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
          </div>
        )}
      </div>
      {/* AI分析表示 */}
      {showAIAnalysis && selectedUserId && (
        <AIAnalysisDisplay
          user={users.find(u => u.id === selectedUserId)!}
          isVisible={showAIAnalysis}
          onClose={() => setShowAIAnalysis(false)}
        />
      )}
      {/* 印刷用CSS */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .print\:static, .print\:p-0, .print\:shadow-none, .print\:max-w-full, .print\:w-full, .print\:rounded-none, .print\:overflow-visible, .print\:text-xs, .print\:bg-white {
            visibility: visible !important;
            position: static !important;
            box-shadow: none !important;
            max-width: 100% !important;
            width: 100% !important;
            border-radius: 0 !important;
            overflow: visible !important;
            font-size: 12px !important;
            background: #fff !important;
            color: #222 !important;
          }
          .print\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default StructuredDailyLogPage;