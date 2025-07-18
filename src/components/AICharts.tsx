import React from 'react';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}

interface AIChartsProps {
  seizureData: {
    riskLevel: string;
    probability: number;
    timeWindow: string;
    triggers: string[];
  };
  healthData: {
    riskLevel: string;
    probability: number;
    factors: string[];
  };
  trendData: {
    trend: string;
    confidence: number;
    factors: string[];
  };
  anomalies: any[];
  positiveChanges: any[];
}

const AICharts: React.FC<AIChartsProps> = ({
  seizureData,
  healthData,
  trendData,
  anomalies,
  positiveChanges
}) => {
  // リスクレベルを数値に変換
  const getRiskScore = (riskLevel: string): number => {
    switch (riskLevel) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  };

  // リスクレベルを色に変換
  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  // トレンドを数値に変換
  const getTrendScore = (trend: string): number => {
    switch (trend) {
      case 'improving': return 1;
      case 'stable': return 0;
      case 'declining': return -1;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* リスクレベル比較チャート */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">リスクレベル比較</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 発作リスク */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">発作リスク</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                seizureData.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                seizureData.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                seizureData.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {seizureData.riskLevel.toUpperCase()}
              </span>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    発生確率
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {(seizureData.probability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${seizureData.probability * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="mb-2">
                <span className="font-semibold">予測時間帯:</span> {seizureData.timeWindow}
              </div>
              {seizureData.triggers.length > 0 && (
                <div>
                  <span className="font-semibold">トリガー要因:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {seizureData.triggers.map((trigger, index) => (
                      <span key={index} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 健康リスク */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">健康リスク</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                healthData.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                healthData.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                healthData.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {healthData.riskLevel.toUpperCase()}
              </span>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                    悪化確率
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-green-600">
                    {(healthData.probability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                <div
                  style={{ width: `${healthData.probability * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {healthData.factors.length > 0 && (
                <div>
                  <span className="font-semibold">リスク要因:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {healthData.factors.map((factor, index) => (
                      <span key={index} className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* トレンド分析チャート */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">健康トレンド分析</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* トレンド方向 */}
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
            <div className="text-4xl mb-4">
              {trendData.trend === 'improving' ? '📈' : 
               trendData.trend === 'declining' ? '📉' : '➡️'}
            </div>
            <div className="font-bold text-lg mb-2">
              {trendData.trend === 'improving' ? '改善傾向' :
               trendData.trend === 'declining' ? '悪化傾向' : '安定'}
            </div>
            <div className="text-sm text-gray-600">
              信頼度: {(trendData.confidence * 100).toFixed(0)}%
            </div>
          </div>

          {/* 信頼度ゲージ */}
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
            <div className="text-2xl mb-4">🎯</div>
            <div className="font-bold text-lg mb-2">分析信頼度</div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${trendData.confidence * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-400 to-blue-500"
                ></div>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {(trendData.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* 要因分析 */}
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
            <div className="text-2xl mb-4">🔍</div>
            <div className="font-bold text-lg mb-2">主要要因</div>
            <div className="text-sm text-gray-600">
              {trendData.factors.length > 0 ? (
                <div className="space-y-1">
                  {trendData.factors.slice(0, 3).map((factor, index) => (
                    <div key={index} className="bg-white px-2 py-1 rounded text-xs">
                      {factor}
                    </div>
                  ))}
                </div>
              ) : (
                <span>要因なし</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 異常検知・ポジティブ変化チャート */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">異常検知・ポジティブ変化</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 異常検知 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-700 flex items-center">
                <span className="text-xl mr-2">🚨</span>
                異常検知
              </h4>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                {anomalies.length}件
              </span>
            </div>
            {anomalies.length > 0 ? (
              <div className="space-y-3">
                {anomalies.slice(0, 5).map((anomaly, index) => (
                  <div key={index} className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-red-700 capitalize">{anomaly.type}</span>
                      <span className="text-sm text-gray-500">{anomaly.date}</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">{anomaly.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-green-600">
                <div className="text-3xl mb-2">✅</div>
                <p>異常は検出されていません</p>
              </div>
            )}
          </div>

          {/* ポジティブ変化 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-700 flex items-center">
                <span className="text-xl mr-2">✨</span>
                ポジティブ変化
              </h4>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                {positiveChanges.length}件
              </span>
            </div>
            {positiveChanges.length > 0 ? (
              <div className="space-y-3">
                {positiveChanges.slice(0, 5).map((change, index) => (
                  <div key={index} className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-green-700 capitalize">{change.type}</span>
                      <span className="text-sm text-gray-500">{change.date}</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">{change.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-3xl mb-2">📊</div>
                <p>ポジティブ変化は検出されていません</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 総合リスクスコア */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">総合リスクスコア</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 発作リスクスコア */}
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-bold text-lg mb-1">発作リスク</div>
            <div className="text-2xl font-bold text-red-600 mb-1">
              {getRiskScore(seizureData.riskLevel)}
            </div>
            <div className="text-xs text-gray-600">/ 4</div>
          </div>

          {/* 健康リスクスコア */}
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
            <div className="text-3xl mb-2">❤️</div>
            <div className="font-bold text-lg mb-1">健康リスク</div>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {getRiskScore(healthData.riskLevel)}
            </div>
            <div className="text-xs text-gray-600">/ 4</div>
          </div>

          {/* 異常検知スコア */}
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
            <div className="text-3xl mb-2">🚨</div>
            <div className="font-bold text-lg mb-1">異常検知</div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {anomalies.length}
            </div>
            <div className="text-xs text-gray-600">件</div>
          </div>

          {/* 総合スコア */}
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-bold text-lg mb-1">総合スコア</div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {getRiskScore(seizureData.riskLevel) + getRiskScore(healthData.riskLevel) + Math.min(anomalies.length, 4)}
            </div>
            <div className="text-xs text-gray-600">/ 12</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICharts; 