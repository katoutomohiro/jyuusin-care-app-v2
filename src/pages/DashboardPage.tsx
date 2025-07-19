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
  const [data, setData] = useState({
    kirameki: {
      name: '田中太郎',
      episode: '職員と目が合うと、にこっと笑ってくれた',
      smileCount: 15,
      week: '今週'
    },
    kokoroWeather: {
      weather: 'ぽかぽか陽だまり☀️',
      emoji: '☀️',
      reason: '「リラックスした様子」が多く記録されました',
      positiveTags: ['リラックス', '笑顔', '穏やか', '興味関心'],
      negativeTags: ['不快', '緊張'],
      bgColor: 'bg-yellow-50',
      color: 'text-yellow-600'
    },
    growth: [
      { label: '発声・クーイングあり', value: '+20%', trend: 'up', description: '先週比で20%増加', icon: '🎵' },
      { label: '発作の記録', value: '-30%', trend: 'down', description: '先週比で30%減少', icon: '💪' },
      { label: '笑顔の記録', value: '+45%', trend: 'up', description: '先週比で45%増加', icon: '😊' }
    ]
  });

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
      const eventTypes = ['seizure', 'expression', 'vital', 'meal', 'excretion', 'sleep', 'activity', 'care'];
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

  // 天気の判定ロジック
  const getWeatherInfo = () => {
    const positiveCount = data.kokoroWeather.positiveTags.length;
    const negativeCount = data.kokoroWeather.negativeTags.length;
    const ratio = positiveCount / (positiveCount + negativeCount);

    if (ratio >= 0.8) {
      return {
        weather: 'ぽかぽか陽だまり☀️',
        emoji: '☀️',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      };
    } else if (ratio >= 0.6) {
      return {
        weather: '春風そよそよ🌤️',
        emoji: '🌤️',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      };
    } else if (ratio >= 0.4) {
      return {
        weather: '曇り空☁️',
        emoji: '☁️',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50'
      };
    } else {
      return {
        weather: '雨のち晴れ🌧️',
        emoji: '🌧️',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      };
    }
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
              {users.slice(0, 6).map((user) => (
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
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                💡 利用者を選択して記録を開始できます（発作・表情・バイタル・食事・排泄・睡眠・活動・医療ケア）
              </p>
            </div>
            {/* 今日の記録サマリー */}
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">📊 今日の記録状況</h3>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="font-bold text-red-600">{todayRecords.seizure || 0}</div>
                  <div className="text-gray-600">発作</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-600">{todayRecords.expression || 0}</div>
                  <div className="text-gray-600">表情</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600">{todayRecords.vital || 0}</div>
                  <div className="text-gray-600">バイタル</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-yellow-600">{todayRecords.meal || 0}</div>
                  <div className="text-gray-600">食事</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-600">{todayRecords.excretion || 0}</div>
                  <div className="text-gray-600">排泄</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-indigo-600">{todayRecords.sleep || 0}</div>
                  <div className="text-gray-600">睡眠</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-orange-600">{todayRecords.activity || 0}</div>
                  <div className="text-gray-600">活動</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-pink-600">{todayRecords.care || 0}</div>
                  <div className="text-gray-600">医療ケア</div>
                </div>
              </div>
              <div className="mt-2 text-center">
                <span className="text-lg font-bold text-gray-800">
                  合計: {Object.values(todayRecords).reduce((sum, count) => sum + count, 0)}件
                </span>
              </div>
            </div>
          </div>

          {/* きらめき大賞 */}
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-yellow-500 mb-2">きらめき大賞</h2>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">{data.kirameki.name}</p>
              <p className="italic text-gray-500">「{data.kirameki.episode}」</p>
              <p className="text-sm text-yellow-600">笑顔タグ: {data.kirameki.smileCount}回</p>
            </div>
          </div>

          {/* 心の天気予報 */}
          <div className={`bg-white rounded-xl shadow p-6 ${data.kokoroWeather.bgColor}`}>
            <h2 className="font-bold text-lg text-gray-700 mb-1">心の天気予報</h2>
            <div className="text-center">
              <p className={`text-4xl font-bold ${data.kokoroWeather.color}`}>{data.kokoroWeather.weather}</p>
              <p className="text-sm text-gray-500">{data.kokoroWeather.reason}</p>
            </div>
          </div>

          {/* 成長の足跡 */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-lg text-gray-700 mb-1">成長の足跡</h2>
            <Line data={growthChartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;