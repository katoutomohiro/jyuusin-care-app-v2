
import { ActivityEvent } from '../src/types';

// ActivityEventService: 活動イベントの記録・AIリスク予測・ローカル保存
export class ActivityEventService {
  // 日付ごとに保存
  static saveActivityEvent(event: ActivityEvent): void {
    const today = new Date().toISOString().slice(0, 10);
    const key = `activity_events_${today}`;
    const events = JSON.parse(localStorage.getItem(key) || '[]');
    events.push(event);
    localStorage.setItem(key, JSON.stringify(events));
  }

  static getTodayEvents(): ActivityEvent[] {
    const today = new Date().toISOString().slice(0, 10);
    const key = `activity_events_${today}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  // ユーザーIDで取得
  static getLogs(user_id: string): ActivityEvent[] {
    const allKeys = Object.keys(localStorage).filter(k => k.startsWith('activity_events_'));
    let allEvents: ActivityEvent[] = [];
    allKeys.forEach(key => {
      const events = JSON.parse(localStorage.getItem(key) || '[]');
      allEvents = allEvents.concat(events);
    });
    return allEvents.filter(e => e.userId === user_id);
  }

  // AIリスク予測（例: 疲労・転倒リスク）
  static async predictActivityRisk(user: any, recentLogs: ActivityEvent[]): Promise<{ riskLevel: string; message: string }> {
    // 疲労リスク: リハビリ/歩行/レクリエーション等で60分以上の活動
    const fatigueCount = recentLogs.filter(e => {
      if (!e.activity_start_time || !e.activity_end_time) return false;
      const start = new Date(e.activity_start_time).getTime();
      const end = new Date(e.activity_end_time).getTime();
      const durationMin = Math.round((end - start) / 60000);
      return (
        ['rehabilitation', 'walk', 'recreation'].includes(e.activity_type) && durationMin > 60
      );
    }).length;
    // 転倒リスク: achievementsやnotesに"転倒"が含まれる場合
    const fallCount = recentLogs.filter(e => {
      const achv = e.achievements?.join(' ') ?? '';
      const notes = e.notes ?? '';
      return achv.includes('転倒') || notes.includes('転倒');
    }).length;
    if (fatigueCount >= 3 || fallCount > 0) {
      return {
        riskLevel: 'high',
        message: '活動量が多く、疲労・転倒リスクが高まっています'
      };
    }
    if (fatigueCount === 2) {
      return {
        riskLevel: 'moderate',
        message: '活動量がやや多めです。休憩を推奨します'
      };
    }
    return {
      riskLevel: 'low',
      message: 'リスクは低いです'
    };
  }
}
