/**
 * AI予測・分析サービス
 * 発作予測、健康リスク予測、異常検知の高度なAI機能
 */

import { DailyLog, User, VitalSigns, SeizureRecord, SeizurePredictionWithAlias, HealthPredictionWithAlias } from '../types';
import { format, subDays, parseISO, differenceInDays } from 'date-fns';

export interface PredictionData {
  userId: string;
  timestamp: string;
  vitalSigns: {
    temperature: number;
    bloodPressure: { systolic: number; diastolic: number };
    pulse: number;
    spO2: number;
  };
  activity: {
    mood: string;
    participation: string[];
    engagement: number;
  };
  intake: {
    mealAmount: string;
    hydration: number;
  };
  sleep: {
    duration: number;
    quality: string;
  };
  environmental: {
    weather: string;
    temperature: number;
    humidity: number;
  };
}

export interface PredictionResult {
  type: 'seizure' | 'health_deterioration' | 'medication_effect';
  probability: number;
  confidence: number;
  factors: string[];
  recommendations: string[];
  timeframe: 'today' | 'tomorrow' | 'this_week';
  severity: 'low' | 'medium' | 'high';
}

export interface SeizurePrediction {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  timeWindow: string;
  triggers: string[];
  preventiveMeasures: string[];
}

export interface HealthPrediction {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  factors: string[];
  recommendations: string[];
  nextCheckTime: string;
}

export interface HealthRiskPrediction {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: {
    dehydration: number;
    infection: number;
    cardiovascular: number;
    respiratory: number;
    nutritional: number;
  };
  predictedIssues: string[];
  preventiveMeasures: string[];
  urgency: 'low' | 'medium' | 'high' | 'urgent';
}

export interface AnomalyDetection {
  type: 'vital_signs' | 'behavior' | 'nutrition' | 'sleep' | 'activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  confidence: number;
  recommendations: string[];
}

export interface TrendAnalysis {
  period: 'daily' | 'weekly' | 'monthly';
  trends: {
    vitalSigns: {
      temperature: { trend: 'increasing' | 'decreasing' | 'stable'; rate: number };
      bloodPressure: { trend: 'increasing' | 'decreasing' | 'stable'; rate: number };
      pulse: { trend: 'increasing' | 'decreasing' | 'stable'; rate: number };
    };
    behavior: {
      mood: { trend: 'improving' | 'declining' | 'stable'; confidence: number };
      activity: { trend: 'increasing' | 'decreasing' | 'stable'; rate: number };
    };
    health: {
      seizures: { frequency: number; trend: 'increasing' | 'decreasing' | 'stable' };
      nutrition: { trend: 'improving' | 'declining' | 'stable'; confidence: number };
    };
  };
  insights: string[];
  recommendations: string[];
}

export interface HealthTrend {
  trend: 'improving' | 'stable' | 'declining';
  confidence: number;
  factors: string[];
  recommendations: string[];
}

export class AIPredictionService {
  private static instance: AIPredictionService;

  static getInstance(): AIPredictionService {
    if (!AIPredictionService.instance) {
      AIPredictionService.instance = new AIPredictionService();
    }
    return AIPredictionService.instance;
  }

  private static predictionModels: Map<string, any> = new Map();
  private static historicalData: Map<string, PredictionData[]> = new Map();
  private static readonly SEIZURE_TRIGGERS = [
    'stress', 'fatigue', 'lack_of_sleep', 'high_temperature', 
    'dehydration', 'medication_change', 'weather_change'
  ];

  private static readonly HEALTH_RISK_FACTORS = [
    'high_temperature', 'low_spo2', 'irregular_pulse', 
    'poor_sleep', 'decreased_appetite', 'mood_changes'
  ];

