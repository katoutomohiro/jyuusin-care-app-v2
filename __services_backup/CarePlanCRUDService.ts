import { CarePlan, CarePlanStatus, CarePlanPriority, CarePlanCategory, CareGoal, CareService } from '../types';

const carePlans = new Map<string, CarePlan>();

/**
 * モックデータを作成して初期化
 */
const initializeMockData = () => {
    if (carePlans.size > 0) return;

    const mockPlan1: CarePlan = {
        id: `cp_${Date.now()}_1`,
        userId: 'user1',
        title: '個別支援計画書 (2024年度前期)',
        category: 'individual_support',
        longTermGoal: '安定した日常生活を送り、日中の活動に意欲的に参加できるようになる。',
        shortTermGoal: '身辺処理の自立度を高め、職員や他の利用者との円滑なコミュニケーションを図る。',
        goals: [
            {
                id: 'goal_1',
                type: 'physical',
                title: '身辺処理の自立',
                description: '食事、整容、更衣の自立度を向上させる',
                targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'in_progress',
                priority: 'high',
                measurable: true,
                measurementCriteria: '食事摂取量80%以上、更衣時間10分以内',
                progress: 65,
                notes: ['食事は順調に進んでいる', '更衣に時間がかかることがある']
            }
        ],
        services: [
            {
                id: 'service_1',
                name: '食事介助（一部）',
                description: '食事の見守りと必要に応じた介助',
                frequency: '毎日',
                duration: '30分',
                provider: '介護職員',
                location: '食堂',
                isActive: true,
                notes: '食事前の手洗いも含む'
            },
            {
                id: 'service_2',
                name: '整容・更衣の見守り・声かけ',
                description: '整容と更衣の自立支援',
                frequency: '毎日',
                duration: '20分',
                provider: '介護職員',
                location: '居室',
                isActive: true
            },
            {
                id: 'service_3',
                name: '集団活動への参加促し',
                description: '集団活動への積極的な参加を促す',
                frequency: '週3回',
                duration: '1時間',
                provider: '介護職員',
                location: '活動室',
                isActive: true
            },
            {
                id: 'service_4',
                name: '個別機能訓練（週2回）',
                description: '個別の機能訓練による能力向上',
                frequency: '週2回',
                duration: '45分',
                provider: '機能訓練担当者',
                location: '訓練室',
                isActive: true
            }
        ],
        status: 'active',
        priority: 'high',
        startDate: new Date().toISOString(),
        reviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: '利用者の意欲が高く、順調に進んでいる',
        createdBy: 'staff_001',
        updatedBy: 'staff_001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const mockPlan2: CarePlan = {
        id: `cp_${Date.now()}_2`,
        userId: 'user2',
        title: '放課後等デイサービス計画 (2024年5月)',
        category: 'social_participation',
        longTermGoal: '集団生活に適応し、好きなことや得意なことを見つける。',
        shortTermGoal: '友達と関わる機会を増やし、簡単なルールを守って遊ぶことができる。',
        goals: [
            {
                id: 'goal_2',
                type: 'social',
                title: '集団活動への参加',
                description: '集団活動に積極的に参加し、友達との関わりを深める',
                targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'in_progress',
                priority: 'medium',
                measurable: true,
                measurementCriteria: '週3回以上の集団活動参加',
                progress: 40,
                notes: ['音楽療法には積極的に参加している', '運動系の活動は慎重']
            }
        ],
        services: [
            {
                id: 'service_5',
                name: 'クールダウンのための個別スペース提供',
                description: '刺激が強い場合の個別スペース提供',
                frequency: '必要時',
                duration: '15分',
                provider: '指導員',
                location: '個別スペース',
                isActive: true,
                notes: 'イヤーマフを使用することがある'
            },
            {
                id: 'service_6',
                name: 'SST（ソーシャルスキルトレーニング）',
                description: '社会性を育むトレーニング',
                frequency: '週2回',
                duration: '30分',
                provider: '指導員',
                location: '活動室',
                isActive: true
            },
            {
                id: 'service_7',
                name: '感覚統合遊び',
                description: '感覚統合を促す遊び',
                frequency: '週3回',
                duration: '20分',
                provider: '指導員',
                location: '遊戯室',
                isActive: true
            },
            {
                id: 'service_8',
                name: '学習支援',
                description: '学習面でのサポート',
                frequency: '週2回',
                duration: '30分',
                provider: '指導員',
                location: '学習室',
                isActive: true
            }
        ],
        status: 'active',
        priority: 'medium',
        startDate: new Date().toISOString(),
        reviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'イヤーマフを使用することがある。感覚過敏に配慮が必要。',
        createdBy: 'staff_002',
        updatedBy: 'staff_002',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    carePlans.set(mockPlan1.id, mockPlan1);
    carePlans.set(mockPlan2.id, mockPlan2);
}

// 初期データを投入
initializeMockData();

export const fetchCarePlans = async (userId: string): Promise<CarePlan[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300)); 
    return Array.from(carePlans.values()).filter(plan => plan.userId === userId);
  } catch (error) {
    console.error('fetchCarePlans error:', error);
    throw error;
  }
};

