/**
 * IoTデバイス連携サービス
 * 各種センサーや医療機器との自動データ取得
 */
export class IoTService {
    /**
     * IoTデバイスの登録
     */
    static registerDevice(device) {
        const newDevice = {
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
    static getDevices(userId) {
        const devices = Array.from(this.devices.values());
        return userId ? devices.filter(d => d.userId === userId) : devices;
    }
    /**
     * 利用可能なデバイスの検出
     */
    static async discoverDevices() {
        // シミュレーション用のデバイスを生成
        const mockDevices = [
            {
                id: 'smartwatch-001',
                name: 'スマートウォッチ',
                type: 'smartwatch',
                userId: '',
                status: 'connected',
                lastSync: new Date().toISOString(),
                batteryLevel: 85,
                firmwareVersion: '1.2.3'
            },
            {
                id: 'thermometer-001',
                name: 'デジタル体温計',
                type: 'thermometer',
                userId: '',
                status: 'connected',
                lastSync: new Date().toISOString(),
                batteryLevel: 90,
                firmwareVersion: '2.1.0'
            },
            {
                id: 'pulse-oximeter-001',
                name: 'パルスオキシメーター',
                type: 'pulse_oximeter',
                userId: '',
                status: 'connected',
                lastSync: new Date().toISOString(),
                batteryLevel: 75,
                firmwareVersion: '1.5.2'
            }
        ];
        return mockDevices;
    }
    /**
     * デバイスの接続状態を更新
     */
    static updateDeviceStatus(deviceId, status) {
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
    static getVitalSignsData(userId, startDate, endDate) {
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
    static getRealTimeVitalSigns(userId) {
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
    static async syncSmartwatchData(userId) {
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
        }
        catch (error) {
            console.error('スマートウォッチ同期エラー:', error);
            throw error;
        }
    }
    /**
     * 体温計からのデータ同期
     */
    static async syncThermometerData(userId) {
        try {
            const thermometer = this.getDevices(userId).find(d => d.type === 'thermometer');
            if (!thermometer || thermometer.status !== 'connected') {
                throw new Error('体温計が接続されていません');
            }
            const temperature = this.simulateTemperatureReading();
            const newData = {
                deviceId: thermometer.id,
                userId,
                timestamp: new Date().toISOString(),
                temperature
            };
            this.vitalSignsData.push(newData);
            this.updateDeviceStatus(thermometer.id, 'connected');
            return newData;
        }
        catch (error) {
            console.error('体温計同期エラー:', error);
            throw error;
        }
    }
    /**
     * パルスオキシメーターからのデータ同期
     */
    static async syncPulseOximeterData(userId) {
        try {
            const pulseOximeter = this.getDevices(userId).find(d => d.type === 'pulse_oximeter');
            if (!pulseOximeter || pulseOximeter.status !== 'connected') {
                throw new Error('パルスオキシメーターが接続されていません');
            }
            const { spO2, pulse } = this.simulatePulseOximeterReading();
            const newData = {
                deviceId: pulseOximeter.id,
                userId,
                timestamp: new Date().toISOString(),
                spO2,
                pulse
            };
            this.vitalSignsData.push(newData);
            this.updateDeviceStatus(pulseOximeter.id, 'connected');
            return newData;
        }
        catch (error) {
            console.error('パルスオキシメーター同期エラー:', error);
            throw error;
        }
    }
    /**
     * 血圧計からのデータ同期
     */
    static async syncBloodPressureData(userId) {
        try {
            const bpMonitor = this.getDevices(userId).find(d => d.type === 'blood_pressure_monitor');
            if (!bpMonitor || bpMonitor.status !== 'connected') {
                throw new Error('血圧計が接続されていません');
            }
            const bloodPressure = this.simulateBloodPressureReading();
            const newData = {
                deviceId: bpMonitor.id,
                userId,
                timestamp: new Date().toISOString(),
                bloodPressure
            };
            this.vitalSignsData.push(newData);
            this.updateDeviceStatus(bpMonitor.id, 'connected');
            return newData;
        }
        catch (error) {
            console.error('血圧計同期エラー:', error);
            throw error;
        }
    }
    /**
     * 睡眠トラッカーからのデータ同期
     */
    static async syncSleepTrackerData(userId) {
        try {
            const sleepTracker = this.getDevices(userId).find(d => d.type === 'sleep_tracker');
            if (!sleepTracker || sleepTracker.status !== 'connected') {
                throw new Error('睡眠トラッカーが接続されていません');
            }
            const sleepData = this.simulateSleepData();
            const newData = {
                deviceId: sleepTracker.id,
                userId,
                timestamp: new Date().toISOString(),
                sleepData
            };
            this.vitalSignsData.push(newData);
            this.updateDeviceStatus(sleepTracker.id, 'connected');
            return newData;
        }
        catch (error) {
            console.error('睡眠トラッカー同期エラー:', error);
            throw error;
        }
    }
    /**
     * アラートの取得
     */
    static getAlerts(deviceId) {
        let alerts = this.alerts.filter(a => !a.resolved);
        return deviceId ? alerts.filter(a => a.deviceId === deviceId) : alerts;
    }
    /**
     * アラートの解決
     */
    static resolveAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.resolved = true;
        }
    }
    /**
     * デバイスの削除
     */
    static removeDevice(deviceId) {
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
    static getConnectionStatus() {
        return this.connectionStatus;
    }
    /**
     * 全デバイスの一括同期
     */
    static async syncAllDevices(userId) {
        const allData = [];
        try {
            // 各デバイスタイプの同期を実行
            const smartwatchData = await this.syncSmartwatchData(userId);
            allData.push(...smartwatchData);
            const thermometerData = await this.syncThermometerData(userId);
            if (thermometerData)
                allData.push(thermometerData);
            const pulseOximeterData = await this.syncPulseOximeterData(userId);
            if (pulseOximeterData)
                allData.push(pulseOximeterData);
            const bloodPressureData = await this.syncBloodPressureData(userId);
            if (bloodPressureData)
                allData.push(bloodPressureData);
            const sleepTrackerData = await this.syncSleepTrackerData(userId);
            if (sleepTrackerData)
                allData.push(sleepTrackerData);
            this.connectionStatus = 'connected';
            return allData;
        }
        catch (error) {
            console.error('全デバイス同期エラー:', error);
            this.connectionStatus = 'disconnected';
            throw error;
        }
    }
    // プライベートメソッド
    static generateDeviceId() {
        return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    static simulateDeviceConnection(deviceId) {
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
    static simulateSmartwatchData(deviceId, userId) {
        const data = [];
        const now = new Date();
        // 過去24時間のデータをシミュレート
        for (let i = 0; i < 24; i++) {
            const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
            data.push({
                deviceId,
                userId,
                timestamp: timestamp.toISOString(),
                heartRate: 60 + Math.random() * 40,
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
    static simulateTemperatureReading() {
        return 36.0 + Math.random() * 2; // 36.0-38.0°C
    }
    static simulatePulseOximeterReading() {
        return {
            spO2: 95 + Math.random() * 5,
            pulse: 60 + Math.random() * 40 // 60-100 bpm
        };
    }
    static simulateBloodPressureReading() {
        return {
            systolic: 100 + Math.random() * 40,
            diastolic: 60 + Math.random() * 20 // 60-80 mmHg
        };
    }
    static simulateSleepData() {
        const duration = 6 + Math.random() * 4; // 6-10時間
        const quality = Math.random() > 0.7 ? 'good' : Math.random() > 0.4 ? 'fair' : 'poor';
        return {
            duration: duration * 60,
            quality,
            deepSleep: duration * 0.2,
            lightSleep: duration * 0.5,
            remSleep: duration * 0.3
        };
    }
    static detectDataAnomalies(data) {
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
    static checkBatteryLevel(device) {
        if (device.batteryLevel < 10) {
            this.createAlert(device.id, 'battery_low', 'medium', `${device.name}のバッテリー残量が低下しています`);
        }
    }
    static createAlert(deviceId, type, severity, message) {
        const alert = {
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
}
IoTService.devices = new Map();
IoTService.vitalSignsData = [];
IoTService.alerts = [];
IoTService.connectionStatus = 'disconnected';
