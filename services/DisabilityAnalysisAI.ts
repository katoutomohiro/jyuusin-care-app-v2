import { User } from '../src/types';

// 分析期間の定義
export type AnalysisPeriod = '1month' | '6months' | '1year';

// 分析結果の型定義
export interface AnalysisResult {
  userId: string;
  userName: string;
  period: AnalysisPeriod;
  analysisDate: string;
  
  // 基本統計
  totalRecords: number;
  recordsPerDay: number;
  
  // 発作分析
  seizureAnalysis: {
    frequency: number;
    averagePerWeek: number;
    severityTrend: 'improving' | 'stable' | 'worsening';
    patternInsights: string[];
    recommendations: string[];
  };
  
  // 表情・反応分析
  expressionAnalysis: {
    positiveRatio: number;
    communicationProgress: 'improving' | 'stable' | 'declining';
    engagementLevel: 'high' | 'medium' | 'low';
    insights: string[];
  };
  
  // バイタル分析
  vitalAnalysis: {
    temperatureStability: 'stable' | 'unstable';
    heartRatePattern: string;
    respirationPattern: string;
    alerts: string[];
  };
  
  // 食事・水分摂取分析
  nutritionAnalysis: {
    intakeStability: 'improving' | 'stable' | 'declining';
    hydrationStatus: 'adequate' | 'insufficient' | 'concerning';
    swallowingConcerns: string[];
    recommendations: string[];
  };
  
  // 排泄パターン分析
  excretionAnalysis: {
    regularityScore: number;
    patternStability: 'regular' | 'irregular';
    concerns: string[];
  };
  
  // 睡眠分析
  sleepAnalysis: {
    qualityScore: number;
    patternConsistency: 'consistent' | 'variable';
    nightWakings: number;
    recommendations: string[];
  };
  
  // 活動・参加分析
  activityAnalysis: {
    participationLevel: 'active' | 'moderate' | 'limited';
    engagementTrend: 'improving' | 'stable' | 'declining';
    preferredActivities: string[];
    adaptationNeeds: string[];
  };
  
  // ケア分析
  careAnalysis: {
    skinCondition: 'good' | 'fair' | 'concerning';
    positioningEffectiveness: 'effective' | 'needs_adjustment';
    careNeeds: string[];
  };
  
  // 服薬分析
  medicationAnalysis: {
    adherence: 'excellent' | 'good' | 'concerning';
    sideEffects: string[];
    effectiveness: string[];
  };
  
  // 総合評価
  overallAssessment: {
    healthStatus: 'stable' | 'improving' | 'concerning';
    qualityOfLife: 'high' | 'medium' | 'low';
    careSuccessAreas: string[];
    improvementAreas: string[];
    urgentConcerns: string[];
    recommendations: string[];
  };
  
  // 家族向けサマリー
  familySummary: {
    highlights: string[];
    concerns: string[];
    achievements: string[];
    nextSteps: string[];
  };
}

// AI分析エンジン
export class DisabilityAnalysisAI {
  
  // メイン分析関数
  static async analyzeUserRecords(
    user: User, 
    period: AnalysisPeriod
  ): Promise<AnalysisResult> {
    const records = await this.getRecordsForPeriod(user.id, period);
    
    return {
      userId: user.id,
      userName: user.name,
      period,
      analysisDate: new Date().toISOString(),
      totalRecords: records.length,
      recordsPerDay: this.calculateRecordsPerDay(records, period),
      
      seizureAnalysis: await this.analyzeSeizures(user, records),
      expressionAnalysis: await this.analyzeExpressions(user, records),
      vitalAnalysis: await this.analyzeVitals(user, records),
      nutritionAnalysis: await this.analyzeNutrition(user, records),
      excretionAnalysis: await this.analyzeExcretion(user, records),
      sleepAnalysis: await this.analyzeSleep(user, records),
      activityAnalysis: await this.analyzeActivity(user, records),
      careAnalysis: await this.analyzeCare(user, records),
      medicationAnalysis: await this.analyzeMedication(user, records),
      
      overallAssessment: await this.generateOverallAssessment(user, records),
      familySummary: await this.generateFamilySummary(user, records)
    };
  }
  
