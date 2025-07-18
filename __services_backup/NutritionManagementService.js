/**
 * 栄養管理サービス
 * 食事記録、栄養分析、アレルギー管理
 */
export class NutritionManagementService {
    /**
     * 食品を追加
     */
    static addFoodItem(foodItem) {
        this.foodItems.set(foodItem.id, foodItem);
    }
    /**
     * 食事を記録
     */
    static addMeal(meal) {
        try {
            const totalNutrition = this.calculateTotalNutrition(meal.foodItems);
            const newMeal = {
                ...meal,
                id: this.generateId(),
                totalNutrition,
                createdAt: new Date().toISOString()
            };
            this.meals.push(newMeal);
            // 栄養分析を実行
            if (this.settings.autoAnalysisEnabled) {
                this.analyzeNutrition(newMeal.userId, newMeal.date);
            }
            // アレルギーチェック
            if (this.settings.allergyChecking) {
                this.checkAllergies(newMeal);
            }
            return newMeal;
        }
        catch (error) {
            console.error('addMeal error:', error);
            throw error;
        }
    }
    /**
     * 栄養目標を設定
     */
    static setNutritionGoal(goal) {
        try {
            const newGoal = {
                ...goal,
                id: this.generateId(),
                createdAt: new Date().toISOString()
            };
            this.nutritionGoals.set(goal.userId, newGoal);
        }
        catch (error) {
            console.error('setNutritionGoal error:', error);
            throw error;
        }
    }
    /**
     * 食品アレルギーを追加
     */
    static addFoodAllergy(allergy) {
        try {
            const newAllergy = {
                ...allergy,
                id: this.generateId()
            };
            this.foodAllergies.push(newAllergy);
        }
        catch (error) {
            console.error('addFoodAllergy error:', error);
            throw error;
        }
    }
    /**
     * 食事制限を追加
     */
    static addDietaryRestriction(restriction) {
        try {
            const newRestriction = {
                ...restriction,
                id: this.generateId()
            };
            this.dietaryRestrictions.push(newRestriction);
        }
        catch (error) {
            console.error('addDietaryRestriction error:', error);
            throw error;
        }
    }
    /**
     * 総栄養価を計算
     */
    static calculateTotalNutrition(foodItems) {
        const total = {
            calories: 0,
            protein: 0,
            fat: 0,
            carbohydrate: 0,
            fiber: 0,
            sodium: 0,
            potassium: 0,
            calcium: 0,
            iron: 0,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 0,
            vitaminB12: 0,
            folate: 0
        };
        foodItems.forEach(item => {
            total.calories += item.nutrition.calories;
            total.protein += item.nutrition.protein;
            total.fat += item.nutrition.fat;
            total.carbohydrate += item.nutrition.carbohydrate;
            total.fiber += item.nutrition.fiber;
            total.sodium += item.nutrition.sodium;
            total.potassium += item.nutrition.potassium;
            total.calcium += item.nutrition.calcium;
            total.iron += item.nutrition.iron;
            total.vitaminA += item.nutrition.vitaminA;
            total.vitaminC += item.nutrition.vitaminC;
            total.vitaminD += item.nutrition.vitaminD;
            total.vitaminE += item.nutrition.vitaminE;
            total.vitaminB12 += item.nutrition.vitaminB12;
            total.folate += item.nutrition.folate;
        });
        return total;
    }
    /**
     * 栄養分析を実行
     */
    static analyzeNutrition(userId, date) {
        const dailyMeals = this.meals.filter(m => m.userId === userId && m.date === date);
        const goal = this.nutritionGoals.get(userId);
        if (!goal)
            return;
        const totalNutrition = this.calculateDailyNutrition(dailyMeals);
        const achievement = this.calculateAchievement(totalNutrition, goal);
        const recommendations = this.generateRecommendations(totalNutrition, goal);
        const riskFactors = this.identifyRiskFactors(totalNutrition);
        console.log(`栄養分析完了: ${userId} (${date})`);
        console.log('達成率:', achievement);
        console.log('推奨事項:', recommendations);
        console.log('リスク要因:', riskFactors);
    }
    /**
     * 日次栄養価を計算
     */
    static calculateDailyNutrition(meals) {
        const total = {
            calories: 0,
            protein: 0,
            fat: 0,
            carbohydrate: 0,
            fiber: 0,
            sodium: 0,
            potassium: 0,
            calcium: 0,
            iron: 0,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 0,
            vitaminB12: 0,
            folate: 0
        };
        meals.forEach(meal => {
            total.calories += meal.totalNutrition.calories;
            total.protein += meal.totalNutrition.protein;
            total.fat += meal.totalNutrition.fat;
            total.carbohydrate += meal.totalNutrition.carbohydrate;
            total.fiber += meal.totalNutrition.fiber;
            total.sodium += meal.totalNutrition.sodium;
            total.potassium += meal.totalNutrition.potassium;
            total.calcium += meal.totalNutrition.calcium;
            total.iron += meal.totalNutrition.iron;
            total.vitaminA += meal.totalNutrition.vitaminA;
            total.vitaminC += meal.totalNutrition.vitaminC;
            total.vitaminD += meal.totalNutrition.vitaminD;
            total.vitaminE += meal.totalNutrition.vitaminE;
            total.vitaminB12 += meal.totalNutrition.vitaminB12;
            total.folate += meal.totalNutrition.folate;
        });
        return total;
    }
    /**
     * 達成率を計算
     */
    static calculateAchievement(actual, goal) {
        const achievement = {};
        achievement.calories = (actual.calories / goal.calories) * 100;
        achievement.protein = (actual.protein / goal.protein) * 100;
        achievement.fat = (actual.fat / goal.fat) * 100;
        achievement.carbohydrate = (actual.carbohydrate / goal.carbohydrate) * 100;
        achievement.fiber = (actual.fiber / goal.fiber) * 100;
        achievement.sodium = (actual.sodium / goal.sodium) * 100;
        achievement.potassium = (actual.potassium / goal.potassium) * 100;
        achievement.calcium = (actual.calcium / goal.calcium) * 100;
        achievement.iron = (actual.iron / goal.iron) * 100;
        achievement.vitaminA = (actual.vitaminA / goal.vitaminA) * 100;
        achievement.vitaminC = (actual.vitaminC / goal.vitaminC) * 100;
        achievement.vitaminD = (actual.vitaminD / goal.vitaminD) * 100;
        achievement.vitaminE = (actual.vitaminE / goal.vitaminE) * 100;
        achievement.vitaminB12 = (actual.vitaminB12 / goal.vitaminB12) * 100;
        achievement.folate = (actual.folate / goal.folate) * 100;
        return achievement;
    }
    /**
     * 推奨事項を生成
     */
    static generateRecommendations(actual, goal) {
        const recommendations = [];
        if (actual.calories < goal.calories * 0.8) {
            recommendations.push('カロリー摂取量が不足しています。食事量を増やすことを検討してください。');
        }
        if (actual.protein < goal.protein * 0.8) {
            recommendations.push('タンパク質摂取量が不足しています。肉、魚、豆類の摂取を増やしてください。');
        }
        if (actual.fiber < goal.fiber * 0.8) {
            recommendations.push('食物繊維の摂取量が不足しています。野菜や果物の摂取を増やしてください。');
        }
        if (actual.sodium > goal.sodium * 1.2) {
            recommendations.push('塩分摂取量が多すぎます。減塩を心がけてください。');
        }
        if (actual.vitaminC < goal.vitaminC * 0.8) {
            recommendations.push('ビタミンCの摂取量が不足しています。柑橘類や野菜の摂取を増やしてください。');
        }
        return recommendations;
    }
    /**
     * リスク要因を特定
     */
    static identifyRiskFactors(nutrition) {
        const riskFactors = [];
        if (nutrition.calories < this.settings.thresholds.lowCalorie) {
            riskFactors.push('低カロリー摂取');
        }
        if (nutrition.sodium > this.settings.thresholds.highSodium) {
            riskFactors.push('高塩分摂取');
        }
        if (nutrition.protein < this.settings.thresholds.lowProtein) {
            riskFactors.push('低タンパク質摂取');
        }
        if (nutrition.fiber < this.settings.thresholds.lowFiber) {
            riskFactors.push('低食物繊維摂取');
        }
        return riskFactors;
    }
    /**
     * アレルギーチェック
     */
    static checkAllergies(meal) {
        const userAllergies = this.foodAllergies.filter(a => a.userId === meal.userId && a.isActive);
        meal.foodItems.forEach(foodItem => {
            const food = this.foodItems.get(foodItem.foodItemId);
            if (!food)
                return;
            userAllergies.forEach(allergy => {
                const hasAllergen = food.allergens.some(allergen => allergen.toLowerCase().includes(allergy.allergen.toLowerCase())) || food.name.toLowerCase().includes(allergy.allergen.toLowerCase());
                if (hasAllergen) {
                    console.error(`アレルギーリスク検出: ${allergy.allergen} in ${food.name}`);
                    this.alertAllergyRisk(allergy, meal);
                }
            });
        });
    }
    /**
     * アレルギーリスクのアラート
     */
    static alertAllergyRisk(allergy, meal) {
        console.error(`アレルギーリスクアラート: ${allergy.allergen} in ${meal.type} (${meal.userName})`);
        // 実際の実装では、緊急時対応システムに通知
        // EmergencyResponseService.detectEmergency(...)
    }
    /**
     * 食事記録を取得
     */
    static getUserMeals(userId, startDate, endDate) {
        try {
            let filtered = this.meals.filter(m => m.userId === userId);
            if (startDate) {
                filtered = filtered.filter(m => m.date >= startDate);
            }
            if (endDate) {
                filtered = filtered.filter(m => m.date <= endDate);
            }
            return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        catch (error) {
            console.error('getUserMeals error:', error);
            throw error;
        }
    }
    /**
     * 日次栄養分析を取得
     */
    static getDailyNutritionAnalysis(userId, date) {
        try {
            const dailyMeals = this.meals.filter(m => m.userId === userId && m.date === date);
            const goal = this.nutritionGoals.get(userId);
            if (!goal)
                return null;
            const totalNutrition = this.calculateDailyNutrition(dailyMeals);
            const achievement = this.calculateAchievement(totalNutrition, goal);
            const recommendations = this.generateRecommendations(totalNutrition, goal);
            const riskFactors = this.identifyRiskFactors(totalNutrition);
            return {
                date,
                totalNutrition,
                goalNutrition: goal,
                achievement,
                recommendations,
                riskFactors,
                trends: this.calculateTrends(userId, date)
            };
        }
        catch (error) {
            console.error('getDailyNutritionAnalysis error:', error);
            throw error;
        }
    }
    /**
     * トレンドを計算
     */
    static calculateTrends(userId, date) {
        // 過去7日間のデータを分析
        const trends = [];
        const today = new Date(date);
        for (let i = 6; i >= 0; i--) {
            const targetDate = new Date(today);
            targetDate.setDate(targetDate.getDate() - i);
            const dateStr = targetDate.toISOString().split('T')[0];
            const dailyMeals = this.meals.filter(m => m.userId === userId && m.date === dateStr);
            const nutrition = this.calculateDailyNutrition(dailyMeals);
            trends.push({
                period: dateStr,
                nutrition,
                trend: 'stable',
                factors: []
            });
        }
        return trends;
    }
    /**
     * 栄養目標を取得
     */
    static getNutritionGoal(userId) {
        try {
            return this.nutritionGoals.get(userId);
        }
        catch (error) {
            console.error('getNutritionGoal error:', error);
            throw error;
        }
    }
    /**
     * 食品アレルギーを取得
     */
    static getUserFoodAllergies(userId) {
        try {
            return this.foodAllergies
                .filter(a => a.userId === userId && a.isActive)
                .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
        }
        catch (error) {
            console.error('getUserFoodAllergies error:', error);
            throw error;
        }
    }
    /**
     * 食事制限を取得
     */
    static getUserDietaryRestrictions(userId) {
        try {
            return this.dietaryRestrictions
                .filter(r => r.userId === userId && r.isActive)
                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        }
        catch (error) {
            console.error('getUserDietaryRestrictions error:', error);
            throw error;
        }
    }
    /**
     * 食品を検索
     */
    static searchFoodItems(query) {
        const searchTerm = query.toLowerCase();
        return Array.from(this.foodItems.values())
            .filter(food => food.isActive &&
            (food.name.toLowerCase().includes(searchTerm) ||
                food.category.toLowerCase().includes(searchTerm)))
            .slice(0, 20); // 最大20件
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
        return `nutrition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
NutritionManagementService.foodItems = new Map();
NutritionManagementService.meals = [];
NutritionManagementService.nutritionGoals = new Map();
NutritionManagementService.foodAllergies = [];
NutritionManagementService.dietaryRestrictions = [];
NutritionManagementService.settings = {
    autoAnalysisEnabled: true,
    allergyChecking: true,
    goalTracking: true,
    trendAnalysis: true,
    notificationSettings: {
        lowIntake: true,
        highIntake: true,
        allergyRisk: true,
        goalAchievement: true
    },
    thresholds: {
        lowCalorie: 1200,
        highSodium: 2300,
        lowProtein: 50,
        lowFiber: 25
    }
};
