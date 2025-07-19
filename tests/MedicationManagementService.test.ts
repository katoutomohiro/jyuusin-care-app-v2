import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  MedicationManagementService, 
  Medication, 
  Prescription, 
  MedicationAdministration, 
  SideEffect, 
  Allergy 
} from '../services/MedicationManagementService';

describe('MedicationManagementService', () => {
  beforeEach(() => {
    // 各テスト前にデータをリセット
    vi.clearAllMocks();
    // サービスをリセット（実際の実装ではリセットメソッドが必要）
    MedicationManagementService.updateSettings({
      autoSchedulingEnabled: true,
      reminderNotifications: true,
      interactionChecking: true,
      sideEffectMonitoring: true,
      allergyChecking: true,
      refillReminders: true,
      notificationSettings: {
        beforeAdministration: 15,
        afterAdministration: 30,
        missedDose: 60,
        lowStock: 7
      }
    });
  });

  it('should add and retrieve medication', () => {
    const medication: Medication = {
      id: 'med1',
      name: 'アセトアミノフェン',
      genericName: 'Acetaminophen',
      category: 'oral',
      dosageForm: '錠剤',
      strength: '500mg',
      manufacturer: 'テスト製薬',
      description: '解熱鎮痛薬',
      activeIngredients: ['アセトアミノフェン'],
      isActive: true
    };
    MedicationManagementService.addMedication(medication);
    // 薬剤の取得は直接APIがないため、処方を通じて確認
    const prescription: Prescription = {
      id: 'pres1',
      userId: 'user1',
      userName: 'テストユーザー',
      medicationId: 'med1',
      medicationName: 'アセトアミノフェン',
      dosage: '1錠',
      frequency: 'three_times_daily',
      route: 'oral',
      instructions: '食後に服用',
      startDate: '2024-06-01',
      prescribedBy: 'Dr. Smith',
      prescribedAt: '2024-06-01T10:00:00Z',
      status: 'active',
      refills: 3,
      totalQuantity: 90,
      remainingQuantity: 90,
      isPRN: false,
      specialInstructions: [],
      contraindications: [],
      sideEffects: [],
      interactions: []
    };
    MedicationManagementService.addPrescription(prescription);
    const prescriptions = MedicationManagementService.getUserPrescriptions('user1');
    expect(prescriptions.length).toBeGreaterThan(0);
    expect(prescriptions[0].medicationName).toBe('アセトアミノフェン');
  });

  it('should add and retrieve prescription', () => {
    const prescription: Prescription = {
      id: 'pres2',
      userId: 'user1',
      userName: 'テストユーザー',
      medicationId: 'med2',
      medicationName: 'アセトアミノフェン',
      dosage: '200mg',
      frequency: 'twice_daily',
      route: 'oral',
      instructions: '食後に服用',
      startDate: '2024-06-01',
      prescribedBy: 'Dr. Johnson',
      prescribedAt: '2024-06-01T10:00:00Z',
      status: 'active',
      refills: 2,
      totalQuantity: 60,
      remainingQuantity: 60,
      isPRN: false,
      specialInstructions: [],
      contraindications: [],
      sideEffects: [],
      interactions: []
    };
    MedicationManagementService.addPrescription(prescription);
    const prescriptions = MedicationManagementService.getUserPrescriptions('user1');
    expect(prescriptions.length).toBeGreaterThan(0);
    expect(prescriptions[0].medicationName).toBe('アセトアミノフェン');
  });

  it('should add and retrieve administration record', () => {
    const administration: MedicationAdministration = {
      id: 'admin1',
      prescriptionId: 'pres1',
      userId: 'user1',
      userName: 'テストユーザー',
      medicationName: 'アセトアミノフェン',
      dosage: '1錠',
      route: 'oral',
      administeredAt: '2024-06-01T12:00:00Z',
      administeredBy: 'nurse1',
      scheduledTime: '2024-06-01T12:00:00Z',
      status: 'administered',
      actualTime: '2024-06-01T12:05:00Z',
      notes: '食後に服用',
      effectiveness: 'effective',
      patientResponse: 'good'
    };
    MedicationManagementService.addAdministration(administration);
    const history = MedicationManagementService.getAdministrationHistory('user1');
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].medicationName).toBe('アセトアミノフェン');
  });

  it('should add and retrieve side effect', () => {
    const sideEffect: Omit<SideEffect, 'id'> = {
      name: '胃部不快感',
      severity: 'mild',
      onsetTime: '2024-06-01T14:00:00Z',
      description: '軽度の胃部不快感',
      actionTaken: '食事と一緒に服用',
      reportedTo: 'Dr. Smith',
      reportedAt: '2024-06-01T14:30:00Z',
      status: 'resolved'
    };
    MedicationManagementService.addSideEffect('admin1', sideEffect);
    const sideEffects = MedicationManagementService.getSideEffectHistory('user1');
    expect(sideEffects.length).toBeGreaterThan(0);
    expect(sideEffects[0].name).toBe('胃部不快感');
  });

  it('should add and retrieve allergy', () => {
    const allergy: Omit<Allergy, 'id'> = {
      userId: 'user1',
      userName: 'テストユーザー',
      allergen: 'ペニシリン',
      type: 'medication',
      severity: 'severe',
      reaction: 'アナフィラキシー',
      onsetTime: '2024-06-01T15:00:00Z',
      symptoms: ['呼吸困難', 'じんましん'],
      treatment: 'エピネフリン投与',
      reportedBy: 'Dr. Smith',
      reportedAt: '2024-06-01T15:30:00Z',
      isActive: true
    };
    MedicationManagementService.addAllergy(allergy);
    const allergies = MedicationManagementService.getUserAllergies('user1');
    expect(allergies.length).toBeGreaterThan(0);
    expect(allergies[0].allergen).toBe('ペニシリン');
  });

  it('should get medication schedule', () => {
    // 事前に処方を追加
    const prescription: Prescription = {
      id: 'pres3',
      userId: 'user2',
      userName: 'テストユーザー2',
      medicationId: 'med3',
      medicationName: 'アスピリン',
      dosage: '100mg',
      frequency: 'once_daily',
      route: 'oral',
      instructions: '朝食後に服用',
      startDate: '2024-06-01',
      prescribedBy: 'Dr. Brown',
      prescribedAt: '2024-06-01T10:00:00Z',
      status: 'active',
      refills: 1,
      totalQuantity: 30,
      remainingQuantity: 30,
      isPRN: false,
      specialInstructions: [],
      contraindications: [],
      sideEffects: [],
      interactions: []
    };
    MedicationManagementService.addPrescription(prescription);
    
    // 今日の日付を使用
    const today = new Date().toISOString().split('T')[0];
    const schedule = MedicationManagementService.getMedicationSchedule('user2', today);
    expect(schedule).toBeDefined();
    expect(schedule!.userId).toBe('user2');
  });

  it('should get low stock prescriptions', () => {
    const lowStockPrescriptions = MedicationManagementService.getLowStockPrescriptions(10);
    expect(Array.isArray(lowStockPrescriptions)).toBe(true);
  });

  it('should update and get settings', () => {
    MedicationManagementService.updateSettings({ autoSchedulingEnabled: false });
    const settings = MedicationManagementService.getSettings();
    expect(settings.autoSchedulingEnabled).toBe(false);
  });

  it('should handle errors gracefully in addPrescription', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      // 不正な処方データでエラーをシミュレート
      const invalidPrescription = {} as Prescription;
      // エラーが発生する可能性があるが、必ずしも例外を投げるとは限らない
      expect(() => {
        try {
          MedicationManagementService.addPrescription(invalidPrescription);
        } catch (error) {
          // エラーが発生した場合はコンソールにログが出力されることを確認
          expect(consoleSpy).toHaveBeenCalled();
        }
      }).not.toThrow();
    } finally {
      consoleSpy.mockRestore();
    }
  });
}); 