import { EncryptionService } from './EncryptionService';
import { format } from 'date-fns';

export interface BackupData {
  version: string;
  timestamp: string;
  data: any;
  hash: string;
  metadata: {
    totalUsers: number;
    totalLogs: number;
    totalStaff: number;
    backupSize: number;
  };
}

export class BackupService {
  private static readonly BACKUP_VERSION = '1.0.0';
  private static readonly BACKUP_PREFIX = 'jyushin-care-backup';
  private static readonly MAX_BACKUPS = 10; // 最大バックアップ数

  /**
   * データをバックアップする
   */
  static async createBackup(data: any): Promise<BackupData> {
    try {
      const timestamp = new Date().toISOString();
      const hash = EncryptionService.generateHash(data);
      
      const backupData: BackupData = {
        version: this.BACKUP_VERSION,
        timestamp,
        data,
        hash,
        metadata: {
          totalUsers: data.users?.length || 0,
          totalLogs: data.dailyLogs?.length || 0,
          totalStaff: data.staff?.length || 0,
          backupSize: JSON.stringify(data).length
        }
      };

      // データの整合性をチェック
      if (!EncryptionService.verifyHash(data, hash)) {
        throw new Error('データの整合性チェックに失敗しました');
      }

      // 暗号化してファイルとして保存
      const filename = `${this.BACKUP_PREFIX}-${format(new Date(), 'yyyyMMdd-HHmmss')}`;
      await EncryptionService.encryptAndSaveFile(backupData, filename);

      // ローカルストレージにも保存（最新のバックアップ情報）
      this.saveBackupInfo(backupData);

      return backupData;
    } catch (error) {
      console.error('バックアップ作成エラー:', error);
      throw new Error('バックアップの作成に失敗しました');
    }
  }

  /**
   * バックアップからデータを復元する
   */
  static async restoreFromBackup(file: File): Promise<any> {
    try {
      const backupData: BackupData = await EncryptionService.loadAndDecryptFile(file);
      
      // バージョンチェック
      if (backupData.version !== this.BACKUP_VERSION) {
        throw new Error('バックアップのバージョンが互換性がありません');
      }

      // データの整合性をチェック
      if (!EncryptionService.verifyHash(backupData.data, backupData.hash)) {
        throw new Error('バックアップデータの整合性チェックに失敗しました');
      }

      return backupData.data;
    } catch (error) {
      console.error('バックアップ復元エラー:', error);
      throw new Error('バックアップの復元に失敗しました');
    }
  }

  /**
   * 自動バックアップを設定する
   */
  static setupAutoBackup(dataProvider: () => any, intervalHours: number = 24): void {
    const intervalMs = intervalHours * 60 * 60 * 1000;
    
    setInterval(async () => {
      try {
        const data = dataProvider();
        await this.createBackup(data);
        console.log('自動バックアップが完了しました');
      } catch (error) {
        console.error('自動バックアップエラー:', error);
      }
    }, intervalMs);
  }

  /**
   * バックアップ情報をローカルストレージに保存
   */
  private static saveBackupInfo(backupData: BackupData): void {
    try {
      const backups = this.getBackupHistory();
      backups.unshift({
        timestamp: backupData.timestamp,
        filename: `${this.BACKUP_PREFIX}-${format(new Date(backupData.timestamp), 'yyyyMMdd-HHmmss')}.encrypted`,
        metadata: backupData.metadata
      });

      // 最大バックアップ数を超えた場合、古いものを削除
      if (backups.length > this.MAX_BACKUPS) {
        backups.splice(this.MAX_BACKUPS);
      }

      localStorage.setItem('backupHistory', JSON.stringify(backups));
    } catch (error) {
      console.error('バックアップ情報保存エラー:', error);
    }
  }

  /**
   * バックアップ履歴を取得
   */
  static getBackupHistory(): Array<{
    timestamp: string;
    filename: string;
    metadata: BackupData['metadata'];
  }> {
    try {
      const history = localStorage.getItem('backupHistory');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('バックアップ履歴取得エラー:', error);
      return [];
    }
  }

  /**
   * バックアップの検証
   */
  static async validateBackup(file: File): Promise<{
    isValid: boolean;
    metadata?: BackupData['metadata'];
    error?: string;
  }> {
    try {
      const backupData: BackupData = await EncryptionService.loadAndDecryptFile(file);
      
      // バージョンチェック
      if (backupData.version !== this.BACKUP_VERSION) {
        return {
          isValid: false,
          error: 'バックアップのバージョンが互換性がありません'
        };
      }

      // データの整合性をチェック
      if (!EncryptionService.verifyHash(backupData.data, backupData.hash)) {
        return {
          isValid: false,
          error: 'バックアップデータの整合性チェックに失敗しました'
        };
      }

      return {
        isValid: true,
        metadata: backupData.metadata
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'バックアップファイルの読み込みに失敗しました'
      };
    }
  }

  /**
   * バックアップの統計情報を取得
   */
  static getBackupStats(): {
    totalBackups: number;
    latestBackup?: string;
    totalDataSize: number;
  } {
    const history = this.getBackupHistory();
    const totalDataSize = history.reduce((sum, backup) => sum + backup.metadata.backupSize, 0);
    
    return {
      totalBackups: history.length,
      latestBackup: history[0]?.timestamp,
      totalDataSize
    };
  }
}
 