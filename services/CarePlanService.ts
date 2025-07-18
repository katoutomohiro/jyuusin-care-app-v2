/**
 * ケアプラン管理サービス
 * 個別ケアプランの作成、管理、進捗追跡
 */

import { User, DailyLog } from '../types';

export interface CarePlan {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed' | 'discontinued';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'daily' | 'weekly' | 'monthly' | 'long-term';
  goals: CareGoal[];
  interventions: CareIntervention[];
  assessments: CareAssessment[];
  progress: CareProgress;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  nextReviewDate?: string;
}

export interface CareGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'not_started' | 'in_progress' | 'achieved' | 'failed';
  priority: 'low' | 'medium' | 'high';
  measurable: boolean;
  measurementCriteria?: string;
  progress: number; // 0-100
  notes: string[];
}

export interface CareIntervention {
  id: string;
  title: string;
  description: string;
  type: 'physical' | 'cognitive' | 'social' | 'emotional' | 'medical' | 'nutritional' | 'environmental';
  frequency: 'daily' | 'weekly' | 'monthly' | 'as_needed';
  duration: number; // 分
  responsibleRole: string;
  instructions: string;
  precautions: string[];
  equipment: string[];
  status: 'active' | 'paused' | 'completed' | 'discontinued';
  effectiveness: 'not_evaluated' | 'effective' | 'partially_effective' | 'ineffective';
  lastPerformed?: string;
  nextScheduled?: string;
}

export interface CareAssessment {
  id: string;
  title: string;
  type: 'physical' | 'cognitive' | 'psychological' | 'social' | 'environmental' | 'nutritional';
  date: string;
  assessor: string;
  results: AssessmentResult[];
  recommendations: string[];
  nextAssessmentDate?: string;
}

export interface AssessmentResult {
  category: string;
  score?: number;
  level: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  description: string;
  observations: string[];
}

export interface CareProgress {
  overallProgress: number; // 0-100
  goalProgress: { [goalId: string]: number };
  interventionProgress: { [interventionId: string]: number };
  lastUpdated: string;
  trends: ProgressTrend[];
  achievements: Achievement[];
  challenges: Challenge[];
}

export interface ProgressTrend {
  period: string;
  progress: number;
  trend: 'improving' | 'stable' | 'declining';
  factors: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  impact: 'low' | 'medium' | 'high';
  category: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'mitigated';
  dateIdentified: string;
  resolutionDate?: string;
  resolutionNotes?: string;
}

export interface CarePlanTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  applicableConditions: string[];
  goals: Partial<CareGoal>[];
  interventions: Partial<CareIntervention>[];
  estimatedDuration: number; // 日
  successRate: number; // 0-100
  isActive: boolean;
}

export interface CarePlanSettings {
  autoReviewEnabled: boolean;
  reviewFrequency: 'weekly' | 'monthly' | 'quarterly';
  progressTrackingEnabled: boolean;
  goalRemindersEnabled: boolean;
  interventionSchedulingEnabled: boolean;
  assessmentRemindersEnabled: boolean;
  notificationSettings: {
    goalDeadlines: boolean;
    interventionDue: boolean;
    assessmentDue: boolean;
    reviewDue: boolean;
  };
}

export interface CarePlanSuggestion {
  longTermGoal: string;
  shortTermGoals: string[];
  tasks: {
    category: string;
    content: string;
  }[];
  rationale: string; // 提案理由
}

export class CarePlanService {
  private static carePlans: Map<string, CarePlan> = new Map();
  private static templates: CarePlanTemplate[] = [];
  private static settings: CarePlanSettings = {
    autoReviewEnabled: true,
    reviewFrequency: 'monthly',
    progressTrackingEnabled: true,
    goalRemindersEnabled: true,
    interventionSchedulingEnabled: true,
    assessmentRemindersEnabled: true,
    notificationSettings: {
      goalDeadlines: true,
      interventionDue: true,
      assessmentDue: true,
      reviewDue: true
    }
  };

