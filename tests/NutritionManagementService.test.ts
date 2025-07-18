import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NutritionManagementService } from '../services/NutritionManagementService';
import { Meal, FoodItem, NutritionGoal, UserAllergy, DietaryRestriction } from '../types';

describe('NutritionManagementService', () => {
  beforeEach(() => {
    // テストデータをクリア
    NutritionManagementService['meals'] = [];
    NutritionManagementService['foodItems'] = [];
    NutritionManagementService['nutritionGoals'] = [];
    NutritionManagementService['userAllergies'] = [];
    NutritionManagementService['dietaryRestrictions'] = [];
  });

  afterEach(() => {
    // テストデータをクリア
    NutritionManagementService['meals'] = [];
    NutritionManagementService['foodItems'] = [];
    NutritionManagementService['nutritionGoals'] = [];
    NutritionManagementService['userAllergies'] = [];
    NutritionManagementService['dietaryRestrictions'] = [];
  });

  describe('Meal Management', () => {
    it('should add a meal', () => {
      const meal: Meal = {
        id: 'meal_1',
        userId: 'user1',
        date: '2024-01-15',
        mealType: 'breakfast',
        foods: [
          {
            foodId: 'food_1',
            name: 'ご飯',
            quantity: 100,
            unit: 'g',
            calories: 168,
            protein: 3.1,
            fat: 0.3,
            carbohydrate: 37.1,
            fiber: 0.3,
            sodium: 1,
            potassium: 29,
            calcium: 3,
            iron: 0.2,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 0,
            vitaminB12: 0,
            folate: 3
          }
        ],
        totalCalories: 168,
        totalProtein: 3.1,
        totalFat: 0.3,
        totalCarbohydrate: 37.1,
        completion: 80,
        notes: 'おいしかった',
        timestamp: new Date().toISOString()
      };

      NutritionManagementService.addMeal(meal);
      const userMeals = NutritionManagementService.getUserMeals('user1');

      expect(userMeals.length).toBe(1);
      expect(userMeals[0].id).toBe('meal_1');
    });

    it('should get user meals', () => {
      const meal: Meal = {
        id: 'meal_1',
        userId: 'user1',
        date: '2024-01-15',
        mealType: 'breakfast',
        foods: [],
        totalCalories: 168,
        totalProtein: 3.1,
        totalFat: 0.3,
        totalCarbohydrate: 37.1,
        completion: 80,
        notes: '',
        timestamp: new Date().toISOString()
      };

      NutritionManagementService.addMeal(meal);
      const userMeals = NutritionManagementService.getUserMeals('user1');

      expect(userMeals.length).toBe(1);
      expect(userMeals[0].userId).toBe('user1');
    });
  });

  describe('Food Item Management', () => {
    it('should add food items', () => {
      const foodItem: FoodItem = {
        id: 'food_1',
        name: 'ご飯',
        category: 'grain',
        calories: 168,
        protein: 3.1,
        fat: 0.3,
        carbohydrate: 37.1,
        fiber: 0.3,
        sodium: 1,
        potassium: 29,
        calcium: 3,
        iron: 0.2,
        vitaminA: 0,
        vitaminC: 0,
        vitaminD: 0,
        vitaminE: 0,
        vitaminB12: 0,
        folate: 3,
        allergens: [],
        isActive: true,
        notes: '白米'
      };

      NutritionManagementService.addFoodItem(foodItem);
      const foodItems = NutritionManagementService.getFoodItems();

      expect(foodItems.length).toBe(1);
      expect(foodItems[0].id).toBe('food_1');
    });

    it('should get food items by category', () => {
      const grainItem: FoodItem = {
        id: 'food_1',
        name: 'ご飯',
        category: 'grain',
        calories: 168,
        protein: 3.1,
        fat: 0.3,
        carbohydrate: 37.1,
        fiber: 0.3,
        sodium: 1,
        potassium: 29,
        calcium: 3,
        iron: 0.2,
        vitaminA: 0,
        vitaminC: 0,
        vitaminD: 0,
        vitaminE: 0,
        vitaminB12: 0,
        folate: 3,
        allergens: [],
        isActive: true,
        notes: '白米'
      };

      const proteinItem: FoodItem = {
        id: 'food_2',
        name: '鶏肉',
        category: 'protein',
        calories: 165,
        protein: 31,
        fat: 3.6,
        carbohydrate: 0,
        fiber: 0,
        sodium: 74,
        potassium: 256,
        calcium: 15,
        iron: 1.0,
        vitaminA: 6,
        vitaminC: 0,
        vitaminD: 0,
        vitaminE: 0.3,
        vitaminB12: 0.3,
        folate: 4,
        allergens: [],
        isActive: true,
        notes: '鶏むね肉'
      };

      NutritionManagementService.addFoodItem(grainItem);
      NutritionManagementService.addFoodItem(proteinItem);

      const grainItems = NutritionManagementService.getFoodItemsByCategory('grain');
      const proteinItems = NutritionManagementService.getFoodItemsByCategory('protein');

      expect(grainItems.length).toBe(1);
      expect(proteinItems.length).toBe(1);
    });
  });

  describe('Nutrition Analysis', () => {
    it('should analyze daily nutrition', () => {
      const meal: Meal = {
        id: 'meal_1',
        userId: 'user1',
        date: '2024-01-15',
        mealType: 'breakfast',
        foods: [
          {
            foodId: 'food_1',
            name: 'ご飯',
            quantity: 100,
            unit: 'g',
            calories: 168,
            protein: 3.1,
            fat: 0.3,
            carbohydrate: 37.1,
            fiber: 0.3,
            sodium: 1,
            potassium: 29,
            calcium: 3,
            iron: 0.2,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 0,
            vitaminB12: 0,
            folate: 3
          }
        ],
        totalCalories: 168,
        totalProtein: 3.1,
        totalFat: 0.3,
        totalCarbohydrate: 37.1,
        completion: 80,
        notes: '',
        timestamp: new Date().toISOString()
      };

      NutritionManagementService.addMeal(meal);
      const analysis = NutritionManagementService.analyzeDailyNutrition('user1', '2024-01-15');

      expect(analysis).toBeDefined();
      expect(analysis?.totalNutrition).toBeDefined();
    });
  });

  describe('Allergy Management', () => {
    it('should add user allergies', () => {
      const allergy: UserAllergy = {
        id: 'allergy_1',
        userId: 'user1',
        allergen: '卵',
        severity: 'moderate',
        symptoms: ['蕁麻疹', '腹痛'],
        diagnosisDate: '2020-01-01',
        isActive: true,
        notes: '卵白アレルギー',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      NutritionManagementService.addUserAllergy(allergy);
      const userAllergies = NutritionManagementService.getUserAllergies('user1');

      expect(userAllergies.length).toBe(1);
      expect(userAllergies[0].allergen).toBe('卵');
    });
  });

  describe('Dietary Restrictions', () => {
    it('should add dietary restrictions', () => {
      const restriction: DietaryRestriction = {
        id: 'restriction_1',
        userId: 'user1',
        type: 'religious',
        name: 'ハラル',
        description: 'イスラム教の食事制限',
        restrictions: ['豚肉禁止', 'アルコール禁止'],
        isActive: true,
        notes: '厳格に守る必要あり',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      NutritionManagementService.addDietaryRestriction(restriction);
      const userRestrictions = NutritionManagementService.getUserDietaryRestrictions('user1');

      expect(userRestrictions.length).toBe(1);
      expect(userRestrictions[0].type).toBe('religious');
    });
  });

  describe('Nutrition Goals', () => {
    it('should set and get nutrition goals', () => {
      const goal: NutritionGoal = {
        id: 'goal_1',
        userId: 'user1',
        userName: '田中 太郎',
        calories: 2000,
        protein: 60,
        fat: 65,
        carbohydrate: 250,
        fiber: 25,
        sodium: 2300,
        potassium: 3500,
        calcium: 1000,
        iron: 8,
        vitaminA: 900,
        vitaminC: 90,
        vitaminD: 600,
        vitaminE: 15,
        vitaminB12: 2.4,
        folate: 400,
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: '栄養士A',
        updatedAt: new Date().toISOString()
      };

      NutritionManagementService.setNutritionGoal(goal);
      const retrievedGoal = NutritionManagementService.getNutritionGoal('user1');

      expect(retrievedGoal).toBeDefined();
      expect(retrievedGoal?.userId).toBe('user1');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid meal data', () => {
      const invalidMeal = {
        userId: 'user1',
        // 必須フィールドが不足
      };

      expect(() => {
        NutritionManagementService.addMeal(invalidMeal as any);
      }).not.toThrow();
    });

    it('should handle invalid nutrition calculations', () => {
      const invalidFoodItem = {
        name: 'テスト食品',
        calories: -100, // 無効な値
        protein: 'invalid' // 無効な型
      };

      expect(() => {
        NutritionManagementService.addFoodItem(invalidFoodItem as FoodItem);
      }).not.toThrow();
    });
  });
}); 