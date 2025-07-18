import { StorageService } from './StorageService';
export class BackupService {
    constructor() {
        this.storageService = new StorageService();
    }
    async createBackup() {
        try {
            const backupData = await this.storageService.exportData();
            const backupString = JSON.stringify(backupData, null, 2);
            // Create downloadable file
            const blob = new Blob([backupString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `重心ケアアプリ_バックアップ_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            return 'バックアップが正常に作成されました';
        }
        catch (error) {
            console.error('Backup creation failed:', error);
            throw new Error('バックアップの作成に失敗しました');
        }
    }
    async importBackup(backupData) {
        try {
            // Validate backup data
            if (!this.isValidBackupData(backupData)) {
                throw new Error('無効なバックアップファイルです');
            }
            await this.storageService.importData(backupData);
        }
        catch (error) {
            console.error('Backup import failed:', error);
            throw error;
        }
    }
    isValidBackupData(data) {
        // Basic validation
        return (data &&
            typeof data === 'object' &&
            Array.isArray(data.users) &&
            Array.isArray(data.logs) &&
            Array.isArray(data.notices) &&
            data.exportDate &&
            data.version);
    }
    async validateBackupFile(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            if (this.isValidBackupData(data)) {
                return { isValid: true };
            }
            else {
                return { isValid: false, error: 'バックアップファイルの形式が正しくありません' };
            }
        }
        catch (error) {
            return { isValid: false, error: 'ファイルの読み込みに失敗しました' };
        }
    }
    async createBackupFromFile(file) {
        try {
            const text = await file.text();
            const backupData = JSON.parse(text);
            if (!this.isValidBackupData(backupData)) {
                throw new Error('無効なバックアップファイルです');
            }
            await this.importBackup(backupData);
        }
        catch (error) {
            console.error('Backup import from file failed:', error);
            throw error;
        }
    }
    getBackupInfo(backupData) {
        return {
            userCount: backupData.users?.length || 0,
            logCount: backupData.logs?.length || 0,
            noticeCount: backupData.notices?.length || 0,
            exportDate: backupData.exportDate || '不明',
            version: backupData.version || '不明'
        };
    }
}
