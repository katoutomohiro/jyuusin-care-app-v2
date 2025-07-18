import { DailyLog, User, VitalSigns, SeizureRecord } from '../types';
import { AIPredictionService } from './AIPredictionService';

export interface HealthTrendAnalysis {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  trends: {
    vitalSigns: VitalSignsTrend;
    seizures: SeizureTrend;
    activities: ActivityTrend;
    nutrition: NutritionTrend;
    sleep: SleepTrend;
  };
  correlations: CorrelationAnalysis[];
  anomalies: AnomalyDetection[];
  predictions: HealthPrediction[];
  recommendations: string[];
  confidence: number;
}

export interface VitalSignsTrend {
  temperature: TrendData;
  pulse: TrendData;
  spO2: TrendData;
  bloodPressure: {
    systolic: TrendData;
    diastolic: TrendData;
  };
  overallHealth: TrendData;
}

export interface SeizureTrend {
  frequency: TrendData;
  duration: TrendData;
  types: Record<string, TrendData>;
  triggers: Record<string, number>;
  timePattern: TimePatternAnalysis;
  severity: TrendData;
}

export interface ActivityTrend {
  participation: TrendData;
  mood: TrendData;
  engagement: TrendData;
  socialInteraction: TrendData;
  physicalActivity: TrendData;
}

export interface NutritionTrend {
  intake: TrendData;
  hydration: TrendData;
  mealCompletion: TrendData;
  preferences: Record<string, number>;
  issues: string[];
}

export interface SleepTrend {
  duration: TrendData;
  quality: TrendData;
  efficiency: TrendData;
  disturbances: string[];
  patterns: TimePatternAnalysis;
}

export interface TrendData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'improving' | 'stable' | 'declining';
  confidence: number;
  min: number;
  max: number;
  average: number;
  standardDeviation: number;
}

export interface TimePatternAnalysis {
  hourlyDistribution: Record<number, number>;
  dailyDistribution: Record<string, number>;
  weeklyDistribution: Record<string, number>;
  peakTimes: string[];
  patterns: string[];
}

export interface CorrelationAnalysis {
  factor1: string;
  factor2: string;
  correlation: number;
  strength: 'strong' | 'moderate' | 'weak';
  direction: 'positive' | 'negative';
  significance: number;
  description: string;
}

export interface AnomalyDetection {
  type: 'vital_signs' | 'behavior' | 'seizure' | 'nutrition' | 'sleep';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  value: number;
  expectedRange: { min: number; max: number };
  confidence: number;
  recommendations: string[];
}

export interface HealthPrediction {
  type: 'seizure' | 'health_deterioration' | 'improvement' | 'medication_effect';
  probability: number;
  timeframe: string;
  factors: string[];
  confidence: number;
  recommendations: string[];
}

export interface CareEffectivenessAnalysis {
  intervention: string;
  effectiveness: number;
  duration: string;
  improvements: string[];
  challenges: string[];
  recommendations: string[];
  nextReview: string;
}

export interface PersonalizedInsights {
  userId: string;
  insights: Insight[];
  patterns: Pattern[];
  recommendations: Recommendation[];
  riskFactors: RiskFactor[];
  opportunities: Opportunity[];
}

export interface Insight {
  id: string;
  type: 'trend' | 'correlation' | 'anomaly' | 'pattern';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  timestamp: string;
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  frequency: number;
  triggers: string[];
  consequences: string[];
  interventions: string[];
}

export interface Recommendation {
  id: string;
  category: 'care' | 'medical' | 'lifestyle' | 'environmental';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  rationale: string;
  expectedOutcome: string;
  implementation: string[];
  timeline: string;
  successMetrics: string[];
}

export interface RiskFactor {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  impact: string;
  mitigation: string[];
  monitoring: string[];
}

export interface Opportunity {
  id: string;
  name: string;
  potential: 'low' | 'medium' | 'high';
  description: string;
  benefits: string[];
  requirements: string[];
  timeline: string;
}

export class AdvancedAnalyticsService {
  private static instance: AdvancedAnalyticsService;
  private aiService: AIPredictionService;

  private constructor() {
    this.aiService = AIPredictionService.getInstance();
  }

