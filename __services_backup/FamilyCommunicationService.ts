/**
 * 家族連携・コミュニケーションサービス
 * 家族との情報共有とコミュニケーション機能
 */

import { DailyLog, User } from '../types';
import { format, subDays, parseISO, isToday, isYesterday } from 'date-fns';

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relationship: 'parent' | 'guardian' | 'sibling' | 'other';
  phone: string;
  email: string;
  notificationPreferences: {
    daily: boolean;
    weekly: boolean;
    emergency: boolean;
    healthAlerts: boolean;
    medicationReminders: boolean;
  };
  lastContact: string;
  isActive: boolean;
}

export interface NotificationMessage {
  id: string;
  familyMemberId: string;
  userId: string;
  type: 'daily' | 'weekly' | 'emergency' | 'health_alert' | 'medication_reminder';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'sent' | 'failed' | 'read';
  timestamp: string;
  scheduledFor?: string;
  deliveryMethod: 'sms' | 'email' | 'both';
  attachments?: string[];
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  availability: '24h' | 'business_hours' | 'weekends';
}

export interface CommunicationLog {
  id: string;
  familyMemberId: string;
  userId: string;
  type: 'incoming' | 'outgoing';
  method: 'phone' | 'email' | 'sms' | 'app';
  subject: string;
  content: string;
  timestamp: string;
  duration?: number; // 電話の場合の通話時間（分）
  status: 'completed' | 'missed' | 'scheduled';
}

export class FamilyCommunicationService {
  private static familyMembers: Map<string, FamilyMember> = new Map();
  private static notifications: NotificationMessage[] = [];
  private static emergencyContacts: Map<string, EmergencyContact> = new Map();
  private static communicationLogs: CommunicationLog[] = [];
  private static notificationQueue: NotificationMessage[] = [];

  /**
   * 家族メンバーの登録
   */
  static registerFamilyMember(member: Omit<FamilyMember, 'id' | 'lastContact'>): FamilyMember {
    const newMember: FamilyMember = {
      ...member,
      id: this.generateId(),
      lastContact: new Date().toISOString(),
      isActive: true
    };

    this.familyMembers.set(newMember.id, newMember);
    return newMember;
  }

  /**
   * 家族メンバー一覧の取得
   */
  static getFamilyMembers(userId: string): FamilyMember[] {
    return Array.from(this.familyMembers.values())
      .filter(member => member.userId === userId && member.isActive);
  }

  /**
   * 緊急連絡先の登録
   */
  static registerEmergencyContact(contact: Omit<EmergencyContact, 'id'>): EmergencyContact {
    const newContact: EmergencyContact = {
      ...contact,
      id: this.generateId()
    };

    this.emergencyContacts.set(newContact.id, newContact);
    return newContact;
  }

  /**
   * 緊急連絡先一覧の取得
   */
  static getEmergencyContacts(userId: string): EmergencyContact[] {
    return Array.from(this.emergencyContacts.values())
      .filter(contact => contact.userId === userId);
  }

  /**
   * 日次通知の送信
   */
  static async sendDailyNotification(userId: string, dailyLog: DailyLog): Promise<void> {
    const familyMembers = this.getFamilyMembers(userId);
    const user = this.getUserById(userId);

    if (!user || familyMembers.length === 0) {
      return;
    }

    const notification = this.createDailyNotification(user, dailyLog);
    
    for (const member of familyMembers) {
      if (member.notificationPreferences.daily) {
        const message = this.createNotificationMessage(member, notification);
        this.notifications.push(message);
        this.notificationQueue.push(message);
      }
    }

    await this.processNotificationQueue();
  }

  /**
   * 週次報告の送信
   */
  static async sendWeeklyReport(userId: string, weeklyLogs: DailyLog[]): Promise<void> {
    const familyMembers = this.getFamilyMembers(userId);
    const user = this.getUserById(userId);

    if (!user || familyMembers.length === 0) {
      return;
    }

    const report = this.createWeeklyReport(user, weeklyLogs);
    
    for (const member of familyMembers) {
      if (member.notificationPreferences.weekly) {
        const message = this.createNotificationMessage(member, report);
        this.notifications.push(message);
        this.notificationQueue.push(message);
      }
    }

    await this.processNotificationQueue();
  }

