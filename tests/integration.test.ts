import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SAMPLE_USERS, SAMPLE_STAFF, FACILITY_INFO, SAMPLE_LOGS_BASE } from '../constants';
import { IoTService } from '../services/IoTService';
import { AdvancedReportingService } from '../services/AdvancedReportingService';
import { FamilyCommunicationService } from '../services/FamilyCommunicationService';
import { VoiceImageRecognitionService } from '../services/VoiceImageRecognitionService';
import { NutritionManagementService } from '../services/NutritionManagementService';
import { EmergencyResponseService } from '../services/EmergencyResponseService';

describe('統合テスト - 本番運用シナリオ', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('利用者データの整合性', () => {
    it('利用者データが正しく定義されている', () => {
      expect(SAMPLE_USERS).toBeInstanceOf(Array);
      expect(SAMPLE_USERS.length).toBeGreaterThan(0);
      
      SAMPLE_USERS.forEach(user => {
        expect(user.id).toBeDefined();
        expect(user.name).toBeDefined();
        expect(user.initials).toBeDefined();
        expect(user.age).toBeGreaterThan(0);
        expect(user.serviceType).toBeInstanceOf(Array);
        expect(user.serviceType.length).toBeGreaterThan(0);
      });
    });

    it('職員データが正しく定義されている', () => {
      expect(SAMPLE_STAFF).toBeInstanceOf(Array);
      expect(SAMPLE_STAFF.length).toBeGreaterThan(0);
      
      SAMPLE_STAFF.forEach(staff => {
        expect(staff.id).toBeDefined();
        expect(staff.username).toBeDefined();
        expect(staff.name).toBeDefined();
        expect(staff.role).toBeDefined();
        expect(staff.permissions).toBeInstanceOf(Array);
      });
    });

    it('事業所情報が正しく定義されている', () => {
      expect(FACILITY_INFO.name).toBeDefined();
      expect(FACILITY_INFO.address).toBeDefined();
      expect(FACILITY_INFO.phone).toBeDefined();
      expect(FACILITY_INFO.contractNumbers).toBeDefined();
      expect(FACILITY_INFO.lifeCareSystem).toBeDefined();
      expect(FACILITY_INFO.dayServiceSystem).toBeDefined();
    });
  });

  describe('日誌データの整合性', () => {
    it('日誌データが正しく定義されている', () => {
      expect(SAMPLE_LOGS_BASE).toBeInstanceOf(Array);
      expect(SAMPLE_LOGS_BASE.length).toBeGreaterThan(0);
      
      SAMPLE_LOGS_BASE.forEach(log => {
        expect(log.record_date).toBeDefined();
        expect(log.vitals).toBeDefined();
        expect(log.intake).toBeDefined();
        expect(log.excretion).toBeDefined();
        expect(log.sleep).toBeDefined();
        expect(log.activity).toBeDefined();
      });
    });

    it('バイタルサインの値が妥当な範囲内', () => {
      SAMPLE_LOGS_BASE.forEach(log => {
        if (log.vitals) {
          expect(log.vitals.temperature).toBeGreaterThan(35);
          expect(log.vitals.temperature).toBeLessThan(42);
          expect(log.vitals.pulse).toBeGreaterThan(40);
          expect(log.vitals.pulse).toBeLessThan(200);
          expect(log.vitals.spO2).toBeGreaterThan(80);
          expect(log.vitals.spO2).toBeLessThanOrEqual(100);
        }
      });
    });
  });

  describe('サービス間の連携', () => {
    it('IoTServiceとAdvancedReportingServiceの連携', async () => {
      // IoTデバイスの登録
      const device = IoTService.registerDevice({
        name: 'テスト体温計',
        type: 'thermometer',
        userId: SAMPLE_USERS[0].id,
        batteryLevel: 80,
        firmwareVersion: '1.0.0'
      });

      // デバイスからの読み取り
      const reading = await IoTService.readFromDevice(device.id);
      expect(reading).toBeDefined();
      expect(reading.deviceId).toBe(device.id);

      // レポート生成
      const report = await AdvancedReportingService.generateMedicalReport(SAMPLE_USERS[0].id, {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString()
      });

      expect(report).toBeDefined();
      expect(report.userId).toBe(SAMPLE_USERS[0].id);
    });

    it('FamilyCommunicationServiceとNutritionManagementServiceの連携', async () => {
      // 栄養データの追加
      const nutritionData = {
        userId: SAMPLE_USERS[0].id,
        date: new Date().toISOString().split('T')[0],
        mealType: 'lunch',
        foodItems: ['白米', '味噌汁', '焼き魚'],
        amount: '全量',
        notes: '食欲良好'
      };

      await NutritionManagementService.addMeal(nutritionData);

      // 家族への通知生成
      const dailySummary = FamilyCommunicationService.generateDailySummary({
        userId: SAMPLE_USERS[0].id,
        date: new Date().toISOString().split('T')[0],
        vitals: { temperature: 36.8, pulse: 88, spO2: 98 },
        intake: { methods: ['経口'], amount_ml: 1200, meal_form: '常食', meal_amount: '全量', status: ['良好'] },
        excretion: { bristol_scale: 4, status: ['スムーズ'] },
        sleep: { duration_minutes: 480, status: '良好' },
        seizures: [],
        activity: { participation: ['音楽活動'], mood: '笑顔' }
      } as any);

      expect(dailySummary).toBeDefined();
      expect(dailySummary).toContain('体温: 36.8°C');
      expect(dailySummary).toContain('睡眠: 480分');
    });

    it('EmergencyResponseServiceとIoTServiceの連携', async () => {
      // 緊急事態のシミュレーション
      const emergencyData = {
        userId: SAMPLE_USERS[0].id,
        type: 'medical_emergency',
        severity: 'high',
        description: '発作が長時間続いている',
        location: '居室A',
        reportedBy: SAMPLE_STAFF[0].id
      };

      const emergency = await EmergencyResponseService.createEmergency(emergencyData);
      expect(emergency).toBeDefined();
      expect(emergency.status).toBe('active');

      // IoTデバイスの状態確認
      const devices = await IoTService.discoverDevices();
      const userDevices = devices.filter(d => d.userId === SAMPLE_USERS[0].id);
      
      if (userDevices.length > 0) {
        const alerts = await IoTService.checkForAlerts(userDevices[0].id);
        expect(Array.isArray(alerts)).toBe(true);
      }
    });
  });

  describe('音声・画像認識の統合', () => {
    it('VoiceImageRecognitionServiceの基本機能', () => {
      // 音声認識のサポート確認
      const isSupported = VoiceImageRecognitionService.isVoiceRecognitionSupported();
      expect(typeof isSupported).toBe('boolean');

      // 設定の取得
      const settings = VoiceImageRecognitionService.getSettings();
      expect(settings).toBeDefined();
      expect(settings.language).toBeDefined();

      // 利用可能言語の取得
      const languages = VoiceImageRecognitionService.getAvailableLanguages();
      expect(languages).toBeInstanceOf(Array);
      expect(languages.length).toBeGreaterThan(0);
    });
  });

  describe('データの永続化と復元', () => {
    it('サービス間でのデータ一貫性', async () => {
      const userId = SAMPLE_USERS[0].id;
      
      // 複数のサービスで同じユーザーデータを操作
      const devices = await IoTService.discoverDevices();
      const userDevices = devices.filter(d => d.userId === userId);
      
      const nutritionData = await NutritionManagementService.getUserNutritionData(userId);
      expect(Array.isArray(nutritionData)).toBe(true);

      const emergencyHistory = await EmergencyResponseService.getEmergencyHistory(userId);
      expect(Array.isArray(emergencyHistory)).toBe(true);
    });
  });

  describe('パフォーマンステスト', () => {
    it('大量データでの処理性能', async () => {
      const startTime = Date.now();
      
      // 複数のサービスを同時に呼び出し
      const promises = SAMPLE_USERS.map(async (user) => {
        const devices = await IoTService.discoverDevices();
        const nutritionData = await NutritionManagementService.getUserNutritionData(user.id);
        const emergencyHistory = await EmergencyResponseService.getEmergencyHistory(user.id);
        return { user, devices, nutritionData, emergencyHistory };
      });

      const results = await Promise.all(promises);
      const endTime = Date.now();
      
      expect(results.length).toBe(SAMPLE_USERS.length);
      expect(endTime - startTime).toBeLessThan(5000); // 5秒以内に完了
    });
  });
}); 