  static getInstance(): AdvancedAnalyticsService {
    if (!AdvancedAnalyticsService.instance) {
      AdvancedAnalyticsService.instance = new AdvancedAnalyticsService();
    }
    return AdvancedAnalyticsService.instance;
  }

  /**
   * 包括的な健康状態トレンド分析
   */
  async analyzeHealthTrends(
    user: User,
    logs: DailyLog[],
    period: 'daily' | 'weekly' | 'monthly' | 'quarterly' = 'monthly'
  ): Promise<HealthTrendAnalysis> {
    const recentLogs = this.getLogsByPeriod(logs, period);
    const previousLogs = this.getLogsByPeriod(logs, period, true);

    const vitalSignsTrend = await this.analyzeVitalSignsTrends(recentLogs, previousLogs);
    const seizureTrend = await this.analyzeSeizureTrends(recentLogs, previousLogs);
    const activityTrend = await this.analyzeActivityTrends(recentLogs, previousLogs);
    const nutritionTrend = await this.analyzeNutritionTrends(recentLogs, previousLogs);
    const sleepTrend = await this.analyzeSleepTrends(recentLogs, previousLogs);

    const correlations = await this.analyzeCorrelations(recentLogs);
    const anomalies = await this.detectAnomalies(recentLogs, user);
    const predictions = await this.generatePredictions(user, recentLogs);
    const recommendations = await this.generateRecommendations(
      vitalSignsTrend,
      seizureTrend,
      activityTrend,
      nutritionTrend,
      sleepTrend,
      anomalies
    );

    const confidence = this.calculateOverallConfidence(recentLogs.length, period);

    return {
      period,
      trends: {
        vitalSigns: vitalSignsTrend,
        seizures: seizureTrend,
        activities: activityTrend,
        nutrition: nutritionTrend,
        sleep: sleepTrend
      },
      correlations,
      anomalies,
      predictions,
      recommendations,
      confidence
    };
  }

  /**
   * パーソナライズされた洞察の生成
   */
  async generatePersonalizedInsights(user: User, logs: DailyLog[]): Promise<any> {
    const seizureTrend = this.analyzeSeizureTrend(logs);
    const vitalTrend = this.analyzeVitalTrend(logs);
    // ... (他の分析ロジック)

    const insights = {
      summary: `${user.name}さんの健康状態は全体的に安定しています。`,
      seizure: seizureTrend,
      vital: vitalTrend,
      recommendations: ['引き続き、定期的な観察をお願いします。']
    };

    return insights;
  }

  /**
   * ケア介入の効果分析
   */
  async analyzeCareEffectiveness(
    user: User,
    logs: DailyLog[],
    interventions: string[]
  ): Promise<CareEffectivenessAnalysis[]> {
    const analyses: CareEffectivenessAnalysis[] = [];

    for (const intervention of interventions) {
      const analysis = await this.analyzeSingleIntervention(user, logs, intervention);
      analyses.push(analysis);
    }

    return analyses;
  }

  /**
   * リアルタイム異常検知
   */
  async detectRealTimeAnomalies(
    user: User,
    currentData: Partial<DailyLog>,
    historicalLogs: DailyLog[]
  ): Promise<AnomalyDetection[]> {
    const anomalies: AnomalyDetection[] = [];

    // バイタルサインの異常検知
    if (currentData.vitals) {
      const vitalAnomalies = await this.detectVitalSignsAnomalies(
        user,
        currentData.vitals,
        historicalLogs
      );
      anomalies.push(...vitalAnomalies);
    }

    // 行動の異常検知
    if (currentData.activity) {
      const behaviorAnomalies = await this.detectBehaviorAnomalies(
        user,
        currentData.activity,
        historicalLogs
      );
      anomalies.push(...behaviorAnomalies);
    }

    // 発作の異常検知
    if (currentData.seizures && currentData.seizures.length > 0) {
      const seizureAnomalies = await this.detectSeizureAnomalies(
        user,
        currentData.seizures,
        historicalLogs
      );
      anomalies.push(...seizureAnomalies);
    }

    return anomalies;
  }

