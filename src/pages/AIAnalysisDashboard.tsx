import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { AnalysisResult, AnalysisPeriod, DisabilityAnalysisAI } from '../../services/DisabilityAnalysisAI';
import AIAnalysisDisplay from '../components/AIAnalysisDisplay';
import { User } from '../types';

const AIAnalysisDashboard: React.FC = () => {
  const { users } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState<AnalysisPeriod>('1month');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  // 全利用者の分析を実行
  const runBatchAnalysis = async () => {
    setIsLoading(true);
    const results: AnalysisResult[] = [];

    try {
      for (const user of users) {
        const result = await DisabilityAnalysisAI.analyzeUserRecords(user, selectedPeriod);
        results.push(result);
      }
      setAnalysisResults(results);
    } catch (error) {
      console.error('Batch analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      runBatchAnalysis();
    }
  }, [selectedPeriod, users]);

  const getPeriodLabel = (period: AnalysisPeriod) => {
    switch (period) {
      case '1month': return '1ヶ月';
      case '6months': return '6ヶ月';
      case '1year': return '1年';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'improving': case 'excellent': case 'good': case 'stable': case 'high':
        return 'text-green-700 bg-green-100';
      case 'concerning': case 'worsening': case 'low': case 'declining':
        return 'text-red-700 bg-red-100';
      case 'medium': case 'moderate': case 'fair':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const handleUserClick = (userId: string) => {
    setSelectedUser(userId);
    setShowDetailedAnalysis(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* ヘッダー */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            🤖 AI分析ダッシュボード
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            重症心身障害児者専門AI分析システム - 全利用者統合分析
          </p>
        </div>

        {/* 期間選択 */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">分析期間選択</h2>
            <div className="flex flex-wrap gap-2">
              {(['1month', '6months', '1year'] as AnalysisPeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedPeriod === period
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getPeriodLabel(period)}間
                </button>
              ))}
              <button
                onClick={runBatchAnalysis}
                disabled={isLoading}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {isLoading ? '🔄 分析中...' : '🔄 再分析'}
              </button>
            </div>
          </div>
        </div>

        {/* ローディング */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin text-6xl mb-4">🤖</div>
            <p className="text-gray-600 text-lg">全利用者のAI分析を実行中...</p>
            <p className="text-gray-500 text-sm mt-2">しばらくお待ちください</p>
          </div>
        )}

        {/* 分析結果グリッド */}
        {!isLoading && analysisResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysisResults.map((result) => (
              <div
                key={result.userId}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-purple-500"
                onClick={() => handleUserClick(result.userId)}
              >
                {/* ユーザー情報 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-lg">
                        {result.userName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{result.userName}</h3>
                      <p className="text-sm text-gray-500">詳細分析をクリック</p>
                    </div>
                  </div>
                  <div className="text-2xl">📊</div>
                </div>

                {/* 基本統計 */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">{result.totalRecords}</div>
                    <div className="text-xs text-gray-600">総記録数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">{result.recordsPerDay}</div>
                    <div className="text-xs text-gray-600">1日平均</div>
                  </div>
                </div>

                {/* 健康状態 */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">健康状態</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(result.overallAssessment.healthStatus)}`}>
                      {result.overallAssessment.healthStatus === 'stable' ? '安定' :
                       result.overallAssessment.healthStatus === 'improving' ? '改善' : '要注意'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">生活の質</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(result.overallAssessment.qualityOfLife)}`}>
                      {result.overallAssessment.qualityOfLife === 'high' ? '高い' :
                       result.overallAssessment.qualityOfLife === 'medium' ? '普通' : '低い'}
                    </span>
                  </div>
                </div>

                {/* 緊急対応事項 */}
                {result.overallAssessment.urgentConcerns.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center mb-1">
                      <span className="text-red-600 text-sm font-semibold">🚨 緊急対応必要</span>
                    </div>
                    <div className="text-red-700 text-xs">
                      {result.overallAssessment.urgentConcerns.length}件の重要事項
                    </div>
                  </div>
                )}

                {/* 主要指標 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">発作頻度:</span>
                    <span className="font-medium">{result.seizureAnalysis.frequency}回</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ポジティブ反応:</span>
                    <span className="font-medium">{result.expressionAnalysis.positiveRatio}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">睡眠スコア:</span>
                    <span className="font-medium">{result.sleepAnalysis.qualityScore}/100</span>
                  </div>
                </div>

                {/* クリック促進 */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-center text-purple-600 hover:text-purple-800 transition-colors">
                    <span className="text-sm font-medium">詳細分析を表示</span>
                    <span className="ml-2">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 統計サマリー */}
        {!isLoading && analysisResults.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📈 施設全体の統計</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analysisResults.reduce((sum, result) => sum + result.totalRecords, 0)}
                </div>
                <div className="text-sm text-gray-600">総記録数</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analysisResults.filter(r => r.overallAssessment.healthStatus === 'stable' || r.overallAssessment.healthStatus === 'improving').length}
                </div>
                <div className="text-sm text-gray-600">安定・改善中</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {analysisResults.reduce((sum, result) => sum + result.overallAssessment.urgentConcerns.length, 0)}
                </div>
                <div className="text-sm text-gray-600">緊急対応事項</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(analysisResults.reduce((sum, result) => sum + result.expressionAnalysis.positiveRatio, 0) / analysisResults.length)}%
                </div>
                <div className="text-sm text-gray-600">平均ポジティブ反応</div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 詳細分析モーダル */}
      {showDetailedAnalysis && selectedUser && (
        <AIAnalysisDisplay
          user={users.find(u => u.id === selectedUser)!}
          isVisible={showDetailedAnalysis}
          onClose={() => {
            setShowDetailedAnalysis(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default AIAnalysisDashboard;
