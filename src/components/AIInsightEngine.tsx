import React, { useState, useEffect } from 'react';
import { AIPredictionService } from "../services/AIPredictionService";
import { AIAnomalyDetectionService } from "../services/AIAnomalyDetectionService";
import AICharts from './AICharts';
import { DailyLog, User } from '../types';

interface AIInsightData {
  predictions: {
    seizure: any;
    health: any;
    medication: any;
  };
  anomalies: any[];
  positiveChanges: any[];
  trends: any;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface AIInsightEngineProps {
  user: User;
  dailyLogs: DailyLog[];
  onInsightUpdate?: (insights: AIInsightData) => void;
}

const AIInsightEngine: React.FC<AIInsightEngineProps> = ({ 
  user, 
  dailyLogs, 
  onInsightUpdate 
}) => {
  const [insights, setInsights] = useState<AIInsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const generateInsights = async () => {
      try {
        setLoading(true);
        setError(null);

        // AI予測サービスのインスタンス取得
        const predictionService = AIPredictionService.getInstance();

        // 発作予測
        const seizurePrediction = await predictionService.predictSeizureRisk(user, dailyLogs);

        // 健康状態予測
        const healthPrediction = await predictionService.predictHealthDecline(user, dailyLogs);

        // 異常検知
        const anomalies = await AIAnomalyDetectionService.detectAnomalies(dailyLogs);
        const positiveChanges = AIAnomalyDetectionService.detectPositiveChanges(dailyLogs);

        // 健康トレンド分析
        const healthTrend = await predictionService.predictHealthDecline(user, dailyLogs);

        // 総合的な推奨事項の生成
        const recommendations = generateRecommendations(
          seizurePrediction,
          healthPrediction,
          anomalies,
          healthTrend
        );

        // リスクレベルの判定
        const riskLevel = calculateOverallRisk(
          seizurePrediction,
          healthPrediction,
          anomalies
        );

        const insightData: AIInsightData = {
          predictions: {
            seizure: seizurePrediction,
            health: healthPrediction,
            medication: null // 必要に応じて実装
          },
          anomalies,
          positiveChanges,
          trends: healthTrend,
          recommendations,
          riskLevel
        };

        setInsights(insightData);
        setLastUpdate(new Date());
        
        if (onInsightUpdate) {
          onInsightUpdate(insightData);
        }

      } catch (err) {
        setError('AI分析中にエラーが発生しました');
        console.error('AI Insight Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && dailyLogs.length > 0) {
      generateInsights();
    }
  }, [user, dailyLogs, onInsightUpdate]);

  const generateRecommendations = (
    seizurePrediction: any,
    healthPrediction: any,
    anomalies: any[],
    healthTrend: any
  ): string[] => {
    const recommendations: string[] = [];

    // 発作予測に基づく推奨事項
    if (seizurePrediction.riskLevel === 'high' || seizurePrediction.riskLevel === 'critical') {
      recommendations.push('発作リスクが高いため、24時間体制での観察を強化してください');
      recommendations.push('環境要因（温度、湿度、ストレス）の管理を徹底してください');
    }

    // 健康状態に基づく推奨事項
    if (healthPrediction.riskLevel === 'high' || healthPrediction.riskLevel === 'critical') {
      recommendations.push('健康状態の悪化が予測されます。医師への相談を推奨します');
    }

    // 異常検知に基づく推奨事項
    anomalies.forEach(anomaly => {
      if (anomaly.type === 'vital') {
        recommendations.push('バイタルサインに異常が検出されました。詳細な観察が必要です');
      } else if (anomaly.type === 'seizure') {
        recommendations.push('発作パターンに変化が検出されました。記録の詳細化を推奨します');
      }
    });

    // トレンドに基づく推奨事項
    if (healthTrend.trend === 'declining') {
      recommendations.push('全体的な健康状態が悪化傾向です。ケアプランの見直しを検討してください');
    } else if (healthTrend.trend === 'improving') {
      recommendations.push('健康状態が改善傾向です。現在のケアを継続してください');
    }

    return recommendations.slice(0, 5); // 最大5件まで
  };

  const calculateOverallRisk = (
    seizurePrediction: any,
    healthPrediction: any,
    anomalies: any[]
  ): 'low' | 'medium' | 'high' | 'critical' => {
    let riskScore = 0;

    // 発作リスクスコア
    const seizureRiskMap = { low: 1, medium: 2, high: 3, critical: 4 };
    riskScore += seizureRiskMap[seizurePrediction.riskLevel] || 1;

    // 健康リスクスコア
    const healthRiskMap = { low: 1, medium: 2, high: 3, critical: 4 };
    riskScore += healthRiskMap[healthPrediction.riskLevel] || 1;

    // 異常検知スコア
    riskScore += anomalies.length * 0.5;

    if (riskScore >= 6) return 'critical';
    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-300';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return '✅';
      default: return 'ℹ️';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg text-gray-600">AI分析中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-red-600 font-bold">{error}</div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4 flex items-center gap-4">
        <span className={`text-2xl ${getRiskLevelColor(insights.riskLevel)} px-3 py-1 rounded border font-bold`}>{getRiskLevelIcon(insights.riskLevel)} リスクレベル: {insights.riskLevel.toUpperCase()}</span>
        <span className="text-gray-500 text-sm">最終更新: {lastUpdate.toLocaleString()}</span>
      </div>

      {/* 推奨事項・要因の詳細化 */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">AI推奨事項（根拠付き）</h3>
        <ul className="list-disc pl-6 space-y-1">
          {insights.recommendations.map((rec, idx) => (
            <li key={idx} className="text-gray-800">
              <span className="font-semibold">{rec}</span>
              {/* 根拠データ例: 発作・健康リスク要因 */}
              {idx === 0 && insights.predictions.seizure && (
                <div className="text-xs text-gray-500 mt-1">
                  発作リスク要因: {insights.predictions.seizure.triggers?.join('、') || 'データ不足'}<br/>
                  予防策: {insights.predictions.seizure.preventiveMeasures?.join('、') || 'なし'}
                </div>
              )}
              {idx === 1 && insights.predictions.health && (
                <div className="text-xs text-gray-500 mt-1">
                  健康リスク要因: {insights.predictions.health.factors?.join('、') || 'データ不足'}<br/>
                  推奨: {insights.predictions.health.recommendations?.join('、') || 'なし'}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 異常検知の詳細表示 */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">AI異常検知・ポジティブ変化</h3>
        <ul className="list-disc pl-6 space-y-1">
          {insights.anomalies.length === 0 && <li className="text-green-600">異常なし</li>}
          {insights.anomalies.map((anomaly, idx) => (
            <li key={idx} className="text-red-600">
              {anomaly.message || anomaly.description || '異常'}
              {anomaly.type && (
                <span className="ml-2 text-xs text-gray-500">({anomaly.type})</span>
              )}
              {anomaly.details && (
                <div className="text-xs text-gray-400 mt-1">詳細: {JSON.stringify(anomaly.details)}</div>
              )}
            </li>
          ))}
          {insights.positiveChanges.map((pos, idx) => (
            <li key={"pos-"+idx} className="text-green-700">
              {pos.message || 'ポジティブ変化'}
              {pos.type && (
                <span className="ml-2 text-xs text-gray-500">({pos.type})</span>
              )}
              {pos.details && (
                <div className="text-xs text-gray-400 mt-1">詳細: {JSON.stringify(pos.details)}</div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* トレンド・グラフ連携（既存AICharts利用） */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">健康トレンド・AIグラフ</h3>
        <AICharts trends={insights.trends} />
      </div>
    </div>
  );
};

export default AIInsightEngine; 