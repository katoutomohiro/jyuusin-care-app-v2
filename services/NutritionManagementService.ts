/**
 * 栄養管理サービス
 * 食事記録、栄養分析、アレルギー管理
 */

export interface FoodItem {
  id: string;
  name: string;
  category: 'grain' | 'vegetable' | 'fruit' | 'protein' | 'dairy' | 'fat' | 'beverage' | 'snack';
  calories: number;
  protein: number; // g
  fat: number; // g
  carbohydrate: number; // g
  fiber: number; // g
  sodium: number; // mg
  potassium: number; // mg
  calcium: number; // mg
  iron: number; // mg
  vitaminA: number; // IU
  vitaminC: number; // mg
  vitaminD: number; // IU
  vitaminE: number; // mg
  vitaminB12: number; // mcg
  folate: number; // mcg
  allergens: string[];
  isActive: boolean;
}

export interface Meal {
  id: string;
  userId: string;
  userName: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  time: string;
  foodItems: MealFoodItem[];
  totalNutrition: NutritionInfo;
  notes: string;
  appetite: 'excellent' | 'good' | 'fair' | 'poor' | 'none';
  completion: number; // 0-100
  texture: 'regular' | 'soft' | 'pureed' | 'liquid';
  temperature: 'hot' | 'warm' | 'cold';
  assistance: 'independent' | 'minimal' | 'moderate' | 'full';
  createdBy: string;
  createdAt: string;
}

export interface MealFoodItem {
  foodItemId: string;
  foodName: string;
  quantity: number;
  unit: string; // 個、g、mlなど
  nutrition: NutritionInfo;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  fiber: number;
  sodium: number;
  potassium: number;
  calcium: number;
  iron: number;
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
  vitaminE: number;
  vitaminB12: number;
  folate: number;
}

