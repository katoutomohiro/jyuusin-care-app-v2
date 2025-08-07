import { useState, useEffect, useMemo, FC } from 'react';
// ...existing code...
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import SeizureForm from '../components/forms/SeizureForm';
import ExpressionForm from '../components/forms/ExpressionForm';
import VitalSignsInput from '../components/forms/VitalSignsInput';
import VitalsForm from '../components/forms/VitalsForm';
import { HydrationForm } from '../components/forms/HydrationForm';
import { ExcretionForm } from '../components/forms/ExcretionForm';
import { ActivityForm } from '../components/forms/ActivityForm';
import { SkinOralCareForm } from '../components/forms/SkinOralCareForm';
import TubeFeedingForm from '../components/forms/TubeFeedingForm';
import ExcretionInput from '../components/forms/ExcretionInput';
import SleepInput from '../components/forms/SleepInput';
import CareInput from '../components/forms/CareInput';
import MedicationInput from '../components/forms/MedicationInput';
import OtherInput from '../components/forms/OtherInput';
import AIAnalysisDisplay from '../components/AIAnalysisDisplay';
import DailyLogA4Print from '../components/DailyLogA4Print';
import { exportDailyLog, exportDailyLogExcel } from '../services/DailyLogExportService';
import { PDFViewer } from '@react-pdf/renderer';
import DailyLogPdfDoc from '../components/pdf/DailyLogPdfDoc';
import PdfPreviewModal from '../components/pdf/PdfPreviewModal';
// import DailyLogPdfDocument from '../components/DailyLogPdfDocument';
// import { PDFDownloadLink } from '@react-pdf/renderer';
import ErrorBoundary from '../components/ErrorBoundary';
import InlineEditText from '../components/InlineEditText';
import InlineEditableList from '../components/InlineEditableList';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { DailyLog, User } from '../types';
import { useLocation } from 'react-router-dom';
import { ButtonsRow } from '../components/ButtonsRow';
import { RecordTile } from '../components/RecordTile';
import { CATEGORIES, EventType as CatEventType } from '../utils/eventCategories';

type EventType = 'seizure' | 'expression' | 'vitals' | 'hydration' | 'excretion' | 'sleep' | 'activity' | 'care' | 'skin_oral_care' | 'illness' | 'cough_choke' | 'tube_feeding' | 'medication_administration' | 'behavioral' | 'communication' | 'other' | 'positioning';

// generateDailyLog関数を巻き上げ可能な関数宣言として定義
function generateDailyLog(
  userId: string | undefined,
  userName: string,
  date: string,
  dailyLogsByUser: Record<string, any[]>
): DailyLog | null {
  if (!userId) return null;
  
  // dailyLogsByUserから今日のイベントデータを取得
  const userLogs = dailyLogsByUser[userId] || [];
  const todayLogs = userLogs.filter((log: any) => 
    log.user_id === userId && 
    log.created_at && 
    log.created_at.startsWith(date)
  );
  
  if (import.meta.env.DEV) {
    console.debug('DEBUG – Found logs for', userId, 'on', date, ':', todayLogs.length, 'events');
  }
  
  // 基本構造
  const dailyLog: DailyLog = {
    userId,
    userName,
    date,
    vitals: null,
    hydration: [],
    excretion: [],
    sleep: null,
    seizure: [],
    activity: [],
    care: [],
    notes: ''
  };

  // イベントタイプ別にデータを集計
  todayLogs.forEach((log: any) => {
    try {
      switch (log.event_type) {
        case 'vitals':
          dailyLog.vitals = {
            temperature: parseFloat(log.temperature) || null,
            pulse: parseInt(log.pulse) || null,
            spo2: parseInt(log.spo2) || null,
            blood_pressure_systolic: parseInt(log.blood_pressure_systolic) || null,
            blood_pressure_diastolic: parseInt(log.blood_pressure_diastolic) || null,
            respiratory_rate: parseInt(log.respiratory_rate) || null,
            measurement_time: log.event_timestamp || ''
          };
          break;
          
        case 'hydration':
          dailyLog.hydration.push({
            time: log.event_timestamp ? log.event_timestamp.substring(11, 16) : '',
            amount: parseInt(log.amount) || 0,
            type: log.intake_type === 'oral' ? 'oral' : 'tube',
            content: log.meal_content || ''
          });
          break;
          
        case 'excretion':
          dailyLog.excretion.push({
            time: log.event_timestamp ? log.event_timestamp.substring(11, 16) : '',
            type: log.record_type === 'urination' ? 'urine' : 'stool',
            amount: log.urination?.amount || log.defecation?.amount || '',
            color: log.urination?.color || '',
            properties: log.defecation?.bristol_scale || '',
            notes: log.notes || ''
          });
          break;
          
        case 'seizure':
          if (!dailyLog.seizure) dailyLog.seizure = [];
          dailyLog.seizure.push({
            time: log.event_timestamp ? log.event_timestamp.substring(11, 16) : '',
            type: log.seizure_type || '',
            duration: (log.duration_minutes || 0) * 60, // Convert minutes to seconds
            symptoms: log.seizure_phenomena || [],
            postIctalState: log.post_ictal_state || '',
            notes: log.notes || ''
          });
          break;
          
        case 'activity':
          if (!dailyLog.activity) dailyLog.activity = [];
          dailyLog.activity.push({
            time: log.event_timestamp ? log.event_timestamp.substring(11, 16) : '',
            title: log.activity_type || '',
            description: log.notes || '',
            mood: log.mood_during_activity || ''
          });
          break;
          
        default:
          // その他のイベントタイプもcareに追加
          if (!dailyLog.care) dailyLog.care = [];
          dailyLog.care.push({
            time: log.event_timestamp ? log.event_timestamp.substring(11, 16) : '',
            type: 'other',
            details: log.notes || `${log.event_type}: ${JSON.stringify(log, null, 2)}`
          });
      }
    } catch (error) {
      console.warn('Error processing log entry:', log, error);
    }
  });
  
  if (import.meta.env.DEV) {
    console.debug('DEBUG - Generated dailyLog with items:', {
      vitals: !!dailyLog.vitals,
      hydration: dailyLog.hydration.length,
      excretion: dailyLog.excretion.length,
      seizure: dailyLog.seizure?.length || 0,
      activity: dailyLog.activity?.length || 0,
      care: dailyLog.care?.length || 0
    });
  }
  
  return dailyLog;
}