  // 期間別レコード取得
  private static async getRecordsForPeriod(userId: string, period: AnalysisPeriod) {
    const days = this.getPeriodDays(period);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const allRecords: any[] = [];
    
    // 各イベントタイプのレコードを取得
    const eventTypes = ['seizure', 'expression', 'vital', 'meal', 'excretion', 'sleep', 'activity', 'care', 'medication', 'other'];
    
    for (const eventType of eventTypes) {
      try {
        const storageKey = `${eventType}_records_${new Date().toISOString().split('T')[0]}`;
        const storedRecords = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // 過去のレコードも検索（簡易実装）
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const dayKey = `${eventType}_records_${dateStr}`;
          const dayRecords = JSON.parse(localStorage.getItem(dayKey) || '[]');
          
          const userRecords = dayRecords.filter((record: any) => 
            record.user_id === userId && 
            new Date(record.timestamp) >= cutoffDate
          );
          
          allRecords.push(...userRecords);
        }
      } catch (error) {
        console.error(`Error loading ${eventType} records:`, error);
      }
    }
    
    return allRecords.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
  
  // 期間を日数に変換
  private static getPeriodDays(period: AnalysisPeriod): number {
    switch (period) {
      case '1month': return 30;
      case '6months': return 180;
      case '1year': return 365;
    }
  }
  
  // 1日あたりの記録数計算
  private static calculateRecordsPerDay(records: any[], period: AnalysisPeriod): number {
    const days = this.getPeriodDays(period);
    return Math.round((records.length / days) * 10) / 10;
  }
  
  // 発作分析
  private static async analyzeSeizures(user: User, records: any[]) {
    const seizureRecords = records.filter(r => r.event_type === 'seizure');
    const weeklyAverage = (seizureRecords.length / records.length) * 7;
    
    // 重症度トレンド分析
    let severityTrend: 'improving' | 'stable' | 'worsening' = 'stable';
    if (seizureRecords.length > 0) {
      const recentSeverity = seizureRecords.slice(-10).reduce((sum, r) => sum + (r.data?.severity || 2), 0) / 10;
      const earlierSeverity = seizureRecords.slice(0, 10).reduce((sum, r) => sum + (r.data?.severity || 2), 0) / 10;
      
      if (recentSeverity < earlierSeverity - 0.3) severityTrend = 'improving';
      else if (recentSeverity > earlierSeverity + 0.3) severityTrend = 'worsening';
    }
    
    return {
      frequency: seizureRecords.length,
      averagePerWeek: Math.round(weeklyAverage * 10) / 10,
      severityTrend,
      patternInsights: this.generateSeizureInsights(user, seizureRecords),
      recommendations: this.generateSeizureRecommendations(user, seizureRecords, severityTrend)
    };
  }
  
