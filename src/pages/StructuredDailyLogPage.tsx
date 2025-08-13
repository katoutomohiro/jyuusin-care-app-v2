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
import { USERS } from '../constants';

interface TodayEventCounts {
  [key: string]: number;
}

const StructuredDailyLogPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeEventType, setActiveEventType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [todayEventCounts, setTodayEventCounts] = useState<TodayEventCounts>({});

  // 今日の日付を取得
  const today = new Date().toISOString().split('T')[0];

  // 今日の記録数を取得
  useEffect(() => {
    const loadTodayEventCounts = () => {
      const counts: TodayEventCounts = {};
      const eventTypes = ['seizure', 'expression', 'vital', 'meal', 'excretion', 'sleep', 'activity', 'care'];
      
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
    setIsSubmitting(true);
    try {
      // データ保存処理
      const eventKey = `${activeEventType}_records_${today}`;
      const existingRecords = JSON.parse(localStorage.getItem(eventKey) || '[]');
      
      const newRecord = {
        id: Date.now().toString(),
        userId: selectedUserId,
        timestamp: new Date().toISOString(),
        data: eventData,
        type: activeEventType
      };
      
      existingRecords.push(newRecord);
      localStorage.setItem(eventKey, JSON.stringify(existingRecords));
      
      // 今日の記録数を更新
      setTodayEventCounts(prev => ({
        ...prev,
        [activeEventType!]: existingRecords.length
      }));
      
      setActiveEventType(null);
      alert('記録を保存しました');
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました');
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
      icon: '💊',
      description: '吸引・胃ろう・投薬'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
            {USERS.map((user) => (
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
                    {USERS.find(u => u.id === selectedUserId)?.name}
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
                <VitalSignsInput />
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StructuredDailyLogPage;
