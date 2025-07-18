/**
 * IoTデバイス連携サービス
 * 各種センサーや医療機器との自動データ取得
 */

import { format } from 'date-fns';

export interface IoTDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'thermometer' | 'pulse_oximeter' | 'blood_pressure_monitor' | 'sleep_tracker';
  userId: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  batteryLevel: number;
  firmwareVersion: string;
  lastReading?: any;
}

export interface IoTReading {
  timestamp: string;
  value: number;
  unit: string;
  deviceId: string;
  quality: 'good' | 'fair' | 'poor';
  notes?: string;
}

export interface VitalSignsData {
  deviceId: string;
  userId: string;
  timestamp: string;
  temperature?: number;
  pulse?: number;
  spO2?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  sleepData?: {
    duration: number;
    quality: 'good' | 'fair' | 'poor';
    deepSleep: number;
    lightSleep: number;
    remSleep: number;
  };
  activityData?: {
    steps: number;
    calories: number;
    distance: number;
  };
}

export interface DeviceAlert {
  id: string;
  deviceId: string;
  type: 'battery_low' | 'connection_lost' | 'data_anomaly' | 'maintenance_required';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export class IoTService {
  private static devices: Map<string, IoTDevice> = new Map();
  private static vitalSignsData: VitalSignsData[] = [];
  private static alerts: DeviceAlert[] = [];
  private static connectionStatus: 'connected' | 'disconnected' = 'disconnected';
  private static dataListeners: Map<string, Set<(data: any) => void>> = new Map();
  private static readings: IoTReading[] = [];

  /**
   * IoTデバイスの登録
   */
  static registerDevice(device: Omit<IoTDevice, 'id' | 'lastSync'>): IoTDevice {
    const newDevice: IoTDevice = {
      ...device,
      id: this.generateDeviceId(),
      lastSync: new Date().toISOString(),
      status: 'connected'
    };

    this.devices.set(newDevice.id, newDevice);
    this.simulateDeviceConnection(newDevice.id);
    
    return newDevice;
  }

  /**
   * デバイス一覧の取得
   */
  static getDevices(userId?: string): IoTDevice[] {
    const devices = Array.from(this.devices.values());
    return userId ? devices.filter(d => d.userId === userId) : devices;
  }

  /**
   * 利用可能なデバイスの検出
   */
  static async discoverDevices(): Promise<IoTDevice[]> {
    // ネットワーク上のデバイスをスキャンするシミュレーション
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.getDevices();
  }

  /**
   * デバイスの接続状態を更新
   */
  static updateDeviceStatus(deviceId: string, status: IoTDevice['status']): void {
    const device = this.devices.get(deviceId);
    if (device) {
      device.status = status;
      device.lastSync = new Date().toISOString();
      
      if (status === 'disconnected') {
        this.createAlert(deviceId, 'connection_lost', 'medium', 'デバイスの接続が切断されました');
      }
    }
  }

  /**
   * バイタルサインデータの取得
   */
  static getVitalSignsData(userId: string, startDate?: string, endDate?: string): VitalSignsData[] {
    let data = this.vitalSignsData.filter(d => d.userId === userId);
    
    if (startDate) {
      data = data.filter(d => d.timestamp >= startDate);
    }
    if (endDate) {
      data = data.filter(d => d.timestamp <= endDate);
    }
    
    return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * リアルタイムバイタルサインの取得
   */
  static getRealTimeVitalSigns(userId: string): VitalSignsData | null {
    const userDevices = this.getDevices(userId);
    const connectedDevices = userDevices.filter(d => d.status === 'connected');
    
    if (connectedDevices.length === 0) {
      return null;
    }

    // 最新のデータを取得
    const latestData = this.vitalSignsData
      .filter(d => d.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    return latestData || null;
  }

  /**
   * スマートウォッチからのデータ同期
   */
  static async syncSmartwatchData(userId: string): Promise<VitalSignsData[]> {
    try {
      const smartwatch = this.getDevices(userId).find(d => d.type === 'smartwatch');
      
      if (!smartwatch || smartwatch.status !== 'connected') {
        throw new Error('スマートウォッチが接続されていません');
      }

      // スマートウォッチからのデータをシミュレート
      const newData = this.simulateSmartwatchData(smartwatch.id, userId);
      
      // データの異常検知
      this.detectDataAnomalies(newData);
      
      // バッテリー残量チェック
      this.checkBatteryLevel(smartwatch);
      
      return newData;
    } catch (error) {
      console.error('スマートウォッチ同期エラー:', error);
      throw error;
    }
  }

  /**
   * 体温計からのデータ同期
   */
  static async syncThermometerData(userId: string): Promise<VitalSignsData | null> {
    try {
      const thermometer = this.getDevices(userId).find(d => d.type === 'thermometer');
      
      if (!thermometer || thermometer.status !== 'connected') {
        throw new Error('体温計が接続されていません');
      }

      const temperature = this.simulateTemperatureReading();
      const newData: VitalSignsData = {
        deviceId: thermometer.id,
        userId,
        timestamp: new Date().toISOString(),
        temperature
      };

      this.vitalSignsData.push(newData);
      this.updateDeviceStatus(thermometer.id, 'connected');
      
      return newData;
    } catch (error) {
      console.error('体温計同期エラー:', error);
      throw error;
    }
  }

  /**
   * パルスオキシメーターからのデータ同期
   */
  static async syncPulseOximeterData(userId: string): Promise<VitalSignsData | null> {
    try {
      const pulseOximeter = this.getDevices(userId).find(d => d.type === 'pulse_oximeter');
      
      if (!pulseOximeter || pulseOximeter.status !== 'connected') {
        throw new Error('パルスオキシメーターが接続されていません');
      }

      const { spO2, pulse } = this.simulatePulseOximeterReading();
      const newData: VitalSignsData = {
        deviceId: pulseOximeter.id,
        userId,
        timestamp: new Date().toISOString(),
        spO2,
        pulse
      };

      this.vitalSignsData.push(newData);
      this.updateDeviceStatus(pulseOximeter.id, 'connected');
      
      return newData;
    } catch (error) {
      console.error('パルスオキシメーター同期エラー:', error);
      throw error;
    }
  }

  /**
   * 血圧計からのデータ同期
   */
  static async syncBloodPressureData(userId: string): Promise<VitalSignsData | null> {
    try {
      const bpMonitor = this.getDevices(userId).find(d => d.type === 'blood_pressure_monitor');
      
      if (!bpMonitor || bpMonitor.status !== 'connected') {
        throw new Error('血圧計が接続されていません');
      }

      const bloodPressure = this.simulateBloodPressureReading();
      const newData: VitalSignsData = {
        deviceId: bpMonitor.id,
        userId,
        timestamp: new Date().toISOString(),
        bloodPressure
      };

      this.vitalSignsData.push(newData);
      this.updateDeviceStatus(bpMonitor.id, 'connected');
      
      return newData;
    } catch (error) {
      console.error('血圧計同期エラー:', error);
      throw error;
    }
  }

  /**
   * 睡眠トラッカーからのデータ同期
   */
  static async syncSleepTrackerData(userId: string): Promise<VitalSignsData | null> {
    try {
      const sleepTracker = this.getDevices(userId).find(d => d.type === 'sleep_tracker');
      
      if (!sleepTracker || sleepTracker.status !== 'connected') {
        throw new Error('睡眠トラッカーが接続されていません');
      }

      const sleepData = this.simulateSleepData();
      const newData: VitalSignsData = {
        deviceId: sleepTracker.id,
        userId,
        timestamp: new Date().toISOString(),
        sleepData
      };

      this.vitalSignsData.push(newData);
      this.updateDeviceStatus(sleepTracker.id, 'connected');
      
      return newData;
    } catch (error) {
      console.error('睡眠トラッカー同期エラー:', error);
      throw error;
    }
  }

  /**
   * アラートの取得
   */
  static getAlerts(deviceId?: string): DeviceAlert[] {
    let alerts = this.alerts.filter(a => !a.resolved);
    return deviceId ? alerts.filter(a => a.deviceId === deviceId) : alerts;
  }

  /**
   * アラートの解決
   */
  static resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  /**
   * デバイスの削除
   */
  static removeDevice(deviceId: string): boolean {
    const device = this.devices.get(deviceId);
    if (device) {
      this.devices.delete(deviceId);
      this.createAlert(deviceId, 'maintenance_required', 'low', 'デバイスが削除されました');
      return true;
    }
    return false;
  }

  /**
   * 接続状態の取得
   */
  static getConnectionStatus(): 'connected' | 'disconnected' {
    return this.connectionStatus;
  }

  /**
   * 全デバイスの一括同期
   */
  static async syncAllDevices(userId: string): Promise<VitalSignsData[]> {
    const allData: VitalSignsData[] = [];
    
    try {
      // 各デバイスタイプの同期を実行
      const smartwatchData = await this.syncSmartwatchData(userId);
      allData.push(...smartwatchData);
      
      const thermometerData = await this.syncThermometerData(userId);
      if (thermometerData) allData.push(thermometerData);
      
      const pulseOximeterData = await this.syncPulseOximeterData(userId);
      if (pulseOximeterData) allData.push(pulseOximeterData);
      
      const bloodPressureData = await this.syncBloodPressureData(userId);
      if (bloodPressureData) allData.push(bloodPressureData);
      
      const sleepTrackerData = await this.syncSleepTrackerData(userId);
      if (sleepTrackerData) allData.push(sleepTrackerData);
      
      this.connectionStatus = 'connected';
      return allData;
    } catch (error) {
      console.error('全デバイス同期エラー:', error);
      this.connectionStatus = 'disconnected';
      throw error;
    }
  }

  static async getLatestReading(deviceId: string): Promise<any> {
    const device = this.devices.get(deviceId);
    if (!device || device.status === 'disconnected') return null;

    // デバイスから最新の測定値を取得するシミュレーション
    await new Promise(resolve => setTimeout(resolve, 300));
    let reading;
    switch (device.type) {
      case 'thermometer':
        reading = { temperature: parseFloat((36.5 + Math.random() * 1.5).toFixed(1)) };
        break;
      case 'pulse_oximeter':
        reading = { pulse: 60 + Math.floor(Math.random() * 20), spo2: 96 + Math.floor(Math.random() * 4) };
        break;
      case 'blood_pressure_monitor':
        reading = { systolic: 110 + Math.floor(Math.random() * 20), diastolic: 70 + Math.floor(Math.random() * 15) };
        break;
    }
    device.lastReading = reading;
    return reading;
  }

  // プライベートメソッド
  private static generateDeviceId(): string {
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static simulateDeviceConnection(deviceId: string): void {
    // デバイスの接続シミュレーション
    setInterval(() => {
      const device = this.devices.get(deviceId);
      if (device) {
        device.batteryLevel = Math.max(0, device.batteryLevel - 0.1);
        device.lastSync = new Date().toISOString();
        
        if (device.batteryLevel < 10) {
          this.createAlert(deviceId, 'battery_low', 'medium', 'バッテリー残量が低下しています');
        }
      }
    }, 60000); // 1分ごと
  }

  private static simulateSmartwatchData(deviceId: string, userId: string): VitalSignsData[] {
    const data: VitalSignsData[] = [];
    const now = new Date();
    
    // 過去24時間のデータをシミュレート
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        deviceId,
        userId,
        timestamp: timestamp.toISOString(),
        heartRate: 60 + Math.random() * 40, // 60-100 bpm
        activityData: {
          steps: Math.floor(Math.random() * 1000),
          calories: Math.floor(Math.random() * 100),
          distance: Math.random() * 2
        }
      });
    }
    
    this.vitalSignsData.push(...data);
    return data;
  }

  private static simulateTemperatureReading(): number {
    return 36.0 + Math.random() * 2; // 36.0-38.0°C
  }

  private static simulatePulseOximeterReading(): { spO2: number; pulse: number } {
    return {
      spO2: 95 + Math.random() * 5, // 95-100%
      pulse: 60 + Math.random() * 40 // 60-100 bpm
    };
  }

  private static simulateBloodPressureReading(): { systolic: number; diastolic: number } {
    return {
      systolic: 100 + Math.random() * 40, // 100-140 mmHg
      diastolic: 60 + Math.random() * 20 // 60-80 mmHg
    };
  }

  private static simulateSleepData(): VitalSignsData['sleepData'] {
    const duration = 6 + Math.random() * 4; // 6-10時間
    const quality = Math.random() > 0.7 ? 'good' : Math.random() > 0.4 ? 'fair' : 'poor';
    
    return {
      duration: duration * 60, // 分単位
      quality,
      deepSleep: duration * 0.2,
      lightSleep: duration * 0.5,
      remSleep: duration * 0.3
    };
  }

  private static detectDataAnomalies(data: VitalSignsData[]): void {
    data.forEach(item => {
      if (item.temperature && (item.temperature > 38.5 || item.temperature < 35.0)) {
        this.createAlert(item.deviceId, 'data_anomaly', 'high', '体温に異常値が検出されました');
      }
      if (item.spO2 && item.spO2 < 90) {
        this.createAlert(item.deviceId, 'data_anomaly', 'critical', 'SpO2が危険なレベルです');
      }
      if (item.pulse && (item.pulse > 120 || item.pulse < 40)) {
        this.createAlert(item.deviceId, 'data_anomaly', 'high', '脈拍に異常値が検出されました');
      }
    });
  }

  private static checkBatteryLevel(device: IoTDevice): void {
    if (device.batteryLevel < 10) {
      this.createAlert(device.id, 'battery_low', 'medium', `${device.name}のバッテリー残量が低下しています`);
    }
  }

  private static createAlert(deviceId: string, type: DeviceAlert['type'], severity: DeviceAlert['severity'], message: string): void {
    const alert: DeviceAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      deviceId,
      type,
      severity,
      message,
      timestamp: new Date().toISOString(),
      resolved: false
    };
    
    this.alerts.push(alert);
  }