  /**
   * 発作予測
   */
  async predictSeizure(
    user: User,
    recentLogs: DailyLog[],
    currentTime: Date = new Date()
  ): Promise<SeizurePredictionWithAlias> {
    const result = await (async () => {
      // 過去30日間の発作記録を分析
      const seizureLogs = recentLogs
        .filter(log => log.seizures && log.seizures.length > 0)
        .slice(-30);

      if (seizureLogs.length === 0) {
        return {
          riskLevel: 'low' as 'low',
          probability: 0.05,
          timeWindow: '24時間以内',
          triggers: [],
          preventiveMeasures: ['定期的な観察を継続'],
          severity: 'low',
          recommendations: ['定期的な観察を継続']
        };
      }

      // 発作パターンの分析
      const seizurePattern = this.analyzeSeizurePattern(seizureLogs, currentTime);
      const triggerAnalysis = this.analyzeSeizureTriggers(seizureLogs, recentLogs);

      // リスクレベルの判定
      const riskLevel = this.calculateSeizureRisk(seizurePattern, triggerAnalysis);
      const probability = this.calculateSeizureProbability(seizurePattern, triggerAnalysis);

      const preventiveMeasures = this.generateSeizurePreventiveMeasures(riskLevel, triggerAnalysis);
      return {
        riskLevel: riskLevel as 'low' | 'medium' | 'high' | 'critical',
        probability,
        timeWindow: seizurePattern.nextExpectedWindow,
        triggers: triggerAnalysis.triggers,
        preventiveMeasures,
        severity: riskLevel,
        recommendations: preventiveMeasures
      };
    })();
    return result;
  }

  /**
   * 健康状態の傾向分析
   */
  async analyzeHealthTrend(
    user: User,
    logs: DailyLog[]
  ): Promise<HealthTrend> {
    const recentLogs = logs.slice(-30); // 過去30日間
    const olderLogs = logs.slice(-60, -30); // その前30日間

    if (recentLogs.length < 10 || olderLogs.length < 10) {
      return {
        trend: 'stable',
        confidence: 0.3,
        factors: ['データ不足'],
        recommendations: ['より多くのデータを収集してください']
      };
    }

    // 各指標の傾向を分析
    const vitalTrends = this.analyzeVitalSignsTrends(recentLogs, olderLogs);
    const seizureTrends = this.analyzeSeizureFrequencyTrends(recentLogs, olderLogs);
    const activityTrends = this.analyzeActivityTrends(recentLogs, olderLogs);

    // 総合的な傾向の判定
    const overallTrend = this.calculateOverallTrend(vitalTrends, seizureTrends, activityTrends);
    const confidence = this.calculateTrendConfidence(vitalTrends, seizureTrends, activityTrends);
      
      return {
      trend: overallTrend,
      confidence,
      factors: this.identifyTrendFactors(vitalTrends, seizureTrends, activityTrends),
      recommendations: this.generateTrendRecommendations(overallTrend, vitalTrends, seizureTrends, activityTrends)
    };
  }

  /**
   * バイタルサインの異常値予測
   */
  static async predictVitalSignsAnomaly(
    user: User,
    recentLogs: DailyLog[],
    currentVitals: VitalSigns
  ): Promise<HealthPrediction> {
    // 過去7日間のデータを分析
    const recentVitals = recentLogs
      .filter(log => log.vitals)
      .slice(-7)
      .map(log => log.vitals!);

    if (recentVitals.length < 3) {
      return {
        riskLevel: 'low',
        probability: 0.1,
        factors: ['データ不足'],
        recommendations: ['より多くのデータを収集してください'],
        nextCheckTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2時間後
      };
    }

    // 体温の異常値チェック
    const tempTrend = this.analyzeTemperatureTrend(recentVitals, currentVitals);
    const pulseTrend = this.analyzePulseTrend(recentVitals, currentVitals);
    const spo2Trend = this.analyzeSpO2Trend(recentVitals, currentVitals);
    const bpTrend = this.analyzeBloodPressureTrend(recentVitals, currentVitals);

    // リスクレベルの計算
    const riskFactors = [];
    let riskScore = 0;

    if (tempTrend.riskLevel === 'high' || tempTrend.riskLevel === 'critical') {
      riskFactors.push(`体温異常: ${tempTrend.factors.join(', ')}`);
      riskScore += tempTrend.riskLevel === 'critical' ? 3 : 2;
    }

    if (pulseTrend.riskLevel === 'high' || pulseTrend.riskLevel === 'critical') {
      riskFactors.push(`脈拍異常: ${pulseTrend.factors.join(', ')}`);
      riskScore += pulseTrend.riskLevel === 'critical' ? 3 : 2;
    }

    if (spo2Trend.riskLevel === 'high' || spo2Trend.riskLevel === 'critical') {
      riskFactors.push(`SpO2異常: ${spo2Trend.factors.join(', ')}`);
      riskScore += spo2Trend.riskLevel === 'critical' ? 4 : 3;
    }

    if (bpTrend.riskLevel === 'high' || bpTrend.riskLevel === 'critical') {
      riskFactors.push(`血圧異常: ${bpTrend.factors.join(', ')}`);
      riskScore += bpTrend.riskLevel === 'critical' ? 3 : 2;
    }

    // リスクレベルの判定
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    let probability: number;

    if (riskScore >= 8) {
      riskLevel = 'critical';
      probability = 0.9;
    } else if (riskScore >= 5) {
      riskLevel = 'high';
      probability = 0.7;
    } else if (riskScore >= 2) {
      riskLevel = 'medium';
      probability = 0.4;
    } else {
      riskLevel = 'low';
      probability = 0.1;
    }

    // 推奨事項の生成
    const recommendations = this.generateHealthRecommendations(
      riskLevel,
      tempTrend,
      pulseTrend,
      spo2Trend,
      bpTrend
    );
      
      return {
      riskLevel,
        probability,
        factors: riskFactors,
      recommendations,
      nextCheckTime: this.calculateNextCheckTime(riskLevel)
    };
  }

