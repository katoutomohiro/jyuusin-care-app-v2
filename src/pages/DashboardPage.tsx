import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LaurelCrownIcon, SunCloudIcon, SproutIcon } from '../components/icons';
import { Line } from 'react-chartjs-2';
import { useData } from '../contexts/DataContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardPage: React.FC = () => {
  const { users } = useData();
  const [todayRecords, setTodayRecords] = useState<Record<string, number>>({});
  const [kiramekiData, setKiramekiData] = useState({
    name: '',
    episode: '',
    smileCount: 0,
    week: '今週'
  });
  const [weatherData, setWeatherData] = useState({
    weather: '',
    emoji: '',
    reason: '',
    positiveTags: [] as string[],
    negativeTags: [] as string[],
    bgColor: 'bg-gray-50',
    color: 'text-gray-600'
  });
  const [weeklyGrowthData, setWeeklyGrowthData] = useState<any[]>([]);

  const growthChartData = {
    labels: ['月', '火', '水', '木', '金', '土', '日'],
    datasets: [
      {
        label: '笑顔の記録',
        data: [5, 10, 15, 20, 25, 30, 35],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true
      }
    ]
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1分ごとに更新

    return () => clearInterval(timer);
  }, []);

  // 今日の記録数を取得
  useEffect(() => {
    const loadTodayRecords = () => {
      const today = new Date().toISOString().split('T')[0];
      const eventTypes = ['seizure', 'expression', 'hydration', 'positioning', 'activity', 'excretion', 'skin_oral_care', 'illness', 'sleep', 'cough_choke', 'tube_feeding', 'medication', 'vitals', 'behavioral', 'communication'];
      const records: Record<string, number> = {};
      
      eventTypes.forEach(eventType => {
        const key = `${eventType}_records_${today}`;
        const eventRecords = JSON.parse(localStorage.getItem(key) || '[]');
        records[eventType] = eventRecords.length;
      });
      
      setTodayRecords(records);
    };

    loadTodayRecords();
    // 30秒ごとに更新（リアルタイム性を向上）
    const interval = setInterval(loadTodayRecords, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // 実際のデータを読み込む
  useEffect(() => {
    const loadRealData = () => {
      const today = new Date().toISOString().split('T')[0];
      
      // きらめき大賞のデータを計算
      let bestUser = { name: '記録なし', episode: '今日はまだ記録がありません', smileCount: 0 };
      let maxSmiles = 0;
      
      users.forEach(user => {
        const expressionRecords = JSON.parse(localStorage.getItem(`expression_records_${today}`) || '[]');
        const userExpressions = expressionRecords.filter((record: any) => record.user_id === user.id);
        const smileCount = userExpressions.filter((record: any) => 
          record.expression_type === 'smile' || record.expression_type === 'happy'
        ).length;
        
        if (smileCount > maxSmiles) {
          maxSmiles = smileCount;
          bestUser = {
            name: user.name,
            episode: userExpressions.length > 0 ? 
              userExpressions[userExpressions.length - 1].notes || '素敵な笑顔を見せてくれました' :
              '今日の記録はまだありません',
            smileCount: smileCount
          };
        }
      });
      
      setKiramekiData({...bestUser, week: '今週'});

      // 心の天気予報データを計算
      const allExpressions = JSON.parse(localStorage.getItem(`expression_records_${today}`) || '[]');
      const positiveExpressions = allExpressions.filter((record: any) => 
        ['smile', 'happy', 'calm', 'interested'].includes(record.expression_type)
      );
      const negativeExpressions = allExpressions.filter((record: any) => 
        ['sad', 'angry', 'anxious', 'distressed'].includes(record.expression_type)
      );

      const totalExpressions = allExpressions.length;
      const positiveRatio = totalExpressions > 0 ? positiveExpressions.length / totalExpressions : 0;

      let weather;
      if (positiveRatio >= 0.8) {
        weather = {
          weather: 'ぽかぽか陽だまり☀️',
          emoji: '☀️',
          reason: '今日はとても良い表情が多く記録されています',
          positiveTags: ['笑顔', 'リラックス', '穏やか'],
          negativeTags: [],
          bgColor: 'bg-yellow-50',
          color: 'text-yellow-600'
        };
      } else if (positiveRatio >= 0.6) {
        weather = {
          weather: '春風そよそよ🌤️',
          emoji: '🌤️',
          reason: '良い表情が多めに記録されています',
          positiveTags: ['笑顔', '穏やか'],
          negativeTags: ['少し不安'],
          bgColor: 'bg-blue-50',
          color: 'text-blue-600'
        };
      } else if (positiveRatio >= 0.4) {
        weather = {
          weather: '曇り空☁️',
          emoji: '☁️',
          reason: '表情の記録がまちまちです',
          positiveTags: ['穏やか'],
          negativeTags: ['不安', '緊張'],
          bgColor: 'bg-gray-50',
          color: 'text-gray-600'
        };
      } else {
        weather = {
          weather: '雨のち晴れ🌧️',
          emoji: '🌧️',
          reason: 'ケアが必要な表情が多く記録されています',
          positiveTags: [],
          negativeTags: ['不安', '緊張', '不快'],
          bgColor: 'bg-purple-50',
          color: 'text-purple-600'
        };
      }

      if (totalExpressions === 0) {
        weather = {
          weather: '新しい一日🌅',
          emoji: '🌅',
          reason: 'まだ表情の記録がありません',
          positiveTags: [],
          negativeTags: [],
          bgColor: 'bg-gradient-to-r from-orange-50 to-pink-50',
          color: 'text-orange-600'
        };
      }

      setWeatherData(weather);

      // 週間成長データを計算
      const growthStats = [];
      const seizureCount = JSON.parse(localStorage.getItem(`seizure_records_${today}`) || '[]').length;
      const yesterdaySeizures = JSON.parse(localStorage.getItem(`seizure_records_${getYesterday()}`) || '[]').length;
      const seizureChange = yesterdaySeizures > 0 ? 
        Math.round(((seizureCount - yesterdaySeizures) / yesterdaySeizures) * 100) : 0;

      growthStats.push({
        label: '発作の記録',
        value: seizureChange >= 0 ? `+${seizureChange}%` : `${seizureChange}%`,
        trend: seizureChange <= 0 ? 'down' : 'up',
        description: `昨日比で${Math.abs(seizureChange)}%${seizureChange <= 0 ? '減少' : '増加'}`,
        icon: seizureChange <= 0 ? '💪' : '⚠️'
      });

      const smileCount = positiveExpressions.length;
      const yesterdaySmiles = JSON.parse(localStorage.getItem(`expression_records_${getYesterday()}`) || '[]')
        .filter((record: any) => ['smile', 'happy'].includes(record.expression_type)).length;
      const smileChange = yesterdaySmiles > 0 ? 
        Math.round(((smileCount - yesterdaySmiles) / yesterdaySmiles) * 100) : (smileCount > 0 ? 100 : 0);

      growthStats.push({
        label: '笑顔の記録',
        value: smileChange >= 0 ? `+${smileChange}%` : `${smileChange}%`,
        trend: smileChange >= 0 ? 'up' : 'down',
        description: `昨日比で${Math.abs(smileChange)}%${smileChange >= 0 ? '増加' : '減少'}`,
        icon: '😊'
      });

      const activityCount = JSON.parse(localStorage.getItem(`activity_records_${today}`) || '[]').length;
      const yesterdayActivities = JSON.parse(localStorage.getItem(`activity_records_${getYesterday()}`) || '[]').length;
      const activityChange = yesterdayActivities > 0 ? 
        Math.round(((activityCount - yesterdayActivities) / yesterdayActivities) * 100) : (activityCount > 0 ? 100 : 0);

      growthStats.push({
        label: '活動の記録',
        value: activityChange >= 0 ? `+${activityChange}%` : `${activityChange}%`,
        trend: activityChange >= 0 ? 'up' : 'down',
        description: `昨日比で${Math.abs(activityChange)}%${activityChange >= 0 ? '増加' : '減少'}`,
        icon: '🎯'
      });

      setWeeklyGrowthData(growthStats);
    };

    const getYesterday = () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    };

    loadRealData();
    // 5分ごとに更新
    const interval = setInterval(loadRealData, 300000);
    
    return () => clearInterval(interval);
  }, [users]);

  // 天気の判定ロジック
  const getWeatherInfo = () => {
    return weatherData;
  };

  const weatherInfo = getWeatherInfo();

  return (
    <div className="min-h-screen bg-[#FAFAF5] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          ダッシュボード <span className="text-sm text-gray-400 font-normal">(魂の物語)</span>
        </h1>
        
        <div className="grid gap-6 mt-8">
          {/* 日誌入力クイックアクセス */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                ✨ きらめき記録 <span className="text-sm text-gray-500 ml-2">(日誌入力)</span>
              </h2>
              <Link 
                to="/daily-log" 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                📝 記録画面へ
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Array.isArray(users) && users.length > 0) ? (
                users.slice(0, 6).map((user) => (
                  <Link
                    key={user.id}
                    to={`/daily-log`}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 flex items-center space-x-3"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {user.initials || user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.age}歳 {user.gender}</div>
                    </div>
                    <div className="text-blue-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-400 py-8">利用者データがありません</div>
              )}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                💡 利用者を選択して記録を開始できます（発作・表情・バイタル・食事・排泄・睡眠・活動・医療ケア）
              </p>
            </div>
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">📊 今日の記録状況</h3>
              <div className="grid grid-cols-5 gap-2 text-sm">
                <div className="text-center">
                  <div className="font-bold text-red-600">{todayRecords.seizure || 0}</div>
                  <div className="text-gray-600">発作</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-600">{todayRecords.expression || 0}</div>
                  <div className="text-gray-600">表情</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-cyan-600">{todayRecords.hydration || 0}</div>
                  <div className="text-gray-600">水分</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600">{todayRecords.positioning || 0}</div>
                  <div className="text-gray-600">体位</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-orange-600">{todayRecords.activity || 0}</div>
                  <div className="text-gray-600">活動</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-600">{todayRecords.excretion || 0}</div>
                  <div className="text-gray-600">排泄</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-pink-600">{todayRecords.skin_oral_care || 0}</div>
                  <div className="text-gray-600">スキンケア</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-yellow-600">{todayRecords.illness || 0}</div>
                  <div className="text-gray-600">体調</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-indigo-600">{todayRecords.sleep || 0}</div>
                  <div className="text-gray-600">睡眠</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-red-500">{todayRecords.cough_choke || 0}</div>
                  <div className="text-gray-600">咳・むせ</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-teal-600">{todayRecords.tube_feeding || 0}</div>
                  <div className="text-gray-600">栄養</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-rose-600">{todayRecords.medication || 0}</div>
                  <div className="text-gray-600">薬剤</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-emerald-600">{todayRecords.vitals || 0}</div>
                  <div className="text-gray-600">バイタル</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-violet-600">{todayRecords.behavioral || 0}</div>
                  <div className="text-gray-600">行動</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sky-600">{todayRecords.communication || 0}</div>
                  <div className="text-gray-600">その他</div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="text-lg font-bold text-gray-800">
                  合計: {Object.values(todayRecords).reduce((sum, count) => sum + count, 0)}件の記録
                </span>
              </div>
            </div>
          </div>

          {/* きらめき大賞 */}
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-yellow-500 mb-2">🏆 きらめき大賞</h2>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">{kiramekiData.name}</p>
              <p className="italic text-gray-500">「{kiramekiData.episode}」</p>
              <p className="text-sm text-yellow-600">笑顔記録: {kiramekiData.smileCount}回</p>
            </div>
          </div>

          {/* 心の天気予報 */}
          <div className={`bg-white rounded-xl shadow-lg p-6 ${weatherData.bgColor}`}>
            <h2 className="font-bold text-xl text-gray-700 mb-3">🌤️ 心の天気予報</h2>
            <div className="text-center">
              <p className={`text-4xl font-bold ${weatherData.color} mb-2`}>{weatherData.weather}</p>
              <p className="text-sm text-gray-600">{weatherData.reason}</p>
              {weatherData.positiveTags.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-green-600 font-semibold">ポジティブ:</p>
                  <p className="text-xs text-green-500">{weatherData.positiveTags.join(', ')}</p>
                </div>
              )}
              {weatherData.negativeTags.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-red-600 font-semibold">注意が必要:</p>
                  <p className="text-xs text-red-500">{weatherData.negativeTags.join(', ')}</p>
                </div>
              )}
            </div>
          </div>

          {/* 成長の足跡 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-bold text-xl text-gray-700 mb-4">📈 成長の足跡</h2>
            {weeklyGrowthData.length > 0 ? (
              <div className="space-y-4">
                {weeklyGrowthData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-700">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${
                      item.trend === 'up' ? 'text-green-600' : 
                      item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">記録が蓄積されると、成長の変化が表示されます</p>
                {/* <Line data={growthChartData} />  // react@19未対応のため一時コメントアウト */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;