  /**
   * ケアプランを作成
   */
  static async createCarePlan(
    userId: string,
    userName: string,
    title: string,
    description: string,
    startDate: string,
    endDate: string,
    category: 'daily' | 'weekly' | 'monthly' | 'long-term',
    createdBy: string
  ): Promise<CarePlan> {
    const carePlan: CarePlan = {
      id: this.generateId(),
      userId,
      userName,
      title,
      description,
      startDate,
      endDate,
      status: 'draft',
      priority: 'medium',
      category,
      goals: [],
      interventions: [],
      assessments: [],
      progress: {
        overallProgress: 0,
        goalProgress: {},
        interventionProgress: {},
        lastUpdated: new Date().toISOString(),
        trends: [],
        achievements: [],
        challenges: []
      },
      createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.carePlans.set(carePlan.id, carePlan);
    return carePlan;
  }

  /**
   * テンプレートからケアプランを作成
   */
  static async createCarePlanFromTemplate(
    userId: string,
    userName: string,
    templateId: string,
    customizations: Partial<CarePlan>,
    createdBy: string
  ): Promise<CarePlan> {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('テンプレートが見つかりません');
    }

    const carePlan = await this.createCarePlan(
      userId,
      userName,
      customizations.title || template.name,
      customizations.description || template.description,
      customizations.startDate || new Date().toISOString(),
      customizations.endDate || this.calculateEndDate(template.estimatedDuration),
      customizations.category || 'monthly',
      createdBy
    );

    // テンプレートの目標を追加
    template.goals.forEach(goalTemplate => {
      const goal: CareGoal = {
        id: this.generateId(),
        title: goalTemplate.title || '',
        description: goalTemplate.description || '',
        targetDate: goalTemplate.targetDate || this.calculateTargetDate(30),
        status: 'not_started',
        priority: goalTemplate.priority || 'medium',
        measurable: goalTemplate.measurable || false,
        measurementCriteria: goalTemplate.measurementCriteria,
        progress: 0,
        notes: []
      };
      carePlan.goals.push(goal);
    });

    // テンプレートの介入を追加
    template.interventions.forEach(interventionTemplate => {
      const intervention: CareIntervention = {
        id: this.generateId(),
        title: interventionTemplate.title || '',
        description: interventionTemplate.description || '',
        type: interventionTemplate.type || 'physical',
        frequency: interventionTemplate.frequency || 'daily',
        duration: interventionTemplate.duration || 30,
        responsibleRole: interventionTemplate.responsibleRole || '介護職員',
        instructions: interventionTemplate.instructions || '',
        precautions: interventionTemplate.precautions || [],
        equipment: interventionTemplate.equipment || [],
        status: 'active',
        effectiveness: 'not_evaluated'
      };
      carePlan.interventions.push(intervention);
    });

    this.carePlans.set(carePlan.id, carePlan);
    return carePlan;
  }