  /**
   * データリスナーの追加
   */
  static addDataListener(deviceId: string, listener: (data: any) => void): void {
    if (!this.dataListeners.has(deviceId)) {
      this.dataListeners.set(deviceId, new Set());
    }
    this.dataListeners.get(deviceId)!.add(listener);
  }

  /**
   * データリスナーの削除
   */
  static removeDataListener(deviceId: string, listener?: (data: any) => void): void {
    const listeners = this.dataListeners.get(deviceId);
    if (listeners) {
      if (listener) {
        listeners.delete(listener);
      } else {
        this.dataListeners.delete(deviceId);
      }
    }
  }

  /**
   * データリスナーの存在確認
   */
  static hasDataListener(deviceId: string): boolean {
    return this.dataListeners.has(deviceId) && this.dataListeners.get(deviceId)!.size > 0;
  }

  /**
   * データ更新のシミュレーション
   */
  static simulateDataUpdate(deviceId: string, data: any): void {
    const listeners = this.dataListeners.get(deviceId);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error('データリスナーエラー:', error);
        }
      });
    }
  }

  /**
   * デバイスからの読み取り
   */
  static async readFromDevice(deviceId: string): Promise<IoTReading> {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`デバイスが見つかりません: ${deviceId}`);
    }
    
    if (device.status !== 'connected') {
      throw new Error(`デバイスが接続されていません: ${deviceId}`);
    }

    const reading: IoTReading = {
      deviceId,
      value: Math.random() * 100,
      unit: 'unit',
      timestamp: new Date().toISOString(),
      quality: 'good'
    };

    this.readings.push(reading);
    this.simulateDataUpdate(deviceId, reading);
    
    return reading;
  }

  /**
   * デバイスへの接続
   */
  static async connectToDevice(deviceId: string): Promise<boolean> {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`デバイスが見つかりません: ${deviceId}`);
    }

    device.status = 'connected';
    device.lastSync = new Date().toISOString();
    return true;
  }

  /**
   * デバイスからの切断
   */
  static async disconnectFromDevice(deviceId: string): Promise<boolean> {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`デバイスが見つかりません: ${deviceId}`);
    }

    device.status = 'disconnected';
    device.lastSync = new Date().toISOString();
    return true;
  }

  /**
   * デバイス設定の更新
   */
  static async updateDeviceSettings(deviceId: string, settings: any): Promise<boolean> {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`デバイスが見つかりません: ${deviceId}`);
    }

    Object.assign(device, settings);
    return true;
  }

  /**
   * データ品質の評価
   */
  static async assessDataQuality(deviceId: string): Promise<{
    overall: number;
    completeness: number;
    accuracy: number;
    timeliness: number;
  }> {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`デバイスが見つかりません: ${deviceId}`);
    }

    const deviceReadings = this.readings.filter(r => r.deviceId === deviceId);
    
    if (deviceReadings.length === 0) {
      return {
        overall: 0,
        completeness: 0,
        accuracy: 0,
        timeliness: 0
      };
    }

    const completeness = deviceReadings.length / 100; // 期待される読み取り数に対する比率
    const accuracy = device.status === 'error' ? 0.3 : 0.9;
    const timeliness = 0.8; // 最新データの新鮮度

    return {
      overall: (completeness + accuracy + timeliness) / 3,
      completeness,
      accuracy,
      timeliness
    };
  }

  /**
   * アラートのチェック
   */
  static async checkForAlerts(deviceId: string): Promise<any[]> {
    const device = this.devices.get(deviceId);
    if (!device) {
      return [];
    }

    const alerts = [];
    
    if (device.batteryLevel < 20) {
      alerts.push({
        deviceId,
        type: 'battery',
        severity: 'medium',
        message: 'バッテリー残量が少なくなっています',
        timestamp: new Date().toISOString()
      });
    }

    if (device.status === 'error') {
      alerts.push({
        deviceId,
        type: 'connection',
        severity: 'high',
        message: 'デバイスでエラーが発生しています',
        timestamp: new Date().toISOString()
      });
    }

    return alerts;
  }

  /**
   * デバイス履歴の取得
   */
  static async getDeviceHistory(deviceId: string, period: { startDate: string; endDate: string }): Promise<IoTReading[]> {
    return this.readings.filter(reading => 
      reading.deviceId === deviceId &&
      reading.timestamp >= period.startDate &&
      reading.timestamp <= period.endDate
    );
  }
} 