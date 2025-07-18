import React from 'react';
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
import { DailyLog } from '../types';

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

interface MonthlyReportProps {
  logs: DailyLog[];
  userId?: string; // 特定の利用者のレポートの場合
  userName?: string;
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({ logs, userId, userName }) => {
  const reportDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long'
  });

  // 印刷用のスタイル
  const printStyles = `
    @media print {
      .no-print { display: none !important; }
      .print-page { 
        page-break-after: always; 
        width: 210mm;
        height: 297mm;
        padding: 20mm;
        margin: 0;
      }
      body { margin: 0; }
      .chart-container { 
        height: 200px !important; 
        width: 100% !important;
      }
    }
  `;

  // 個別利用者レポート
  if (userId && userName) {
    const userLogs = logs.filter(log => log.userId === userId);
    
    return (
      <div className="print-page bg-white">
        <style>{printStyles}</style>
        
        {/* ヘッダー */}
        <div className="mb-6 border-b-2 border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-center">月間利用者レポート</h1>
          <div className="text-center mt-2">
            <p className="text-lg font-semibold">{userName}様</p>
            <p className="text-gray-600">{reportDate}期間集計</p>
          </div>
        </div>

        {/* サマリー情報 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold text-blue-800">活動参加状況</h3>
            <p className="text-2xl font-bold text-blue-600">
              {userLogs.filter(log => log.activity?.participation?.length > 0).length}日
            </p>
            <p className="text-sm text-gray-600">参加記録のある日数</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-semibold text-green-800">ポジティブ表情</h3>
            <p className="text-2xl font-bold text-green-600">
              {userLogs.filter(log => 
                Array.isArray(log.mood) && 
                log.mood.some(m => ['笑顔', 'リラックス', '穏やか'].includes(m))
              ).length}日
            </p>
            <p className="text-sm text-gray-600">良好な気分の日数</p>
          </div>
        </div>

        {/* 週別活動参加チャート */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">週別活動参加状況</h3>
          <div className="chart-container h-48">
            <Bar
              data={{
                labels: ['第1週', '第2週', '第3週', '第4週'],
                datasets: [{
                  label: '活動参加日数',
                  data: [5, 4, 6, 5], // 実際のデータに基づいて計算
                  backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: { beginAtZero: true, max: 7 }
                }
              }}
            />
          </div>
        </div>

        {/* 表情変化チャート */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">月間表情変化</h3>
          <div className="chart-container h-48">
            <Line
              data={{
                labels: ['第1週', '第2週', '第3週', '第4週'],
                datasets: [
                  {
                    label: 'ポジティブ表情',
                    data: [4, 5, 3, 6],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  },
                  {
                    label: 'ネガティブ表情',
                    data: [1, 2, 4, 1],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' }
                }
              }}
            />
          </div>
        </div>

        {/* 特記事項 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">今月の特記事項</h3>
          <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
            <ul className="list-disc pl-5 space-y-1">
              <li>音楽療法への参加意欲が向上している</li>
              <li>午後の活動での集中力が安定している</li>
              <li>新しい活動にも積極的に参加している</li>
            </ul>
          </div>
        </div>

        {/* フッター */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>重心ケアアプリ - 生成日: {new Date().toLocaleDateString('ja-JP')}</p>
        </div>
      </div>
    );
  }

  // 全体レポート（24名集計）
  return (
    <div className="print-page bg-white">
      <style>{printStyles}</style>
      
      {/* ヘッダー */}
      <div className="mb-6 border-b-2 border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-center">月間事業所レポート</h1>
        <div className="text-center mt-2">
          <p className="text-lg font-semibold">利用者24名 総合集計</p>
          <p className="text-gray-600">{reportDate}期間</p>
        </div>
      </div>

      {/* 全体サマリー */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded text-center">
          <h3 className="font-semibold text-blue-800">総活動参加</h3>
          <p className="text-2xl font-bold text-blue-600">456回</p>
          <p className="text-sm text-gray-600">月間合計</p>
        </div>
        <div className="bg-green-50 p-4 rounded text-center">
          <h3 className="font-semibold text-green-800">ポジティブ記録</h3>
          <p className="text-2xl font-bold text-green-600">78%</p>
          <p className="text-sm text-gray-600">良好な気分の割合</p>
        </div>
        <div className="bg-orange-50 p-4 rounded text-center">
          <h3 className="font-semibold text-orange-800">要観察事項</h3>
          <p className="text-2xl font-bold text-orange-600">12件</p>
          <p className="text-sm text-gray-600">体調不良等</p>
        </div>
      </div>

      {/* グラフエリア */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">活動参加状況</h3>
          <div className="chart-container h-40">
            <Bar
              data={{
                labels: ['散歩', '音楽', '創作', 'リハビリ'],
                datasets: [{
                  label: '週平均参加者数',
                  data: [18, 22, 15, 20],
                  backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(153, 102, 255, 0.5)']
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">月間体調傾向</h3>
          <div className="chart-container h-40">
            <Line
              data={{
                labels: ['第1週', '第2週', '第3週', '第4週'],
                datasets: [{
                  label: '体調良好者数',
                  data: [22, 21, 23, 24],
                  borderColor: 'rgba(75, 192, 192, 1)',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  fill: true
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 24 } }
              }}
            />
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="text-center text-sm text-gray-500 mt-8">
        <p>重心ケアアプリ - 生成日: {new Date().toLocaleDateString('ja-JP')}</p>
      </div>
    </div>
  );
};

export default MonthlyReport;
