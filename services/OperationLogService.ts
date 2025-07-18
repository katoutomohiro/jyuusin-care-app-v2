// 操作ログサービス雛形
export interface OperationLog {
  timestamp: string;
  userId: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: any;
}

export class OperationLogService {
  static LOG_KEY = 'jyushin_care_operation_logs';

  static addLog(log: OperationLog) {
    const logs = OperationLogService.getLogs();
    logs.push(log);
    localStorage.setItem(OperationLogService.LOG_KEY, JSON.stringify(logs));
  }

  static getLogs(): OperationLog[] {
    try {
      const logs = localStorage.getItem(OperationLogService.LOG_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  static clearLogs() {
    localStorage.removeItem(OperationLogService.LOG_KEY);
  }
} 