  /**
   * 緊急通知の送信
   */
  static async sendEmergencyNotification(userId: string, emergency: {
    type: 'seizure' | 'health_issue' | 'medication_error' | 'fall' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    location?: string;
  }): Promise<void> {
    const emergencyContacts = this.getEmergencyContacts(userId);
    const user = this.getUserById(userId);

    if (!user || emergencyContacts.length === 0) {
      return;
    }

    const notification = this.createEmergencyNotification(user, emergency);
    
    // プライマリ連絡先を優先
    const primaryContact = emergencyContacts.find(contact => contact.isPrimary);
    const contactsToNotify = primaryContact ? [primaryContact] : emergencyContacts;

    for (const contact of contactsToNotify) {
      const message = this.createNotificationMessage(contact, notification, 'urgent');
      message.deliveryMethod = 'both'; // 緊急時は両方の方法で送信
      this.notifications.push(message);
      this.notificationQueue.unshift(message); // 緊急通知を優先
    }

    await this.processNotificationQueue();
  }

  /**
   * 健康アラートの送信
   */
  static async sendHealthAlert(userId: string, alert: {
    type: 'high_temperature' | 'low_spo2' | 'irregular_pulse' | 'poor_sleep' | 'decreased_appetite';
    value: number;
    threshold: number;
    description: string;
  }): Promise<void> {
    const familyMembers = this.getFamilyMembers(userId);
    const user = this.getUserById(userId);

    if (!user || familyMembers.length === 0) {
      return;
    }

    const notification = this.createHealthAlert(user, alert);
    
    for (const member of familyMembers) {
      if (member.notificationPreferences.healthAlerts) {
        const message = this.createNotificationMessage(member, notification, 'high');
        this.notifications.push(message);
        this.notificationQueue.push(message);
      }
    }

    await this.processNotificationQueue();
  }

  /**
   * 薬剤リマインダーの送信
   */
  static async sendMedicationReminder(userId: string, medication: {
    name: string;
    dosage: string;
    time: string;
    notes?: string;
  }): Promise<void> {
    const familyMembers = this.getFamilyMembers(userId);
    const user = this.getUserById(userId);

    if (!user || familyMembers.length === 0) {
      return;
    }

    const notification = this.createMedicationReminder(user, medication);
    
    for (const member of familyMembers) {
      if (member.notificationPreferences.medicationReminders) {
        const message = this.createNotificationMessage(member, notification, 'medium');
        this.notifications.push(message);
        this.notificationQueue.push(message);
      }
    }

    await this.processNotificationQueue();
  }

