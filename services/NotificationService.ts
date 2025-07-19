import { NotificationType } from '../types';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  userId?: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'system' | 'user' | 'medical' | 'emergency' | 'family';
  metadata?: Record<string, any>;
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
}

export class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private subscribers: Set<(notification: Notification) => void> = new Set();
  private wsConnection: WebSocket | null = null;
  private pushSubscription: PushSubscription | null = null;
  private notificationPermission: NotificationPermission = 'default';

  private constructor() {
    this.initializeNotifications();
    this.requestNotificationPermission();
    this.setupServiceWorker();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * 通知システムの初期化
   */
  private async initializeNotifications(): Promise<void> {
    try {
      // ローカルストレージから通知履歴を読み込み
      const stored = localStorage.getItem('notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
      }

      // WebSocket接続の確立
      this.connectWebSocket();

      // プッシュ通知の設定
      await this.setupPushNotifications();

      console.log('通知システムが初期化されました');
    } catch (error) {
      console.error('通知システム初期化エラー:', error);
    }
  }

  /**
   * WebSocket接続の確立
   */
  private connectWebSocket(): void {
    try {
      // 実際のWebSocketサーバーURLに置き換える
      const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/notifications';
      this.wsConnection = new WebSocket(wsUrl);

      this.wsConnection.onopen = () => {
        console.log('WebSocket接続が確立されました');
        this.sendWebSocketMessage({
          type: 'subscribe',
          userId: this.getCurrentUserId()
        });
      };

      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(data);
        } catch (error) {
          console.error('WebSocketメッセージ解析エラー:', error);
        }
      };

      this.wsConnection.onerror = (error) => {
        console.error('WebSocketエラー:', error);
      };

      this.wsConnection.onclose = () => {
        console.log('WebSocket接続が切断されました');
        // 再接続を試行
        setTimeout(() => this.connectWebSocket(), 5000);
      };
    } catch (error) {
      console.error('WebSocket接続エラー:', error);
    }
  }

  /**
   * WebSocketメッセージの処理
   */
  private handleWebSocketMessage(data: any): void {
    switch (data.type) {
      case 'notification':
        this.addNotification({
          type: data.notificationType,
          title: data.title,
          message: data.message,
          timestamp: data.timestamp,
          userId: data.userId,
          read: false,
          priority: data.priority || 'medium',
          category: data.category || 'system',
          metadata: data.metadata
        });
        break;
      case 'emergency_alert':
        this.showEmergencyNotification(data);
        break;
      case 'family_update':
        this.showFamilyNotification(data);
        break;
      default:
        console.log('未処理のWebSocketメッセージ:', data);
    }
  }

  /**
   * WebSocketメッセージの送信
   */
  private sendWebSocketMessage(message: any): void {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify(message));
    }
  }

  /**
   * プッシュ通知の設定
   */
  private async setupPushNotifications(): Promise<void> {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        
        // プッシュ通知の許可を要求
        const permission = await Notification.requestPermission();
        this.notificationPermission = permission;

        if (permission === 'granted') {
          // プッシュ通知の購読
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY || '')
          });

          this.pushSubscription = subscription;
          console.log('プッシュ通知が設定されました');
        }
      }
    } catch (error) {
      console.error('プッシュ通知設定エラー:', error);
    }
  }

  /**
   * 通知権限の要求
   */
  private async requestNotificationPermission(): Promise<void> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
    }
  }

  /**
   * Service Workerの設定
   */
  private async setupServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Workerが登録されました:', registration);
      } catch (error) {
        console.error('Service Worker登録エラー:', error);
      }
    }
  }

  /**
   * 通知の追加
   */
  addNotification(notification: Omit<Notification, 'id'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: notification.timestamp || new Date().toISOString()
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifySubscribers(newNotification);

    // デスクトップ通知の表示
    this.showDesktopNotification(newNotification);

    // プッシュ通知の送信（高優先度の場合）
    if (newNotification.priority === 'high' || newNotification.priority === 'urgent') {
      this.sendPushNotification(newNotification);
    }
  }

  /**
   * デスクトップ通知の表示
   */
  private showDesktopNotification(notification: Notification): void {
    if (this.notificationPermission === 'granted' && 'Notification' in window) {
      const desktopNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent',
        silent: notification.priority === 'low',
        data: notification.metadata
      });

      desktopNotification.onclick = () => {
        if (notification.actionUrl) {
          window.open(notification.actionUrl, '_blank');
        }
        desktopNotification.close();
      };
    }
  }

  /**
   * プッシュ通知の送信
   */
  private async sendPushNotification(notification: Notification): Promise<void> {
    if (this.pushSubscription) {
      try {
        const pushNotification: PushNotification = {
          title: notification.title,
          body: notification.message,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          tag: notification.id,
          requireInteraction: notification.priority === 'urgent',
          silent: notification.priority === 'low',
          data: notification.metadata
        };

        // 実際の実装では、サーバーにプッシュ通知を送信
        await fetch('/api/push-notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription: this.pushSubscription,
            notification: pushNotification
          })
        });
      } catch (error) {
        console.error('プッシュ通知送信エラー:', error);
      }
    }
  }

  /**
   * 緊急通知の表示
   */
  private showEmergencyNotification(data: any): void {
    const notification = {
      type: NotificationType.ERROR,
      title: '緊急事態',
      message: data.message,
      timestamp: new Date().toISOString(),
      userId: data.userId,
      read: false,
      priority: 'urgent' as const,
      category: 'emergency' as const,
      metadata: data
    };

    this.addNotification(notification);

    // 音声アラート
    this.playEmergencySound();
  }

  /**
   * 家族からの通知の表示
   */
  private showFamilyNotification(data: any): void {
    const notification = {
      type: NotificationType.INFO,
      title: '家族からの連絡',
      message: data.message,
      timestamp: new Date().toISOString(),
      userId: data.userId,
      read: false,
      priority: 'medium' as const,
      category: 'family' as const,
      metadata: data
    };

    this.addNotification(notification);
  }

  /**
   * 緊急音の再生
   */
  private playEmergencySound(): void {
    try {
      const audio = new Audio('/sounds/emergency-alert.mp3');
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.error('緊急音再生エラー:', error);
      });
    } catch (error) {
      console.error('緊急音再生エラー:', error);
    }
  }

  /**
   * 通知の購読
   */
  subscribe(callback: (notification: Notification) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * 購読者への通知
   */
  private notifySubscribers(notification: Notification): void {
    this.subscribers.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('通知コールバックエラー:', error);
      }
    });
  }

  /**
   * 通知の取得
   */
  getNotifications(userId?: string): Notification[] {
    if (userId) {
      return this.notifications.filter(n => !n.userId || n.userId === userId);
    }
    return this.notifications;
  }

  /**
   * 未読通知の取得
   */
  getUnreadNotifications(userId?: string): Notification[] {
    return this.getNotifications(userId).filter(n => !n.read);
  }

  /**
   * 通知を既読にする
   */
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  /**
   * 通知を削除
   */
  deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
  }

  /**
   * 全通知を既読にする
   */
  markAllAsRead(userId?: string): void {
    const notifications = userId 
      ? this.notifications.filter(n => !n.userId || n.userId === userId)
      : this.notifications;
    
    notifications.forEach(n => n.read = true);
    this.saveNotifications();
  }

  /**
   * 通知の保存
   */
  private saveNotifications(): void {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('通知保存エラー:', error);
    }
  }

  /**
   * パーソナライズされた感謝メッセージの生成
   */
  static generatePersonalizedThanksMessage(
    userName: string, 
    comments: string[], 
    likes: number[], 
    language: 'ja' | 'en' = 'ja'
  ): string {
    const totalComments = comments.length;
    const totalLikes = likes.reduce((sum, count) => sum + count, 0);
    
    if (language === 'ja') {
      if (totalComments > 0 && totalLikes > 0) {
        return `${userName}様、${totalComments}件のコメントと${totalLikes}件のいいねをありがとうございます。心から感謝いたします。`;
      } else if (totalComments > 0) {
        return `${userName}様、${totalComments}件のコメントをありがとうございます。励みになります。`;
      } else if (totalLikes > 0) {
        return `${userName}様、${totalLikes}件のいいねをありがとうございます。ありがとうございます。`;
      } else {
        return `${userName}様、いつもありがとうございます。`;
      }
    } else {
      if (totalComments > 0 && totalLikes > 0) {
        return `Thank you ${userName} for ${totalComments} comments and ${totalLikes} likes. We truly appreciate it.`;
      } else if (totalComments > 0) {
        return `Thank you ${userName} for ${totalComments} comments. It means a lot to us.`;
      } else if (totalLikes > 0) {
        return `Thank you ${userName} for ${totalLikes} likes. We appreciate it.`;
      } else {
        return `Thank you ${userName} for everything.`;
      }
    }
  }

  /**
   * ユーティリティ関数
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getCurrentUserId(): string {
    // 実際の実装では、認証コンテキストから取得
    return 'current_user';
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
} 