export const addCarePlan = async (planData: Omit<CarePlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<CarePlan> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newPlan: CarePlan = {
      id: `cp_${Date.now()}`,
      ...planData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    carePlans.set(newPlan.id, newPlan);
    return newPlan;
  } catch (error) {
    console.error('addCarePlan error:', error);
    throw error;
  }
};

export const updateCarePlan = async (planId: string, updates: Partial<Omit<CarePlan, 'id' | 'createdAt' | 'updatedAt'>>): Promise<CarePlan> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentPlan = carePlans.get(planId);
    if (!currentPlan) {
      throw new Error('Care plan not found');
    }
    const updatedPlan: CarePlan = {
      ...currentPlan,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    carePlans.set(planId, updatedPlan);
    return updatedPlan;
  } catch (error) {
    console.error('updateCarePlan error:', error);
    throw error;
  }
};

export const deleteCarePlan = async (planId: string): Promise<void> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!carePlans.delete(planId)) {
      throw new Error('Care plan not found');
    }
  } catch (error) {
    console.error('deleteCarePlan error:', error);
    throw error;
  }
};

/**
 * ケアプランの進捗を更新
 */
export const updateCarePlanProgress = async (planId: string, progress: Partial<CarePlan['progress']>): Promise<CarePlan> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentPlan = carePlans.get(planId);
    if (!currentPlan) {
      throw new Error('Care plan not found');
    }
    
    const currentProgress = currentPlan.progress || {
      overallProgress: 0,
      goalProgress: {},
      serviceProgress: {},
      lastUpdated: new Date().toISOString(),
      trends: [],
      achievements: [],
      challenges: []
    };
    
    const updatedProgress = {
      ...currentProgress,
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    
    const updatedPlan: CarePlan = {
      ...currentPlan,
      progress: updatedProgress,
      updatedAt: new Date().toISOString(),
    };
    
    carePlans.set(planId, updatedPlan);
    return updatedPlan;
  } catch (error) {
    console.error('updateCarePlanProgress error:', error);
    throw error;
  }
};

/**
 * ケアプランの目標を更新
 */
export const updateCarePlanGoal = async (planId: string, goalId: string, goalUpdates: Partial<CareGoal>): Promise<CarePlan> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentPlan = carePlans.get(planId);
    if (!currentPlan) {
      throw new Error('Care plan not found');
    }
    
    const updatedGoals = currentPlan.goals.map(goal => 
      goal.id === goalId ? { ...goal, ...goalUpdates } : goal
    );
    
    const updatedPlan: CarePlan = {
      ...currentPlan,
      goals: updatedGoals,
      updatedAt: new Date().toISOString(),
    };
    
    carePlans.set(planId, updatedPlan);
    return updatedPlan;
  } catch (error) {
    console.error('updateCarePlanGoal error:', error);
    throw error;
  }
};

/**
 * ケアプランのサービスを更新
 */
export const updateCarePlanService = async (planId: string, serviceId: string, serviceUpdates: Partial<CareService>): Promise<CarePlan> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentPlan = carePlans.get(planId);
    if (!currentPlan) {
      throw new Error('Care plan not found');
    }
    
    const updatedServices = currentPlan.services.map(service => 
      service.id === serviceId ? { ...service, ...serviceUpdates } : service
    );
    
    const updatedPlan: CarePlan = {
      ...currentPlan,
      services: updatedServices,
      updatedAt: new Date().toISOString(),
    };
    
    carePlans.set(planId, updatedPlan);
    return updatedPlan;
  } catch (error) {
    console.error('updateCarePlanService error:', error);
    throw error;
  }
};