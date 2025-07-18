// WebSocketリアルタイム通知サービス（無効化）
export class WebSocketService {
  private static socket: WebSocket | null = null;
  
  static connect(url: string, token: string, onMessage: (msg: any) => void) {
    // WebSocket接続を無効化（エラー回避）
    console.log('WebSocket接続は無効化されています');
    return;
  }
  
  static sendNotification(type: string, payload: any) {
    // 何もしない
    return;
  }
  
  static disconnect() {
    // 何もしない
    return;
  }
}  