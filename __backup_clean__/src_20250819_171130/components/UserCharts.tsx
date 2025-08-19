import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { DailyLog, User } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UserChartsProps {
  user: User;
  logs: DailyLog[];
}

type Period = '1month' | '3months' | '6months' | '1year';

const UserCharts: React.FC<UserChartsProps> = ({ user, logs }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('1month');

  // 期間に応じたデータフィルタリング
  const getFilteredLogs = () => {
    const now = new Date();
    const monthsBack = {
      '1month': 1,
      '3months': 3,
      '6months': 6,
      '1year': 12
    }[selectedPeriod];

    const startDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
    
    return logs.filter(log => {
      const logDate = new Date(log.record_date);
      return logDate >= startDate && log.userId === user.id;
    });
  };

  // 印刷用のスタイル
  const printStyles = `
    @media print {
      .no-print { display: none !important; }
      .print-charts { 
        page-break-after: always; 
        width: 210mm;
        height: 297mm;
        padding: 15mm;
        margin: 0;
      }
      .chart-grid {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 10mm !important;
      }
      .chart-item {
        height: 120mm !important;
        width: 100% !important;
      }
      .chart-container {
        height: 100mm !important;
        width: 100% !important;
      }
    }
  `;

  // 発作詳細グラフ
  const getSeizureDetailsGraph = () => {
    const filteredLogs = getFilteredLogs();
    const weeks = getWeekLabels();
    
    // 発作データの集計
    const seizureTypes = ['強直間代発作', '欠神発作', 'ミオクロニー発作'];
    const data = {
      labels: weeks,
      datasets: seizureTypes.map((type, index) => ({
        label: type,
        data: weeks.map(() => Math.floor(Math.random() * 5)), // 実際のデータに置き換え
        borderColor: `rgba(${255 - index * 50}, ${100 + index * 30}, ${150 + index * 40}, 1)`,
        backgroundColor: `rgba(${255 - index * 50}, ${100 + index * 30}, ${150 + index * 40}, 0.2)`,
      }))
    };

    return (
      <Line 
        data={data} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: '発作詳細グラフ'
            },
            legend: {
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: '発作回数'
              }
            }
          }
        }} 
      />
    );
  };

  // 活動参加グラフ
  const getActivityParticipationGraph = () => {
    const filteredLogs = getFilteredLogs();
    const weeks = getWeekLabels();
    
    const activities = ['散歩', '音楽療法', '読書', 'リハビリ', '創作活動'];
    const data = {
      labels: weeks,
      datasets: activities.map((activity, index) => ({
        label: activity,
        data: weeks.map(() => Math.floor(Math.random() * 7)), // 週7日中の参加日数
        borderColor: `rgba(${50 + index * 40}, ${200 - index * 20}, ${100 + index * 30}, 1)`,
        backgroundColor: `rgba(${50 + index * 40}, ${200 - index * 20}, ${100 + index * 30}, 0.2)`,
      }))
    };

    return (
      <Bar 
        data={data} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: '活動参加グラフ'
            },
            legend: {
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 7,
              title: {
                display: true,
                text: '参加日数/週'
              }
            }
          }
        }} 
      />
    );
  };

  // 表情グラフ
  const getMoodExpressionGraph = () => {
    const filteredLogs = getFilteredLogs();
    const weeks = getWeekLabels();
    
    const expressions = ['笑顔', '穏やか', 'リラックス', '不安', '疲労'];
    const data = {
      labels: weeks,
      datasets: expressions.map((expression, index) => ({
        label: expression,
        data: weeks.map(() => Math.floor(Math.random() * 10) + 1),
        borderColor: index < 3 ? 
          `rgba(${50 + index * 40}, ${200 - index * 20}, ${100 + index * 30}, 1)` : 
          `rgba(${200 + index * 20}, ${100 - index * 10}, ${50 + index * 15}, 1)`,
        backgroundColor: index < 3 ?
          `rgba(${50 + index * 40}, ${200 - index * 20}, ${100 + index * 30}, 0.2)` :
          `rgba(${200 + index * 20}, ${100 - index * 10}, ${50 + index * 15}, 0.2)`,
      }))
    };

    return (
      <Line 
        data={data} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: '表情グラフ'
            },
            legend: {
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: '記録回数'
              }
            }
          }
        }} 
      />
    );
  };

  // 体調不良グラフ
  const getHealthIssuesGraph = () => {
    const filteredLogs = getFilteredLogs();
    const weeks = getWeekLabels();
    
    const healthIssues = ['発熱', '嘔吐', '下痢', '咳・痰', '発作', '食欲不振'];
    const data = {
      labels: weeks,
      datasets: healthIssues.map((issue, index) => ({
        label: issue,
        data: weeks.map(() => Math.floor(Math.random() * 5)),
        borderColor: `rgba(${220 - index * 20}, ${100 + index * 15}, ${80 + index * 10}, 1)`,
        backgroundColor: `rgba(${220 - index * 20}, ${100 + index * 15}, ${80 + index * 10}, 0.2)`,
      }))
    };

    return (
      <Bar 
        data={data} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: '体調不良グラフ'
            },
            legend: {
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: '発生回数'
              }
            }
          }
        }} 
      />
    );
  };

  // 期間に応じた週ラベルを生成
  const getWeekLabels = () => {
    const weekCounts = {
      '1month': 4,
      '3months': 12,
      '6months': 24,
      '1year': 52
    }[selectedPeriod];

    return Array.from({ length: weekCounts }, (_, i) => `第${i + 1}週`);
  };

  const periodLabels = {
    '1month': '1ヶ月',
    '3months': '3ヶ月',
    '6months': '6ヶ月',
    '1year': '1年'
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <style>{printStyles}</style>
      
      {/* ヘッダーとコントロール */}
      <div className="p-6 border-b no-print">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.name}様の詳細グラフ</h1>
            <p className="text-gray-600 mt-1">期間: {periodLabels[selectedPeriod]}</p>
          </div>
          
          <div className="flex gap-4 items-center">
            {/* 期間選択 */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as Period)}
              className="border border-gray-300 rounded px-3 py-2 bg-white"
            >
              <option value="1month">1ヶ月</option>
              <option value="3months">3ヶ月</option>
              <option value="6months">6ヶ月</option>
              <option value="1year">1年</option>
            </select>
            
            {/* 印刷ボタン */}
            <button
              onClick={() => window.print()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              🖨️ A4印刷
            </button>
          </div>
        </div>
      </div>

      {/* グラフエリア - 2x2配置 */}
      <div className="p-6 print-charts">
        <div className="chart-grid grid grid-cols-2 gap-6">
          <div className="chart-item">
            <h3 className="text-lg font-semibold mb-3 text-center">発作詳細</h3>
            <div className="chart-container h-80">
              {getSeizureDetailsGraph()}
            </div>
          </div>
          
          <div className="chart-item">
            <h3 className="text-lg font-semibold mb-3 text-center">活動参加状況</h3>
            <div className="chart-container h-80">
              {getActivityParticipationGraph()}
            </div>
          </div>
          
          <div className="chart-item">
            <h3 className="text-lg font-semibold mb-3 text-center">表情変化</h3>
            <div className="chart-container h-80">
              {getMoodExpressionGraph()}
            </div>
          </div>
          
          <div className="chart-item">
            <h3 className="text-lg font-semibold mb-3 text-center">体調不良パターン</h3>
            <div className="chart-container h-80">
              {getHealthIssuesGraph()}
            </div>
          </div>
        </div>
        
        {/* 印刷用フッター */}
        <div className="print-only text-center text-sm text-gray-500 mt-6">
          <p>重心ケアアプリ - {user.name}様 {periodLabels[selectedPeriod]}期間レポート</p>
          <p>生成日: {new Date().toLocaleDateString('ja-JP')}</p>
        </div>
      </div>
    </div>
  );
};

export default UserCharts;
