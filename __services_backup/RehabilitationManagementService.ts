/**
 * リハビリ管理サービス
 * リハビリ計画、進捗管理、運動機能評価
 */

import { RehabilitationPlan } from '../types';

export interface RehabilitationGoal {
  id: string;
  userId: string;
  userName: string;
  category: 'mobility' | 'adl' | 'communication' | 'cognition' | 'swallowing' | 'respiratory' | 'other';
  title: string;
  description: string;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'achieved' | 'discontinued' | 'on_hold';
  progress: number; // 0-100
  measurements: GoalMeasurement[];
  interventions: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalMeasurement {
  id: string;
  name: string;
  unit: string;
  baseline: number;
  target: number;
  current: number;
  lastUpdated: string;
}

export interface RehabilitationSession {
  id: string;
  userId: string;
  userName: string;
  goalId: string;
  goalTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // 分
  therapist: string;
  type: 'individual' | 'group' | 'home' | 'assessment';
  activities: SessionActivity[];
  notes: string;
  patientResponse: 'excellent' | 'good' | 'fair' | 'poor' | 'refused';
  cooperation: 'excellent' | 'good' | 'fair' | 'poor';
  fatigue: 'none' | 'mild' | 'moderate' | 'severe';
  pain: 'none' | 'mild' | 'moderate' | 'severe';
  createdBy: string;
  createdAt: string;
}

export interface SessionActivity {
  id: string;
  name: string;
  category: 'exercise' | 'training' | 'assessment' | 'education' | 'other';
  description: string;
  duration: number; // 分
  intensity: 'low' | 'moderate' | 'high';
  sets?: number;
  reps?: number;
  weight?: number;
  distance?: number;
  performance: 'excellent' | 'good' | 'fair' | 'poor' | 'unable';
  notes: string;
}

export interface FunctionalAssessment {
  id: string;
  userId: string;
  userName: string;
  assessmentType: 'barthel' | 'fim' | 'mmse' | 'gait' | 'balance' | 'strength' | 'custom';
  date: string;
  assessor: string;
  scores: AssessmentScore[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  interpretation: string;
  recommendations: string[];
  nextAssessmentDate: string;
  createdBy: string;
  createdAt: string;
}

export interface AssessmentScore {
  id: string;
  category: string;
  item: string;
  score: number;
  maxScore: number;
  notes: string;
}

export interface ExerciseProgram {
  id: string;
  userId: string;
  userName: string;
  name: string;
  description: string;
  category: 'strength' | 'endurance' | 'flexibility' | 'balance' | 'coordination' | 'cardio';
  exercises: ProgramExercise[];
  frequency: 'daily' | 'twice_daily' | 'three_times_daily' | 'weekly' | 'custom';
  duration: number; // 週間
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface ProgramExercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: number;
  duration: number; // 秒
  rest: number; // 秒
  intensity: 'low' | 'moderate' | 'high';
  equipment: string[];
  instructions: string;
  precautions: string[];
}

export interface ProgressReport {
  id: string;
  userId: string;
  userName: string;
  period: string; // 週次、月次など
  startDate: string;
  endDate: string;
  goals: GoalProgress[];
  sessions: SessionSummary[];
  assessments: AssessmentSummary[];
  achievements: string[];
  challenges: string[];
  recommendations: string[];
  nextSteps: string[];
  createdBy: string;
  createdAt: string;
}

export interface GoalProgress {
  goalId: string;
  goalTitle: string;
  baselineProgress: number;
  currentProgress: number;
  improvement: number;
  status: 'improving' | 'stable' | 'declining';
  factors: string[];
}

export interface SessionSummary {
  totalSessions: number;
  totalDuration: number;
  averageResponse: string;
  averageCooperation: string;
  mostEffectiveActivities: string[];
  challenges: string[];
}

export interface AssessmentSummary {
  assessmentType: string;
  baselineScore: number;
  currentScore: number;
  improvement: number;
  interpretation: string;
}

export interface RehabilitationSettings {
  autoProgressTracking: boolean;
  goalReminders: boolean;
  assessmentScheduling: boolean;
  progressReporting: boolean;
  notificationSettings: {
    goalDeadline: number; // 日前
    assessmentDue: number; // 日前
    sessionReminder: number; // 時間前
    progressReview: number; // 週間
  };
  thresholds: {
    lowProgress: number;
    highProgress: number;
    sessionFrequency: number;
    assessmentFrequency: number;
  };
}

export class RehabilitationManagementService {
  private static goals: Map<string, RehabilitationGoal> = new Map();
  private static sessions: RehabilitationSession[] = [];
  private static assessments: FunctionalAssessment[] = [];
  private static exercisePrograms: Map<string, ExerciseProgram> = new Map();
  private static progressReports: ProgressReport[] = [];
  private static settings: RehabilitationSettings = {
    autoProgressTracking: true,
    goalReminders: true,
    assessmentScheduling: true,
    progressReporting: true,
    notificationSettings: {
      goalDeadline: 7,
      assessmentDue: 3,
      sessionReminder: 2,
      progressReview: 4
    },
    thresholds: {
      lowProgress: 30,
      highProgress: 80,
      sessionFrequency: 3,
      assessmentFrequency: 4
    }
  };

