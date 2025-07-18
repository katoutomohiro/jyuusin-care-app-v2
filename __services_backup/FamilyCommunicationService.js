/**
 * 家族連携・コミュニケーションサービス
 * 家族との情報共有とコミュニケーション機能
 */
import { format, parseISO } from 'date-fns';
export class FamilyCommunicationService {
    /**
     * 家族メンバーの登録
     */
    static registerFamilyMember(member) {
        const newMember = {
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
    static getFamilyMembers(userId) {
        return Array.from(this.familyMembers.values())
            .filter(member => member.userId === userId && member.isActive);
    }
    /**
     * 緊急連絡先の登録
     */
    static registerEmergencyContact(contact) {
        const newContact = {
            ...contact,
            id: this.generateId()
        };
        this.emergencyContacts.set(newContact.id, newContact);
        return newContact;
    }
    /**
     * 緊急連絡先一覧の取得
     */
    static getEmergencyContacts(userId) {
        return Array.from(this.emergencyContacts.values())
            .filter(contact => contact.userId === userId);
    }
    /**
     * 日次通知の送信
     */
    static async sendDailyNotification(userId, dailyLog) {
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
    static async sendWeeklyReport(userId, weeklyLogs) {
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
    static async sendEmergencyNotification(userId, emergency) {
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
    static async sendHealthAlert(userId, alert) {
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
    static async sendMedicationReminder(userId, medication) {
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
    static getNotificationHistory(userId, limit = 50) {
        return this.notifications
            .filter(notification => notification.userId === userId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
    }
    /**
     * 通信履歴の取得
     */
    static getCommunicationLogs(userId, familyMemberId) {
        let logs = this.communicationLogs.filter(log => log.userId === userId);
        if (familyMemberId) {
            logs = logs.filter(log => log.familyMemberId === familyMemberId);
        }
        return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    /**
     * 通信履歴の記録
     */
    static logCommunication(log) {
        const newLog = {
            ...log,
            id: this.generateId()
        };
        this.communicationLogs.push(newLog);
        return newLog;
    }
    /**
     * 通知設定の更新
     */
    static updateNotificationPreferences(familyMemberId, preferences) {
        const member = this.familyMembers.get(familyMemberId);
        if (member) {
            member.notificationPreferences = { ...member.notificationPreferences, ...preferences };
        }
    }
    /**
     * 家族メンバーの非アクティブ化
     */
    static deactivateFamilyMember(familyMemberId) {
        const member = this.familyMembers.get(familyMemberId);
        if (member) {
            member.isActive = false;
        }
    }
    /**
     * 自動通知スケジュールの設定
     */
    static scheduleAutomaticNotifications(userId) {
        // 日次通知のスケジュール（毎日18:00）
        this.scheduleDailyNotification(userId);
        // 週次報告のスケジュール（毎週日曜日18:00）
        this.scheduleWeeklyReport(userId);
    }
    // プライベートメソッド
    static generateId() {
        return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    static getUserById(userId) {
        // 実際の実装ではユーザーサービスから取得
        return {
            id: userId,
            initials: 'UT',
            name: '利用者',
            age: 25,
            gender: 'male',
            serviceType: ['生活介護']
        };
    }
    static createDailyNotification(user, dailyLog) {
        const date = format(parseISO(dailyLog.date || dailyLog.record_date), 'yyyy年MM月dd日');
        return {
            title: `${user.name}の${date}の様子`,
            message: this.generateDailySummary(dailyLog),
            priority: 'low'
        };
    }
    static createWeeklyReport(user, weeklyLogs) {
        return {
            title: `${user.name}の週次報告`,
            message: this.generateWeeklySummary(user, weeklyLogs),
            priority: 'medium'
        };
    }
    static createEmergencyNotification(user, emergency) {
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
    static createHealthAlert(user, alert) {
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
    static createMedicationReminder(user, medication) {
        return {
            title: `${user.name}の薬剤リマインダー`,
            message: `${medication.name} ${medication.dosage}を${medication.time}に投与してください。\n${medication.notes || ''}`,
            priority: 'medium'
        };
    }
    static createNotificationMessage(recipient, notification, priority) {
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
    static generateDailySummary(dailyLog) {
        const summary = [];
        if (dailyLog.vitals) {
            summary.push(`体温: ${dailyLog.vitals.temperature}°C`);
            summary.push(`SpO2: ${dailyLog.vitals.spO2}%`);
            summary.push(`脈拍: ${dailyLog.vitals.pulse}/分`);
        }
        if (dailyLog.sleep) {
            summary.push(`睡眠: ${dailyLog.sleep.duration_minutes}分 (${dailyLog.sleep.status})`);
        }
        if (dailyLog.seizures && dailyLog.seizures.length > 0) {
            summary.push(`発作: ${dailyLog.seizures.length}回`);
        }
        if (dailyLog.activity?.mood) {
            summary.push(`気分: ${dailyLog.activity.mood}`);
        }
        return summary.join('\n') || '特に異常はありません。';
    }
    static generateWeeklySummary(user, weeklyLogs) {
        const summary = [];
        // バイタルサインの平均
        const vitals = weeklyLogs.filter(log => log.vitals);
        if (vitals.length > 0) {
            const avgTemp = vitals.reduce((sum, log) => sum + (log.vitals.temperature || 0), 0) / vitals.length;
            const avgSpO2 = vitals.reduce((sum, log) => sum + (log.vitals.spO2 || 0), 0) / vitals.length;
            summary.push(`平均体温: ${avgTemp.toFixed(1)}°C`);
            summary.push(`平均SpO2: ${avgSpO2.toFixed(1)}%`);
        }
        // 発作回数
        const totalSeizures = weeklyLogs.reduce((sum, log) => sum + (log.seizures?.length || 0), 0);
        summary.push(`週間発作回数: ${totalSeizures}回`);
        // 睡眠状況
        const sleepLogs = weeklyLogs.filter(log => log.sleep);
        if (sleepLogs.length > 0) {
            const avgSleep = sleepLogs.reduce((sum, log) => sum + (log.sleep.duration_minutes || 0), 0) / sleepLogs.length;
            summary.push(`平均睡眠時間: ${Math.round(avgSleep / 60)}時間`);
        }
        return summary.join('\n');
    }
    static async processNotificationQueue() {
        while (this.notificationQueue.length > 0) {
            const notification = this.notificationQueue.shift();
            if (notification) {
                try {
                    await this.sendNotification(notification);
                    notification.status = 'sent';
                }
                catch (error) {
                    console.error('通知送信エラー:', error);
                    notification.status = 'failed';
                }
            }
        }
    }
    static async sendNotification(notification) {
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
    static scheduleDailyNotification(userId) {
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
    static scheduleWeeklyReport(userId) {
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
FamilyCommunicationService.familyMembers = new Map();
FamilyCommunicationService.notifications = [];
FamilyCommunicationService.emergencyContacts = new Map();
FamilyCommunicationService.communicationLogs = [];
FamilyCommunicationService.notificationQueue = [];
