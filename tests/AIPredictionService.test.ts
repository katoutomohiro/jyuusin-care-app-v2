import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIPredictionService, HealthRiskPrediction, CareRecommendation, BehaviorPrediction } from '../services/AIPredictionService';

describe('AIPredictionService', () => {
  beforeEach(() => {
    // テスト前にデータをリセット
    // AIPredictionService.clearAllData(); // このメソッドが存在しない場合は削除
  });

  describe('Health Risk Prediction', () => {
    it('should predict health risks based on vital signs', async () => {
      const vitalSigns = {
        temperature: 38.5,
        bloodPressure: { systolic: 160, diastolic: 95 },
        pulse: 110,
        spO2: 92
      };

      const prediction = await AIPredictionService.predictHealthRisks('user1', vitalSigns);

      expect(prediction).toBeDefined();
      expect(prediction.overallRisk).toBeDefined();
      expect(prediction.riskFactors).toBeDefined();
      expect(prediction.predictedIssues).toBeInstanceOf(Array);
      expect(prediction.preventiveMeasures).toBeInstanceOf(Array);
      expect(prediction.urgency).toBeDefined();
    });

    it('should identify critical risks for abnormal vital signs', async () => {
      const criticalVitalSigns = {
        temperature: 40.0,
        bloodPressure: { systolic: 200, diastolic: 120 },
        pulse: 140,
        spO2: 85
      };

      const prediction = await AIPredictionService.predictHealthRisks('user1', criticalVitalSigns);

      expect(prediction.overallRisk).toBe('critical');
      expect(prediction.urgency).toBe('urgent');
      expect(prediction.riskFactors.cardiovascular).toBeGreaterThan(0.7);
      expect(prediction.riskFactors.respiratory).toBeGreaterThan(0.7);
    });

    it('should provide low risk for normal vital signs', async () => {
      const normalVitalSigns = {
        temperature: 36.8,
        bloodPressure: { systolic: 120, diastolic: 80 },
        pulse: 72,
        spO2: 98
      };

      const prediction = await AIPredictionService.predictHealthRisks('user1', normalVitalSigns);

      expect(prediction.overallRisk).toBe('low');
      expect(prediction.urgency).toBe('low');
    });
  });

  describe('Care Recommendations', () => {
    it('should generate personalized care recommendations', async () => {
      const userProfile = {
        age: 75,
        conditions: ['diabetes', 'hypertension'],
        medications: ['metformin', 'amlodipine'],
        preferences: ['low_salt', 'regular_exercise']
      };

      const recommendations = await AIPredictionService.generateCareRecommendations('user1', userProfile);

      expect(recommendations).toBeDefined();
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0]).toHaveProperty('category');
      expect(recommendations[0]).toHaveProperty('title');
      expect(recommendations[0]).toHaveProperty('description');
      expect(recommendations[0]).toHaveProperty('priority');
    });

    it('should prioritize recommendations based on user conditions', async () => {
      const diabeticProfile = {
        age: 65,
        conditions: ['diabetes'],
        medications: ['insulin'],
        preferences: []
      };

      const recommendations = await AIPredictionService.generateCareRecommendations('user1', diabeticProfile);

      const diabetesRecommendations = recommendations.filter(r => 
        r.category === 'nutrition' || r.title.toLowerCase().includes('血糖')
      );

      expect(diabetesRecommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Behavior Prediction', () => {
    it('should predict behavior patterns', async () => {
      const behaviorData = {
        sleepPatterns: { averageHours: 7, quality: 'good' },
        activityLevels: { dailySteps: 5000, exerciseFrequency: 'moderate' },
        socialInteractions: { frequency: 'high', quality: 'positive' },
        moodTrends: { overall: 'stable', recentChanges: 'none' }
      };

      const prediction = await AIPredictionService.predictBehaviorPatterns('user1', behaviorData);

      expect(prediction).toBeDefined();
      expect(prediction.patterns).toBeInstanceOf(Array);
      expect(prediction.riskFactors).toBeInstanceOf(Array);
      expect(prediction.recommendations).toBeInstanceOf(Array);
    });

    it('should identify concerning behavior patterns', async () => {
      const concerningData = {
        sleepPatterns: { averageHours: 4, quality: 'poor' },
        activityLevels: { dailySteps: 1000, exerciseFrequency: 'low' },
        socialInteractions: { frequency: 'low', quality: 'negative' },
        moodTrends: { overall: 'declining', recentChanges: 'significant' }
      };

      const prediction = await AIPredictionService.predictBehaviorPatterns('user1', concerningData);

      expect(prediction.riskFactors.length).toBeGreaterThan(0);
      expect(prediction.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Fall Risk Assessment', () => {
    it('should assess fall risk based on multiple factors', async () => {
      const fallRiskFactors = {
        age: 80,
        mobilityIssues: true,
        medicationSideEffects: ['dizziness'],
        environmentalHazards: ['loose_rugs'],
        previousFalls: 2,
        balanceIssues: true
      };

      const assessment = await AIPredictionService.assessFallRisk('user1', fallRiskFactors);

      expect(assessment).toBeDefined();
      expect(assessment.riskLevel).toBeDefined();
      expect(assessment.riskScore).toBeGreaterThan(0);
      expect(assessment.factors).toBeInstanceOf(Array);
      expect(assessment.preventiveMeasures).toBeInstanceOf(Array);
    });

    it('should identify high fall risk for elderly with multiple factors', async () => {
      const highRiskFactors = {
        age: 85,
        mobilityIssues: true,
        medicationSideEffects: ['dizziness', 'confusion'],
        environmentalHazards: ['loose_rugs', 'poor_lighting'],
        previousFalls: 5,
        balanceIssues: true,
        visionProblems: true
      };

      const assessment = await AIPredictionService.assessFallRisk('user1', highRiskFactors);

      expect(assessment.riskLevel).toBe('high');
      expect(assessment.riskScore).toBeGreaterThan(0.7);
    });
  });

  describe('Medication Adherence Prediction', () => {
    it('should predict medication adherence', async () => {
      const adherenceData = {
        medicationHistory: [
          { medication: 'metformin', adherence: 0.95 },
          { medication: 'amlodipine', adherence: 0.88 }
        ],
        reminderUsage: true,
        sideEffects: ['mild_nausea'],
        complexity: 'medium'
      };

      const prediction = await AIPredictionService.predictMedicationAdherence('user1', adherenceData);

      expect(prediction).toBeDefined();
      expect(prediction.adherenceScore).toBeGreaterThan(0);
      expect(prediction.adherenceScore).toBeLessThanOrEqual(1);
      expect(prediction.riskFactors).toBeInstanceOf(Array);
      expect(prediction.improvementStrategies).toBeInstanceOf(Array);
    });

    it('should identify low adherence risk factors', async () => {
      const lowAdherenceData = {
        medicationHistory: [
          { medication: 'metformin', adherence: 0.45 },
          { medication: 'amlodipine', adherence: 0.32 }
        ],
        reminderUsage: false,
        sideEffects: ['severe_nausea', 'dizziness'],
        complexity: 'high'
      };

      const prediction = await AIPredictionService.predictMedicationAdherence('user1', lowAdherenceData);

      expect(prediction.adherenceScore).toBeLessThan(0.5);
      expect(prediction.riskFactors.length).toBeGreaterThan(0);
    });
  });

  describe('Data Management', () => {
    it('should store and retrieve prediction history', async () => {
      const prediction = await AIPredictionService.predictHealthRisks('user1', {
        temperature: 37.0,
        bloodPressure: { systolic: 130, diastolic: 85 },
        pulse: 75,
        spO2: 96
      });

      const history = AIPredictionService.getPredictionHistory('user1');

      expect(history).toBeInstanceOf(Array);
      expect(history.length).toBeGreaterThan(0);
      expect(history[0]).toHaveProperty('timestamp');
      expect(history[0]).toHaveProperty('predictionType');
    });

    it('should clear prediction data', () => {
      AIPredictionService.clearAllData();
      
      const history = AIPredictionService.getPredictionHistory('user1');
      expect(history.length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid input data gracefully', async () => {
      const invalidVitalSigns = {
        temperature: -10, // Invalid temperature
        bloodPressure: { systolic: -50, diastolic: 200 }, // Invalid BP
        pulse: -20, // Invalid pulse
        spO2: 150 // Invalid SpO2
      };

      await expect(
        AIPredictionService.predictHealthRisks('user1', invalidVitalSigns)
      ).rejects.toThrow();
    });

    it('should handle missing user data', async () => {
      await expect(
        AIPredictionService.predictHealthRisks('nonexistent_user', {})
      ).rejects.toThrow();
    });
  });
}); 