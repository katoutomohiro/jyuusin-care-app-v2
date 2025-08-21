import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
// import { BarChart, LineChart, PieChart, TrendingUp, FileText, Download, User, Calendar } from 'lucide-react';

interface ReportData {
  totalRecords: number;
  recordsByType: { [key: string]: number };
  recordsByUser: { [key: string]: number };
  recordsByDay: { [key: string]: number };
  trendAnalysis: {
    seizures: { current: number; trend: 'up' | 'down' | 'stable' };
    positive_expressions: { current: number; trend: 'up' | 'down' | 'stable' };
    activities: { current: number; trend: 'up' | 'down' | 'stable' };
  };
}

const ReportEnginePage: React.FC = () => {
  const { users } = useData();
  const [selectedUserId, setSelectedUserId] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('1week');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const periodOptions = [
    { value: '1day', label: '今日' },
    { value: '1week', label: '1週間' },
    { value: '1month', label: '1ヶ月' },
    { value: '3months', label: '3ヶ月' }
  ];

  const eventTypeLabels = {
    seizure: '発作記録',
    expression: '表情記録',
    hydration: '水分摂取',
    positioning: '体位変換',
    activity: '活動記録',
    excretion: '排泄記録',
    skin_oral_care: 'スキンケア',
    illness: '体調記録',
    sleep: '睡眠記録',
    cough_choke: '咳・むせ',
    tube_feeding: '栄養管理',
    medication: '薬剤投与',
    vitals: 'バイタル',
    behavioral: '行動記録',
    communication: 'その他記録'
  };

  const generateReport = () => {
    setIsGenerating(true);
    
    // 期間の計算
    const endDate = new Date();
    const startDate = new Date();
    
    switch (selectedPeriod) {
      case '1day':
        // 今日のみ
        break;
      case '1week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
    }

    // データ収集
    // 全イベント型を0で初期化
    const initialRecordsByType: { [key: string]: number } = {};
    Object.keys(eventTypeLabels).forEach(eventType => {
      initialRecordsByType[eventType] = 0;
    });
    const reportData: ReportData = {
      totalRecords: 0,
      recordsByType: initialRecordsByType,
      recordsByUser: {},
      recordsByDay: {},
      trendAnalysis: {
        seizures: { current: 0, trend: 'stable' },
        positive_expressions: { current: 0, trend: 'stable' },
        activities: { current: 0, trend: 'stable' }
      }
    };

    // 日付範囲でデータを収集
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      Object.keys(eventTypeLabels).forEach(eventType => {
        const key = `${eventType}_records_${dateStr}`;
        const records = JSON.parse(localStorage.getItem(key) || '[]');
        
        // 対象ユーザーでフィルタリング
        const filteredRecords = selectedUserId === 'all' 
          ? records 
          : records.filter((record: any) => record.user_id === selectedUserId);
        
        reportData.totalRecords += filteredRecords.length;
        reportData.recordsByType[eventType] = (reportData.recordsByType[eventType] || 0) + filteredRecords.length;
        reportData.recordsByDay[dateStr] = (reportData.recordsByDay[dateStr] || 0) + filteredRecords.length;
        
        // ユーザー別集計
        filteredRecords.forEach((record: any) => {
          const userId = record.user_id;
          reportData.recordsByUser[userId] = (reportData.recordsByUser[userId] || 0) + 1;
        });

        // トレンド分析
        if (eventType === 'seizure') {
          reportData.trendAnalysis.seizures.current += filteredRecords.length;
        } else if (eventType === 'expression') {
          const positiveExpressions = filteredRecords.filter((record: any) => 
            ['smile', 'happy', 'calm'].includes(record.data?.expression_type)
          );
          reportData.trendAnalysis.positive_expressions.current += positiveExpressions.length;
        } else if (eventType === 'activity') {
          reportData.trendAnalysis.activities.current += filteredRecords.length;
        }
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // トレンド計算（前期間との比較）
    const prevStartDate = new Date(startDate);
    const prevEndDate = new Date(startDate);
    const periodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    prevStartDate.setDate(prevStartDate.getDate() - periodDays);

    let prevSeizures = 0, prevPositiveExpressions = 0, prevActivities = 0;
    
    const prevDate = new Date(prevStartDate);
    while (prevDate < startDate) {
      const dateStr = prevDate.toISOString().split('T')[0];
      
      const seizureRecords = JSON.parse(localStorage.getItem(`seizure_records_${dateStr}`) || '[]');
      const expressionRecords = JSON.parse(localStorage.getItem(`expression_records_${dateStr}`) || '[]');
      const activityRecords = JSON.parse(localStorage.getItem(`activity_records_${dateStr}`) || '[]');
      
      if (selectedUserId !== 'all') {
        prevSeizures += seizureRecords.filter((r: any) => r.user_id === selectedUserId).length;
        prevPositiveExpressions += expressionRecords.filter((r: any) => 
          r.user_id === selectedUserId && ['smile', 'happy', 'calm'].includes(r.data?.expression_type)
        ).length;
        prevActivities += activityRecords.filter((r: any) => r.user_id === selectedUserId).length;
      } else {
        prevSeizures += seizureRecords.length;
        prevPositiveExpressions += expressionRecords.filter((r: any) => 
          ['smile', 'happy', 'calm'].includes(r.data?.expression_type)
        ).length;
        prevActivities += activityRecords.length;
      }
      
      prevDate.setDate(prevDate.getDate() + 1);
    }

    // トレンド判定
    reportData.trendAnalysis.seizures.trend = 
      reportData.trendAnalysis.seizures.current > prevSeizures ? 'up' :
      reportData.trendAnalysis.seizures.current < prevSeizures ? 'down' : 'stable';
      
    reportData.trendAnalysis.positive_expressions.trend =
      reportData.trendAnalysis.positive_expressions.current > prevPositiveExpressions ? 'up' :
      reportData.trendAnalysis.positive_expressions.current < prevPositiveExpressions ? 'down' : 'stable';
      
    reportData.trendAnalysis.activities.trend =
      reportData.trendAnalysis.activities.current > prevActivities ? 'up' :
      reportData.trendAnalysis.activities.current < prevActivities ? 'down' : 'stable';

    setTimeout(() => {
      setReportData(reportData);
      setIsGenerating(false);
    }, 1500);
  };

  useEffect(() => {
    generateReport();
  }, [selectedUserId, selectedPeriod]);

  const handleExportReport = () => {
    if (!reportData) return;
    
    const reportText = `
多職種連携レポート
===================================

対象期間: ${periodOptions.find(p => p.value === selectedPeriod)?.label}
対象利用者: ${selectedUserId === 'all' ? '全利用者' : users.find(u => u.id === selectedUserId)?.name}
生成日時: ${new Date().toLocaleString('ja-JP')}

総記録数: ${reportData.totalRecords}件

記録種別内訳:
${Object.entries(reportData.recordsByType)
  .filter(([_, count]) => (count as number) > 0)
  .map(([type, count]) => `・${eventTypeLabels[type as keyof typeof eventTypeLabels]}: ${count}件`)
  .join('\n')}

利用者別記録数:
${Object.entries(reportData.recordsByUser)
  .map(([userId, count]) => {
    const user = users.find(u => u.id === userId);
    return `・${user?.name || userId}: ${count}件`;
  })
  .join('\n')}

トレンド分析:
・発作記録: ${reportData.trendAnalysis.seizures.current}件 (${reportData.trendAnalysis.seizures.trend === 'up' ? '↗️増加' : reportData.trendAnalysis.seizures.trend === 'down' ? '↘️減少' : '→安定'})
・ポジティブ表情: ${reportData.trendAnalysis.positive_expressions.current}件 (${reportData.trendAnalysis.positive_expressions.trend === 'up' ? '↗️増加' : reportData.trendAnalysis.positive_expressions.trend === 'down' ? '↘️減少' : '→安定'})
・活動記録: ${reportData.trendAnalysis.activities.current}件 (${reportData.trendAnalysis.activities.trend === 'up' ? '↗️増加' : reportData.trendAnalysis.activities.trend === 'down' ? '↘️減少' : '→安定'})

このレポートは重症心身障害ケアアプリで自動生成されました。
    `;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `多職種連携レポート_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              多職種連携レポート
              <span className="text-sm text-gray-400 font-normal ml-2">(魂の翻訳機)</span>
            </h1>
            <p className="text-gray-600">実際のケア記録から自動生成されるリアルタイムレポート</p>
          </div>
          <button
            onClick={handleExportReport}
            disabled={!reportData || isGenerating}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {/* <Download size={16} /> */}
            <span>レポート出力</span>
          </button>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">📊 レポート設定</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">対象利用者</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">全利用者</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">対象期間</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {periodOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isGenerating ? '生成中...' : '🔄 レポート更新'}
              </button>
            </div>
          </div>
        </div>

        {/* レポート表示 */}
        {isGenerating && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">レポートを生成しています...</p>
          </div>
        )}

        {reportData && !isGenerating && (
          <div className="space-y-6">
            {/* サマリー */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📈 概要</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{reportData.totalRecords}</div>
                  <div className="text-sm text-blue-800">総記録数</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{reportData.trendAnalysis.seizures.current}</div>
                  <div className="text-sm text-red-800">発作記録</div>
                  <div className="text-xs">
                    {reportData.trendAnalysis.seizures.trend === 'up' ? '↗️' : 
                     reportData.trendAnalysis.seizures.trend === 'down' ? '↘️' : '→'}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{reportData.trendAnalysis.positive_expressions.current}</div>
                  <div className="text-sm text-green-800">ポジティブ表情</div>
                  <div className="text-xs">
                    {reportData.trendAnalysis.positive_expressions.trend === 'up' ? '↗️' : 
                     reportData.trendAnalysis.positive_expressions.trend === 'down' ? '↘️' : '→'}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{reportData.trendAnalysis.activities.current}</div>
                  <div className="text-sm text-purple-800">活動記録</div>
                  <div className="text-xs">
                    {reportData.trendAnalysis.activities.trend === 'up' ? '↗️' : 
                     reportData.trendAnalysis.activities.trend === 'down' ? '↘️' : '→'}
                  </div>
                </div>
              </div>
            </div>

            {/* 記録種別グラフ */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📊 記録種別内訳</h2>
              <div className="space-y-2">
                {Object.entries(reportData.recordsByType)
                  .filter(([_, count]) => (count as number) > 0)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .map(([type, count]) => {
                    const percentage = Math.round(((count as number) / reportData.totalRecords) * 100);
                    return (
                      <div key={type} className="flex items-center">
                        <div className="w-32 text-sm text-gray-700">
                          {eventTypeLabels[type as keyof typeof eventTypeLabels]}
                        </div>
                        <div className="flex-1 mx-3">
                          <div className="bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-blue-500 h-3 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-16 text-sm text-gray-600 text-right">
                          {count}件 ({percentage}%)
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* 利用者別記録数 */}
            {Object.keys(reportData.recordsByUser).length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">👥 利用者別記録数</h2>
                <div className="space-y-3">
                  {Object.entries(reportData.recordsByUser)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .map(([userId, count]) => {
                      const user = users.find(u => u.id === userId);
                      const percentage = Math.round(((count as number) / reportData.totalRecords) * 100);
                      return (
                        <div key={userId} className="flex items-center">
                          <div className="w-20">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-sm">
                                {user?.initials || user?.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="w-24 text-sm text-gray-700">
                            {user?.name || userId}
                          </div>
                          <div className="flex-1 mx-3">
                            <div className="bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-green-500 h-3 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-16 text-sm text-gray-600 text-right">
                            {count}件
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 専門用語翻訳 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">🌟 魂の翻訳（専門用語→家族用語）</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="font-semibold text-purple-700">記録の意味</div>
                  <div>✨ ポジティブ表情: 笑顔や穏やかな様子</div>
                  <div>⚠️ 発作記録: てんかん発作やけいれんの記録</div>
                  <div>🎯 活動記録: リハビリや療育活動への参加</div>
                  <div>💧 水分摂取: 脱水防止のための水分管理</div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-pink-700">ケアの視点</div>
                  <div>📈 増加傾向: より積極的にケアを提供</div>
                  <div>📉 減少傾向: 状態が安定または改善</div>
                  <div>→ 安定: 現在のケアを継続</div>
                  <div>🔄 変化なし: 経過観察中</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {reportData && reportData.totalRecords === 0 && !isGenerating && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            {/* <FileText size={48} className="mx-auto text-gray-400 mb-4" /> */}
            <h3 className="text-lg font-semibold text-gray-700 mb-2">記録がありません</h3>
            <p className="text-gray-600">
              選択した期間・利用者の記録がまだありません。<br />
              日誌入力画面で記録を開始してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportEnginePage;