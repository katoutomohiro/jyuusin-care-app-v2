import React, { useState, useEffect, useCallback } from 'react';
import { AIPredictionService } from "../../services/AIPredictionService";
import { AIAnomalyDetectionService } from "../../services/AIAnomalyDetectionService";
import { DailyLog, User } from '../../types';

interface RealTimeAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'positive';
  title: string;
  message: string;
  timestamp: Date;
  severity: number;
  actionRequired: boolean;
}

interface AIRealTimeMonitorProps {
  user: User;
  dailyLogs: DailyLog[];
  onAlert?: (alert: RealTimeAlert) => void;
  monitoringInterval?: number; // ミリ秒
}

const AIRealTimeMonitor: React.FC<AIRealTimeMonitorProps> = ({
  user,
  dailyLogs,
  onAlert,
  monitoringInterval = 300000 // 5分間隔
}) => {
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);
  const [currentStatus, setCurrentStatus] = useState<'normal' | 'warning' | 'critical'>('normal');

  // リアルタイム分析
  const performRealTimeAnalysis = useCallback(async () => {
    try {
      // 最新のログを取得（過去24時間）
      const recentLogs = dailyLogs.filter(log => {
        const logDate = new Date(log.record_date);
        const now = new Date();
        const diffHours = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60);
        return diffHours <= 24;
      });

      if (recentLogs.length === 0) {
        return;
      }

      // 発作予測（静的メソッド使用）
      const seizurePrediction = await AIPredictionService.predictSeizures(user, recentLogs);
      
      // 健康状態予測（静的メソッド使用）
      const healthPrediction = await AIPredictionService.predictHealthDeterioration(user, recentLogs);
      
      // 異常検知
      const anomalies = AIAnomalyDetectionService.detectAnomalies(recentLogs);
      const positiveChanges = AIAnomalyDetectionService.detectPositiveChanges(recentLogs);

      // アラート生成
      const newAlerts: RealTimeAlert[] = [];

      // 発作リスクアラート
      if (seizurePrediction.riskLevel === 'critical') {
        newAlerts.push({
          id: `seizure-${Date.now()}`,
          type: 'critical',
          title: '🚨 発作リスク：緊急',
          message: `発作リスクが極めて高い状態です。発生確率: ${(seizurePrediction.probability * 100).toFixed(1)}%。24時間体制での観察が必要です。`,
          timestamp: new Date(),
          severity: 10,
          actionRequired: true
        });
      } else if (seizurePrediction.riskLevel === 'high') {
        newAlerts.push({
          id: `seizure-${Date.now()}`,
          type: 'warning',
          title: '⚠️ 発作リスク：注意',
          message: `発作リスクが高い状態です。発生確率: ${(seizurePrediction.probability * 100).toFixed(1)}%。観察を強化してください。`,
          timestamp: new Date(),
          severity: 7,
          actionRequired: true
        });
      }

      // 健康リスクアラート
      if (healthPrediction.riskLevel === 'critical') {
        newAlerts.push({
          id: `health-${Date.now()}`,
          type: 'critical',
          title: '🚨 健康リスク：緊急',
          message: `健康状態の悪化が予測されます。医師への相談が急務です。`,
          timestamp: new Date(),
          severity: 10,
          actionRequired: true
        });
      } else if (healthPrediction.riskLevel === 'high') {
        newAlerts.push({
          id: `health-${Date.now()}`,
          type: 'warning',
          title: '⚠️ 健康リスク：注意',
          message: `健康状態に注意が必要です。詳細な観察を推奨します。`,
          timestamp: new Date(),
          severity: 6,
          actionRequired: false
        });
      }

      // 異常検知アラート
      anomalies.forEach((anomaly, index) => {
        if (anomaly.type === 'vital' && anomaly.severity === 'critical') {
          newAlerts.push({
            id: `anomaly-${Date.now()}-${index}`,
            type: 'critical',
            title: '🚨 バイタル異常：緊急',
            message: anomaly.message,
            timestamp: new Date(),
            severity: 9,
            actionRequired: true
          });
        } else if (anomaly.type === 'seizure') {
          newAlerts.push({
            id: `anomaly-${Date.now()}-${index}`,
            type: 'warning',
            title: '⚠️ 発作異常',
            message: anomaly.message,
            timestamp: new Date(),
            severity: 8,
            actionRequired: true
          });
        }
      });

      // ポジティブ変化通知
      positiveChanges.forEach((change, index) => {
        newAlerts.push({
          id: `positive-${Date.now()}-${index}`,
          type: 'positive',
          title: '✨ ポジティブ変化',
          message: change.message,
          timestamp: new Date(),
          severity: 2,
          actionRequired: false
        });
      });

      // 新しいアラートを追加
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 50)); // 最新50件まで保持
        
        // 重要なアラートをコールバックで通知
        newAlerts.forEach(alert => {
          if (alert.actionRequired && onAlert) {
            onAlert(alert);
          }
        });
      }

      // 現在のステータスを更新
      const hasCritical = newAlerts.some(alert => alert.type === 'critical');
      const hasWarning = newAlerts.some(alert => alert.type === 'warning');
      
      if (hasCritical) {
        setCurrentStatus('critical');
      } else if (hasWarning) {
        setCurrentStatus('warning');
      } else {
        setCurrentStatus('normal');
      }

      setLastAnalysis(new Date());

    } catch (error) {
      console.error('Real-time analysis error:', error);
    }
  }, [user, dailyLogs, onAlert]);

  // 監視の開始/停止
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isMonitoring) {
      // 初回分析
      performRealTimeAnalysis();
      
      // 定期的な分析
      intervalId = setInterval(performRealTimeAnalysis, monitoringInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isMonitoring, performRealTimeAnalysis, monitoringInterval]);

  // 監視の開始
  const startMonitoring = () => {
    setIsMonitoring(true);
  };

  // 監視の停止
  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  // アラートの削除
  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // 全アラートのクリア
  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-300';
      case 'warning': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'normal': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'normal': return '✅';
      default: return 'ℹ️';
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-400 text-red-700';
      case 'warning': return 'bg-orange-50 border-orange-400 text-orange-700';
      case 'info': return 'bg-blue-50 border-blue-400 text-blue-700';
      case 'positive': return 'bg-green-50 border-green-400 text-green-700';
      default: return 'bg-gray-50 border-gray-400 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* 監視制御パネル */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="text-2xl mr-2">🔍</span>
            AIリアルタイム監視
          </h3>
          <div className={`px-4 py-2 rounded-full border-2 ${getStatusColor(currentStatus)}`}>
            <span className="text-lg mr-2">{getStatusIcon(currentStatus)}</span>
            <span className="font-semibold">
              {currentStatus === 'critical' ? '緊急状態' :
               currentStatus === 'warning' ? '注意状態' : '正常状態'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-gray-800">監視状態</div>
            <div className={`text-lg font-bold ${
              isMonitoring ? 'text-green-600' : 'text-red-600'
            }`}>
              {isMonitoring ? '監視中' : '停止中'}
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">⏰</div>
            <div className="font-semibold text-gray-800">更新間隔</div>
            <div className="text-lg font-bold text-green-600">
              {monitoringInterval / 60000}分
            </div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">🕐</div>
            <div className="font-semibold text-gray-800">最終分析</div>
            <div className="text-sm text-gray-600">
              {lastAnalysis ? lastAnalysis.toLocaleTimeString('ja-JP') : '未実行'}
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={startMonitoring}
            disabled={isMonitoring}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              isMonitoring
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isMonitoring ? '監視中...' : '監視開始'}
          </button>
          <button
            onClick={stopMonitoring}
            disabled={!isMonitoring}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              !isMonitoring
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            監視停止
          </button>
          <button
            onClick={performRealTimeAnalysis}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            手動分析
          </button>
        </div>
      </div>

      {/* アラート一覧 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="text-2xl mr-2">🔔</span>
            リアルタイムアラート ({alerts.length}件)
          </h3>
          {alerts.length > 0 && (
            <button
              onClick={clearAllAlerts}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              全クリア
            </button>
          )}
        </div>

        {alerts.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border-l-4 rounded-lg ${getAlertTypeColor(alert.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{alert.title}</span>
                      {alert.actionRequired && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                          要対応
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    <div className="text-xs text-gray-500">
                      {alert.timestamp.toLocaleString('ja-JP')}
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="ml-4 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-3xl mb-2">🔕</div>
            <p>アラートはありません</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRealTimeMonitor; 