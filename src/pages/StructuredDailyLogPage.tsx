import React, { useEffect } from 'react';
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
import ErrorBoundary from '../components/ErrorBoundary';
import InlineEditText from '../components/InlineEditText';
import InlineEditableList from '../components/InlineEditableList';
import { useData } from '../contexts/DataContext';
import { useAdmin } from '../contexts/AdminContext';
import { useConfigurableComponent } from '../../services/DynamicConfigSystem';
import UserCareExcelTemplateExporter from '../components/UserCareExcelTemplateExporter.tsx';

interface TodayEventCounts {
  [key: string]: number;
}

const StructuredDailyLogPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, addDailyLog, updateUser, getFrequentTags } = useData();
  const { isAdminMode, isAuthenticated, autoSaveEnabled } = useAdmin();
  const { eventTypes, systemSettings, facilityName } = useConfigurableComponent('structuredDailyLog');
  const [activeEventType, setActiveEventType] = useLocalStorage<string | null>('activeEventType', null);
  const [isSubmitting, setIsSubmitting] = useLocalStorage<boolean>('isSubmitting', false);
  const [selectedUserId, setSelectedUserId] = useLocalStorage<string>('selectedUserId', '');
  const [todayEventCounts, setTodayEventCounts] = useLocalStorage<TodayEventCounts>('todayEventCounts', {});
  const [showAdminWarning, setShowAdminWarning] = useLocalStorage<boolean>('showAdminWarning', false);
  const [showAIAnalysis, setShowAIAnalysis] = useLocalStorage<boolean>('showAIAnalysis', false);
  const [editableEventTypes, setEditableEventTypes] = useLocalStorage<any[]>('editableEventTypes', eventTypes || []);
  const [showEventEditor, setShowEventEditor] = useLocalStorage<boolean>('showEventEditor', false);
  const [editingEventType, setEditingEventType] = useLocalStorage<string | null>('editingEventType', null);

  // 管理者向け: 全日誌データ表示モーダル
  const [showLogsModal, setShowLogsModal] = React.useState(false);
  const [logsJson, setLogsJson] = React.useState('');
  const handleShowLogs = () => {
    try {
      const logs = localStorage.getItem('daily_logs');
      setLogsJson(logs ? JSON.stringify(JSON.parse(logs), null, 2) : 'データなし');
    } catch (e) {
      setLogsJson('取得エラー');
    }
    setShowLogsModal(true);
  };

  // 今日の日付を取得
  const today = new Date().toISOString().split('T')[0];

  // 動的に読み込まれたイベントタイプを使用（フォールバック付き）
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

  // 今日の記録数を取得
  useEffect(() => {
    const counts: TodayEventCounts = {};
    currentEventTypes.forEach(type => {
      counts[type.id] = 0;
    });

    // 実際の記録がある場合は、localStorageから取得して集計（useLocalStorageで統一）
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
      console.error('今日の記録数の取得でエラー:', error);
    }

    setTodayEventCounts(counts);
  }, [users, today, currentEventTypes]);

  // 管理者権限の警告表示
  useEffect(() => {
    if (!autoSaveEnabled && !isAdminMode) {
      setShowAdminWarning(true);
      const timer = setTimeout(() => setShowAdminWarning(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [autoSaveEnabled, isAdminMode]);

  // 下書き（自動一時保存）機能
  const getDraftKey = () => `draft_${selectedUserId}_${activeEventType}`;

  // フォーム入力内容の自動保存
  const handleDraftChange = (draftData: any) => {
    if (!selectedUserId || !activeEventType) return;
    localStorage.setItem(getDraftKey(), JSON.stringify(draftData));
  };

  // フォーム初期値として下書きを復元
  const getDraftData = () => {
    if (!selectedUserId || !activeEventType) return undefined;
    const raw = localStorage.getItem(getDraftKey());
    if (!raw) return undefined;
    try {
      return JSON.parse(raw);
    } catch {
      return undefined;
    }
  };

  // イベント保存処理
  const handleSaveEvent = async (eventData: any) => {
    if (!selectedUserId) return;

    setIsSubmitting(true);
    try {
      // DailyLog型に合わせてデータを構築
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

      // localStorageにも個別イベントとして保存（既存のシステムとの互換性のため）
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

      // 保存成功時は下書きを削除
      localStorage.removeItem(getDraftKey());

      setActiveEventType(null);

      // 今日の記録数を更新
      setTodayEventCounts({
        ...todayEventCounts,
        [activeEventType!]: (todayEventCounts[activeEventType!] || 0) + 1
      });

      alert('✅ 記録を保存しました');

    } catch (error) {
      console.error('記録の保存でエラー:', error);
      alert('記録の保存中にエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">📋 構造化日誌入力</h1>
          <p className="text-gray-600 text-sm sm:text-base">{facilityName} - 利用者の日常記録を構造化して記録します</p>
        </div>

        {/* 管理モード・自動保存状態表示 */}
        {(isAdminMode || !autoSaveEnabled || showAdminWarning) && (
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6 border-l-4 border-blue-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm space-y-2 sm:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4">
                {isAdminMode && (
                  <div className={`flex items-center ${isAuthenticated ? 'text-green-700' : 'text-red-700'}`}>
                    <span className="font-semibold mr-2">🔒</span>
                    管理者モード: {isAuthenticated ? '認証済み' : '未認証'}
                  </div>
                )}
                <div className={`flex items-center ${autoSaveEnabled ? 'text-green-700' : 'text-orange-700'}`}>
                  <span className="font-semibold mr-2">💾</span>
                  自動保存: {autoSaveEnabled ? '有効' : '無効'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 管理者権限の警告 */}
        {showAdminWarning && (
          <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-orange-500">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-orange-700">
                  自動保存が無効です。記録は手動で保存する必要があります。
                  <button
                    className="ml-2 font-medium underline hover:no-underline"
                    onClick={() => navigate('/users')}
                  >
                    利用者管理で設定
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 利用者選択 */}
        {!selectedUserId && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">📝 記録する利用者を選択</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {users.map((user) => (
                <div key={user.id} className="border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-200">
                  <button
                    onClick={() => setSelectedUserId(user.id)}
                    className="p-4 text-left w-full hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-lg">{user.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-800 text-lg">{user.name}</div>
                        <div className="text-sm text-gray-500">記録を開始</div>
                      </div>
                    </div>
                  </button>
                  
                  {/* AI分析ボタン */}
                  <div className="px-4 pb-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUserId(user.id);
                        setShowAIAnalysis(true);
                      }}
                      className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 text-sm"
                    >
                      🤖 AI分析を表示
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 記録画面 */}
        {selectedUserId && (
          <div className="space-y-4 sm:space-y-6">
            {!activeEventType ? (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
                  <button
                    onClick={() => setSelectedUserId('')}
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm sm:text-base"
                  >
                    <span>←</span>
                    <span>利用者選択に戻る</span>
                  </button>
                </div>

                <div className="text-center mb-4 sm:mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      📝 
                    </h2>
                    {/* ②利用者名をインライン編集可能に */}
                    <InlineEditText
                      value={users.find(u => u.id === selectedUserId)?.name || ''}
                      onSave={(newName) => {
                        const user = users.find(u => u.id === selectedUserId);
                        if (user) {
                          updateUser(user.id, { ...user, name: newName });
                        }
                      }}
                      className="text-xl sm:text-2xl font-bold text-gray-800"
                      placeholder="利用者名"
                      adminOnly={true}
                      showEditIcon={isAdminMode}
                    />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      さんの記録
                    </h2>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full">
                      今日の記録: {Object.values(todayEventCounts).reduce((total, count) => total + count, 0)}件
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap justify-center gap-1 sm:gap-2 text-xs">
                    {Object.entries(todayEventCounts).map(([type, count]) => (
                      <span key={type} className="text-gray-500">
                        {currentEventTypes.find(t => t.id === type)?.name}: {count}
                      </span>
                    ))}
                  </div>
                  
                  {/* AI分析ボタン */}
                  <button
                    onClick={() => setShowAIAnalysis(true)}
                    className="mt-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 px-6 rounded-lg font-medium transition-all duration-200"
                  >
                    🤖 AI分析を表示
                  </button>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">記録する項目を選択してください</h3>
                  <div className="flex gap-2">
                    {/* ③④管理者向け項目編集機能 */}
                    {isAdminMode && (
                      <>
                        <button
                          onClick={() => setShowEventEditor(!showEventEditor)}
                          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded"
                        >
                          {showEventEditor ? '編集完了' : '項目編集'}
                        </button>
                        <button
                          onClick={handleShowLogs}
                          className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded border border-blue-300"
                        >
                          全日誌データ表示
                        </button>
                      </>
                    )}
                  </div>
                </div>
        {/* 管理者向け: 全日誌データ表示モーダル */}
        {showLogsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
              <h2 className="text-lg font-bold mb-2">全利用者・全日誌データ（daily_logs）</h2>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-[60vh] mb-4" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{logsJson}</pre>
              <button
                onClick={() => setShowLogsModal(false)}
                className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
              >閉じる</button>
            </div>
          </div>
        )}

                {/* 管理者向け項目編集パネル */}
                {isAdminMode && showEventEditor && (
                  <div className="mb-6">
                    <InlineEditableList
                      items={editableEventTypes.map(type => ({
                        id: type.id,
                        label: type.name,
                        value: type.icon,
                        type: 'text' as const,
                        required: false
                      }))}
                      onItemsChange={(items) => {
                        const updatedTypes = items.map((item, index) => ({
                          id: item.id,
                          name: item.label,
                          icon: item.value || '📝',
                          color: defaultEventTypes[index % defaultEventTypes.length]?.color || 'bg-gray-500'
                        }));
                        setEditableEventTypes(updatedTypes);
                        // TODO: 設定をローカルストレージに保存
                        localStorage.setItem('customEventTypes', JSON.stringify(updatedTypes));
                      }}
                      title="記録項目管理"
                      adminOnly={true}
                      allowAdd={true}
                      allowDelete={true}
                      allowReorder={true}
                    />
                  </div>
                )}
                
                {/* ▼▼▼ Excel全出力機能 ▼▼▼ */}
                <div className="my-6 flex justify-center">
                  {/* Excelエクスポート時のエラー抑制ラッパー（このページだけでエラー表示） */}
                  <ErrorBoundary excelOnly>
                    <DailyLogExcelExporter />
                  </ErrorBoundary>
                </div>
                {/* ▲▲▲ Excel全出力機能 ▲▲▲ */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {currentEventTypes.map((eventType) => (
                    <div key={eventType.id} className="relative">
                      <button
                        onClick={() => setActiveEventType(eventType.id)}
                        className={`flex flex-col justify-center items-center p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 ${eventType.color} bg-opacity-10 min-h-[80px] sm:min-h-[100px] h-full w-full`}
                      >
                        <div className="text-center w-full">
                          <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{eventType.icon}</div>
                          <div className="font-medium text-gray-800 text-xs sm:text-sm leading-tight">{eventType.name}</div>
                          {todayEventCounts[eventType.id] > 0 && (
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                              {todayEventCounts[eventType.id]}
                            </div>
                          )}
                        </div>
                      </button>
                      {/* ④項目クリックでの詳細編集ボタン（button外に移動） */}
                      {isAdminMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingEventType(eventType.id);
                          }}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow border border-gray-300 hover:bg-gray-100 z-10"
                          title="詳細項目を編集"
                        >
                          ⚙️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                  <button
                    onClick={() => setActiveEventType(null)}
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm sm:text-base"
                  >
                    <span>←</span>
                    <span>項目選択に戻る</span>
                  </button>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    {eventTypes.find(t => t.id === activeEventType)?.name}の記録
                  </h2>
                </div>

                <div className="w-full overflow-x-hidden pb-32">
                  {/* フォームコンポーネント */}
                  {activeEventType === 'seizure' && (
                    <SeizureForm
                      onSave={handleSaveEvent}
                      isSubmitting={isSubmitting}
                      suggestedTags={selectedUserId ? getFrequentTags(selectedUserId, 'seizure', 5) : []}
                    />
                  )}
                  {activeEventType === 'expression' && (
                    <ExpressionForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />
                  )}
                  {activeEventType === 'vital' && (
                    <VitalSignsInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
                  )}
                  {activeEventType === 'meal' && (
                    <HydrationForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />
                  )}
                  {activeEventType === 'excretion' && (
                    <ExcretionInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
                  )}
                  {activeEventType === 'sleep' && (
                    <SleepInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
                  )}
                  {activeEventType === 'activity' && (
                    <ActivityInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
                  )}
                  {activeEventType === 'care' && (
                    <CareInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
                  )}
                  {activeEventType === 'medication' && (
                    <MedicationInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
                  )}
                  {activeEventType === 'other' && (
                    <OtherInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
                  )}
                </div>

                {/* 常時固定の保存ボタン（現場最適UI） */}
                <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center bg-gradient-to-t from-white/90 via-white/80 to-transparent p-4 pointer-events-none">
                  <button
                    type="button"
                    className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-16 rounded-2xl shadow-xl min-w-[220px] min-h-[64px] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    onClick={() => {
                      // 各フォームのonSaveを呼び出すため、フォーム側でhandleSaveEventをprops経由で呼ぶ設計を維持
                      const saveBtn = document.querySelector('[data-save-btn]') as HTMLButtonElement;
                      if (saveBtn) saveBtn.click();
                    }}
                    disabled={isSubmitting}
                    aria-label="記録を保存"
                  >
                    {isSubmitting ? '保存中...' : '💾 記録を保存'}
                  </button>
                </div>
              </div>
            )}
            {/* ▼▼▼ 利用者ごとの帳票型Excel出力ボタン ▼▼▼ */}
            <div className="my-6 flex justify-center">
              <ErrorBoundary excelOnly>
                <UserCareExcelTemplateExporter userId={selectedUserId} />
              </ErrorBoundary>
            </div>
            {/* ▲▲▲ 利用者ごとの帳票型Excel出力ボタン ▲▲▲ */}
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
    </div>
  );
};

export default StructuredDailyLogPage;
