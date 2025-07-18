/**
 * リハビリ管理サービス
 * リハビリ計画、進捗管理、運動機能評価
 */
export class RehabilitationManagementService {
    /**
     * リハビリ目標を追加
     */
    static addGoal(goal) {
        const newGoal = {
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
    static addSession(session) {
        const newSession = {
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
    static addAssessment(assessment) {
        const newAssessment = {
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
    static addExerciseProgram(program) {
        const newProgram = {
            ...program,
            id: this.generateId(),
            createdAt: new Date().toISOString()
        };
        this.exercisePrograms.set(newProgram.id, newProgram);
    }
    /**
     * 進捗レポートを生成
     */
    static generateProgressReport(userId, startDate, endDate) {
        const userGoals = Array.from(this.goals.values()).filter(g => g.userId === userId);
        const userSessions = this.sessions.filter(s => s.userId === userId && s.date >= startDate && s.date <= endDate);
        const userAssessments = this.assessments.filter(a => a.userId === userId && a.date >= startDate && a.date <= endDate);
        const goalProgress = userGoals.map(goal => {
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
        const sessionSummary = {
            totalSessions: userSessions.length,
            totalDuration: userSessions.reduce((sum, s) => sum + s.duration, 0),
            averageResponse: this.calculateAverageResponse(userSessions),
            averageCooperation: this.calculateAverageCooperation(userSessions),
            mostEffectiveActivities: this.identifyEffectiveActivities(userSessions),
            challenges: this.identifySessionChallenges(userSessions)
        };
        const assessmentSummary = userAssessments.map(assessment => {
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
        const report = {
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
    static updateGoalProgress(goalId) {
        const goal = this.goals.get(goalId);
        if (!goal)
            return;
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
    static updateRelatedGoalProgress(userId, assessmentType) {
        const relatedGoals = Array.from(this.goals.values())
            .filter(g => g.userId === userId && g.category === this.mapAssessmentToGoalCategory(assessmentType));
        relatedGoals.forEach(goal => {
            this.updateGoalProgress(goal.id);
        });
    }
    /**
     * 評価タイプを目標カテゴリにマッピング
     */
    static mapAssessmentToGoalCategory(assessmentType) {
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
    static trackProgress(userId) {
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
            }
            else if (goal.progress > this.settings.thresholds.highProgress) {
                console.log(`高進捗アラート: ${goal.title} (${goal.progress}%)`);
            }
        });
    }
    /**
     * 進捗要因を特定
     */
    static identifyProgressFactors(goalId, sessions) {
        const goalSessions = sessions.filter(s => s.goalId === goalId);
        const factors = [];
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
    static calculateAverageResponse(sessions) {
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
        if (responseScores.length === 0)
            return 'not_evaluated';
        const average = responseScores.reduce((sum, score) => sum + score, 0) / responseScores.length;
        if (average >= 90)
            return 'excellent';
        if (average >= 70)
            return 'good';
        if (average >= 50)
            return 'fair';
        return 'poor';
    }
    /**
     * 平均協力度を計算
     */
    static calculateAverageCooperation(sessions) {
        const cooperationScores = sessions.map(s => {
            switch (s.cooperation) {
                case 'excellent': return 100;
                case 'good': return 75;
                case 'fair': return 50;
                case 'poor': return 25;
                default: return 50;
            }
        });
        if (cooperationScores.length === 0)
            return 'not_evaluated';
        const average = cooperationScores.reduce((sum, score) => sum + score, 0) / cooperationScores.length;
        if (average >= 90)
            return 'excellent';
        if (average >= 70)
            return 'good';
        if (average >= 50)
            return 'fair';
        return 'poor';
    }
    /**
     * 効果的な活動を特定
     */
    static identifyEffectiveActivities(sessions) {
        const activityPerformance = {};
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
    static identifySessionChallenges(sessions) {
        const challenges = [];
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
    static identifyAchievements(goals, sessions) {
        const achievements = [];
        goals.forEach(goal => {
            if (goal.progress >= 100) {
                achievements.push(`${goal.title}の目標を達成`);
            }
            else if (goal.progress >= 80) {
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
    static identifyChallenges(goals, sessions) {
        const challenges = [];
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
    static generateRecommendations(goals, sessions, assessments) {
        const recommendations = [];
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
    static planNextSteps(goals, sessions, assessments) {
        const nextSteps = [];
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
    static getUserGoals(userId) {
        return Array.from(this.goals.values())
            .filter(g => g.userId === userId)
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    /**
     * 利用者のセッションを取得
     */
    static getUserSessions(userId, startDate, endDate) {
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
    static getUserAssessments(userId) {
        return this.assessments
            .filter(a => a.userId === userId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    /**
     * 利用者の運動プログラムを取得
     */
    static getUserExercisePrograms(userId) {
        return Array.from(this.exercisePrograms.values())
            .filter(p => p.userId === userId && p.isActive)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    /**
     * 利用者の進捗レポートを取得
     */
    static getUserProgressReports(userId) {
        return this.progressReports
            .filter(r => r.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    // ヘルパーメソッド
    static generateId() {
        return `rehab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
RehabilitationManagementService.goals = new Map();
RehabilitationManagementService.sessions = [];
RehabilitationManagementService.assessments = [];
RehabilitationManagementService.exercisePrograms = new Map();
RehabilitationManagementService.progressReports = [];
RehabilitationManagementService.settings = {
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
