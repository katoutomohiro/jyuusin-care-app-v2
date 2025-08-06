import { useState, useEffect, FC } from 'react';
// ...existing code...
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

type EventType = 'seizure' | 'expression' | 'vitals' | 'hydration' | 'excretion' | 'sleep' | 'activity' | 'care' | 'skin_oral_care' | 'illness' | 'cough_choke' | 'tube_feeding' | 'medication_administration' | 'behavioral' | 'communication' | 'other';

const StructuredDailyLogPage: FC = () => {
  const navigate = useNavigate();
  const { users } = useData();
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotification();
  const location = useLocation();
  
  // 基本的な状態管理
  const [selectedUserId, setSelectedUserId] = useLocalStorage<string>('selectedUserId', '');
  const [activeEventType, setActiveEventType] = useState<EventType>('seizure');
  const [showEventEditor, setShowEventEditor] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  
  // 現在選択されている利用者
  const selectedUser = users.find(user => user.id === selectedUserId);
  
  // 今日の日付
  const today = new Date().toISOString().split('T')[0];
  
  // 施設名（データコンテキストから取得、なければデフォルト）
  const facilityName = "重心ケア施設";

  // ダミーデータ生成関数
  const generateDailyLog = (): DailyLog => {
    if (!selectedUser) {
      throw new Error('利用者が選択されていません');
    }
    
    return {
      userId: selectedUser.id,
      userName: selectedUser.name,
      date: today,
      vitals: { 
        temperature: 36.5, 
        pulse: 80, 
        spo2: 98,
        blood_pressure_systolic: null,
        blood_pressure_diastolic: null,
        respiratory_rate: null,
        measurement_time: '10:00'
      },
      hydration: [{ time: '10:00', amount: 200, type: 'oral', content: '水' }],
      excretion: [{ time: '11:00', type: 'urine', amount: '中量' }],
      seizure: [],
      notes: 'テスト用メモ'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-2 sm:p-4">
      {/* PDF・Excel出力ボタン */}
      {selectedUserId && (
        <div className="mb-4 flex justify-end gap-2">
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded" 
            onClick={() => setPdfPreviewOpen(true)}
          >
            A4印刷用日誌プレビュー
          </button>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              try {
                if (selectedUser) {
                  const dailyLog = generateDailyLog();
                  exportDailyLogExcel(dailyLog, selectedUser, today);
                } else {
                  alert('利用者が選択されていません。');
                }
              } catch (error) {
                console.error('Excel出力エラー:', error);
                alert('Excel出力に失敗しました: ' + (error as Error).message);
              }
            }}
          >
            Excel ダウンロード
          </button>
        </div>
      )}

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

            <div className="text-center text-gray-500 text-sm">
              構造化日誌の実装を準備中...
            </div>
          </div>
        )}

        {/* PDF Preview Modal */}
        {selectedUserId && selectedUser && (
          <PdfPreviewModal
            open={pdfPreviewOpen}
            onClose={() => setPdfPreviewOpen(false)}
            dailyLog={generateDailyLog()}
            user={selectedUser}
            recordDate={today}
          />
        )}
      </div>
    </div>
  );
};

export default StructuredDailyLogPage;