const StructuredDailyLogPage: FC = () => {
  const navigate = useNavigate();
  const { users, dailyLogsByUser } = useData();
  // const { user: currentUser } = useAuth(); // Commented out due to context type issues
  // const { addNotification } = useNotification(); // Commented out due to context type issues
  const location = useLocation();
  
  // 基本的な状態管理
  const [selectedUserId, setSelectedUserId] = useLocalStorage<string>('selectedUserId', '');
  const [activeEventType, setActiveEventType] = useState<EventType>('seizure');
  const [showEventEditor, setShowEventEditor] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 現在選択されている利用者
  const selectedUser = users.find(user => user.id === selectedUserId);
  
  // 今日の日付
  const today = new Date().toISOString().split('T')[0];
  
  // 施設名（データコンテキストから取得、なければデフォルト）
  const facilityName = "重心ケア施設";

  // logsReady判定: selectedUserIdが存在し、dailyLogsByUserにデータが存在する
  const logsReady = selectedUserId && dailyLogsByUser[selectedUserId] !== undefined;

  // dailyLogをuseMemoで生成（dailyLogsByUserの変更を購読）
  const dailyLog = useMemo(() => {
    if (!selectedUserId || !selectedUser || !logsReady) return null;
    
    const generatedLog = generateDailyLog(selectedUserId, selectedUser.name, today, dailyLogsByUser);
    if (import.meta.env.DEV && generatedLog) {
      console.debug('DEBUG – generateDailyLog regenerated, items:', Object.keys(generatedLog).length);
    }
    return generatedLog;
  }, [selectedUserId, selectedUser, today, dailyLogsByUser]);

  // 各カテゴリーの件数を計算
  const getCategoryCount = (categoryKey: string): number => {
    if (!dailyLog) return 0;
    
    switch (categoryKey) {
      case 'seizure':
        return dailyLog.seizure?.length || 0;
      case 'expression':
        return dailyLog.activity?.filter((item: any) => item.type === 'expression').length || 0;
      case 'vitals':
        return dailyLog.vitals ? 1 : 0;
      case 'hydration':
        return dailyLog.hydration?.length || 0;
      case 'excretion':
        return dailyLog.excretion?.length || 0;
      case 'activity':
        return dailyLog.activity?.filter((item: any) => item.type !== 'expression').length || 0;
      case 'skin_oral_care':
        return dailyLog.care?.filter((item: any) => item.type === 'skin_oral_care').length || 0;
      case 'tube_feeding':
        return dailyLog.care?.filter((item: any) => item.type === 'tube_feeding').length || 0;
      default:
        return 0;
    }
  };

  // Excel Export Handler
  const handleExportExcel = async () => {
    console.time('exportExcel');
    console.log('Excel export started');
    try {
      if (!selectedUser || !dailyLog || !logsReady) {
        alert('利用者データの準備ができていません。少しお待ちください。');
        return;
      }
      
      console.log('Generated dailyLog:', dailyLog);
      
      await exportDailyLogExcel(dailyLog, selectedUser, today);
      console.log('Excel export completed successfully');
      
      // toast.success('Excel を生成しました'); // Future: implement toast
      alert('Excel ファイルを生成しました');
    } catch (error) {
      console.error('Excel export error:', error);
      // toast.error('Excel 生成に失敗しました'); // Future: implement toast
      alert('Excel出力に失敗しました: ' + (error as Error).message);
    }
    console.timeEnd('exportExcel');
  };

  // Event Tile Click Handler
  const handleTileClick = (eventType: CatEventType) => {
    console.log('Tile clicked:', eventType);
    setActiveEventType(eventType as EventType);
    setShowEventEditor(true);
  };

  // Handle Save Event (from forms) - DataContextのaddDailyLogを使用
  const handleSaveEvent = async (eventData: any) => {
    const { addDailyLog } = useData();
    setIsSubmitting(true);
    
    const newEvent = {
      id: Date.now().toString(),
      user_id: selectedUserId,
      userId: selectedUserId,
      event_type: activeEventType,
      created_at: new Date().toISOString(),
      ...eventData
    };
    
    try {
      // DataContextのaddDailyLogを呼び出し（自動的にUI更新）
      await addDailyLog(newEvent);
      
      if (import.meta.env.DEV) {
        console.debug('DEBUG – Event saved:', newEvent);
      }
      
      setIsSubmitting(false);
      setShowEventEditor(false);
    } catch (error) {
      console.error('Failed to save event:', error);
      setIsSubmitting(false);
    }
  };

  // DEBUG: State monitoring
  useEffect(() => {
    console.log('DEBUG - selectedUserId:', selectedUserId, 'selectedUser:', selectedUser);
  }, [selectedUserId, selectedUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">📋 構造化日誌入力</h1>
          <p className="text-gray-600 text-sm sm:text-base">{facilityName} - 利用者の日常記録を構造化して記録します</p>
        </div>

        {/* 利用者選択エリア */}
        {!selectedUserId && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">📝 記録する利用者を選択</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg border border-blue-200 transition-all duration-200 text-left"
                >
                  <div className="font-semibold text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-500">記録を開始</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* メインコンテンツ */}
        {selectedUserId && selectedUser && (
          <div className="space-y-4 sm:space-y-6">
            {/* 利用者情報表示 */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
                <button
                  onClick={() => setSelectedUserId('')}
                  className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span>←</span>
                  <span>利用者選択に戻る</span>
                </button>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{selectedUser.name}</h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>年齢: {selectedUser.age}歳 ({selectedUser.gender})</p>
                  <p>サービス: {selectedUser.serviceType?.join(', ')}</p>
                </div>
              </div>
            </div>

            {/* PDF/Excel ボタン */}
            <ButtonsRow
              dailyLog={dailyLog}
              logsReady={logsReady}
              onPdf={() => setPdfPreviewOpen(true)}
              onExcel={handleExportExcel}
            />

            {!logsReady && (
              <p className="text-sm text-gray-500 text-center">構造化日誌の変換を準備中…</p>
            )}

            {logsReady && (!dailyLog || Object.keys(dailyLog).length === 0) && (
              <p className="text-sm text-orange-500 text-center">まだ記録がありません。下のタイルから入力してください。</p>
            )}

            {/* 記録入力タイルグリッド */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📝 記録入力</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {CATEGORIES.map(category => (
                  <RecordTile
                    key={category.key}
                    icon={category.icon}
                    label={category.label}
                    onClick={() => handleTileClick(category.key)}
                    count={getCategoryCount(category.key)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Form Modals */}
        {showEventEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                  {CATEGORIES.find(c => c.key === activeEventType)?.label || activeEventType} 入力
                </h3>
                <button
                  onClick={() => setShowEventEditor(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
              
              {/* Form Components */}
              {activeEventType === 'seizure' && <SeizureForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
              {activeEventType === 'expression' && <ExpressionForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
              {activeEventType === 'vitals' && <VitalsForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
              {activeEventType === 'hydration' && <HydrationForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
              {activeEventType === 'excretion' && <ExcretionForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
              {activeEventType === 'activity' && <ActivityForm userId={selectedUserId} onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
              {activeEventType === 'skin_oral_care' && <SkinOralCareForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
              {activeEventType === 'tube_feeding' && <TubeFeedingForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />}
              
              {/* ダミーフォーム表示（まだ実装していないもの） */}
              {!['seizure', 'expression', 'vitals', 'hydration', 'excretion', 'activity', 'skin_oral_care', 'tube_feeding'].includes(activeEventType) && (
                <div className="text-center text-gray-500 py-8">
                  <p>🚧 {CATEGORIES.find(c => c.key === activeEventType)?.label || activeEventType} フォームは準備中です</p>
                  <button
                    onClick={() => setShowEventEditor(false)}
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    閉じる
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PDF Preview Modal */}
        {selectedUserId && selectedUser && dailyLog && (
          <PdfPreviewModal
            open={pdfPreviewOpen}
            onClose={() => setPdfPreviewOpen(false)}
            dailyLog={dailyLog}
            user={selectedUser}
            recordDate={today}
          />
        )}
      </div>
    </div>
  );
};

export default StructuredDailyLogPage;
