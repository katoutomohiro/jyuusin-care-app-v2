import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SeizureForm from '../components/forms/SeizureForm';
import ExpressionForm from '../components/forms/ExpressionForm';
import VitalSignsInput from '../components/forms/VitalSignsInput';
import IntakeInput from '../components/forms/IntakeInput';
import ExcretionInput from '../components/forms/ExcretionInput';
import SleepInput from '../components/forms/SleepInput';
import ActivityInput from '../components/forms/ActivityInput';
import CareInput from '../components/forms/CareInput';
import MedicationInput from '../components/forms/MedicationInput';
import OtherInput from '../components/forms/OtherInput';
import { useData } from '../contexts/DataContext';
import { useAdmin } from '../contexts/AdminContext';

interface TodayEventCounts {
  [key: string]: number;
}

const StructuredDailyLogPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, addDailyLog } = useData();
  const { isAdminMode, isAuthenticated, autoSaveEnabled } = useAdmin();
  const [activeEventType, setActiveEventType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [todayEventCounts, setTodayEventCounts] = useState<TodayEventCounts>({});
  const [showAdminWarning, setShowAdminWarning] = useState(false);

  // 今日の日付を取得
  const today = new Date().toISOString().split('T')[0];

  // 今日の記録数を取得
  useEffect(() => {
    const loadTodayEventCounts = () => {
      const counts: TodayEventCounts = {};
      const eventTypes = [
        'seizure', 'expression', 'vital', 'meal', 'excretion', 
        'sleep', 'activity', 'care', 'medication', 'other'
      ];
      
      eventTypes.forEach(eventType => {
        const key = `${eventType}_records_${today}`;
        const records = JSON.parse(localStorage.getItem(key) || '[]');
        counts[eventType] = records.length;
      });
      
      setTodayEventCounts(counts);
    };

    loadTodayEventCounts();
  }, [today]);

  const handleSaveEvent = async (eventData: any) => {
    // 管理者権限チェック
    if (isAdminMode && !isAuthenticated) {
      setShowAdminWarning(true);
      setTimeout(() => setShowAdminWarning(false), 5000);
      return;
    }

    setIsSubmitting(true);
    try {
      // データ保存処理
      const eventKey = `${activeEventType}_records_${today}`;
      const existingRecords = JSON.parse(localStorage.getItem(eventKey) || '[]');
      
      const newRecord = {
        id: Date.now().toString(),
        user_id: selectedUserId,
        event_type: activeEventType,
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        data: eventData,
        type: activeEventType,
        staff_name: '記録者', // TODO: 実際のスタッフ名を取得
        notes: eventData.notes || '',
        admin_created: isAdminMode && isAuthenticated,
        auto_saved: autoSaveEnabled
      };
      
      existingRecords.push(newRecord);
      
      // 自動保存設定に応じて保存
      if (autoSaveEnabled) {
        localStorage.setItem(eventKey, JSON.stringify(existingRecords));
        console.log(`💾 自動保存: ${activeEventType} 記録が保存されました`);
      } else {
        console.log(`📝 記録作成: ${activeEventType} 記録（手動保存モード）`);
      }
      
      // DataContextにも記録を追加
      try {
        await addDailyLog({
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
            details: eventData.notes || ''
          }]
        });
      } catch (contextError) {
        console.warn('DataContext保存エラー:', contextError);
        // localStorageに保存済みなので続行
      }
      
      // 今日の記録数を更新
      setTodayEventCounts(prev => ({
        ...prev,
        [activeEventType!]: existingRecords.length
      }));
      
      setActiveEventType(null);
      
      // 成功メッセージ
      const eventTypeName = eventTypes.find(t => t.id === activeEventType)?.name || '記録';
      alert(`✅ ${eventTypeName}を保存しました\n時刻: ${new Date(newRecord.timestamp).toLocaleString('ja-JP')}`);
      
    } catch (error) {
      console.error('保存エラー:', error);
      alert(`❌ 保存に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventTypes = [
    { 
      id: 'seizure', 
      name: '発作記録', 
      color: 'bg-red-500',
      icon: '⚡',
      description: 'てんかん発作の記録'
    },
    { 
      id: 'expression', 
      name: '表情・反応', 
      color: 'bg-blue-500',
      icon: '😊',
      description: '表情や反応の記録'
    },
    { 
      id: 'vital', 
      name: 'バイタルサイン', 
      color: 'bg-green-500',
      icon: '💓',
      description: '体温・血圧・脈拍'
    },
    { 
      id: 'meal', 
      name: '食事・水分', 
      color: 'bg-yellow-500',
      icon: '🍽️',
      description: '食事と水分摂取'
    },
    { 
      id: 'excretion', 
      name: '排泄', 
      color: 'bg-purple-500',
      icon: '🚽',
      description: '尿・便の記録'
    },
    { 
      id: 'sleep', 
      name: '睡眠', 
      color: 'bg-indigo-500',
      icon: '😴',
      description: '睡眠時間・質'
    },
    { 
      id: 'activity', 
      name: '活動・リハビリ', 
      color: 'bg-orange-500',
      icon: '🏃',
      description: 'リハビリ・レクリエーション'
    },
    { 
      id: 'care', 
      name: '医療的ケア', 
      color: 'bg-pink-500',
      icon: '🏥',
      description: '吸引・酸素・人工呼吸器'
    },
    { 
      id: 'medication', 
      name: '薬剤投与', 
      color: 'bg-cyan-500',
      icon: '💊',
      description: '抗てんかん薬・内服薬'
    },
    { 
      id: 'other', 
      name: 'その他記録', 
      color: 'bg-gray-500',
      icon: '📝',
      description: '行動・家族・事故記録'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 管理者状態情報バー */}
      {(isAdminMode || !autoSaveEnabled || showAdminWarning) && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
          <div className="max-w-md mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                {isAdminMode && (
                  <div className={`flex items-center ${isAuthenticated ? 'text-green-700' : 'text-red-700'}`}>
                    <span className="mr-1">👑</span>
                    <span className="font-medium">
                      管理者モード: {isAuthenticated ? '認証済み' : '未認証'}
                    </span>
                  </div>
                )}
                <div className={`flex items-center ${autoSaveEnabled ? 'text-green-700' : 'text-orange-700'}`}>
                  <span className="mr-1">💾</span>
                  <span className="font-medium">
                    自動保存: {autoSaveEnabled ? '有効' : '無効'}
                  </span>
                </div>
              </div>
            </div>
            {showAdminWarning && (
              <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-800 text-sm">
                ⚠️ 管理者モードが有効ですが認証されていません。設定画面で認証を行ってください。
              </div>
            )}
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/users')}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              戻る
            </button>
            <h1 className="text-lg font-bold text-gray-800">
              きらめき記録
            </h1>
            <div className="w-12"></div>
          </div>
        </div>
      </div>

      {/* 利用者選択 */}
      {!selectedUserId && (
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">利用者を選択してください</h2>
          <div className="space-y-2">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.age}歳 {user.gender}</div>
                </div>
                <div className="text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      {selectedUserId && (
        <div className="max-w-md mx-auto">
          {!activeEventType ? (
            /* イベント種別選択画面 */
            <div className="p-4">
              <div className="flex items-center mb-4">
                <button
                  onClick={() => setSelectedUserId('')}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  戻る
                </button>
                <div className="flex-1 text-center">
                  <h2 className="text-lg font-bold text-gray-800">
                    {users.find(u => u.id === selectedUserId)?.name}
                  </h2>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">今日の記録サマリー</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">
                      {Object.values(todayEventCounts).reduce((total, count) => total + count, 0)}
                    </span>
                    件の記録
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {Object.entries(todayEventCounts).map(([type, count]) => (
                      <span key={type} className="mr-3">
                        {eventTypes.find(t => t.id === type)?.name}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-6">
                記録する項目を選択してください
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {eventTypes.map((eventType) => (
                  <button
                    key={eventType.id}
                    onClick={() => setActiveEventType(eventType.id)}
                    className={`${eventType.color} text-white p-4 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow relative`}
                  >
                    <div className="text-2xl mb-2">{eventType.icon}</div>
                    <div className="text-sm font-semibold">{eventType.name}</div>
                    <div className="text-xs opacity-80 mt-1">{eventType.description}</div>
                    {todayEventCounts[eventType.id] > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {todayEventCounts[eventType.id]}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* フォーム表示 */
            <div className="p-4">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setActiveEventType(null)}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  戻る
                </button>
                <div className="flex-1 text-center">
                  <h2 className="text-lg font-bold text-gray-800">
                    {eventTypes.find(t => t.id === activeEventType)?.name}
                  </h2>
                </div>
              </div>

              {/* フォーム表示 */}
              {activeEventType === 'seizure' && (
                <SeizureForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />
              )}
              {activeEventType === 'expression' && (
                <ExpressionForm onSave={handleSaveEvent} isSubmitting={isSubmitting} />
              )}
              {activeEventType === 'vital' && (
                <VitalSignsInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
              )}
              {activeEventType === 'meal' && (
                <IntakeInput onSave={handleSaveEvent} isSubmitting={isSubmitting} />
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
          )}
        </div>
      )}
    </div>
  );
};

export default StructuredDailyLogPage;
