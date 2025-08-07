import { useState, useEffect, FC } from 'react';
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

const StructuredDailyLogPage: FC = () => {
  const navigate = useNavigate();
  const { users } = useData();
  // const { user: currentUser } = useAuth(); // Commented out due to context type issues
  // const { addNotification } = useNotification(); // Commented out due to context type issues
  const location = useLocation();
  
  // 基本的な状態管理
  const [selectedUserId, setSelectedUserId] = useLocalStorage<string>('selectedUserId', '');
  const [activeEventType, setActiveEventType] = useState<EventType>('seizure');
  const [showEventEditor, setShowEventEditor] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [logsReady, setLogsReady] = useState(false);
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 現在選択されている利用者
  const selectedUser = users.find(user => user.id === selectedUserId);
  
  // 今日の日付
  const today = new Date().toISOString().split('T')[0];
  
  // 施設名（データコンテキストから取得、なければデフォルト）
  const facilityName = "重心ケア施設";

  // 安全なダミーデータ生成関数 → 実際のlocalStorage読み込み関数に変更
  const generateDailyLog = (userId: string, userName: string, date: string): DailyLog => {
    // localStorageから今日のイベントデータを取得
    const allLogs = JSON.parse(localStorage.getItem('daily_logs') || '[]');
    const todayLogs = allLogs.filter((log: any) => 
      log.user_id === userId && 
      log.created_at && 
      log.created_at.startsWith(date)
    );
    
    console.log('DEBUG - Found logs for', userId, 'on', date, ':', todayLogs.length, 'events');
    
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
    
    console.log('DEBUG - Generated dailyLog with items:', {
      vitals: !!dailyLog.vitals,
      hydration: dailyLog.hydration.length,
      excretion: dailyLog.excretion.length,
      seizure: dailyLog.seizure?.length || 0,
      activity: dailyLog.activity?.length || 0,
      care: dailyLog.care?.length || 0
    });
    
    return dailyLog;
  };

  // ユーザー変更時のログ生成
  useEffect(() => {
    if (!selectedUserId || users.length === 0) {
      setLogsReady(false);
      setDailyLog(null);
      return;
    }
    
    (async () => {
      console.log('DEBUG - Starting generateDailyLog for userId:', selectedUserId);
      setLogsReady(false);
      
      const user = users.find(u => u.id === selectedUserId);
      if (!user) {
        console.error('User not found:', selectedUserId);
        return;
      }
      
      try {
        const log = generateDailyLog(user.id, user.name, today);
        console.log('DEBUG - generateDailyLog done, items:', Object.keys(log).length);
        setDailyLog(log);
        setLogsReady(true);
      } catch (error) {
        console.error('generateDailyLog failed:', error);
        setLogsReady(false);
      }
    })();
  }, [selectedUserId, users, today]);

  // localStorage変更の監視（イベント保存後のdailyLog更新）
  useEffect(() => {
    if (!selectedUserId || !selectedUser || !logsReady) return;
    
    const handleStorageChange = () => {
      console.debug('localStorage changed - regenerating dailyLog');
      const updatedLog = generateDailyLog(selectedUser.id, selectedUser.name, today);
      setDailyLog(updatedLog);
    };
    
    // storage eventは他のタブからの変更のみ検知するため、
    // 同一タブ内での変更は手動で監視する必要がある
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [selectedUserId, selectedUser, logsReady, today]);

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

  // Handle Save Event (from forms)
  const handleSaveEvent = async (eventData: any) => {
    setIsSubmitting(true);
    
    const newEvent = {
      id: Date.now().toString(),
      user_id: selectedUserId,
      event_type: activeEventType,
      created_at: new Date().toISOString(),
      ...eventData
    };
    
    // Save to localStorage
    const existingLogs = JSON.parse(localStorage.getItem('daily_logs') || '[]');
    const updatedLogs = [...existingLogs, newEvent];
    localStorage.setItem('daily_logs', JSON.stringify(updatedLogs));
    
    // Regenerate daily log to reflect changes
    if (selectedUser) {
      const updatedLog = generateDailyLog(selectedUser.id, selectedUser.name, today);
      setDailyLog(updatedLog);
      console.log('DEBUG - generateDailyLog regenerated, items:', Object.keys(updatedLog).length);
    }
    
    setIsSubmitting(false);
    setShowEventEditor(false);
    // TODO: Show success toast
    console.log('Event saved:', newEvent);
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