  /**
   * 通知履歴の取得
   */
  static getNotificationHistory(userId: string, limit: number = 50): NotificationMessage[] {
    return this.notifications
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * 通信履歴の取得
   */
  static getCommunicationLogs(userId: string, familyMemberId?: string): CommunicationLog[] {
    let logs = this.communicationLogs.filter(log => log.userId === userId);
    
    if (familyMemberId) {
      logs = logs.filter(log => log.familyMemberId === familyMemberId);
    }
    
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * 通信履歴の記録
   */
  static logCommunication(log: Omit<CommunicationLog, 'id'>): CommunicationLog {
    const newLog: CommunicationLog = {
      ...log,
      id: this.generateId()
    };

    this.communicationLogs.push(newLog);
    return newLog;
  }

  /**
   * 通知設定の更新
   */
  static updateNotificationPreferences(
    familyMemberId: string, 
    preferences: Partial<FamilyMember['notificationPreferences']>
  ): void {
    const member = this.familyMembers.get(familyMemberId);
    if (member) {
      member.notificationPreferences = { ...member.notificationPreferences, ...preferences };
    }
  }

  /**
   * 家族メンバーの非アクティブ化
   */
  static deactivateFamilyMember(familyMemberId: string): void {
    const member = this.familyMembers.get(familyMemberId);
    if (member) {
      member.isActive = false;
    }
  }

  /**
   * 自動通知スケジュールの設定
   */
  static scheduleAutomaticNotifications(userId: string): void {
    // 日次通知のスケジュール（毎日18:00）
    this.scheduleDailyNotification(userId);
    
    // 週次報告のスケジュール（毎週日曜日18:00）
    this.scheduleWeeklyReport(userId);
  }

  // プライベートメソッド
  private static generateId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getUserById(userId: string): User | null {
    // 実際の実装ではユーザーサービスから取得
    return {
      id: userId,
      initials: 'UT',
      name: '利用者',
      age: 25,
      gender: 'male' as any,
      serviceType: ['生活介護' as any]
    } as User;
  }

  private static createDailyNotification(user: User, dailyLog: DailyLog) {
    const date = format(parseISO(dailyLog.date || dailyLog.record_date), 'yyyy年MM月dd日');
    
    return {
      title: `${user.name}の${date}の様子`,
      message: this.generateDailySummary(dailyLog),
      priority: 'low' as const
    };
  }

  private static createWeeklyReport(user: User, weeklyLogs: DailyLog[]) {
    return {
      title: `${user.name}の週次報告`,
      message: this.generateWeeklySummary(user, weeklyLogs),
      priority: 'medium' as const
    };
  }

  private static createEmergencyNotification(user: User, emergency: {
    type: 'seizure' | 'health_issue' | 'medication_error' | 'fall' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    location?: string;
  }) {
    const severityText = {
      low: '軽度',
      medium: '中度',
      high: '重度',
      critical: '緊急'
    }[emergency.severity];

    return {
      title: `緊急通知: ${user.name}に${severityText}の${emergency.type}が発生`,
      message: `${emergency.description}${emergency.location ? `\n場所: ${emergency.location}` : ''}`,
      priority: emergency.severity === 'critical' ? 'urgent' : 'high'
    };
  }

  private static createHealthAlert(user: User, alert: {
    type: 'high_temperature' | 'low_spo2' | 'irregular_pulse' | 'poor_sleep' | 'decreased_appetite';
    value: number;
    threshold: number;
    description: string;
  }) {
    const alertTypeText = {
      high_temperature: '高体温',
      low_spo2: '低酸素',
      irregular_pulse: '脈拍異常',
      poor_sleep: '睡眠不足',
      decreased_appetite: '食欲不振'
    }[alert.type];

    return {
      title: `${user.name}の健康アラート: ${alertTypeText}`,
      message: `${alert.description}\n測定値: ${alert.value} (基準値: ${alert.threshold})`,
      priority: 'medium'
    };
  }

  private static createMedicationReminder(user: User, medication: any) {
    return {
      title: `${user.name}の薬剤リマインダー`,
      message: `${medication.name} ${medication.dosage}を${medication.time}に投与してください。\n${medication.notes || ''}`,
      priority: 'medium' as const
    };
  }

  private static createNotificationMessage(
    recipient: FamilyMember | EmergencyContact,
    notification: any,
    priority?: 'low' | 'medium' | 'high' | 'urgent'
  ): NotificationMessage {
    return {
      id: this.generateId(),
      familyMemberId: 'familyMemberId' in recipient ? recipient.id : '',
      userId: recipient.userId,
      type: 'daily',
      title: notification.title,
      message: notification.message,
      priority: priority || notification.priority,
      status: 'pending',
      timestamp: new Date().toISOString(),
      deliveryMethod: 'email'
    };
  }

  private static generateDailySummary(dailyLog: DailyLog): string {
    const summary: string[] = [];
    
    // バイタルサイン
    const vitals = dailyLog.vitals || dailyLog.vitalSigns;
    if (vitals) {
      if (vitals.temperature) {
        summary.push(`体温: ${vitals.temperature}°C`);
      }
      if (vitals.spO2) {
        summary.push(`SpO2: ${vitals.spO2}%`);
      }
      if (vitals.pulse) {
        summary.push(`脈拍: ${vitals.pulse}/分`);
      }
    }
    
    // 睡眠
    const sleep = dailyLog.sleep;
    if (sleep) {
      const duration = sleep.duration_minutes || sleep.hours;
      const status = sleep.status || sleep.quality;
      if (duration && status) {
        summary.push(`睡眠: ${duration}分 (${status})`);
      } else if (duration) {
        summary.push(`睡眠: ${duration}分`);
      } else if (status) {
        summary.push(`睡眠: ${status}`);
      }
    }
    
    // 発作
    if (dailyLog.seizures && dailyLog.seizures.length > 0) {
      summary.push(`発作: ${dailyLog.seizures.length}回`);
    }
    
    // 活動・気分
    const activity = dailyLog.activity || dailyLog.activities;
    if (activity?.mood) {
      summary.push(`気分: ${activity.mood}`);
    }
    
    // 食事
    const intake = dailyLog.intake;
    if (intake) {
      if (intake.amount_ml) {
        summary.push(`水分摂取: ${intake.amount_ml}ml`);
      }
      if (intake.meal_amount) {
        summary.push(`食事量: ${intake.meal_amount}`);
      }
    }
    
    // 排泄
    const excretion = dailyLog.excretion;
    if (excretion) {
      if (excretion.bristol_scale) {
        summary.push(`排便: ブリストルスケール${excretion.bristol_scale}`);
      }
      if (excretion.status && excretion.status.length > 0) {
        summary.push(`排泄状態: ${excretion.status.join('、')}`);
      }
    }
    
    return summary.length > 0 ? summary.join('\n') : '特に異常はありません。';
  }

  private static generateWeeklySummary(user: User, weeklyLogs: DailyLog[]): string {
    const summary: string[] = [];
    // バイタルサインの平均
    const vitalsList = weeklyLogs.map(log => log.vitals || log.vitalSigns).filter(Boolean);
    if (vitalsList.length > 0) {
      const avgTemp = (vitalsList.reduce((sum, v) => sum + (v.temperature || 0), 0) / vitalsList.length).toFixed(1);
      summary.push(`平均体温: ${avgTemp}°C`);
    }
    // 活動の集計
    const activitiesList = weeklyLogs.map(log => log.activity || log.activities).filter(Boolean);
    if (activitiesList.length > 0) {
      summary.push(`活動記録数: ${activitiesList.length}`);
    }
    return summary.join('\n') || '特に異常はありません。';
  }

  private static async processNotificationQueue(): Promise<void> {
    while (this.notificationQueue.length > 0) {
      const notification = this.notificationQueue.shift();
      if (notification) {
        try {
          await this.sendNotification(notification);
          notification.status = 'sent';
        } catch (error) {
          console.error('通知送信エラー:', error);
          notification.status = 'failed';
        }
      }
    }
  }

  private static async sendNotification(notification: NotificationMessage): Promise<void> {
    // 実際の実装ではSMS/Email APIを使用
    console.log('通知送信:', {
      to: notification.familyMemberId,
      title: notification.title,
      message: notification.message,
      method: notification.deliveryMethod
    });
    
    // シミュレーション用の遅延
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private static scheduleDailyNotification(userId: string): void {
    // 毎日18:00に日次通知をスケジュール
    const now = new Date();
    const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
    
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const delay = scheduledTime.getTime() - now.getTime();
    setTimeout(() => {
      // 日次通知の処理
      console.log(`${userId}の日次通知をスケジュールしました`);
    }, delay);
  }

  private static scheduleWeeklyReport(userId: string): void {
    // 毎週日曜日18:00に週次報告をスケジュール
    const now = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7;
    const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday, 18, 0, 0);
    
    const delay = scheduledTime.getTime() - now.getTime();
    setTimeout(() => {
      // 週次報告の処理
      console.log(`${userId}の週次報告をスケジュールしました`);
    }, delay);
  }
} 