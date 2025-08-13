import React, { useState, useEffect } from 'react';
import { AnalysisResult, AnalysisPeriod, DisabilityAnalysisAI } from '../../services/DisabilityAnalysisAI';
import { User } from '../types';

interface AIAnalysisDisplayProps {
  user: User;
  isVisible: boolean;
  onClose: () => void;
}

const AIAnalysisDisplay: React.FC<AIAnalysisDisplayProps> = ({ user, isVisible, onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<AnalysisPeriod>('1month');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 分析実行
  const runAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await DisabilityAnalysisAI.analyzeUserRecords(user, selectedPeriod);
      setAnalysisResult(result);
    } catch (err) {
      setError('分析中にエラーが発生しました。');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 期間変更時に自動分析
  useEffect(() => {
    if (isVisible) {
      runAnalysis();
    }
  }, [selectedPeriod, isVisible]);

  if (!isVisible) return null;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b p-4 sm:p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                🤖 AI分析結果 - {user.name}さん
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                重症心身障害児者専門AI分析システム
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
          
          {/* 期間選択 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {(['1month', '6months', '1year'] as AnalysisPeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getPeriodLabel(period)}間
              </button>
            ))}
            <button
              onClick={runAnalysis}
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? '🔄 分析中...' : '🔄 再分析'}
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-4 sm:p-6">
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin text-4xl mb-4">🤖</div>
              <p className="text-gray-600">AI分析を実行中です...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {analysisResult && !isLoading && (
            <div className="space-y-6">
              
              {/* 基本統計 */}
              <div className="bg-blue-50 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-4">📊 基本統計</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analysisResult.totalRecords}</div>
                    <div className="text-sm text-gray-600">総記録数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analysisResult.recordsPerDay}</div>
                    <div className="text-sm text-gray-600">1日平均記録</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{getPeriodLabel(selectedPeriod)}</div>
                    <div className="text-sm text-gray-600">分析期間</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {new Date(analysisResult.analysisDate).toLocaleDateString('ja-JP')}
                    </div>
                    <div className="text-sm text-gray-600">分析日</div>
                  </div>
                </div>
              </div>

              {/* 総合評価 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-bold text-purple-800 mb-4">🌟 総合評価</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="font-semibold text-gray-700">健康状態: </span>
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(analysisResult.overallAssessment.healthStatus)}`}>
                      {analysisResult.overallAssessment.healthStatus === 'stable' ? '安定' :
                       analysisResult.overallAssessment.healthStatus === 'improving' ? '改善' : '要注意'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">生活の質: </span>
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(analysisResult.overallAssessment.qualityOfLife)}`}>
                      {analysisResult.overallAssessment.qualityOfLife === 'high' ? '高い' :
                       analysisResult.overallAssessment.qualityOfLife === 'medium' ? '普通' : '低い'}
                    </span>
                  </div>
                </div>

                {analysisResult.overallAssessment.urgentConcerns.length > 0 && (
                  <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
                    <h4 className="font-semibold text-red-800 mb-2">🚨 緊急対応が必要な事項</h4>
                    <ul className="list-disc list-inside text-red-700 text-sm">
                      {analysisResult.overallAssessment.urgentConcerns.map((concern, index) => (
                        <li key={index}>{concern}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">✅ 成功している領域</h4>
                    <ul className="list-disc list-inside text-green-700 text-sm">
                      {analysisResult.overallAssessment.careSuccessAreas.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">🎯 改善が期待される領域</h4>
                    <ul className="list-disc list-inside text-orange-700 text-sm">
                      {analysisResult.overallAssessment.improvementAreas.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 項目別分析 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 発作分析 */}
                <div className="bg-red-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-red-800 mb-3">⚡ 発作分析</h3>
                  <div className="space-y-2 text-sm">
                    <div>発作頻度: <span className="font-semibold">{analysisResult.seizureAnalysis.frequency}回</span></div>
                    <div>週平均: <span className="font-semibold">{analysisResult.seizureAnalysis.averagePerWeek}回/週</span></div>
                    <div>
                      トレンド: 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(analysisResult.seizureAnalysis.severityTrend)}`}>
                        {analysisResult.seizureAnalysis.severityTrend === 'improving' ? '改善' :
                         analysisResult.seizureAnalysis.severityTrend === 'stable' ? '安定' : '悪化'}
                      </span>
                    </div>
                    <div className="mt-3">
                      <h4 className="font-semibold text-red-700 mb-1">洞察:</h4>
                      <ul className="list-disc list-inside text-xs">
                        {analysisResult.seizureAnalysis.patternInsights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 表情・反応分析 */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">😊 表情・反応分析</h3>
                  <div className="space-y-2 text-sm">
                    <div>ポジティブ反応: <span className="font-semibold">{analysisResult.expressionAnalysis.positiveRatio}%</span></div>
                    <div>
                      コミュニケーション: 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(analysisResult.expressionAnalysis.communicationProgress)}`}>
                        {analysisResult.expressionAnalysis.communicationProgress === 'improving' ? '向上' :
                         analysisResult.expressionAnalysis.communicationProgress === 'stable' ? '安定' : '低下'}
                      </span>
                    </div>
                    <div>
                      関与レベル: 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(analysisResult.expressionAnalysis.engagementLevel)}`}>
                        {analysisResult.expressionAnalysis.engagementLevel === 'high' ? '高い' :
                         analysisResult.expressionAnalysis.engagementLevel === 'medium' ? '普通' : '低い'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 栄養・水分分析 */}
                <div className="bg-orange-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-orange-800 mb-3">🍽️ 栄養・水分分析</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      摂取安定性: 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(analysisResult.nutritionAnalysis.intakeStability)}`}>
                        {analysisResult.nutritionAnalysis.intakeStability === 'improving' ? '改善' :
                         analysisResult.nutritionAnalysis.intakeStability === 'stable' ? '安定' : '低下'}
                      </span>
                    </div>
                    <div>
                      水分状態: 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(analysisResult.nutritionAnalysis.hydrationStatus)}`}>
                        {analysisResult.nutritionAnalysis.hydrationStatus === 'adequate' ? '適切' :
                         analysisResult.nutritionAnalysis.hydrationStatus === 'insufficient' ? '不足' : '要注意'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 睡眠分析 */}
                <div className="bg-indigo-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-indigo-800 mb-3">😴 睡眠分析</h3>
                  <div className="space-y-2 text-sm">
                    <div>睡眠スコア: <span className="font-semibold">{analysisResult.sleepAnalysis.qualityScore}/100</span></div>
                    <div>
                      パターン: 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(analysisResult.sleepAnalysis.patternConsistency)}`}>
                        {analysisResult.sleepAnalysis.patternConsistency === 'consistent' ? '一貫' : '変動'}
                      </span>
                    </div>
                    <div>夜間覚醒: <span className="font-semibold">{analysisResult.sleepAnalysis.nightWakings}回/夜</span></div>
                  </div>
                </div>

              </div>

              {/* 家族向けサマリー */}
              <div className="bg-green-50 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-bold text-green-800 mb-4">👨‍👩‍👧‍👦 家族向けサマリー</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">🌟 ハイライト</h4>
                    <ul className="list-disc list-inside text-green-600 text-sm">
                      {analysisResult.familySummary.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">🎯 次のステップ</h4>
                    <ul className="list-disc list-inside text-green-600 text-sm">
                      {analysisResult.familySummary.nextSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {analysisResult.familySummary.achievements.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-green-700 mb-2">🏆 達成事項</h4>
                    <ul className="list-disc list-inside text-green-600 text-sm">
                      {analysisResult.familySummary.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 推奨事項 */}
              <div className="bg-yellow-50 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-bold text-yellow-800 mb-4">💡 AI推奨事項</h3>
                <ul className="list-disc list-inside text-yellow-700 space-y-1">
                  {analysisResult.overallAssessment.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisDisplay;
import * as React from "react"; const C: React.FC<any> = () => null; export default C;
