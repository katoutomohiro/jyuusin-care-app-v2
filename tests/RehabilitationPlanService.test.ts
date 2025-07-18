import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchRehabilitationPlans, addRehabilitationPlan, updateRehabilitationPlan, deleteRehabilitationPlan } from '../services/RehabilitationPlanService';
import { RehabilitationPlan } from '../types';

describe('RehabilitationPlanService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchRehabilitationPlans', () => {
    it('should fetch rehabilitation plans for a specific user', async () => {
      const userId = 'user1';
      const plans = await fetchRehabilitationPlans(userId);
      expect(Array.isArray(plans)).toBe(true);
      plans.forEach(plan => {
        expect(plan.userId).toBe(userId);
        expect(plan.id).toBeDefined();
        expect(plan.goal).toBeDefined();
        expect(plan.activity).toBeDefined();
        expect(plan.frequency).toBeDefined();
        expect(plan.progress).toBeDefined();
        expect(plan.createdAt).toBeDefined();
        expect(plan.updatedAt).toBeDefined();
      });
    });
    
    it('should return empty array for non-existent user', async () => {
      const userId = 'non-existent-user';
      const plans = await fetchRehabilitationPlans(userId);
      expect(plans).toEqual([]);
    });
  });

  describe('addRehabilitationPlan', () => {
    it('should add a new rehabilitation plan', async () => {
      const planData = {
        userId: 'user1',
        goal: '新しい目標',
        activity: '新しい活動',
        frequency: '週1回',
        progress: '未実施',
        notes: 'テスト用'
      };
      const newPlan = await addRehabilitationPlan(planData);
      expect(newPlan.id).toBeDefined();
      expect(newPlan.userId).toBe(planData.userId);
      expect(newPlan.goal).toBe(planData.goal);
      expect(newPlan.activity).toBe(planData.activity);
      expect(newPlan.frequency).toBe(planData.frequency);
      expect(newPlan.progress).toBe(planData.progress);
      expect(newPlan.notes).toBe(planData.notes);
      expect(newPlan.createdAt).toBeDefined();
      expect(newPlan.updatedAt).toBeDefined();
      
      // 後始末
      await deleteRehabilitationPlan(newPlan.id);
    });
    
    it('should generate unique IDs for different plans', async () => {
      const planData1 = {
        userId: 'user1',
        goal: '目標1',
        activity: '活動1',
        frequency: '週1回',
        progress: '進行中',
        notes: 'メモ1'
      };
      const planData2 = {
        userId: 'user1',
        goal: '目標2',
        activity: '活動2',
        frequency: '週2回',
        progress: '未実施',
        notes: 'メモ2'
      };
      const plan1 = await addRehabilitationPlan(planData1);
      const plan2 = await addRehabilitationPlan(planData2);
      expect(plan1.id).not.toBe(plan2.id);
      
      // 後始末
      await deleteRehabilitationPlan(plan1.id);
      await deleteRehabilitationPlan(plan2.id);
    });
  });

  describe('updateRehabilitationPlan', () => {
    it('should update an existing rehabilitation plan', async () => {
      const planData = {
        userId: 'user1',
        goal: '元の目標',
        activity: '元の活動',
        frequency: '週1回',
        progress: '未実施',
        notes: '元のメモ'
      };
      const originalPlan = await addRehabilitationPlan(planData);
      const updates = {
        goal: '更新後の目標',
        progress: '進行中',
        notes: '更新メモ'
      };
      const updatedPlan = await updateRehabilitationPlan(originalPlan.id, updates);
      expect(updatedPlan.id).toBe(originalPlan.id);
      expect(updatedPlan.goal).toBe(updates.goal);
      expect(updatedPlan.progress).toBe(updates.progress);
      expect(updatedPlan.notes).toBe(updates.notes);
      expect(updatedPlan.activity).toBe(originalPlan.activity);
      expect(updatedPlan.updatedAt).not.toBe(originalPlan.updatedAt);
      
      // 後始末
      await deleteRehabilitationPlan(originalPlan.id);
    });
    
    it('should throw error when updating non-existent plan', async () => {
      const updates = { goal: '更新後の目標' };
      await expect(updateRehabilitationPlan('non-existent-id', updates)).rejects.toThrow('Plan not found');
    });
  });

  describe('deleteRehabilitationPlan', () => {
    it('should delete an existing rehabilitation plan', async () => {
      const planData = {
        userId: 'user1',
        goal: '削除対象',
        activity: '活動',
        frequency: '週1回',
        progress: '未実施',
        notes: '削除用'
      };
      const plan = await addRehabilitationPlan(planData);
      await expect(deleteRehabilitationPlan(plan.id)).resolves.not.toThrow();
      const plans = await fetchRehabilitationPlans(plan.userId);
      const deletedPlan = plans.find(p => p.id === plan.id);
      expect(deletedPlan).toBeUndefined();
    });
    
    it('should throw error when deleting non-existent plan', async () => {
      await expect(deleteRehabilitationPlan('non-existent-id')).rejects.toThrow('Plan not found');
    });
  });

  describe('error handling', () => {
    it('should handle errors gracefully in fetchRehabilitationPlans', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      try {
        await fetchRehabilitationPlans('user1');
        expect(consoleSpy).not.toHaveBeenCalled();
      } finally {
        consoleSpy.mockRestore();
      }
    });
    
    it('should handle errors gracefully in addRehabilitationPlan', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      try {
        const planData = {
          userId: 'user1',
          goal: 'テスト',
          activity: '活動',
          frequency: '週1回',
          progress: '未実施',
          notes: 'メモ'
        };
        const plan = await addRehabilitationPlan(planData);
        expect(consoleSpy).not.toHaveBeenCalled();
        
        // 後始末
        await deleteRehabilitationPlan(plan.id);
      } finally {
        consoleSpy.mockRestore();
      }
    });
  });
}); 