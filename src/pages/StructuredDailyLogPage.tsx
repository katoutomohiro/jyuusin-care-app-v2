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
import { useData } from '../contexts/DataContext';
import { useAdmin } from '../contexts/AdminContext';
import { useConfigurableComponent } from '../../services/DynamicConfigSystem';

const StructuredDailyLogPage: React.FC = () => {
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
      {/* 保存完了トースト通知 */}
      {showSaveToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-lg font-semibold print:hidden">
          ✅ 全日誌データをローカルストレージに保存しました
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">📋 構造化日誌入力</h1>
          <p className="text-gray-600 text-sm sm:text-base">{facilityName} - 利用者の日常記録を構造化して記録します</p>
        </div>
        {/* ここから下は元のreturn JSXをそのまま使用してください（return部は既存のまま） */}
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