  /**
   * 健康リスク予測（エイリアスメソッド）
   */
  static async predictHealthRisk(user: User, dailyLogs: DailyLog[]): Promise<HealthPrediction> {
    return this.predictVitalSignsAnomaly(user, dailyLogs.slice(-7), dailyLogs[dailyLogs.length - 1].vitals!);
  }

  /**
   * 薬剤効果予測
   */
  static predictMedicationEffect(user: User, dailyLogs: DailyLog[], medicationName: string): PredictionResult {
    // Implementation needed
    throw new Error("Method not implemented");
  }

  /**
   * 包括的予測
   */
  static generateComprehensivePrediction(user: User, dailyLogs: DailyLog[]): {
    seizurePrediction: SeizurePrediction;
    healthPrediction: HealthPrediction;
    overallRisk: 'low' | 'medium' | 'high';
    priorityActions: string[];
  } {
    // Implementation needed
    throw new Error("Method not implemented");
  }

  /**
   * データを追加
   */
  static addData(userId: string, data: PredictionData): void {
    const userData = this.historicalData.get(userId) || [];
    userData.push(data);
    
    // 最新90日間のデータのみ保持
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);
    
    const filteredData = userData.filter(d => 
      new Date(d.timestamp) > cutoffDate
    );
    
    this.historicalData.set(userId, filteredData);
  }

  // プライベートメソッド

  private static analyzeTemperatureTrend(vitals: VitalSigns[], current: VitalSigns) {
    const temps = vitals.map(v => v.temperature);
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const tempChange = current.temperature - avgTemp;

    if (current.temperature > 38.0) {
    return {
        riskLevel: 'critical' as const,
        factors: ['高熱', '感染症の可能性']
      };
    } else if (current.temperature > 37.5 || tempChange > 1.0) {
      return {
        riskLevel: 'high' as const,
        factors: ['体温上昇', '体調変化の可能性']
      };
    } else if (current.temperature < 35.0) {
      return {
        riskLevel: 'high' as const,
        factors: ['低体温', '循環不全の可能性']
      };
    }

    return {
      riskLevel: 'low' as const,
      factors: ['正常範囲']
    };
  }

  private static analyzePulseTrend(vitals: VitalSigns[], current: VitalSigns) {
    const pulses = vitals.map(v => v.pulse);
    const avgPulse = pulses.reduce((a, b) => a + b, 0) / pulses.length;
    const pulseChange = current.pulse - avgPulse;

    if (current.pulse > 120 || current.pulse < 50) {
    return {
        riskLevel: 'critical' as const,
        factors: ['脈拍異常', '循環器系の問題の可能性']
      };
    } else if (current.pulse > 100 || current.pulse < 60 || Math.abs(pulseChange) > 20) {
      return {
        riskLevel: 'high' as const,
        factors: ['脈拍変化', '体調変化の可能性']
      };
    }

    return {
      riskLevel: 'low' as const,
      factors: ['正常範囲']
    };
  }

  private static analyzeSpO2Trend(vitals: VitalSigns[], current: VitalSigns) {
    if (current.spO2 < 90) {
    return {
        riskLevel: 'critical' as const,
        factors: ['低酸素血症', '呼吸器系の問題の可能性']
      };
    } else if (current.spO2 < 95) {
      return {
        riskLevel: 'high' as const,
        factors: ['酸素飽和度低下', '呼吸状態の注意']
      };
    }

      return {
      riskLevel: 'low' as const,
      factors: ['正常範囲']
    };
  }

  private static analyzeBloodPressureTrend(vitals: VitalSigns[], current: VitalSigns) {
    const systolic = current.bloodPressure.systolic;
    const diastolic = current.bloodPressure.diastolic;

    if (systolic > 180 || systolic < 90 || diastolic > 110 || diastolic < 60) {
      return {
        riskLevel: 'critical' as const,
        factors: ['血圧異常', '循環器系の問題の可能性']
      };
    } else if (systolic > 160 || systolic < 100 || diastolic > 100 || diastolic < 70) {
      return {
        riskLevel: 'high' as const,
        factors: ['血圧変化', '体調変化の可能性']
      };
    }

      return {
      riskLevel: 'low' as const,
      factors: ['正常範囲']
    };
  }

  private analyzeSeizurePattern(logs: DailyLog[], currentTime: Date) {
    const seizures = logs.flatMap(log => log.seizures || []);
    const seizureTimes = logs
      .filter(log => log.seizures && log.seizures.length > 0)
      .map(log => new Date(log.record_date));

    // 発作の頻度分析
    const frequency = seizures.length / 30; // 1日あたりの平均発作回数

    // 発作の時間帯分析
    const timePattern = this.analyzeSeizureTimePattern(seizureTimes);

    return {
      frequency,
      timePattern,
      lastSeizure: seizureTimes.length > 0 ? seizureTimes[seizureTimes.length - 1] : null,
      nextExpectedWindow: this.predictNextSeizureWindow(seizureTimes, currentTime)
    };
  }

  private analyzeSeizureTriggers(seizureLogs: DailyLog[], allLogs: DailyLog[]) {
    const triggers: string[] = [];
    
    // 発作前の状態を分析
    seizureLogs.forEach(log => {
      if (log.vitals) {
        if (log.vitals.temperature > 37.5) triggers.push('発熱');
        if (log.vitals.spO2 < 95) triggers.push('低酸素');
        if (log.vitals.pulse > 100) triggers.push('脈拍上昇');
      }
      
      if (log.intake?.notes?.includes('むせ込み')) triggers.push('むせ込み');
      if (log.sleep?.notes?.includes('睡眠不足')) triggers.push('睡眠不足');
      if (log.activity?.notes?.includes('興奮')) triggers.push('興奮状態');
    });
    
    return {
      triggers: [...new Set(triggers)],
      frequency: triggers.reduce((acc, trigger) => {
        acc[trigger] = (acc[trigger] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  private calculateSeizureRisk(pattern: any, triggers: any): 'low' | 'medium' | 'high' | 'critical' {
    let riskScore = 0;

    // 頻度によるリスク
    if (pattern.frequency > 0.5) riskScore += 3;
    else if (pattern.frequency > 0.2) riskScore += 2;
    else if (pattern.frequency > 0.1) riskScore += 1;

    // トリガーによるリスク
    if (triggers.triggers.includes('発熱')) riskScore += 2;
    if (triggers.triggers.includes('低酸素')) riskScore += 3;
    if (triggers.triggers.includes('興奮状態')) riskScore += 1;

    if (riskScore >= 5) return 'critical';
    if (riskScore >= 3) return 'high';
    if (riskScore >= 1) return 'medium';
    return 'low';
  }

  private calculateSeizureProbability(pattern: any, triggers: any): number {
    const baseProbability = pattern.frequency * 0.3;
    const triggerBonus = triggers.triggers.length * 0.1;
    return Math.min(0.95, baseProbability + triggerBonus);
  }

  private generateSeizurePreventiveMeasures(
    riskLevel: string,
    triggers: any
  ): string[] {
    const measures: string[] = [];

    if (riskLevel === 'critical') {
      measures.push('24時間体制での観察');
      measures.push('発作時の対応準備');
      measures.push('医師への即座の報告');
    } else if (riskLevel === 'high') {
      measures.push('頻回の観察（30分ごと）');
      measures.push('発作の前兆症状の注意');
      measures.push('環境の調整（刺激の軽減）');
    } else if (riskLevel === 'medium') {
      measures.push('定期的な観察（1時間ごと）');
      measures.push('体調変化の記録');
    } else {
      measures.push('通常の観察を継続');
    }

    // トリガー別の対策
    if (triggers.triggers.includes('発熱')) {
      measures.push('体温の継続的なモニタリング');
      measures.push('解熱剤の準備');
    }

    if (triggers.triggers.includes('低酸素')) {
      measures.push('酸素飽和度の継続的なモニタリング');
      measures.push('酸素投与の準備');
    }

    return measures;
  }

  private static calculateNextCheckTime(riskLevel: string): string {
    const now = new Date();
    let nextCheck: Date;

    switch (riskLevel) {
      case 'critical':
        nextCheck = new Date(now.getTime() + 30 * 60 * 1000); // 30分後
        break;
      case 'high':
        nextCheck = new Date(now.getTime() + 60 * 60 * 1000); // 1時間後
        break;
      case 'medium':
        nextCheck = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2時間後
        break;
      default:
        nextCheck = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4時間後
    }

    return nextCheck.toISOString();
  }

  private analyzeSeizureTimePattern(seizureTimes: Date[]) {
    const hours = seizureTimes.map(time => time.getHours());
    const hourCounts = hours.reduce((acc, hour) => {
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const peakHours = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    return {
      peakHours,
      hourCounts
    };
  }

  private predictNextSeizureWindow(seizureTimes: Date[], currentTime: Date): string {
    if (seizureTimes.length === 0) return '24時間以内';

    const lastSeizure = seizureTimes[seizureTimes.length - 1];
    const timeSinceLastSeizure = currentTime.getTime() - lastSeizure.getTime();
    const avgInterval = this.calculateAverageSeizureInterval(seizureTimes);

    if (timeSinceLastSeizure > avgInterval * 0.8) {
      return '12時間以内';
    } else if (timeSinceLastSeizure > avgInterval * 0.5) {
      return '24時間以内';
    } else {
      return '48時間以内';
    }
  }

  private calculateAverageSeizureInterval(seizureTimes: Date[]): number {
    if (seizureTimes.length < 2) return 24 * 60 * 60 * 1000; // 24時間

    const intervals = [];
    for (let i = 1; i < seizureTimes.length; i++) {
      intervals.push(seizureTimes[i].getTime() - seizureTimes[i-1].getTime());
    }

    return intervals.reduce((a, b) => a + b, 0) / intervals.length;
  }

  private analyzeVitalSignsTrends(recentLogs: DailyLog[], olderLogs: DailyLog[]) {
    const recentVitals = recentLogs.filter(log => log.vitals).map(log => log.vitals!);
    const olderVitals = olderLogs.filter(log => log.vitals).map(log => log.vitals!);

    if (recentVitals.length === 0 || olderVitals.length === 0) {
      return { trend: 'stable', confidence: 0.3 };
    }

    const recentAvg = this.calculateAverageVitals(recentVitals);
    const olderAvg = this.calculateAverageVitals(olderVitals);

    const tempChange = recentAvg.temperature - olderAvg.temperature;
    const pulseChange = recentAvg.pulse - olderAvg.pulse;
    const spo2Change = recentAvg.spO2 - olderAvg.spO2;

    let improving = 0;
    let declining = 0;

    if (Math.abs(tempChange) > 0.5) {
      if (tempChange < 0) improving++;
      else declining++;
    }

    if (Math.abs(pulseChange) > 5) {
      if (pulseChange < 0) improving++;
      else declining++;
    }

    if (Math.abs(spo2Change) > 2) {
      if (spo2Change > 0) improving++;
      else declining++;
    }

    if (improving > declining) return { trend: 'improving', confidence: 0.7 };
    if (declining > improving) return { trend: 'declining', confidence: 0.7 };
    return { trend: 'stable', confidence: 0.6 };
  }

  private analyzeSeizureFrequencyTrends(recentLogs: DailyLog[], olderLogs: DailyLog[]) {
    const recentSeizures = recentLogs.filter(log => log.seizures && log.seizures.length > 0).length;
    const olderSeizures = olderLogs.filter(log => log.seizures && log.seizures.length > 0).length;

    const recentRate = recentSeizures / recentLogs.length;
    const olderRate = olderSeizures / olderLogs.length;

    if (recentRate < olderRate * 0.7) return { trend: 'improving', confidence: 0.8 };
    if (recentRate > olderRate * 1.3) return { trend: 'declining', confidence: 0.8 };
    return { trend: 'stable', confidence: 0.6 };
  }

  private analyzeActivityTrends(recentLogs: DailyLog[], olderLogs: DailyLog[]) {
    // 活動記録の分析（簡略化）
    return { trend: 'stable', confidence: 0.5 };
  }

  private calculateAverageVitals(vitals: VitalSigns[]) {
    return {
      temperature: vitals.reduce((sum, v) => sum + v.temperature, 0) / vitals.length,
      pulse: vitals.reduce((sum, v) => sum + v.pulse, 0) / vitals.length,
      spO2: vitals.reduce((sum, v) => sum + v.spO2, 0) / vitals.length,
      bloodPressure: {
        systolic: vitals.reduce((sum, v) => sum + v.bloodPressure.systolic, 0) / vitals.length,
        diastolic: vitals.reduce((sum, v) => sum + v.bloodPressure.diastolic, 0) / vitals.length
      }
    };
  }

  private calculateOverallTrend(
    vitalTrends: any,
    seizureTrends: any,
    activityTrends: any
  ): 'improving' | 'stable' | 'declining' {
    const trends = [vitalTrends.trend, seizureTrends.trend, activityTrends.trend];
    const improving = trends.filter(t => t === 'improving').length;
    const declining = trends.filter(t => t === 'declining').length;

    if (improving > declining) return 'improving';
    if (declining > improving) return 'declining';
    return 'stable';
  }

  private calculateTrendConfidence(
    vitalTrends: any,
    seizureTrends: any,
    activityTrends: any
  ): number {
    return (vitalTrends.confidence + seizureTrends.confidence + activityTrends.confidence) / 3;
  }

  private identifyTrendFactors(
    vitalTrends: any,
    seizureTrends: any,
    activityTrends: any
  ): string[] {
    const factors: string[] = [];

    if (vitalTrends.trend === 'improving') factors.push('バイタルサインの改善');
    if (vitalTrends.trend === 'declining') factors.push('バイタルサインの悪化');
    if (seizureTrends.trend === 'improving') factors.push('発作頻度の減少');
    if (seizureTrends.trend === 'declining') factors.push('発作頻度の増加');

    return factors;
  }

  private generateTrendRecommendations(
    overallTrend: string,
    vitalTrends: any,
    seizureTrends: any,
    activityTrends: any
  ): string[] {
    const recommendations: string[] = [];
    
    if (overallTrend === 'improving') {
      recommendations.push('現在のケアプランを継続');
      recommendations.push('改善要因の分析と記録');
    } else if (overallTrend === 'declining') {
      recommendations.push('ケアプランの見直しを検討');
      recommendations.push('医師への相談を検討');
      recommendations.push('家族への状況報告');
    } else {
      recommendations.push('定期的な評価の継続');
      recommendations.push('ケアプランの微調整を検討');
    }
    
    return recommendations;
  }

  private static generateHealthRecommendations(
    riskLevel: string,
    tempTrend: any,
    pulseTrend: any,
    spo2Trend: any,
    bpTrend: any
  ): string[] {
    const recommendations: string[] = [];
    
    if (riskLevel === 'critical') {
      recommendations.push('医師への即座の報告が必要です');
      recommendations.push('バイタルサインの頻回測定（30分ごと）');
      recommendations.push('家族への緊急連絡');
    } else if (riskLevel === 'high') {
      recommendations.push('バイタルサインの頻回測定（1時間ごと）');
      recommendations.push('看護師への報告');
      recommendations.push('安静の確保');
    } else if (riskLevel === 'medium') {
      recommendations.push('バイタルサインの注意深い観察');
      recommendations.push('体調変化の記録');
    } else {
      recommendations.push('通常の観察を継続');
    }

    // 具体的な推奨事項
    if (tempTrend.riskLevel === 'high' || tempTrend.riskLevel === 'critical') {
      recommendations.push('体温の継続的なモニタリング');
      recommendations.push('水分補給の促進');
    }

    if (spo2Trend.riskLevel === 'high' || spo2Trend.riskLevel === 'critical') {
      recommendations.push('酸素飽和度の継続的なモニタリング');
      recommendations.push('呼吸状態の注意深い観察');
    }

    return recommendations;
  }

  /**
   * 互換用: 発作予測（静的メソッド名）
   */
  static async predictSeizures(user: User, recentLogs: DailyLog[], currentTime: Date = new Date()): Promise<SeizurePredictionWithAlias> {
    const instance = AIPredictionService.getInstance();
    return instance.predictSeizure(user, recentLogs, currentTime);
  }

  /**
   * 互換用: 健康リスク予測（静的メソッド名）
   */
  static async predictHealthDeterioration(user: User, dailyLogs: DailyLog[]): Promise<HealthPredictionWithAlias> {
    const base = await this.predictHealthRisk(user, dailyLogs);
    return {
      ...base,
      severity: base.riskLevel,
      riskFactors: [],
      symptoms: []
    };
  }
}

export default AIPredictionService; 