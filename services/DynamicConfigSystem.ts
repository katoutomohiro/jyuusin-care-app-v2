/**
 * 動的設定適用システム
 * 管理者の設定変更をリアルタイムで反映
 */

import React from 'react';

export class DynamicConfigSystem {
  private static configCache: any = null;
  private static listeners: Array<(config: any) => void> = [];

  /**
   * 設定の読み込み
   */
  static loadConfig(): any {
    try {
      if (this.configCache) {
        return this.configCache;
      }

      const config = {
        eventTypes: this.loadEventTypes(),
        userFields: this.loadUserFields(),
        systemSettings: this.loadSystemSettings(),
        aiSettings: this.loadAISettings()
      };

      this.configCache = config;
      return config;
    } catch (error) {
      console.error('設定読み込みエラー:', error);
      return this.getDefaultConfig();
    }
  }

  /**
   * イベントタイプの読み込み
   */
  static loadEventTypes(): any[] {
    const saved = localStorage.getItem('app_event_types');
    if (saved) {
      const parsed = JSON.parse(saved);
      return Object.keys(parsed).map(key => ({
        id: key,
        name: parsed[key].name,
        icon: parsed[key].icon,
        color: parsed[key].color
      }));
    }

    return [
      { id: 'seizure', name: '発作', icon: '⚡', color: 'bg-red-500' },
      { id: 'expression', name: '表情・反応', icon: '😊', color: 'bg-blue-500' },
      { id: 'vital', name: 'バイタル', icon: '🌡️', color: 'bg-green-500' },
      { id: 'meal', name: '食事・水分', icon: '🍽️', color: 'bg-orange-500' },
      { id: 'excretion', name: '排泄', icon: '🚽', color: 'bg-purple-500' },
      { id: 'sleep', name: '睡眠', icon: '😴', color: 'bg-indigo-500' },
      { id: 'activity', name: '活動', icon: '🎯', color: 'bg-teal-500' },
      { id: 'care', name: 'ケア', icon: '🤲', color: 'bg-pink-500' },
      { id: 'medication', name: '服薬', icon: '💊', color: 'bg-cyan-500' },
      { id: 'other', name: 'その他', icon: '📝', color: 'bg-gray-500' }
    ];
  }

  /**
   * ユーザーフィールドの読み込み
   */
  static loadUserFields(): any[] {
    const saved = localStorage.getItem('app_user_fields');
    if (saved) {
      return JSON.parse(saved);
    }

    return [
      { id: 'name', name: '利用者名', type: 'text', required: true },
      { id: 'age', name: '年齢', type: 'number', required: true },
      { id: 'gender', name: '性別', type: 'select', options: ['男性', '女性', '男児', '女児', '不明'], required: true },
      { id: 'disabilityType', name: '障害種別', type: 'text', required: true },
      { id: 'disabilityLevel', name: '障害程度', type: 'select', options: ['区分1', '区分2', '区分3', '区分4', '区分5', '区分6'], required: true }
    ];
  }

  /**
   * システム設定の読み込み
   */
  static loadSystemSettings(): any {
    const saved = localStorage.getItem('app_system_settings');
    if (saved) {
      return JSON.parse(saved);
    }

    return {
      facility_name: '重症心身障害者施設',
      auto_save: true,
      backup_interval: 30
    };
  }

  /**
   * AI設定の読み込み
   */
  static loadAISettings(): any {
    const saved = localStorage.getItem('app_ai_settings');
    if (saved) {
      return JSON.parse(saved);
    }

    return {
      ai_analysis_enabled: true,
      analysis_periods: ['1month', '6months', '1year'],
      alert_threshold: 2
    };
  }

  /**
   * デフォルト設定
   */
  static getDefaultConfig(): any {
    return {
      eventTypes: this.loadEventTypes(),
      userFields: this.loadUserFields(),
      systemSettings: this.loadSystemSettings(),
      aiSettings: this.loadAISettings()
    };
  }

  /**
   * 設定変更の監視
   */
  static addConfigListener(callback: (config: any) => void): void {
    this.listeners.push(callback);
  }

  /**
   * 設定変更の通知
   */
  static notifyConfigChange(): void {
    this.configCache = null; // キャッシュクリア
    const newConfig = this.loadConfig();
    this.listeners.forEach(callback => callback(newConfig));
  }

  /**
   * 即座に設定を反映
   */
  static applyConfigImmediately(config: any): void {
    // LocalStorageに保存
    if (config.eventTypes) {
      const eventTypesConfig = config.eventTypes.reduce((acc: any, item: any) => {
        acc[item.id] = {
          name: item.name,
          icon: item.icon,
          color: item.color
        };
        return acc;
      }, {});
      localStorage.setItem('app_event_types', JSON.stringify(eventTypesConfig));
    }

    if (config.userFields) {
      localStorage.setItem('app_user_fields', JSON.stringify(config.userFields));
    }

    if (config.systemSettings) {
      localStorage.setItem('app_system_settings', JSON.stringify(config.systemSettings));
    }

    if (config.aiSettings) {
      localStorage.setItem('app_ai_settings', JSON.stringify(config.aiSettings));
    }

    // 設定変更を通知
    this.notifyConfigChange();
  }

  /**
   * 管理者権限チェック
   */
  static hasAdminPermission(): boolean {
    try {
      const adminContext = JSON.parse(localStorage.getItem('admin_context') || '{}');
      return adminContext.isAdminMode && adminContext.isAuthenticated;
    } catch {
      return false;
    }
  }

  /**
   * 設定のバックアップ
   */
  static backupConfig(): string {
    const config = this.loadConfig();
    const backup = {
      timestamp: new Date().toISOString(),
      config: config,
      version: '1.0'
    };
    return JSON.stringify(backup);
  }

  /**
   * 設定の復元
   */
  static restoreConfig(backupData: string): boolean {
    try {
      const backup = JSON.parse(backupData);
      this.applyConfigImmediately(backup.config);
      return true;
    } catch (error) {
      console.error('設定復元エラー:', error);
      return false;
    }
  }
}

/**
 * React Hook: 動的設定
 */
export function useDynamicConfig() {
  const [config, setConfig] = React.useState(DynamicConfigSystem.loadConfig());

  React.useEffect(() => {
    const handleConfigChange = (newConfig: any) => {
      setConfig(newConfig);
    };

    DynamicConfigSystem.addConfigListener(handleConfigChange);

    // ストレージ変更の監視
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('app_')) {
        DynamicConfigSystem.notifyConfigChange();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return config;
}

/**
 * コンポーネントのリアルタイム更新Hook
 */
export function useConfigurableComponent(componentType: string) {
  const config = useDynamicConfig();
  
  const getEventTypes = () => config.eventTypes || [];
  const getUserFields = () => config.userFields || [];
  const getSystemSettings = () => config.systemSettings || {};
  const getAISettings = () => config.aiSettings || {};

  return {
    eventTypes: getEventTypes(),
    userFields: getUserFields(),
    systemSettings: getSystemSettings(),
    aiSettings: getAISettings(),
    facilityName: config.systemSettings?.facility_name || '重症心身障害者施設'
  };
}
