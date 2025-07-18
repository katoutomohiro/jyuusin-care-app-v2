import React, { useState, useEffect } from 'react';
import { LaurelCrownIcon, SunCloudIcon, SproutIcon } from '../components/icons';
import { Line } from 'react-chartjs-2';
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