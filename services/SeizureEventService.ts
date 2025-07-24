// SeizureEvent（発作イベント）自動追加サービス
export class SeizureEventService {
  static saveLog(log: any) {
    const logs = JSON.parse(localStorage.getItem('seizureLogs') || '[]');
    logs.push(log);
    localStorage.setItem('seizureLogs', JSON.stringify(logs));
  }
  static getLogs(userId: string) {
    const logs = JSON.parse(localStorage.getItem('seizureLogs') || '[]');
    return logs.filter((l: any) => l.user_id === userId);
  }
  static async getSeizureRisk(user: any, recentLogs: any[]) {
    // AI予測サービス呼び出し例
    // return await AIPredictionService.predictSeizureRisk(user, recentLogs);
    return { riskLevel: 'normal' };
  }
}