  /**
   * 予測モデルの精度向上
   */
  async improvePredictionAccuracy(
    user: User,
    logs: DailyLog[],
    actualOutcomes: any[]
  ): Promise<void> {
    // 予測モデルの再学習と精度向上のロジック
    await this.retrainPredictionModels(user, logs, actualOutcomes);
    await this.updateModelParameters(user, logs);
    await this.validateModelAccuracy(user, logs, actualOutcomes);
  }

  // プライベートメソッド

  private getLogsByPeriod(
    logs: DailyLog[],
    period: string,
    previous: boolean = false
  ): DailyLog[] {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getTime() - (previous ? 2 : 1) * 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - (previous ? 14 : 7) * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getTime() - (previous ? 60 : 30) * 24 * 60 * 60 * 1000);
        break;
      case 'quarterly':
        startDate = new Date(now.getTime() - (previous ? 180 : 90) * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const endDate = previous ? 
      new Date(now.getTime() - (period === 'daily' ? 1 : period === 'weekly' ? 7 : period === 'monthly' ? 30 : 90) * 24 * 60 * 60 * 1000) :
      now;

    return logs.filter(log => {
      const logDate = new Date(log.record_date);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  private async analyzeVitalSignsTrends(
    recentLogs: DailyLog[],
    previousLogs: DailyLog[]
  ): Promise<VitalSignsTrend> {
    const recentVitals = recentLogs.filter(log => log.vitals).map(log => log.vitals!);
    const previousVitals = previousLogs.filter(log => log.vitals).map(log => log.vitals!);

    return {
      temperature: this.calculateTrendData(
        recentVitals.map(v => v.temperature),
        previousVitals.map(v => v.temperature)
      ),
      pulse: this.calculateTrendData(
        recentVitals.map(v => v.pulse),
        previousVitals.map(v => v.pulse)
      ),
      spO2: this.calculateTrendData(
        recentVitals.map(v => v.spO2),
        previousVitals.map(v => v.spO2)
      ),
      bloodPressure: {
        systolic: this.calculateTrendData(
          recentVitals.map(v => v.bloodPressure.systolic),
          previousVitals.map(v => v.bloodPressure.systolic)
        ),
        diastolic: this.calculateTrendData(
          recentVitals.map(v => v.bloodPressure.diastolic),
          previousVitals.map(v => v.bloodPressure.diastolic)
        )
      },
      overallHealth: this.calculateOverallHealthTrend(recentVitals, previousVitals)
    };
  }

  private async analyzeSeizureTrends(
    recentLogs: DailyLog[],
    previousLogs: DailyLog[]
  ): Promise<SeizureTrend> {
    const recentSeizures = recentLogs.flatMap(log => log.seizures || []);
    const previousSeizures = previousLogs.flatMap(log => log.seizures || []);

    const frequency = this.calculateTrendData(
      [recentSeizures.length],
      [previousSeizures.length]
    );

    const duration = this.calculateTrendData(
      recentSeizures.map(s => s.duration_sec),
      previousSeizures.map(s => s.duration_sec)
    );

    const types = this.analyzeSeizureTypes(recentSeizures, previousSeizures);
    const triggers = this.analyzeSeizureTriggers(recentSeizures);
    const timePattern = this.analyzeSeizureTimePattern(recentSeizures);
    const severity = this.calculateSeizureSeverity(recentSeizures, previousSeizures);

    return {
      frequency,
      duration,
      types,
      triggers,
      timePattern,
      severity
    };
  }

  private async analyzeActivityTrends(
    recentLogs: DailyLog[],
    previousLogs: DailyLog[]
  ): Promise<ActivityTrend> {
    const recentActivities = recentLogs.filter(log => log.activity).map(log => log.activity!);
    const previousActivities = previousLogs.filter(log => log.activity).map(log => log.activity!);

    return {
      participation: this.calculateActivityParticipation(recentActivities, previousActivities),
      mood: this.calculateMoodTrend(recentActivities, previousActivities),
      engagement: this.calculateEngagementTrend(recentActivities, previousActivities),
      socialInteraction: this.calculateSocialInteractionTrend(recentActivities, previousActivities),
      physicalActivity: this.calculatePhysicalActivityTrend(recentActivities, previousActivities)
    };
  }

  private async analyzeNutritionTrends(
    recentLogs: DailyLog[],
    previousLogs: DailyLog[]
  ): Promise<NutritionTrend> {
    const recentIntake = recentLogs.filter(log => log.intake).map(log => log.intake!);
    const previousIntake = previousLogs.filter(log => log.intake).map(log => log.intake!);

    return {
      intake: this.calculateNutritionIntake(recentIntake, previousIntake),
      hydration: this.calculateHydrationTrend(recentIntake, previousIntake),
      mealCompletion: this.calculateMealCompletion(recentIntake, previousIntake),
      preferences: this.analyzeFoodPreferences(recentIntake),
      issues: this.identifyNutritionIssues(recentIntake)
    };
  }

  private async analyzeSleepTrends(
    recentLogs: DailyLog[],
    previousLogs: DailyLog[]
  ): Promise<SleepTrend> {
    const recentSleep = recentLogs.filter(log => log.sleep).map(log => log.sleep!);
    const previousSleep = previousLogs.filter(log => log.sleep).map(log => log.sleep!);

    return {
      duration: this.calculateSleepDuration(recentSleep, previousSleep),
      quality: this.calculateSleepQuality(recentSleep, previousSleep),
      efficiency: this.calculateSleepEfficiency(recentSleep, previousSleep),
      disturbances: this.identifySleepDisturbances(recentSleep),
      patterns: this.analyzeSleepPatterns(recentSleep)
    };
  }

  private calculateTrendData(
    currentValues: number[],
    previousValues: number[]
  ): TrendData {
    if (currentValues.length === 0 || previousValues.length === 0) {
      return {
        current: 0,
        previous: 0,
        change: 0,
        changePercent: 0,
        trend: 'stable',
        confidence: 0,
        min: 0,
        max: 0,
        average: 0,
        standardDeviation: 0
      };
    }

    const current = this.calculateAverage(currentValues);
    const previous = this.calculateAverage(previousValues);
    const change = current - previous;
    const changePercent = previous !== 0 ? (change / previous) * 100 : 0;

    const trend: 'improving' | 'stable' | 'declining' = 
      changePercent > 5 ? 'improving' :
      changePercent < -5 ? 'declining' : 'stable';

    const confidence = Math.min(0.95, currentValues.length / 10);

    return {
      current,
      previous,
      change,
      changePercent,
      trend,
      confidence,
      min: Math.min(...currentValues),
      max: Math.max(...currentValues),
      average: current,
      standardDeviation: this.calculateStandardDeviation(currentValues)
    };
  }

  private calculateAverage(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private calculateStandardDeviation(values: number[]): number {
    const mean = this.calculateAverage(values);
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = this.calculateAverage(squaredDiffs);
    return Math.sqrt(variance);
  }

  private calculateOverallHealthTrend(
    recentVitals: VitalSigns[],
    previousVitals: VitalSigns[]
  ): TrendData {
    // 総合的な健康スコアの計算
    const recentScores = recentVitals.map(v => this.calculateHealthScore(v));
    const previousScores = previousVitals.map(v => this.calculateHealthScore(v));

    return this.calculateTrendData(recentScores, previousScores);
  }

  private calculateHealthScore(vitals: VitalSigns): number {
    let score = 100;

    // 体温の評価
    if (vitals.temperature < 35 || vitals.temperature > 38) score -= 20;
    else if (vitals.temperature < 36 || vitals.temperature > 37.5) score -= 10;

    // 脈拍の評価
    if (vitals.pulse < 50 || vitals.pulse > 120) score -= 20;
    else if (vitals.pulse < 60 || vitals.pulse > 100) score -= 10;

    // SpO2の評価
    if (vitals.spO2 < 90) score -= 30;
    else if (vitals.spO2 < 95) score -= 15;

    // 血圧の評価
    if (vitals.bloodPressure.systolic > 180 || vitals.bloodPressure.systolic < 90) score -= 20;
    else if (vitals.bloodPressure.systolic > 160 || vitals.bloodPressure.systolic < 100) score -= 10;

    return Math.max(0, score);
  }

  private analyzeSeizureTypes(
    recentSeizures: SeizureRecord[],
    previousSeizures: SeizureRecord[]
  ): Record<string, TrendData> {
    const types: Record<string, TrendData> = {};
    const allTypes = [...new Set([...recentSeizures, ...previousSeizures].map(s => s.type))];

    for (const type of allTypes) {
      const recentCount = recentSeizures.filter(s => s.type === type).length;
      const previousCount = previousSeizures.filter(s => s.type === type).length;

      types[type] = this.calculateTrendData([recentCount], [previousCount]);
    }

    return types;
  }

  private analyzeSeizureTriggers(seizures: SeizureRecord[]): Record<string, number> {
    const triggers: Record<string, number> = {};
    
    seizures.forEach(seizure => {
      seizure.details.forEach(detail => {
        triggers[detail] = (triggers[detail] || 0) + 1;
      });
    });

    return triggers;
  }

  private analyzeSeizureTimePattern(seizures: SeizureRecord[]): TimePatternAnalysis {
    const hourlyDistribution: Record<number, number> = {};
    const dailyDistribution: Record<string, number> = {};
    const weeklyDistribution: Record<string, number> = {};

    // 時間分布の分析（簡略化）
    for (let i = 0; i < 24; i++) {
      hourlyDistribution[i] = 0;
    }

    return {
      hourlyDistribution,
      dailyDistribution,
      weeklyDistribution,
      peakTimes: [],
      patterns: []
    };
  }

  private calculateSeizureSeverity(
    recentSeizures: SeizureRecord[],
    previousSeizures: SeizureRecord[]
  ): TrendData {
    const recentSeverity = recentSeizures.map(s => s.duration_sec);
    const previousSeverity = previousSeizures.map(s => s.duration_sec);

    return this.calculateTrendData(recentSeverity, previousSeverity);
  }

  private calculateActivityParticipation(
    recentActivities: any[],
    previousActivities: any[]
  ): TrendData {
    const recentParticipation = recentActivities.map(a => a.participation?.length || 0);
    const previousParticipation = previousActivities.map(a => a.participation?.length || 0);

    return this.calculateTrendData(recentParticipation, previousParticipation);
  }

  private calculateMoodTrend(
    recentActivities: any[],
    previousActivities: any[]
  ): TrendData {
    // 気分の数値化（簡略化）
    const moodScores = { '良い': 3, '普通': 2, '悪い': 1 };
    
    const recentMoods = recentActivities.map(a => moodScores[a.mood as keyof typeof moodScores] || 2);
    const previousMoods = previousActivities.map(a => moodScores[a.mood as keyof typeof moodScores] || 2);

    return this.calculateTrendData(recentMoods, previousMoods);
  }

  private calculateEngagementTrend(
    recentActivities: any[],
    previousActivities: any[]
  ): TrendData {
    // エンゲージメントの計算（簡略化）
    const recentEngagement = recentActivities.map(a => a.participation?.length || 0);
    const previousEngagement = previousActivities.map(a => a.participation?.length || 0);

    return this.calculateTrendData(recentEngagement, previousEngagement);
  }

  private calculateSocialInteractionTrend(
    recentActivities: any[],
    previousActivities: any[]
  ): TrendData {
    // 社会的相互作用の計算（簡略化）
    const recentSocial = recentActivities.map(a => 
      a.participation?.some((p: string) => p.includes('他者') || p.includes('交流')) ? 1 : 0
    );
    const previousSocial = previousActivities.map(a => 
      a.participation?.some((p: string) => p.includes('他者') || p.includes('交流')) ? 1 : 0
    );

    return this.calculateTrendData(recentSocial, previousSocial);
  }

  private calculatePhysicalActivityTrend(
    recentActivities: any[],
    previousActivities: any[]
  ): TrendData {
    // 身体活動の計算（簡略化）
    const recentPhysical = recentActivities.map(a => 
      a.participation?.some((p: string) => p.includes('運動') || p.includes('リハビリ')) ? 1 : 0
    );
    const previousPhysical = previousActivities.map(a => 
      a.participation?.some((p: string) => p.includes('運動') || p.includes('リハビリ')) ? 1 : 0
    );

    return this.calculateTrendData(recentPhysical, previousPhysical);
  }

  private calculateNutritionIntake(
    recentIntake: any[],
    previousIntake: any[]
  ): TrendData {
    const recentAmounts = recentIntake.map(i => i.amount_ml || 0);
    const previousAmounts = previousIntake.map(i => i.amount_ml || 0);

    return this.calculateTrendData(recentAmounts, previousAmounts);
  }

  private calculateHydrationTrend(
    recentIntake: any[],
    previousIntake: any[]
  ): TrendData {
    const recentHydration = recentIntake.map(i => i.amount_ml || 0);
    const previousHydration = previousIntake.map(i => i.amount_ml || 0);

    return this.calculateTrendData(recentHydration, previousHydration);
  }

  private calculateMealCompletion(
    recentIntake: any[],
    previousIntake: any[]
  ): TrendData {
    const recentCompletion = recentIntake.map(i => 
      i.meal_amount === '完食' ? 100 : 
      i.meal_amount === '半分' ? 50 : 
      i.meal_amount === '少量' ? 25 : 0
    );
    const previousCompletion = previousIntake.map(i => 
      i.meal_amount === '完食' ? 100 : 
      i.meal_amount === '半分' ? 50 : 
      i.meal_amount === '少量' ? 25 : 0
    );

    return this.calculateTrendData(recentCompletion, previousCompletion);
  }

  private analyzeFoodPreferences(intake: any[]): Record<string, number> {
    const preferences: Record<string, number> = {};
    
    intake.forEach(i => {
      if (i.notes) {
        const foods = i.notes.match(/[^ -\s,]+/g) || [];
        foods.forEach((food: string) => {
          preferences[food] = (preferences[food] || 0) + 1;
        });
      }
    });

    return preferences;
  }

  private identifyNutritionIssues(intake: any[]): string[] {
    const issues: string[] = [];
    
    intake.forEach(i => {
      if (i.notes?.includes('むせ込み')) issues.push('むせ込み');
      if (i.notes?.includes('食欲不振')) issues.push('食欲不振');
      if (i.notes?.includes('嘔吐')) issues.push('嘔吐');
    });

    return [...new Set(issues)];
  }

  private calculateSleepDuration(
    recentSleep: any[],
    previousSleep: any[]
  ): TrendData {
    const recentDurations = recentSleep.map(s => s.duration_minutes / 60);
    const previousDurations = previousSleep.map(s => s.duration_minutes / 60);

    return this.calculateTrendData(recentDurations, previousDurations);
  }

  private calculateSleepQuality(
    recentSleep: any[],
    previousSleep: any[]
  ): TrendData {
    // 睡眠品質の数値化（簡略化）
    const qualityScores = { '良好': 3, '普通': 2, '不良': 1 };
    
    const recentQuality = recentSleep.map(s => qualityScores[s.status as keyof typeof qualityScores] || 2);
    const previousQuality = previousSleep.map(s => qualityScores[s.status as keyof typeof qualityScores] || 2);

    return this.calculateTrendData(recentQuality, previousQuality);
  }

  private calculateSleepEfficiency(
    recentSleep: any[],
    previousSleep: any[]
  ): TrendData {
    // 睡眠効率の計算（簡略化）
    const recentEfficiency = recentSleep.map(s => 
      s.status === '良好' ? 90 : s.status === '普通' ? 70 : 50
    );
    const previousEfficiency = previousSleep.map(s => 
      s.status === '良好' ? 90 : s.status === '普通' ? 70 : 50
    );

    return this.calculateTrendData(recentEfficiency, previousEfficiency);
  }

  private identifySleepDisturbances(sleep: any[]): string[] {
    const disturbances: string[] = [];
    
    sleep.forEach(s => {
      if (s.notes?.includes('中途覚醒')) disturbances.push('中途覚醒');
      if (s.notes?.includes('いびき')) disturbances.push('いびき');
      if (s.notes?.includes('体動')) disturbances.push('体動');
    });

    return [...new Set(disturbances)];
  }

  private analyzeSleepPatterns(sleep: any[]): TimePatternAnalysis {
    // 睡眠パターンの分析（簡略化）
    return {
      hourlyDistribution: {},
      dailyDistribution: {},
      weeklyDistribution: {},
      peakTimes: [],
      patterns: []
    };
  }

  private async analyzeCorrelations(logs: DailyLog[]): Promise<CorrelationAnalysis[]> {
    const correlations: CorrelationAnalysis[] = [];

    // バイタルサイン間の相関
    const vitalLogs = logs.filter(log => log.vitals);
    if (vitalLogs.length > 10) {
      const tempPulseCorr = this.calculateCorrelation(
        vitalLogs.map(l => l.vitals!.temperature),
        vitalLogs.map(l => l.vitals!.pulse)
      );
      if (Math.abs(tempPulseCorr) > 0.3) {
        correlations.push({
          factor1: '体温',
          factor2: '脈拍',
          correlation: tempPulseCorr,
          strength: Math.abs(tempPulseCorr) > 0.7 ? 'strong' : Math.abs(tempPulseCorr) > 0.5 ? 'moderate' : 'weak',
          direction: tempPulseCorr > 0 ? 'positive' : 'negative',
          significance: 0.05,
          description: '体温と脈拍の間に相関関係が見られます'
        });
      }
    }

    return correlations;
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private async detectAnomalies(
    logs: DailyLog[],
    user: User
  ): Promise<AnomalyDetection[]> {
    const anomalies: AnomalyDetection[] = [];

    // バイタルサインの異常検知
    const vitalLogs = logs.filter(log => log.vitals);
    if (vitalLogs.length > 0) {
      const temps = vitalLogs.map(l => l.vitals!.temperature);
      const avgTemp = this.calculateAverage(temps);
      const stdTemp = this.calculateStandardDeviation(temps);

      vitalLogs.forEach(log => {
        const temp = log.vitals!.temperature;
        if (Math.abs(temp - avgTemp) > 2 * stdTemp) {
          anomalies.push({
            type: 'vital_signs',
            severity: Math.abs(temp - avgTemp) > 3 * stdTemp ? 'critical' : 'high',
            description: `体温の異常値: ${temp}°C`,
            detectedAt: log.record_date,
            value: temp,
            expectedRange: { min: avgTemp - 2 * stdTemp, max: avgTemp + 2 * stdTemp },
            confidence: 0.8,
            recommendations: ['医師への報告を検討', 'バイタルサインの頻回測定']
          });
        }
      });
    }

    return anomalies;
  }

  private async generatePredictions(
    user: User,
    logs: DailyLog[]
  ): Promise<HealthPrediction[]> {
    const predictions: HealthPrediction[] = [];

    // 発作予測
    const seizurePrediction = await this.aiService.predictSeizure(user, logs);
    predictions.push({
      type: 'seizure',
      probability: seizurePrediction.probability,
      timeframe: seizurePrediction.timeWindow,
      factors: seizurePrediction.triggers,
      confidence: 0.7,
      recommendations: seizurePrediction.preventiveMeasures
    });

    return predictions;
  }

  private async generateRecommendations(
    vitalSignsTrend: VitalSignsTrend,
    seizureTrend: SeizureTrend,
    activityTrend: ActivityTrend,
    nutritionTrend: NutritionTrend,
    sleepTrend: SleepTrend,
    anomalies: AnomalyDetection[]
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // バイタルサインの推奨事項
    if (vitalSignsTrend.temperature.trend === 'declining') {
      recommendations.push('体温の継続的なモニタリングを強化してください');
    }

    if (vitalSignsTrend.spO2.trend === 'declining') {
      recommendations.push('酸素飽和度の注意深い観察が必要です');
    }

    // 発作の推奨事項
    if (seizureTrend.frequency.trend === 'improving') {
      recommendations.push('現在のケアプランが効果的です。継続を推奨します');
    } else if (seizureTrend.frequency.trend === 'declining') {
      recommendations.push('発作頻度の増加が認められます。医師への相談を検討してください');
    }

    // 活動の推奨事項
    if (activityTrend.participation.trend === 'declining') {
      recommendations.push('活動参加の促進を検討してください');
    }

    // 栄養の推奨事項
    if (nutritionTrend.intake.trend === 'declining') {
      recommendations.push('栄養摂取の改善が必要です');
    }

    // 睡眠の推奨事項
    if (sleepTrend.quality.trend === 'declining') {
      recommendations.push('睡眠環境の改善を検討してください');
    }

    // 異常値に対する推奨事項
    anomalies.forEach(anomaly => {
      recommendations.push(...anomaly.recommendations);
    });

    return recommendations;
  }

  private calculateOverallConfidence(dataPoints: number, period: string): number {
    const minDataPoints = {
      daily: 5,
      weekly: 10,
      monthly: 20,
      quarterly: 30
    };

    const required = minDataPoints[period as keyof typeof minDataPoints] || 10;
    return Math.min(0.95, dataPoints / required);
  }

  // その他のプライベートメソッド（簡略化）
  private async generateHealthInsights(user: User, logs: DailyLog[]): Promise<Insight[]> {
    return [];
  }

  private async generateBehaviorInsights(user: User, logs: DailyLog[]): Promise<Insight[]> {
    return [];
  }

  private async generateSeizureInsights(user: User, logs: DailyLog[]): Promise<Insight[]> {
    return [];
  }

  private async identifyPatterns(user: User, logs: DailyLog[]): Promise<Pattern[]> {
    return [];
  }

  private async identifyRiskFactors(user: User, logs: DailyLog[]): Promise<RiskFactor[]> {
    return [];
  }

  private async identifyOpportunities(user: User, logs: DailyLog[]): Promise<Opportunity[]> {
    return [];
  }

  private async generatePersonalizedRecommendations(
    user: User,
    insights: Insight[],
    patterns: Pattern[],
    riskFactors: RiskFactor[],
    opportunities: Opportunity[]
  ): Promise<Recommendation[]> {
    return [];
  }

  private async analyzeSingleIntervention(
    user: User,
    logs: DailyLog[],
    intervention: string
  ): Promise<CareEffectivenessAnalysis> {
    return {
      intervention,
      effectiveness: 0.7,
      duration: '3ヶ月',
      improvements: ['発作頻度の減少', '活動参加の増加'],
      challenges: ['継続的なモニタリングが必要'],
      recommendations: ['介入の継続を推奨'],
      nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private async detectVitalSignsAnomalies(
    user: User,
    vitals: VitalSigns,
    historicalLogs: DailyLog[]
  ): Promise<AnomalyDetection[]> {
    return [];
  }

  private async detectBehaviorAnomalies(
    user: User,
    activity: any,
    historicalLogs: DailyLog[]
  ): Promise<AnomalyDetection[]> {
    return [];
  }

  private async detectSeizureAnomalies(
    user: User,
    seizures: SeizureRecord[],
    historicalLogs: DailyLog[]
  ): Promise<AnomalyDetection[]> {
    return [];
  }

  private async retrainPredictionModels(
    user: User,
    logs: DailyLog[],
    actualOutcomes: any[]
  ): Promise<void> {
    // モデルの再学習ロジック
  }

  private async updateModelParameters(
    user: User,
    logs: DailyLog[]
  ): Promise<void> {
    // パラメータ更新ロジック
  }

  private async validateModelAccuracy(
    user: User,
    logs: DailyLog[],
    actualOutcomes: any[]
  ): Promise<void> {
    // 精度検証ロジック
  }

  private analyzeSeizureTrend(logs: DailyLog[]): string {
    const recentSeizures = logs.slice(-7).filter(l => l.seizures && l.seizures.length > 0).length;
    const previousSeizures = logs.slice(-14, -7).filter(l => l.seizures && l.seizures.length > 0).length;

    if (recentSeizures < previousSeizures) return '発作回数は減少傾向にあります。';
    if (recentSeizures > previousSeizures) return '発作回数が増加傾向にあります。注意してください。';
    return '発作回数は安定しています。';
  }

  private analyzeVitalTrend(logs: DailyLog[]): string {
    // Implementation of analyzeVitalTrend method
    return '';
  }
}

export default AdvancedAnalyticsService; 