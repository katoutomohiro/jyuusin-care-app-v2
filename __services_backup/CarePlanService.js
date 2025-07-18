/**
 * ケアプラン管理サービス
 * 個別ケアプランの作成、管理、進捗追跡
 */
export class CarePlanService {
    /**
     * ケアプランを作成
     */
    static async createCarePlan(userId, userName, title, description, startDate, endDate, category, createdBy) {
        const carePlan = {
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
    static async createCarePlanFromTemplate(userId, userName, templateId, customizations, createdBy) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) {
            throw new Error('テンプレートが見つかりません');
        }
        const carePlan = await this.createCarePlan(userId, userName, customizations.title || template.name, customizations.description || template.description, customizations.startDate || new Date().toISOString(), customizations.endDate || this.calculateEndDate(template.estimatedDuration), customizations.category || 'monthly', createdBy);
        // テンプレートの目標を追加
        template.goals.forEach(goalTemplate => {
            const goal = {
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
            const intervention = {
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
    static updateCarePlan(carePlanId, updates) {
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
    static addGoal(carePlanId, goal) {
        const carePlan = this.carePlans.get(carePlanId);
        if (carePlan) {
            const newGoal = {
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
    static updateGoal(carePlanId, goalId, updates) {
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
    static addIntervention(carePlanId, intervention) {
        const carePlan = this.carePlans.get(carePlanId);
        if (carePlan) {
            const newIntervention = {
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
    static updateIntervention(carePlanId, interventionId, updates) {
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
    static addAssessment(carePlanId, assessment) {
        const carePlan = this.carePlans.get(carePlanId);
        if (carePlan) {
            const newAssessment = {
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
    static updateProgress(carePlanId) {
        const carePlan = this.carePlans.get(carePlanId);
        if (!carePlan)
            return;
        // 目標の進捗を計算
        const goalProgress = {};
        let totalGoalProgress = 0;
        carePlan.goals.forEach(goal => {
            goalProgress[goal.id] = goal.progress;
            totalGoalProgress += goal.progress;
        });
        const averageGoalProgress = carePlan.goals.length > 0 ? totalGoalProgress / carePlan.goals.length : 0;
        // 介入の進捗を計算
        const interventionProgress = {};
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
    static calculateInterventionProgress(intervention) {
        if (intervention.status === 'completed')
            return 100;
        if (intervention.status === 'discontinued')
            return 0;
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
    static calculateTrends(carePlan) {
        // モック実装（実際は過去の進捗データを分析）
        const trends = [
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
    static identifyAchievements(carePlan) {
        const achievements = [];
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
    static identifyChallenges(carePlan) {
        const challenges = [];
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
    static getCarePlan(carePlanId) {
        return this.carePlans.get(carePlanId);
    }
    /**
     * 利用者のケアプランを取得
     */
    static getUserCarePlans(userId) {
        return Array.from(this.carePlans.values())
            .filter(plan => plan.userId === userId)
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    /**
     * アクティブなケアプランを取得
     */
    static getActiveCarePlans() {
        return Array.from(this.carePlans.values())
            .filter(plan => plan.status === 'active')
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    /**
     * テンプレートを追加
     */
    static addTemplate(template) {
        this.templates.push(template);
    }
    /**
     * テンプレートを取得
     */
    static getTemplates() {
        return this.templates.filter(t => t.isActive);
    }
    /**
     * 設定を更新
     */
    static updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }
    /**
     * 設定を取得
     */
    static getSettings() {
        return { ...this.settings };
    }
    /**
     * 定期レビューを実行
     */
    static async performPeriodicReview(carePlanId, reviewer) {
        const carePlan = this.carePlans.get(carePlanId);
        if (!carePlan)
            return;
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
    static autoUpdateCarePlan(carePlanId) {
        const carePlan = this.carePlans.get(carePlanId);
        if (!carePlan)
            return;
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
    static generateId() {
        return `care_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    static calculateEndDate(durationDays) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + durationDays);
        return endDate.toISOString();
    }
    static calculateTargetDate(daysFromNow) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysFromNow);
        return targetDate.toISOString();
    }
    static calculateNextReviewDate() {
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
}
CarePlanService.carePlans = new Map();
CarePlanService.templates = [];
CarePlanService.settings = {
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