  // --- Simple Rehabilitation Plan ---
  private static plans = new Map<string, RehabilitationPlan>();
  private static isMockDataInitialized = false;

  private static initializeMockPlans() {
    if (this.isMockDataInitialized) return;
    const mockPlan1: RehabilitationPlan = {
      id: `plan_${Date.now()}_1`,
      userId: 'user1',
      goal: '歩行能力の向上',
      activity: '平行棒内での歩行訓練',
      frequency: '週3回',
      progress: '安定して10m歩行可能',
      notes: '監視下でのみ実施',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const mockPlan2: RehabilitationPlan = {
      id: `plan_${Date.now()}_2`,
      userId: 'user1',
      goal: '食事動作の自立',
      activity: '自助具を使用した食事訓練',
      frequency: '毎食時',
      progress: 'スプーンの操作が改善',
      notes: 'むせ込みに注意',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.plans.set(mockPlan1.id, mockPlan1);
    this.plans.set(mockPlan2.id, mockPlan2);
    this.isMockDataInitialized = true;
  }
  
  public static async fetchRehabilitationPlans(userId: string): Promise<RehabilitationPlan[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const userPlans = Array.from(this.plans.values()).filter(plan => plan.userId === userId);
    if(userPlans.length === 0 && userId === 'user1') {
        const mockPlan1: RehabilitationPlan = {id: 'mock1', userId: 'user1', goal: '歩行能力の向上', activity: '平行棒内での歩行訓練', frequency: '週3回', progress: '安定して10m歩行可能', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()};
        this.plans.set(mockPlan1.id, mockPlan1);
        return [mockPlan1];
    }
    return userPlans;
  }
  
  public static async addRehabilitationPlan(planData: Omit<RehabilitationPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<RehabilitationPlan> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newPlan: RehabilitationPlan = {
      id: `plan_${Date.now()}`,
      ...planData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.plans.set(newPlan.id, newPlan);
    return newPlan;
  }
  
  public static async updateRehabilitationPlan(planId: string, updates: Partial<Omit<RehabilitationPlan, 'id' | 'createdAt' | 'updatedAt'>>): Promise<RehabilitationPlan> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const currentPlan = this.plans.get(planId);
    if (!currentPlan) throw new Error('Plan not found');
    const updatedPlan: RehabilitationPlan = { ...currentPlan, ...updates, updatedAt: new Date().toISOString() };
    this.plans.set(planId, updatedPlan);
    return updatedPlan;
  }
  
  public static async deleteRehabilitationPlan(planId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (!this.plans.delete(planId)) throw new Error('Plan not found');
  }

  /**
   * リハビリ目標を追加
   */
  static addGoal(goal: Omit<RehabilitationGoal, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newGoal: RehabilitationGoal = {
      ...goal,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.goals.set(newGoal.id, newGoal);
  }

  /**
   * リハビリセッションを追加
   */
  static addSession(session: Omit<RehabilitationSession, 'id' | 'createdAt'>): void {
    const newSession: RehabilitationSession = {
      ...session,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };
    
    this.sessions.push(newSession);
    
    // 目標の進捗を更新
    this.updateGoalProgress(session.goalId);
    
    // 自動進捗追跡
    if (this.settings.autoProgressTracking) {
      this.trackProgress(session.userId);
    }
  }

  /**
   * 機能評価を追加
   */
  static addAssessment(assessment: Omit<FunctionalAssessment, 'id' | 'createdAt'>): void {
    const newAssessment: FunctionalAssessment = {
      ...assessment,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };
    
    this.assessments.push(newAssessment);
    
    // 関連する目標の進捗を更新
    this.updateRelatedGoalProgress(assessment.userId, assessment.assessmentType);
  }

  /**
   * 運動プログラムを追加
   */
  static addExerciseProgram(program: Omit<ExerciseProgram, 'id' | 'createdAt'>): void {
    const newProgram: ExerciseProgram = {
      ...program,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };
    
    this.exercisePrograms.set(newProgram.id, newProgram);
  }

  /**
   * 進捗レポートを生成
   */
  static generateProgressReport(userId: string, startDate: string, endDate: string): ProgressReport {
    const userGoals = Array.from(this.goals.values()).filter(g => g.userId === userId);
    const userSessions = this.sessions.filter(s => s.userId === userId && s.date >= startDate && s.date <= endDate);
    const userAssessments = this.assessments.filter(a => a.userId === userId && a.date >= startDate && a.date <= endDate);
    
    const goalProgress: GoalProgress[] = userGoals.map(goal => {
      const baselineProgress = goal.measurements.reduce((sum, m) => sum + m.baseline, 0) / goal.measurements.length;
      const currentProgress = goal.measurements.reduce((sum, m) => sum + m.current, 0) / goal.measurements.length;
      
      return {
        goalId: goal.id,
        goalTitle: goal.title,
        baselineProgress,
        currentProgress,
        improvement: currentProgress - baselineProgress,
        status: currentProgress > baselineProgress ? 'improving' : currentProgress < baselineProgress ? 'declining' : 'stable',
        factors: this.identifyProgressFactors(goal.id, userSessions)
      };
    });
    
    const sessionSummary: SessionSummary = {
      totalSessions: userSessions.length,
      totalDuration: userSessions.reduce((sum, s) => sum + s.duration, 0),
      averageResponse: this.calculateAverageResponse(userSessions),
      averageCooperation: this.calculateAverageCooperation(userSessions),
      mostEffectiveActivities: this.identifyEffectiveActivities(userSessions),
      challenges: this.identifySessionChallenges(userSessions)
    };
    
    const assessmentSummary: AssessmentSummary[] = userAssessments.map(assessment => {
      const previousAssessment = this.assessments
        .filter(a => a.userId === userId && a.assessmentType === assessment.assessmentType && a.date < assessment.date)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      return {
        assessmentType: assessment.assessmentType,
        baselineScore: previousAssessment?.totalScore || assessment.totalScore,
        currentScore: assessment.totalScore,
        improvement: assessment.totalScore - (previousAssessment?.totalScore || assessment.totalScore),
        interpretation: assessment.interpretation
      };
    });
    
    const achievements = this.identifyAchievements(userGoals, userSessions);
    const challenges = this.identifyChallenges(userGoals, userSessions);
    const recommendations = this.generateRecommendations(userGoals, userSessions, userAssessments);
    const nextSteps = this.planNextSteps(userGoals, userSessions, userAssessments);
    
    const report: ProgressReport = {
      id: this.generateId(),
      userId,
      userName: userGoals[0]?.userName || '',
      period: '週次',
      startDate,
      endDate,
      goals: goalProgress,
      sessions: [sessionSummary],
      assessments: assessmentSummary,
      achievements,
      challenges,
      recommendations,
      nextSteps,
      createdBy: 'システム',
      createdAt: new Date().toISOString()
    };
    
    this.progressReports.push(report);
    return report;
  }

  /**
   * 目標の進捗を更新
   */
  private static updateGoalProgress(goalId: string): void {
    const goal = this.goals.get(goalId);
    if (!goal) return;
    
    // 最新のセッションから進捗を計算
    const recentSessions = this.sessions
      .filter(s => s.goalId === goalId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // 最新5セッション
    
    if (recentSessions.length > 0) {
      const averagePerformance = recentSessions.reduce((sum, session) => {
        const activityPerformance = session.activities.reduce((activitySum, activity) => {
          const performanceScore = activity.performance === 'excellent' ? 100 :
                                  activity.performance === 'good' ? 75 :
                                  activity.performance === 'fair' ? 50 :
                                  activity.performance === 'poor' ? 25 : 0;
          return activitySum + performanceScore;
        }, 0) / session.activities.length;
        
        return sum + activityPerformance;
      }, 0) / recentSessions.length;
      
      goal.progress = Math.min(100, Math.max(0, averagePerformance));
      goal.updatedAt = new Date().toISOString();
      
      this.goals.set(goal.id, goal);
    }
  }

  /**
   * 関連する目標の進捗を更新
   */
  private static updateRelatedGoalProgress(userId: string, assessmentType: string): void {
    const relatedGoals = Array.from(this.goals.values())
      .filter(g => g.userId === userId && g.category === this.mapAssessmentToGoalCategory(assessmentType));
    
    relatedGoals.forEach(goal => {
      this.updateGoalProgress(goal.id);
    });
  }

  /**
   * 評価タイプを目標カテゴリにマッピング
   */
  private static mapAssessmentToGoalCategory(assessmentType: string): string {
    switch (assessmentType) {
      case 'barthel':
      case 'fim':
        return 'adl';
      case 'mmse':
        return 'cognition';
      case 'gait':
      case 'balance':
        return 'mobility';
      case 'strength':
        return 'mobility';
      default:
        return 'other';
    }
  }

  /**
   * 進捗を追跡
   */
  private static trackProgress(userId: string): void {
    const userGoals = Array.from(this.goals.values()).filter(g => g.userId === userId);
    
    userGoals.forEach(goal => {
      // 目標期限のチェック
      const daysToDeadline = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToDeadline <= this.settings.notificationSettings.goalDeadline) {
        console.log(`目標期限アラート: ${goal.title} (${daysToDeadline}日後)`);
      }
      
      // 進捗率のチェック
      if (goal.progress < this.settings.thresholds.lowProgress) {
        console.log(`低進捗アラート: ${goal.title} (${goal.progress}%)`);
      } else if (goal.progress > this.settings.thresholds.highProgress) {
        console.log(`高進捗アラート: ${goal.title} (${goal.progress}%)`);
      }
    });
  }

  /**
   * 進捗要因を特定
   */
  private static identifyProgressFactors(goalId: string, sessions: RehabilitationSession[]): string[] {
    const goalSessions = sessions.filter(s => s.goalId === goalId);
    const factors: string[] = [];
    
    if (goalSessions.length === 0) {
      factors.push('セッション未実施');
      return factors;
    }
    
    const averageResponse = this.calculateAverageResponse(goalSessions);
    const averageCooperation = this.calculateAverageCooperation(goalSessions);
    
    if (averageResponse === 'excellent' || averageResponse === 'good') {
      factors.push('良好な反応');
    }
    
    if (averageCooperation === 'excellent' || averageCooperation === 'good') {
      factors.push('良好な協力');
    }
    
    if (goalSessions.length >= this.settings.thresholds.sessionFrequency) {
      factors.push('定期的なセッション実施');
    }
    
    return factors;
  }

  /**
   * 平均反応を計算
   */
  private static calculateAverageResponse(sessions: RehabilitationSession[]): string {
    const responseScores = sessions.map(s => {
      switch (s.patientResponse) {
        case 'excellent': return 100;
        case 'good': return 75;
        case 'fair': return 50;
        case 'poor': return 25;
        case 'refused': return 0;
        default: return 50;
      }
    });
    
    if (responseScores.length === 0) return 'not_evaluated';

    const average = responseScores.reduce<number>((sum, score) => sum + score, 0) / responseScores.length;
    
    if (average >= 90) return 'excellent';
    if (average >= 70) return 'good';
    if (average >= 50) return 'fair';
    return 'poor';
  }

  /**
   * 平均協力度を計算
   */
  private static calculateAverageCooperation(sessions: RehabilitationSession[]): string {
    const cooperationScores = sessions.map(s => {
      switch (s.cooperation) {
        case 'excellent': return 100;
        case 'good': return 75;
        case 'fair': return 50;
        case 'poor': return 25;
        default: return 50;
      }
    });
    
    if (cooperationScores.length === 0) return 'not_evaluated';

    const average = cooperationScores.reduce<number>((sum, score) => sum + score, 0) / cooperationScores.length;
    
    if (average >= 90) return 'excellent';
    if (average >= 70) return 'good';
    if (average >= 50) return 'fair';
    return 'poor';
  }

  /**
   * 効果的な活動を特定
   */
  private static identifyEffectiveActivities(sessions: RehabilitationSession[]): string[] {
    const activityPerformance: { [key: string]: number[] } = {};
    
    sessions.forEach(session => {
      session.activities.forEach(activity => {
        if (!activityPerformance[activity.name]) {
          activityPerformance[activity.name] = [];
        }
        
        const score = activity.performance === 'excellent' ? 100 :
                     activity.performance === 'good' ? 75 :
                     activity.performance === 'fair' ? 50 :
                     activity.performance === 'poor' ? 25 : 0;
        
        activityPerformance[activity.name].push(score);
      });
    });
    
    const effectiveActivities = Object.entries(activityPerformance)
      .map(([name, scores]) => ({
        name,
        averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length
      }))
      .filter(activity => activity.averageScore >= 70)
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5)
      .map(activity => activity.name);
    
    return effectiveActivities;
  }

  /**
   * セッションの課題を特定
   */
  private static identifySessionChallenges(sessions: RehabilitationSession[]): string[] {
    const challenges: string[] = [];
    
    const poorResponseCount = sessions.filter(s => s.patientResponse === 'poor' || s.patientResponse === 'refused').length;
    const poorCooperationCount = sessions.filter(s => s.cooperation === 'poor').length;
    const highFatigueCount = sessions.filter(s => s.fatigue === 'moderate' || s.fatigue === 'severe').length;
    const highPainCount = sessions.filter(s => s.pain === 'moderate' || s.pain === 'severe').length;
    
    if (poorResponseCount > sessions.length * 0.3) {
      challenges.push('患者の反応が不良');
    }
    
    if (poorCooperationCount > sessions.length * 0.3) {
      challenges.push('協力度が低い');
    }
    
    if (highFatigueCount > sessions.length * 0.3) {
      challenges.push('疲労が強い');
    }
    
    if (highPainCount > sessions.length * 0.3) {
      challenges.push('疼痛がある');
    }
    
    return challenges;
  }

  /**
   * 達成事項を特定
   */
  private static identifyAchievements(goals: RehabilitationGoal[], sessions: RehabilitationSession[]): string[] {
    const achievements: string[] = [];
    
    goals.forEach(goal => {
      if (goal.progress >= 100) {
        achievements.push(`${goal.title}の目標を達成`);
      } else if (goal.progress >= 80) {
        achievements.push(`${goal.title}の目標に近づいている`);
      }
    });
    
    if (sessions.length >= this.settings.thresholds.sessionFrequency) {
      achievements.push('定期的なセッション実施を継続');
    }
    
    return achievements;
  }

  /**
   * 課題を特定
   */
  private static identifyChallenges(goals: RehabilitationGoal[], sessions: RehabilitationSession[]): string[] {
    const challenges: string[] = [];
    
    goals.forEach(goal => {
      if (goal.progress < this.settings.thresholds.lowProgress) {
        challenges.push(`${goal.title}の進捗が遅れている`);
      }
    });
    
    if (sessions.length < this.settings.thresholds.sessionFrequency) {
      challenges.push('セッション実施頻度が不足');
    }
    
    return challenges;
  }

  /**
   * 推奨事項を生成
   */
  private static generateRecommendations(goals: RehabilitationGoal[], sessions: RehabilitationSession[], assessments: FunctionalAssessment[]): string[] {
    const recommendations: string[] = [];
    
    goals.forEach(goal => {
      if (goal.progress < this.settings.thresholds.lowProgress) {
        recommendations.push(`${goal.title}の介入方法を見直す`);
      }
    });
    
    if (sessions.length < this.settings.thresholds.sessionFrequency) {
      recommendations.push('セッション頻度を増やす');
    }
    
    const recentAssessment = assessments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    if (recentAssessment && recentAssessment.percentage < 50) {
      recommendations.push('評価結果に基づいて介入を強化する');
    }
    
    return recommendations;
  }

  /**
   * 次のステップを計画
   */
  private static planNextSteps(goals: RehabilitationGoal[], sessions: RehabilitationSession[], assessments: FunctionalAssessment[]): string[] {
    const nextSteps: string[] = [];
    
    goals.forEach(goal => {
      if (goal.status === 'active') {
        nextSteps.push(`${goal.title}の継続的な介入`);
      }
    });
    
    const assessmentDue = assessments.length === 0 || 
      new Date(assessments[assessments.length - 1].date).getTime() < 
      new Date().getTime() - (this.settings.thresholds.assessmentFrequency * 7 * 24 * 60 * 60 * 1000);
    
    if (assessmentDue) {
      nextSteps.push('定期的な機能評価の実施');
    }
    
    return nextSteps;
  }

  /**
   * 利用者の目標を取得
   */
  static getUserGoals(userId: string): RehabilitationGoal[] {
    return Array.from(this.goals.values())
      .filter(g => g.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  /**
   * 利用者のセッションを取得
   */
  static getUserSessions(userId: string, startDate?: string, endDate?: string): RehabilitationSession[] {
    let filtered = this.sessions.filter(s => s.userId === userId);
    
    if (startDate) {
      filtered = filtered.filter(s => s.date >= startDate);
    }
    
    if (endDate) {
      filtered = filtered.filter(s => s.date <= endDate);
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * 利用者の評価を取得
   */
  static getUserAssessments(userId: string): FunctionalAssessment[] {
    return this.assessments
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * 利用者の運動プログラムを取得
   */
  static getUserExercisePrograms(userId: string): ExerciseProgram[] {
    return Array.from(this.exercisePrograms.values())
      .filter(p => p.userId === userId && p.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * 利用者の進捗レポートを取得
   */
  static getUserProgressReports(userId: string): ProgressReport[] {
    return this.progressReports
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * 設定を更新
   */
  static updateSettings(newSettings: Partial<RehabilitationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * 設定を取得
   */
  static getSettings(): RehabilitationSettings {
    return { ...this.settings };
  }

  // ヘルパーメソッド
  private static generateId(): string {
    return `rehab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const fetchRehabilitationPlans = (userId: string) => RehabilitationManagementService.fetchRehabilitationPlans(userId);
export const addRehabilitationPlan = (planData: Omit<RehabilitationPlan, 'id' | 'createdAt' | 'updatedAt'>) => RehabilitationManagementService.addRehabilitationPlan(planData);
export const updateRehabilitationPlan = (planId: string, updates: Partial<Omit<RehabilitationPlan, 'id' | 'createdAt' | 'updatedAt'>>) => RehabilitationManagementService.updateRehabilitationPlan(planId, updates);
export const deleteRehabilitationPlan = (planId: string) => RehabilitationManagementService.deleteRehabilitationPlan(planId); 