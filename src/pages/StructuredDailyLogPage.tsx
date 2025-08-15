import React, { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import DailyLogA4Print from '../components/DailyLogA4Print';
import AIAnalysisDisplay from '../components/AIAnalysisDisplay';
import SeizureForm from '../components/forms/SeizureForm';
import ExpressionForm from '../components/forms/ExpressionForm';
import { HydrationForm } from '../components/forms/HydrationForm';
import { PositioningForm } from '../components/forms/PositioningForm';
import { ActivityForm } from '../components/forms/ActivityForm';
import { ExcretionForm } from '../components/forms/ExcretionForm';
import { SkinOralCareForm } from '../components/forms/SkinOralCareForm';
import IllnessForm from '../components/forms/IllnessForm';
import SleepInput from '../components/forms/SleepInput';
import OtherInput from '../components/forms/OtherInput';
import VitalSignsInput from '../components/forms/VitalSignsInput';
import MedicationForm from '../components/forms/MedicationForm';
import CommunicationForm from '../components/forms/CommunicationForm';
import RehabilitationForm from '../components/forms/RehabilitationForm';
import { exportDailyLogPdf } from '../services/DailyLogExportService';

// 型定義例（実際はtypes.tsからimportすること）
type LogEntry = any;


// 主要なイベント種別（必要に応じてアイコンや色を調整）
const eventTypes = [
  { id: 'seizure', name: '発作', icon: '⚡', color: 'bg-red-500', description: 'てんかん等の発作' },
  { id: 'expression', name: '表情・反応', icon: '😊', color: 'bg-yellow-500', description: '表情や反応の変化' },
  { id: 'hydration', name: '水分', icon: '💧', color: 'bg-blue-400', description: '水分摂取' },
  { id: 'positioning', name: '体位', icon: '🛏️', color: 'bg-purple-400', description: '体位変換・姿勢' },
  { id: 'activity', name: '活動', icon: '🏃', color: 'bg-green-500', description: '活動・レクリエーション' },
  { id: 'excretion', name: '排泄', icon: '🚽', color: 'bg-pink-400', description: '排泄記録' },
  { id: 'skin_oral_care', name: '皮膚・口腔ケア', icon: '🦷', color: 'bg-orange-400', description: '皮膚・口腔ケア' },
  { id: 'illness', name: '体調・発熱', icon: '🤒', color: 'bg-red-300', description: '体調不良・発熱' },
  { id: 'sleep', name: '睡眠', icon: '😴', color: 'bg-indigo-400', description: '睡眠・休息' },
  { id: 'cough_choke', name: '咳・誤嚥', icon: '🤧', color: 'bg-yellow-700', description: '咳・誤嚥' },
  { id: 'tube_feeding', name: '経管栄養', icon: '🥤', color: 'bg-blue-700', description: '経管栄養' },
  { id: 'medication', name: '投薬', icon: '💊', color: 'bg-pink-600', description: '投薬記録' },
  { id: 'vitals', name: 'バイタル', icon: '🩺', color: 'bg-green-700', description: 'バイタルサイン' },
  { id: 'behavioral', name: '行動', icon: '🗣️', color: 'bg-gray-500', description: '行動・様子' },
  { id: 'communication', name: 'コミュニケーション', icon: '💬', color: 'bg-blue-300', description: '意思疎通・発語' },
  { id: 'rehabilitation', name: 'リハビリ', icon: '🦾', color: 'bg-green-300', description: 'リハビリ・訓練' },
  { id: 'other', name: 'その他', icon: '📝', color: 'bg-gray-400', description: 'その他' },
];

const StructuredDailyLogPage: React.FC = () => {
  const { users } = useData();
  const { isAuthenticated } = useAuth();
    // 通知機能は未使用
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeEventType, setActiveEventType] = useState<string | null>(null);
  const [todayEventCounts, setTodayEventCounts] = useState<{ [key: string]: number }>({});
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const printDivRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().slice(0, 10);
  const facilityName = '重心多機能型事業所';
  const currentEventTypes = eventTypes; // 実際はユーザーやサービス種別でフィルタ
  const isAdminMode = false; // 必要に応じて
  const autoSaveEnabled = true;

  // 保存完了トースト表示
  const showSaveCompleteToast = () => {
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
  };

  // 印刷
  const handlePrint = () => {
    if (printDivRef.current) {
      const printContents = printDivRef.current.innerHTML;
      const win = window.open('', '', 'width=800,height=600');
      if (win) {
        win.document.write('<html><head><title>印刷</title></head><body>' + printContents + '</body></html>');
        win.document.close();
        win.print();
      }
    }
  };

  // イベント保存

  const { addDailyLog, getDailyLogsByUser } = useData();
  const handleSaveEvent = async (eventData: any) => {
    setIsSubmitting(true);
    try {
      if (!selectedUserId || !activeEventType) return;
      const today = new Date().toISOString().slice(0, 10);
      // バイタルの場合はvitalsフィールドもセット
      let extraFields = {};
      if (activeEventType === 'vitals') {
        // eventDataの型変換
        const vitals = {
          temperature: Number(eventData.temperature),
          pulse: Number(eventData.pulse),
          spO2: Number(eventData.spo2),
          bloodPressure: {
            systolic: Number(eventData.blood_pressure_systolic),
            diastolic: Number(eventData.blood_pressure_diastolic),
          },
        };
        extraFields = { vitals };
      }
      await addDailyLog({
        userId: selectedUserId,
        staff_id: '',
        author: '',
        authorId: '',
        record_date: today,
        recorder_name: '',
        weather: '',
        mood: [],
        meal_intake: { breakfast: '', lunch: '', snack: '', dinner: '' },
        hydration: 0,
        toileting: [],
        activity: { participation: [], mood: '', notes: '' },
        special_notes: [
          {
            category: activeEventType,
            details: JSON.stringify(eventData),
          },
        ],
        ...extraFields,
      });
      showSaveCompleteToast();
      setActiveEventType(null);
    } catch (error) {
      alert('記録の保存中にエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- JSX return部 ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-2 sm:p-4">
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
          <div className="mb-6">
            <h2 className="font-semibold text-base mb-2">本日の記録件数</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {currentEventTypes.map((type, idx) => {
                const logs = getDailyLogsByUser(selectedUserId).filter(l => l.record_date === today && l.special_notes?.some(note => note.category === type.id));
                return (
                  <div key={type.id} className={`rounded px-2 py-1 text-xs font-bold text-white ${type.color}`}>
                    {type.icon} {type.name}: {logs.length}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* 今日の記録サマリー＋PDF/印刷ボタン */}
        {selectedUserId && (
          <div className="mt-10">
            <h2 className="font-bold text-lg mb-2">今日の記録サマリー</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(() => {
                const logs = getDailyLogsByUser(selectedUserId).filter(l => l.record_date === today);
                if (logs.length === 0) return <div className="text-gray-500 col-span-3">まだ記録がありません</div>;
                return logs.map((log, idx) => {
                  const note = log.special_notes?.[0];
                  const eventType = currentEventTypes.find(t => t.id === note?.category);
                  return (
                    <div key={log.id} className="rounded shadow p-4 bg-white border">
                      <div className="font-bold mb-1">{eventType?.name || note?.category}</div>
                      <div className="text-xs text-gray-500 mb-2">{log.createdAt?.slice(0,16).replace('T',' ')}</div>
                      <div className="text-xs break-all">{note?.details}</div>
                    </div>
                  );
                });
              })()}
            </div>
            {/* PDF/印刷ボタン */}
            <div className="flex gap-2 mt-4">
              <button onClick={handlePrint} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">印刷</button>
              <button
                onClick={async () => {
                  if (!selectedUserId) return;
                  const logs = getDailyLogsByUser(selectedUserId).filter(l => l.record_date === today);
                  if (!logs.length) return;
                  const userObj = users.find((u: any) => u.id === selectedUserId);
                  const payload = {
                    user: userObj,
                    date: today,
                    entries: logs,
                    notes: '',
                  };
                  await exportDailyLogPdf(payload);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >PDF保存</button>
            </div>
            {/* 印刷用hidden領域 */}
            <div style={{ display: 'none' }} ref={printDivRef}>
              <DailyLogA4Print
                user={users.find((u: any) => u.id === selectedUserId) || { id: '', name: '不明', age: 0, gender: '不明', disabilityType: '', disabilityLevel: '', underlyingDiseases: '', medicalCare: [], certificates: '', careLevel: '', serviceType: [] }}
                log={{
                  id: '',
                  userId: selectedUserId,
                  staff_id: '',
                  author: '',
                  authorId: '',
                  record_date: today,
                  recorder_name: '',
                  weather: '',
                  mood: [],
                  meal_intake: { breakfast: '', lunch: '', snack: '', dinner: '' },
                  hydration: 0,
                  toileting: [],
                  activity: { participation: [], mood: '', notes: '' },
                  special_notes: [],
                }}
              />
            </div>
          </div>
        )}
        {/* イベントカテゴリカード一覧 or フォーム */}
        {selectedUserId && !activeEventType && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {currentEventTypes.map(type => (
              <button
                key={type.id}
                className={`rounded-lg shadow p-4 flex flex-col items-center border-2 hover:scale-105 transition-all ${type.color} text-white`}
                onClick={() => setActiveEventType(type.id)}
              >
                <span className="text-3xl mb-2">{type.icon}</span>
                <span className="font-bold text-base mb-1">{type.name}</span>
                <span className="text-xs opacity-80">{type.description}</span>
              </button>
            ))}
          </div>
        )}
        {/* 選択カテゴリのフォーム表示 */}
        {selectedUserId && activeEventType && (
          <div className="bg-white rounded-lg shadow p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentEventTypes.find(t => t.id === activeEventType)?.icon}</span>
                <span className="font-bold text-lg">{currentEventTypes.find(t => t.id === activeEventType)?.name}</span>
              </div>
              <button className="text-sm text-blue-600 underline" onClick={() => setActiveEventType(null)}>キャンセル</button>
            </div>
            {/* カテゴリごとにフォームを切り替え（未実装はOtherInput等で代用） */}
            {activeEventType === 'seizure' && <SeizureForm onSave={handleSaveEvent} />}
            {activeEventType === 'expression' && <ExpressionForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
            {activeEventType === 'hydration' && <HydrationForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
            {activeEventType === 'positioning' && <PositioningForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
            {activeEventType === 'activity' && <ActivityForm userId={selectedUserId} onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
            {activeEventType === 'excretion' && <ExcretionForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
            {activeEventType === 'skin_oral_care' && <SkinOralCareForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
            {activeEventType === 'illness' && <IllnessForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
            {activeEventType === 'sleep' && <SleepInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
            {activeEventType === 'tube_feeding' && <OtherInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
            {activeEventType === 'vitals' && <VitalSignsInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
            {activeEventType === 'medication' && <MedicationForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
            {activeEventType === 'behavioral' && <OtherInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
            {activeEventType === 'communication' && <CommunicationForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
            {activeEventType === 'rehabilitation' && <RehabilitationForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
            {activeEventType === 'other' && <OtherInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
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
}

export default StructuredDailyLogPage;