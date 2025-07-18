const plans = new Map();
/**
 * モックデータを作成して初期化
 */
const initializeMockData = () => {
    // すでにデータがあれば何もしない
    if (plans.size > 0 && Array.from(plans.values()).some(p => p.userId === 'user1')) {
        return;
    }
    const mockPlan1 = {
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
    const mockPlan2 = {
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
    plans.set(mockPlan1.id, mockPlan1);
    plans.set(mockPlan2.id, mockPlan2);
};
// 初期データを投入
initializeMockData();
export const fetchRehabilitationPlans = async (userId) => {
    try {
        console.log(`Fetching plans for userId: ${userId}`);
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
        const userPlans = Array.from(plans.values()).filter(plan => plan.userId === userId);
        return userPlans;
    }
    catch (error) {
        console.error('fetchRehabilitationPlans error:', error);
        throw error;
    }
};
export const addRehabilitationPlan = async (planData) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const newPlan = {
            id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...planData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        plans.set(newPlan.id, newPlan);
        return newPlan;
    }
    catch (error) {
        console.error('addRehabilitationPlan error:', error);
        throw error;
    }
};
export const updateRehabilitationPlan = async (planId, updates) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const currentPlan = plans.get(planId);
        if (!currentPlan) {
            throw new Error('Plan not found');
        }
        const updatedPlan = {
            ...currentPlan,
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        plans.set(planId, updatedPlan);
        return updatedPlan;
    }
    catch (error) {
        console.error('updateRehabilitationPlan error:', error);
        throw error;
    }
};
export const deleteRehabilitationPlan = async (planId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        if (!plans.delete(planId)) {
            throw new Error('Plan not found');
        }
    }
    catch (error) {
        console.error('deleteRehabilitationPlan error:', error);
        throw error;
    }
};