  /**
   * ケアプランを更新
   */
  static updateCarePlan(carePlanId: string, updates: Partial<CarePlan>): void {
    const carePlan = this.carePlans.get(carePlanId);
    if (carePlan) {
      const updatedCarePlan = {
        ...carePlan,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.carePlans.set(carePlanId, updatedCarePlan);
    }
  }

  /**
   * 目標を追加
   */
  static addGoal(carePlanId: string, goal: Omit<CareGoal, 'id'>): void {
    const carePlan = this.carePlans.get(carePlanId);
    if (carePlan) {
      const newGoal: CareGoal = {
        ...goal,
        id: this.generateId()
      };
      carePlan.goals.push(newGoal);
      this.updateCarePlan(carePlanId, carePlan);
    }
  }

  /**
   * 目標を更新
   */
  static updateGoal(carePlanId: string, goalId: string, updates: Partial<CareGoal>): void {
    const carePlan = this.carePlans.get(carePlanId);
    if (carePlan) {
      const goalIndex = carePlan.goals.findIndex(g => g.id === goalId);
      if (goalIndex !== -1) {
        carePlan.goals[goalIndex] = { ...carePlan.goals[goalIndex], ...updates };
        this.updateCarePlan(carePlanId, carePlan);
        this.updateProgress(carePlanId);
      }
    }
  }

  /**
   * 介入を追加
   */
  static addIntervention(carePlanId: string, intervention: Omit<CareIntervention, 'id'>): void {
    const carePlan = this.carePlans.get(carePlanId);
    if (carePlan) {
      const newIntervention: CareIntervention = {
        ...intervention,
        id: this.generateId()
      };
      carePlan.interventions.push(newIntervention);
      this.updateCarePlan(carePlanId, carePlan);
    }
  }

  /**
   * 介入を更新
   */
  static updateIntervention(carePlanId: string, interventionId: string, updates: Partial<CareIntervention>): void {
    const carePlan = this.carePlans.get(carePlanId);
    if (carePlan) {
      const interventionIndex = carePlan.interventions.findIndex(i => i.id === interventionId);
      if (interventionIndex !== -1) {
        carePlan.interventions[interventionIndex] = { ...carePlan.interventions[interventionIndex], ...updates };
        this.updateCarePlan(carePlanId, carePlan);
        this.updateProgress(carePlanId);
      }
    }
  }

  /**
   * 評価を追加
   */
  static addAssessment(carePlanId: string, assessment: Omit<CareAssessment, 'id'>): void {
    const carePlan = this.carePlans.get(carePlanId);
    if (carePlan) {
      const newAssessment: CareAssessment = {
        ...assessment,
        id: this.generateId()
      };
      carePlan.assessments.push(newAssessment);
      this.updateCarePlan(carePlanId, carePlan);
    }
  }

  /**
   * 進捗を更新
   */
  static updateProgress(carePlanId: string): void {
    const carePlan = this.carePlans.get(carePlanId);
    if (!carePlan) return;

    // 目標の進捗を計算
    const goalProgress: { [goalId: string]: number } = {};
    let totalGoalProgress = 0;
    
    carePlan.goals.forEach(goal => {
      goalProgress[goal.id] = goal.progress;
      totalGoalProgress += goal.progress;
    });

    const averageGoalProgress = carePlan.goals.length > 0 ? totalGoalProgress / carePlan.goals.length : 0;

    // 介入の進捗を計算
    const interventionProgress: { [interventionId: string]: number } = {};
    let totalInterventionProgress = 0;
    
    carePlan.interventions.forEach(intervention => {
      const progress = this.calculateInterventionProgress(intervention);
      interventionProgress[intervention.id] = progress;
      totalInterventionProgress += progress;
    });

    const averageInterventionProgress = carePlan.interventions.length > 0 ? totalInterventionProgress / carePlan.interventions.length : 0;

    // 全体の進捗を計算
    const overallProgress = (averageGoalProgress + averageInterventionProgress) / 2;

    // 進捗を更新
    carePlan.progress = {
      overallProgress,
      goalProgress,
      interventionProgress,
      lastUpdated: new Date().toISOString(),
      trends: this.calculateTrends(carePlan),
      achievements: this.identifyAchievements(carePlan),
      challenges: this.identifyChallenges(carePlan)
    };

    this.updateCarePlan(carePlanId, carePlan);
  }

  /**
   * 介入の進捗を計算
   */
  private static calculateInterventionProgress(intervention: CareIntervention): number {
    if (intervention.status === 'completed') return 100;
    if (intervention.status === 'discontinued') return 0;
    
    // 効果性に基づいて進捗を計算
    switch (intervention.effectiveness) {
      case 'effective': return 90;
      case 'partially_effective': return 60;
      case 'ineffective': return 20;
      case 'not_evaluated': return 50;
      default: return 50;
    }
  }

  /**
   * トレンドを計算
   */
  private static calculateTrends(carePlan: CarePlan): ProgressTrend[] {
    // モック実装（実際は過去の進捗データを分析）
    const trends: ProgressTrend[] = [
      {
        period: '過去1週間',
        progress: carePlan.progress.overallProgress,
        trend: carePlan.progress.overallProgress > 50 ? 'improving' : 'stable',
        factors: ['定期的な介入の実施', '目標の達成']
      }
    ];
    return trends;
  }

  /**
   * 達成を識別
   */
  private static identifyAchievements(carePlan: CarePlan): Achievement[] {
    const achievements: Achievement[] = [];
    
    carePlan.goals.forEach(goal => {
      if (goal.status === 'achieved') {
        achievements.push({
          id: this.generateId(),
          title: goal.title,
          description: goal.description,
          date: new Date().toISOString(),
          impact: goal.priority === 'high' ? 'high' : goal.priority === 'medium' ? 'medium' : 'low',
          category: 'goal_achievement'
        });
      }
    });

    return achievements;
  }

  /**
   * 課題を識別
   */
  private static identifyChallenges(carePlan: CarePlan): Challenge[] {
    const challenges: Challenge[] = [];
    
    carePlan.goals.forEach(goal => {
      if (goal.status === 'failed' || (goal.progress < 30 && new Date(goal.targetDate) < new Date())) {
        challenges.push({
          id: this.generateId(),
          title: `目標未達成: ${goal.title}`,
          description: goal.description,
          severity: goal.priority === 'high' ? 'high' : 'medium',
          status: 'active',
          dateIdentified: new Date().toISOString()
        });
      }
    });

    carePlan.interventions.forEach(intervention => {
      if (intervention.effectiveness === 'ineffective') {
        challenges.push({
          id: this.generateId(),
          title: `介入効果なし: ${intervention.title}`,
          description: intervention.description,
          severity: 'medium',
          status: 'active',
          dateIdentified: new Date().toISOString()
        });
      }
    });

    return challenges;
  }

  /**
   * ケアプランを取得
   */
  static getCarePlan(carePlanId: string): CarePlan | undefined {
    return this.carePlans.get(carePlanId);
  }

  /**
   * 利用者のケアプランを取得
   */
  static getUserCarePlans(userId: string): CarePlan[] {
    return Array.from(this.carePlans.values())
      .filter(plan => plan.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  /**
   * アクティブなケアプランを取得
   */
  static getActiveCarePlans(): CarePlan[] {
    return Array.from(this.carePlans.values())
      .filter(plan => plan.status === 'active')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  /**
   * テンプレートを追加
   */
  static addTemplate(template: CarePlanTemplate): void {
    this.templates.push(template);
  }

  /**
   * テンプレートを取得
   */
  static getTemplates(): CarePlanTemplate[] {
    return this.templates.filter(t => t.isActive);
  }

  /**
   * 設定を更新
   */
  static updateSettings(newSettings: Partial<CarePlanSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * 設定を取得
   */
  static getSettings(): CarePlanSettings {
    return { ...this.settings };
  }

  /**
   * 定期レビューを実行
   */
  static async performPeriodicReview(carePlanId: string, reviewer: string): Promise<void> {
    const carePlan = this.carePlans.get(carePlanId);
    if (!carePlan) return;

    // 進捗を更新
    this.updateProgress(carePlanId);

    // レビュー日を更新
    const nextReviewDate = this.calculateNextReviewDate();
    
    this.updateCarePlan(carePlanId, {
      reviewedAt: new Date().toISOString(),
      nextReviewDate
    });

    // 必要に応じてケアプランを更新
    this.autoUpdateCarePlan(carePlanId);
  }

  /**
   * ケアプランを自動更新
   */
  private static autoUpdateCarePlan(carePlanId: string): void {
    const carePlan = this.carePlans.get(carePlanId);
    if (!carePlan) return;

    // 達成された目標を完了にマーク
    carePlan.goals.forEach(goal => {
      if (goal.progress >= 100 && goal.status !== 'achieved') {
        goal.status = 'achieved';
      }
    });

    // 効果のない介入を一時停止
    carePlan.interventions.forEach(intervention => {
      if (intervention.effectiveness === 'ineffective' && intervention.status === 'active') {
        intervention.status = 'paused';
      }
    });

    this.updateCarePlan(carePlanId, carePlan);
  }

  // ヘルパーメソッド
  private static generateId(): string {
    return `care_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static calculateEndDate(durationDays: number): string {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);
    return endDate.toISOString();
  }

  private static calculateTargetDate(daysFromNow: number): string {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysFromNow);
    return targetDate.toISOString();
  }

  private static calculateNextReviewDate(): string {
    const nextReview = new Date();
    switch (this.settings.reviewFrequency) {
      case 'weekly':
        nextReview.setDate(nextReview.getDate() + 7);
        break;
      case 'monthly':
        nextReview.setMonth(nextReview.getMonth() + 1);
        break;
      case 'quarterly':
        nextReview.setMonth(nextReview.getMonth() + 3);
        break;
    }
    return nextReview.toISOString();
  }

  static async generateAISuggestions(user: User, logs: DailyLog[]): Promise<CarePlanSuggestion> {
    // ここでAIによる分析ロジックを実行
    // 例：発作記録が多い場合、発作管理を目標に設定
    const hasFrequentSeizures = logs.some(log => log.seizures && log.seizures.length > 0);
    
    let longTermGoal = "心身ともに安定した日々を送り、笑顔で過ごせる時間を増やす。";
    const shortTermGoals = ["バイタルサインの安定を維持する。", "コミュニケーションの機会を増やす。"];
    const tasks = [{ category: "健康管理", content: "日々のバイタルチェックと体調観察を継続する。" }];
    let rationale = "全体的な健康状態の維持とQOL向上を目指します。";

    if (hasFrequentSeizures) {
      longTermGoal = "発作のコントロールを行い、安全で快適な生活を送る。";
      shortTermGoals.push("発作の前兆を早期に察知し、迅速に対応できる体制を整える。");
      tasks.push({ category: "発作管理", content: "発作記録を詳細に分析し、トリガーやパターンを特定する。" });
      rationale = "発作記録の分析から、発作管理を中心とした計画を提案します。";
    }

    return { longTermGoal, shortTermGoals, tasks, rationale };
  }
} 