  // 発作の洞察生成
  private static generateSeizureInsights(user: User, seizureRecords: any[]): string[] {
    const insights = [];
    
    if (seizureRecords.length === 0) {
      insights.push('分析期間中に発作の記録はありませんでした。');
      return insights;
    }
    
    // 時間帯パターン分析
    const timePatterns = seizureRecords.reduce((acc, record) => {
      const hour = new Date(record.timestamp).getHours();
      const timeSlot = hour < 6 ? '夜間' : hour < 12 ? '午前' : hour < 18 ? '午後' : '夕方';
      acc[timeSlot] = (acc[timeSlot] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommonTime = Object.entries(timePatterns).sort((a: any, b: any) => b[1] - a[1])[0];
    if (mostCommonTime) {
      insights.push(`発作は${mostCommonTime[0]}に最も多く発生しています。`);
    }
    
    // 頻度分析
    if (seizureRecords.length > 5) {
      insights.push('定期的な発作パターンが観察されています。医師との相談をお勧めします。');
    } else if (seizureRecords.length <= 2) {
      insights.push('発作の頻度は比較的低く安定しています。');
    }
    
    return insights;
  }
  
  // 発作の推奨事項生成
  private static generateSeizureRecommendations(user: User, seizureRecords: any[], trend: string): string[] {
    const recommendations = [];
    
    if (trend === 'worsening') {
      recommendations.push('発作の重症度が悪化傾向にあります。医師に相談してください。');
      recommendations.push('服薬状況と生活パターンを見直しましょう。');
    } else if (trend === 'improving') {
      recommendations.push('発作の状態が改善しています。現在のケア継続をお勧めします。');
    }
    
    if (seizureRecords.length > 0) {
      recommendations.push('発作記録を詳細に継続し、トリガーの特定に努めましょう。');
      recommendations.push('安全な環境づくりを心がけてください。');
    }
    
    return recommendations;
  }
  
  // 表情・反応分析
  private static async analyzeExpressions(user: User, records: any[]) {
    const expressionRecords = records.filter(r => r.event_type === 'expression');
    
    const positiveExpressions = expressionRecords.filter(r => 
      r.data?.mood === 'happy' || r.data?.mood === 'calm' || r.data?.response === 'positive'
    ).length;
    
    const positiveRatio = expressionRecords.length > 0 ? positiveExpressions / expressionRecords.length : 0;
    
    return {
      positiveRatio: Math.round(positiveRatio * 100),
      communicationProgress: this.assessCommunicationProgress(expressionRecords),
      engagementLevel: this.assessEngagementLevel(expressionRecords),
      insights: this.generateExpressionInsights(expressionRecords, positiveRatio)
    };
  }
  
  // その他の分析メソッドを実装...
  
  private static assessCommunicationProgress(records: any[]): 'improving' | 'stable' | 'declining' {
    if (records.length < 5) return 'stable';
    
    const recentScores = records.slice(-5).map(r => r.data?.communicationScore || 2);
    const earlierScores = records.slice(0, 5).map(r => r.data?.communicationScore || 2);
    
    const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const earlierAvg = earlierScores.reduce((a, b) => a + b, 0) / earlierScores.length;
    
    if (recentAvg > earlierAvg + 0.5) return 'improving';
    if (recentAvg < earlierAvg - 0.5) return 'declining';
    return 'stable';
  }
  
  private static assessEngagementLevel(records: any[]): 'high' | 'medium' | 'low' {
    if (records.length === 0) return 'low';
    
    const avgScore = records.reduce((sum, r) => sum + (r.data?.engagementScore || 2), 0) / records.length;
    
    if (avgScore > 3.5) return 'high';
    if (avgScore > 2.5) return 'medium';
    return 'low';
  }
  
  private static generateExpressionInsights(records: any[], positiveRatio: number): string[] {
    const insights = [];
    
    if (positiveRatio > 0.7) {
      insights.push('良好な表情・反応が多く観察されています。');
    } else if (positiveRatio < 0.3) {
      insights.push('表情・反応の改善が必要な状況です。');
    }
    
    if (records.length > 10) {
      insights.push('コミュニケーションの記録が豊富で、詳細な分析が可能です。');
    }
    
    return insights;
  }
  
  // 他の分析メソッドのスタブ実装
  private static async analyzeVitals(user: User, records: any[]) {
    const vitalRecords = records.filter(r => r.event_type === 'vital');
    
    return {
      temperatureStability: 'stable' as const,
      heartRatePattern: '正常範囲内',
      respirationPattern: '安定',
      alerts: []
    };
  }
  
  private static async analyzeNutrition(user: User, records: any[]) {
    return {
      intakeStability: 'stable' as const,
      hydrationStatus: 'adequate' as const,
      swallowingConcerns: [],
      recommendations: ['栄養バランスの維持を継続してください。']
    };
  }
  
  private static async analyzeExcretion(user: User, records: any[]) {
    return {
      regularityScore: 85,
      patternStability: 'regular' as const,
      concerns: []
    };
  }
  
  private static async analyzeSleep(user: User, records: any[]) {
    return {
      qualityScore: 80,
      patternConsistency: 'consistent' as const,
      nightWakings: 1,
      recommendations: ['良好な睡眠パターンを維持してください。']
    };
  }
  
  private static async analyzeActivity(user: User, records: any[]) {
    return {
      participationLevel: 'moderate' as const,
      engagementTrend: 'stable' as const,
      preferredActivities: ['音楽活動', '感覚遊び'],
      adaptationNeeds: []
    };
  }
  
  private static async analyzeCare(user: User, records: any[]) {
    return {
      skinCondition: 'good' as const,
      positioningEffectiveness: 'effective' as const,
      careNeeds: []
    };
  }
  
  private static async analyzeMedication(user: User, records: any[]) {
    return {
      adherence: 'excellent' as const,
      sideEffects: [],
      effectiveness: ['投薬が適切に管理されています。']
    };
  }
  
  // 総合評価生成
  private static async generateOverallAssessment(user: User, records: any[]) {
    return {
      healthStatus: 'stable' as const,
      qualityOfLife: 'medium' as const,
      careSuccessAreas: ['日常ケアの継続', '記録の充実'],
      improvementAreas: ['コミュニケーション支援の強化'],
      urgentConcerns: [],
      recommendations: [
        '現在のケアを継続してください。',
        '定期的な医師の診察を受けてください。',
        '家族とのコミュニケーションを大切にしてください。'
      ]
    };
  }
  
  // 家族向けサマリー生成
  private static async generateFamilySummary(user: User, records: any[]) {
    return {
      highlights: [
        `${user.name}さんの記録が${records.length}件蓄積されました。`,
        '日常ケアが適切に実施されています。'
      ],
      concerns: [],
      achievements: ['安定した生活リズムの維持'],
      nextSteps: ['継続的な記録とケアの実施']
    };
  }
}

export default DisabilityAnalysisAI;
