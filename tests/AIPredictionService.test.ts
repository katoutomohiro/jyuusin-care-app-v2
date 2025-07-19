import { describe, it, expect } from 'vitest';
import { AIPredictionService } from '../services/AIPredictionService';
import { User, Gender, ServiceType } from '../types';

export {}; // モジュールとして認識させる

describe('AIPredictionService', () => {
  describe('Health Risk Prediction', () => {
    it('should predict health risks', async () => {
      const user: User = {
        id: 'user1',
        name: 'テストユーザー',
        age: 25,
        gender: Gender.MALE,
        serviceType: [ServiceType.LIFE_CARE],
        medicalCare: []
      };

      const prediction = await AIPredictionService.predictHealthRisk(user, []);

      expect(prediction).toBeDefined();
      expect(prediction.riskLevel).toBeDefined();
      expect(prediction.probability).toBeDefined();
      expect(prediction.factors).toBeInstanceOf(Array);
      expect(prediction.recommendations).toBeInstanceOf(Array);
    });

    it('should predict seizures', async () => {
      const user: User = {
        id: 'user1',
        name: 'テストユーザー',
        age: 25,
        gender: Gender.MALE,
        serviceType: [ServiceType.LIFE_CARE],
        medicalCare: []
      };

      const prediction = await AIPredictionService.predictSeizures(user, []);

      expect(prediction).toBeDefined();
      expect(prediction.riskLevel).toBeDefined();
    });
  });
});
