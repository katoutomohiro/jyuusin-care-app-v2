// AI異常検知サービス雛形
import { DailyLog, safeParseFloat } from '../types';

export interface AnomalyAlert {
  type: string; // 'vital' | 'seizure' | 'excretion' | 'sleep' など
  message: string;
  date: string;
  userId: string;
  details?: any;
}

// ポジティブ変化通知
export interface PositiveChange {
  type: string; // 'vital' | 'seizure' | 'activity' など
  message: string;
  date: string;
  userId: string;
  details?: any;
}

export class AIAnomalyDetectionService {
  // シンプルなルールベース異常検知（今後AIロジック拡張可）
  static detectAnomalies(logs: DailyLog[]): AnomalyAlert[] {
    const alerts: AnomalyAlert[] = [];
    logs.forEach(log => {
      const userId = log.user_id || log.userId;
      if (!userId) return; // userIdが存在しない場合はスキップ

      // バイタル異常例
      if (log.vitals) {
        if (safeParseFloat(log.vitals.temperature) > 37.5) {
          alerts.push({
            type: 'vital',
            message: `体温が高め (${log.vitals.temperature}℃)`,
            date: log.record_date,
            userId: userId,
            details: log.vitals
          });
        }
        if (safeParseFloat(log.vitals.spO2) < 95) {
          alerts.push({
            type: 'vital',
            message: `SpO2が低め (${log.vitals.spO2}%)`,
            date: log.record_date,
            userId: userId,
            details: log.vitals
          });
        }
      }
      // 発作異常例
      if (log.seizures && log.seizures.length > 0) {
        log.seizures.forEach(seizure => {
          if (seizure.duration_sec > 60) {
            alerts.push({
              type: 'seizure',
              message: `長時間の発作 (${seizure.duration_sec}秒)`,
              date: log.record_date,
              userId: userId,
              details: seizure
            });
          }
        });
      }
      // 睡眠異常例
      if (log.sleep && log.sleep.duration_minutes < 360) { // 6時間未満
        alerts.push({
          type: 'sleep',
          message: `睡眠時間が短い (${log.sleep.duration_minutes}分)`,
          date: log.record_date,
          userId: userId,
          details: log.sleep
        });
      }
      // 水分摂取異常例（IntakeRecordの実際のプロパティを使用）
      if (log.intake && log.intake.amount_ml < 500) {
        alerts.push({
          type: 'intake',
          message: `水分摂取量が少ない (${log.intake.amount_ml}ml)`,
          date: log.record_date,
          userId: userId,
          details: log.intake
        });
      }
      // 排泄異常例（ExcretionRecordの実際のプロパティを使用）
      if (log.excretion && log.excretion.bristol_scale <= 2) {
        alerts.push({
          type: 'excretion',
          message: '便秘傾向が見られます',
          date: log.record_date,
          userId: userId,
          details: log.excretion
        });
      }
      // 活動参加度チェック（ActivityRecordの実際のプロパティを使用）
      if (log.activity && log.activity.mood === 'unwell') {
        alerts.push({
          type: 'activity',
          message: '体調不良の兆候があります',
          date: log.record_date,
          userId: userId,
          details: log.activity
        });
      }
      // 体重変化チェック
      if (log.vitals && 'weight' in log.vitals) {
        alerts.push({
          type: 'vital',
          message: '体重に変化があります',
          date: log.record_date,
          userId: userId,
          details: log.vitals
        });
      }
      // 特記事項チェック（SpecialNoteの型に合わせて修正）
      if (log.special_notes && Array.isArray(log.special_notes)) {
        log.special_notes.forEach(note => {
          if (typeof note === 'object' && note.category === 'NEAR_MISS') {
            alerts.push({
              type: 'special',
              message: 'ヒヤリハット事例が報告されました',
              date: log.record_date,
              userId: userId,
              details: note
            });
          }
        });
      }
    });
    return alerts;
  }

  // 傾向分析（週間・月間での異常傾向を検知）
  static analyzeTrends(logs: DailyLog[]): AnomalyAlert[] {
    const alerts: AnomalyAlert[] = [];
    const logsByUser: { [key: string]: DailyLog[] } = {};

    logs.forEach(log => {
      const userId = log.user_id || log.userId;
      if (!userId) return;
      
      if (!logsByUser[userId]) logsByUser[userId] = [];
      logsByUser[userId].push(log);
    });

    // 各利用者の傾向分析
    Object.keys(logsByUser).forEach(userId => {
      const userLogs = logsByUser[userId];
      
      // 発作頻度の増加傾向
      const recentSeizures = userLogs.filter(log => 
        log.seizures && log.seizures.length > 0
      ).length;
      
      if (recentSeizures > 3) { // 直近期間で3回以上
        alerts.push({
          type: 'trend',
          message: `発作の頻度が増加傾向にあります (${recentSeizures}回)`,
          date: new Date().toISOString(),
          userId: userId,
          details: { seizureCount: recentSeizures }
        });
      }

      // 平均体温の上昇傾向
      const temperatures = userLogs
        .filter(log => log.vitals?.temperature)
        .map(log => safeParseFloat(log.vitals!.temperature));
      
      if (temperatures.length > 3) {
        const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
        if (avgTemp > 37.0) {
          alerts.push({
            type: 'trend',
            message: `平均体温が高めです (${avgTemp.toFixed(1)}℃)`,
            date: new Date().toISOString(),
            userId: userId,
            details: { averageTemperature: avgTemp }
          });
        }
      }
    });

    return alerts;
  }

  // ポジティブな変化の検出
  static detectPositiveChanges(logs: DailyLog[]): PositiveChange[] {
    const changes: PositiveChange[] = [];
    
    logs.forEach(log => {
      const userId = log.user_id || log.userId;
      if (!userId) return;

      // 睡眠時間の改善
      if (log.sleep && log.sleep.duration_minutes > 480) { // 8時間以上
        changes.push({
          type: 'sleep',
          message: `良好な睡眠時間を確保できました (${log.sleep.duration_minutes}分)`,
          date: log.record_date,
          userId: userId,
          details: log.sleep
        });
      }

      // 活動への積極的な参加
      if (log.activity && log.activity.mood === 'happy') {
        changes.push({
          type: 'activity',
          message: '活動に積極的に参加していました',
          date: log.record_date,
          userId: userId,
          details: log.activity
        });
      }
    });

    return changes;
  }
}
