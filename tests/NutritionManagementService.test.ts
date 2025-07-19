import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NutritionManagementService } from '../services/NutritionManagementService';

// モジュールとして認識させる
export {};

describe('NutritionManagementService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Service Tests', () => {
    it('should have NutritionManagementService class', () => {
      expect(NutritionManagementService).toBeDefined();
      expect(typeof NutritionManagementService).toBe('function');
    });

    it('should handle food item search', () => {
      expect(() => {
        const results = NutritionManagementService.searchFoodItems('ご飯');
        expect(Array.isArray(results)).toBe(true);
      }).not.toThrow();
    });

    it('should handle get all food items', () => {
      expect(() => {
        const foodItems = NutritionManagementService.getAllFoodItems();
        expect(Array.isArray(foodItems)).toBe(true);
      }).not.toThrow();
    });

    it('should handle nutrition goal retrieval', () => {
      expect(() => {
        const goal = NutritionManagementService.getNutritionGoal('user1');
        expect(goal === null || typeof goal === 'object').toBe(true);
      }).not.toThrow();
    });
  });
});