export interface NutritionGoal {
  id: string;
  userId: string;
  userName: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  fiber: number;
  sodium: number;
  potassium: number;
  calcium: number;
  iron: number;
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
  vitaminE: number;
  vitaminB12: number;
  folate: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface NutritionAnalysis {
  date: string;
  totalNutrition: NutritionInfo;
  goalNutrition: NutritionInfo;
  achievement: { [key: string]: number }; // 各栄養素の達成率
  recommendations: string[];
  riskFactors: string[];
  trends: NutritionTrend[];
}

export interface NutritionTrend {
  period: string;
  nutrition: NutritionInfo;
  trend: 'improving' | 'stable' | 'declining';
  factors: string[];
}

export interface FoodAllergy {
  id: string;
  userId: string;
  userName: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
  reaction: string;
  onsetTime: string;
  symptoms: string[];
  treatment: string;
  reportedBy: string;
  reportedAt: string;
  isActive: boolean;
}

export interface DietaryRestriction {
  id: string;
  userId: string;
  userName: string;
  type: 'allergy' | 'intolerance' | 'preference' | 'medical' | 'religious' | 'cultural';
  description: string;
  restrictedItems: string[];
  alternatives: string[];
  severity: 'strict' | 'moderate' | 'flexible';
  startDate: string;
  endDate?: string;
  reason: string;
  prescribedBy?: string;
  isActive: boolean;
}

export interface NutritionSettings {
  autoAnalysisEnabled: boolean;
  allergyChecking: boolean;
  goalTracking: boolean;
  trendAnalysis: boolean;
  notificationSettings: {
    lowIntake: boolean;
    highIntake: boolean;
    allergyRisk: boolean;
    goalAchievement: boolean;
  };
  thresholds: {
    lowCalorie: number;
    highSodium: number;
    lowProtein: number;
    lowFiber: number;
  };
}

export class NutritionManagementService {
  private static foodItems: Map<string, FoodItem> = new Map();
  private static meals: Meal[] = [];
  private static nutritionGoals: Map<string, NutritionGoal> = new Map();
  private static foodAllergies: FoodAllergy[] = [];
  private static dietaryRestrictions: DietaryRestriction[] = [];
  private static settings: NutritionSettings = {
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

  /**
   * 食品を追加
   */
  static addFoodItem(foodItem: FoodItem): void {
    // バリデーション
    if (!foodItem.id || !foodItem.name || !foodItem.category) {
      throw new Error('食品の基本情報が不足しています');
    }
    
    if (foodItem.calories < 0 || foodItem.protein < 0 || foodItem.fat < 0 || 
        foodItem.carbohydrate < 0 || foodItem.fiber < 0 || foodItem.sodium < 0 ||
        foodItem.potassium < 0 || foodItem.calcium < 0 || foodItem.iron < 0 ||
        foodItem.vitaminA < 0 || foodItem.vitaminC < 0 || foodItem.vitaminD < 0 ||
        foodItem.vitaminE < 0 || foodItem.vitaminB12 < 0 || foodItem.folate < 0) {
      throw new Error('栄養価に無効な値が含まれています');
    }
    
    this.foodItems.set(foodItem.id, foodItem);
  }

  /**
   * 全ての食品を取得
   */
  static getAllFoodItems(): FoodItem[] {
    return Array.from(this.foodItems.values()).filter(food => food.isActive);
  }

  /**
   * 食事を記録
   */
  static addMeal(meal: Omit<Meal, 'id' | 'totalNutrition' | 'createdAt'>): Meal {
    try {
      // バリデーション
      if (!meal.userId || !meal.userName || !meal.type || !meal.date || !meal.time) {
        throw new Error('食事の基本情報が不足しています');
      }
      
      if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(meal.type)) {
        throw new Error('無効な食事タイプです');
      }
      
      if (!['excellent', 'good', 'fair', 'poor', 'none'].includes(meal.appetite)) {
        throw new Error('無効な食欲レベルです');
      }
      
      if (!['regular', 'soft', 'pureed', 'liquid'].includes(meal.texture)) {
        throw new Error('無効な食形態です');
      }
      
      if (!['hot', 'warm', 'cold'].includes(meal.temperature)) {
        throw new Error('無効な温度です');
      }
      
      if (!['independent', 'minimal', 'moderate', 'full'].includes(meal.assistance)) {
        throw new Error('無効な介助レベルです');
      }
      
      if (meal.completion < 0 || meal.completion > 100) {
        throw new Error('完食率は0-100の範囲で指定してください');
      }
      
      const totalNutrition = this.calculateTotalNutrition(meal.foodItems);
      
      const newMeal: Meal = {
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
    } catch (error) {
      console.error('addMeal error:', error);
      throw error;
    }
  }

  /**
   * 栄養目標を設定
   */
  static setNutritionGoal(goal: Omit<NutritionGoal, 'id' | 'createdAt'>): NutritionGoal {
    try {
      const newGoal: NutritionGoal = {
        ...goal,
        id: this.generateId(),
        createdAt: new Date().toISOString()
      };
      
      this.nutritionGoals.set(goal.userId, newGoal);
      return newGoal;
    } catch (error) {
      console.error('setNutritionGoal error:', error);
      throw error;
    }
  }

  /**
   * 食品アレルギーを追加
   */
  static addFoodAllergy(allergy: Omit<FoodAllergy, 'id'>): void {
    try {
      const newAllergy: FoodAllergy = {
        ...allergy,
        id: this.generateId()
      };
      
      this.foodAllergies.push(newAllergy);
    } catch (error) {
      console.error('addFoodAllergy error:', error);
      throw error;
    }
  }

  /**
   * 食事制限を追加
   */
  static addDietaryRestriction(restriction: Omit<DietaryRestriction, 'id'>): void {
    try {
      const newRestriction: DietaryRestriction = {
        ...restriction,
        id: this.generateId()
      };
      
      this.dietaryRestrictions.push(newRestriction);
    } catch (error) {
      console.error('addDietaryRestriction error:', error);
      throw error;
    }
  }

  /**
   * 総栄養価を計算
   */
  private static calculateTotalNutrition(foodItems: MealFoodItem[]): NutritionInfo {
    const total: NutritionInfo = {
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
  private static analyzeNutrition(userId: string, date: string): void {
    const dailyMeals = this.meals.filter(m => m.userId === userId && m.date === date);
    const goal = this.nutritionGoals.get(userId);
    
    if (!goal) return;
    
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
  private static calculateDailyNutrition(meals: Meal[]): NutritionInfo {
    const total: NutritionInfo = {
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
  private static calculateAchievement(actual: NutritionInfo, goal: NutritionGoal): { [key: string]: number } {
    const achievement: { [key: string]: number } = {};
    
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
  private static generateRecommendations(actual: NutritionInfo, goal: NutritionGoal): string[] {
    const recommendations: string[] = [];
    
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
  private static identifyRiskFactors(nutrition: NutritionInfo): string[] {
    const riskFactors: string[] = [];
    
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
  private static checkAllergies(meal: Meal): void {
    const userAllergies = this.foodAllergies.filter(a => a.userId === meal.userId && a.isActive);
    
    meal.foodItems.forEach(foodItem => {
      const food = this.foodItems.get(foodItem.foodItemId);
      if (!food) return;
      
      userAllergies.forEach(allergy => {
        const hasAllergen = food.allergens.some(allergen => 
          allergen.toLowerCase().includes(allergy.allergen.toLowerCase())
        ) || food.name.toLowerCase().includes(allergy.allergen.toLowerCase());
        
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
  private static alertAllergyRisk(allergy: FoodAllergy, meal: Meal): void {
    console.error(`アレルギーリスクアラート: ${allergy.allergen} in ${meal.type} (${meal.userName})`);
    
    // 実際の実装では、緊急時対応システムに通知
    // EmergencyResponseService.detectEmergency(...)
  }

  /**
   * 食事記録を取得
   */
  static getUserMeals(userId: string, startDate?: string, endDate?: string): Meal[] {
    try {
      let filtered = this.meals.filter(m => m.userId === userId);
      
      if (startDate) {
        filtered = filtered.filter(m => m.date >= startDate);
      }
      
      if (endDate) {
        filtered = filtered.filter(m => m.date <= endDate);
      }
      
      return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('getUserMeals error:', error);
      throw error;
    }
  }

  /**
   * 日次栄養分析を取得
   */
  static getDailyNutritionAnalysis(userId: string, date: string): NutritionAnalysis | null {
    try {
      const dailyMeals = this.meals.filter(m => m.userId === userId && m.date === date);
      const goal = this.nutritionGoals.get(userId);
      
      if (!goal) return null;
      
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
    } catch (error) {
      console.error('getDailyNutritionAnalysis error:', error);
      throw error;
    }
  }

  /**
   * トレンドを計算
   */
  private static calculateTrends(userId: string, date: string): NutritionTrend[] {
    // 過去7日間のデータを分析
    const trends: NutritionTrend[] = [];
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
        trend: 'stable', // 実際は過去データと比較して計算
        factors: []
      });
    }
    
    return trends;
  }

  /**
   * 栄養目標を取得
   */
  static getNutritionGoal(userId: string): NutritionGoal | undefined {
    try {
      return this.nutritionGoals.get(userId);
    } catch (error) {
      console.error('getNutritionGoal error:', error);
      throw error;
    }
  }

  /**
   * 食品アレルギーを取得
   */
  static getUserFoodAllergies(userId: string): FoodAllergy[] {
    try {
      return this.foodAllergies
        .filter(a => a.userId === userId && a.isActive)
        .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
    } catch (error) {
      console.error('getUserFoodAllergies error:', error);
      throw error;
    }
  }

  /**
   * 食事制限を取得
   */
  static getUserDietaryRestrictions(userId: string): DietaryRestriction[] {
    try {
      return this.dietaryRestrictions
        .filter(r => r.userId === userId && r.isActive)
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    } catch (error) {
      console.error('getUserDietaryRestrictions error:', error);
      throw error;
    }
  }

  /**
   * 食品を検索
   */
  static searchFoodItems(query: string): FoodItem[] {
    const searchTerm = query.toLowerCase();
    return Array.from(this.foodItems.values())
      .filter(food => 
        food.isActive && 
        (food.name.toLowerCase().includes(searchTerm) || 
         food.category.toLowerCase().includes(searchTerm))
      )
      .slice(0, 20); // 最大20件
  }

  /**
   * 設定を更新
   */
  static updateSettings(newSettings: Partial<NutritionSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * 設定を取得
   */
  static getSettings(): NutritionSettings {
    return { ...this.settings };
  }

  /**
   * 日付別の食事を取得
   */
  static getUserMealsByDate(userId: string, date: string): Meal[] {
    try {
      return this.meals.filter(m => m.userId === userId && m.date === date);
    } catch (error) {
      console.error('getUserMealsByDate error:', error);
      throw error;
    }
  }

  /**
   * カテゴリ別の食品を取得
   */
  static getFoodItemsByCategory(category: string): FoodItem[] {
    try {
      return Array.from(this.foodItems.values())
        .filter(food => food.isActive && food.category === category);
    } catch (error) {
      console.error('getFoodItemsByCategory error:', error);
      throw error;
    }
  }

  /**
   * 栄養ギャップを特定
   */
  static identifyNutritionGaps(userId: string, date: string): string[] {
    try {
      const analysis = this.getDailyNutritionAnalysis(userId, date);
      if (!analysis) return [];
      
      const gaps: string[] = [];
      const goal = analysis.goalNutrition;
      const actual = analysis.totalNutrition;
      
      if (actual.calories < goal.calories * 0.8) {
        gaps.push('カロリー不足');
      }
      if (actual.protein < goal.protein * 0.8) {
        gaps.push('タンパク質不足');
      }
      if (actual.fiber < goal.fiber * 0.8) {
        gaps.push('食物繊維不足');
      }
      if (actual.calcium < goal.calcium * 0.8) {
        gaps.push('カルシウム不足');
      }
      if (actual.iron < goal.iron * 0.8) {
        gaps.push('鉄分不足');
      }
      
      return gaps;
    } catch (error) {
      console.error('identifyNutritionGaps error:', error);
      throw error;
    }
  }

  /**
   * アレルギー競合をチェック
   */
  static checkAllergenConflicts(userId: string, foodItemId: string): FoodAllergy[] {
    try {
      const food = this.foodItems.get(foodItemId);
      if (!food) return [];
      
      const userAllergies = this.foodAllergies.filter(a => a.userId === userId && a.isActive);
      const conflicts: FoodAllergy[] = [];
      
      userAllergies.forEach(allergy => {
        const hasAllergen = food.allergens.some(allergen => 
          allergen.toLowerCase().includes(allergy.allergen.toLowerCase())
        ) || food.name.toLowerCase().includes(allergy.allergen.toLowerCase());
        
        if (hasAllergen) {
          conflicts.push(allergy);
        }
      });
      
      return conflicts;
    } catch (error) {
      console.error('checkAllergenConflicts error:', error);
      throw error;
    }
  }

  /**
   * 食事制限の遵守をチェック
   */
  static checkDietaryCompliance(userId: string, foodItemId: string): DietaryRestriction[] {
    try {
      const food = this.foodItems.get(foodItemId);
      if (!food) return [];
      
      const restrictions = this.dietaryRestrictions.filter(r => r.userId === userId && r.isActive);
      const violations: DietaryRestriction[] = [];
      
      restrictions.forEach(restriction => {
        const hasRestrictedItem = restriction.restrictedItems.some(item => 
          food.name.toLowerCase().includes(item.toLowerCase()) ||
          food.category.toLowerCase().includes(item.toLowerCase())
        );
        
        if (hasRestrictedItem) {
          violations.push(restriction);
        }
      });
      
      return violations;
    } catch (error) {
      console.error('checkDietaryCompliance error:', error);
      throw error;
    }
  }

  /**
   * 目標進捗を追跡
   */
  static trackGoalProgress(userId: string, date: string): { [key: string]: number } {
    try {
      const goal = this.nutritionGoals.get(userId);
      if (!goal) return {};
      
      const analysis = this.getDailyNutritionAnalysis(userId, date);
      if (!analysis) return {};
      
      return analysis.achievement;
    } catch (error) {
      console.error('trackGoalProgress error:', error);
      throw error;
    }
  }

  // ヘルパーメソッド
  private static generateId(): string {
    return `nutrition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 