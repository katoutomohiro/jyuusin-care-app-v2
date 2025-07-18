import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BackupService } from '../services/BackupService';
import { StorageService } from '../services/StorageService';
import { EncryptionService } from '../services/EncryptionService';

// StorageServiceをモック
vi.mock('../services/StorageService');

// EncryptionServiceをモック
vi.mock('../services/EncryptionService');

describe('BackupService', () => {
  let backupService: BackupService;
  let mockStorageService: jest.Mocked<StorageService>;

  beforeEach(() => {
    vi.clearAllMocks();
    backupService = new BackupService();
    mockStorageService = (backupService as any).storageService;
  });

  describe('createBackup', () => {
    it('should create backup successfully', async () => {
      const mockBackupData = {
        users: [{ id: 'user1', name: 'テストユーザー' }],
        logs: [{ id: 'log1', userId: 'user1' }],
        notices: [{ id: 'notice1', title: 'テスト通知' }],
        exportDate: '2024-06-01T00:00:00Z',
        version: '1.0.0'
      };
      mockStorageService.exportData.mockResolvedValue(mockBackupData);

      // document.createElementをモック
      const mockAnchor = {
        href: '',
        download: '',
        click: vi.fn()
      };
      vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
      
      // document.body.appendChildを直接モック（JSDOMエラー回避）
      const originalAppendChild = document.body.appendChild;
      document.body.appendChild = vi.fn();
      const originalRemoveChild = document.body.removeChild;
      document.body.removeChild = vi.fn();

      // URL.createObjectURLとURL.revokeObjectURLをモック
      const mockUrl = 'blob:mock-url';
      vi.spyOn(URL, 'createObjectURL').mockReturnValue(mockUrl);
      vi.spyOn(URL, 'revokeObjectURL').mockImplementation();

      const result = await backupService.createBackup();

      expect(result).toBe('バックアップが正常に作成されました');
      expect(mockStorageService.exportData).toHaveBeenCalled();
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);

      // 元のメソッドを復元
      document.body.appendChild = originalAppendChild;
      document.body.removeChild = originalRemoveChild;
    });

    it('should throw error when backup creation fails', async () => {
      mockStorageService.exportData.mockRejectedValue(new Error('Storage error'));

      await expect(backupService.createBackup()).rejects.toThrow('バックアップの作成に失敗しました');
    });
  });

  describe('importBackup', () => {
    it('should import valid backup data', async () => {
      const validBackupData = {
        users: [{ id: 'user1', name: 'テストユーザー' }],
        logs: [{ id: 'log1', userId: 'user1' }],
        notices: [{ id: 'notice1', title: 'テスト通知' }],
        exportDate: '2024-06-01T00:00:00Z',
        version: '1.0.0'
      };
      mockStorageService.importData.mockResolvedValue();

      await expect(backupService.importBackup(validBackupData)).resolves.not.toThrow();
      expect(mockStorageService.importData).toHaveBeenCalledWith(validBackupData);
    });

    it('should throw error for invalid backup data', async () => {
      const invalidBackupData = {
        users: 'not an array',
        logs: [],
        notices: []
      };

      await expect(backupService.importBackup(invalidBackupData)).rejects.toThrow('無効なバックアップファイルです');
    });

    it('should throw error when storage import fails', async () => {
      const validBackupData = {
        users: [{ id: 'user1', name: 'テストユーザー' }],
        logs: [{ id: 'log1', userId: 'user1' }],
        notices: [{ id: 'notice1', title: 'テスト通知' }],
        exportDate: '2024-06-01T00:00:00Z',
        version: '1.0.0'
      };
      mockStorageService.importData.mockRejectedValue(new Error('Import error'));

      await expect(backupService.importBackup(validBackupData)).rejects.toThrow('Import error');
    });
  });

  describe('validateBackupFile', () => {
    it('should validate valid backup file', async () => {
      const validBackupData = {
        users: [{ id: 'user1', name: 'テストユーザー' }],
        logs: [{ id: 'log1', userId: 'user1' }],
        notices: [{ id: 'notice1', title: 'テスト通知' }],
        exportDate: '2024-06-01T00:00:00Z',
        version: '1.0.0'
      };
      const mockFile = {
        text: vi.fn().mockResolvedValue(JSON.stringify(validBackupData))
      } as any;

      const result = await backupService.validateBackupFile(mockFile);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid backup file', async () => {
      const invalidBackupData = {
        users: 'not an array',
        logs: [],
        notices: []
      };
      const mockFile = {
        text: vi.fn().mockResolvedValue(JSON.stringify(invalidBackupData))
      } as any;

      const result = await backupService.validateBackupFile(mockFile);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('バックアップファイルの形式が正しくありません');
    });

    it('should handle file reading error', async () => {
      const mockFile = {
        text: vi.fn().mockRejectedValue(new Error('File read error'))
      } as any;

      const result = await backupService.validateBackupFile(mockFile);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('ファイルの読み込みに失敗しました');
    });

    it('should handle invalid JSON', async () => {
      const mockFile = {
        text: vi.fn().mockResolvedValue('invalid json')
      } as any;

      const result = await backupService.validateBackupFile(mockFile);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('ファイルの読み込みに失敗しました');
    });
  });

  describe('createBackupFromFile', () => {
    it('should create backup from valid file', async () => {
      const validBackupData = {
        users: [{ id: 'user1', name: 'テストユーザー' }],
        logs: [{ id: 'log1', userId: 'user1' }],
        notices: [{ id: 'notice1', title: 'テスト通知' }],
        exportDate: '2024-06-01T00:00:00Z',
        version: '1.0.0'
      };
      const mockFile = {
        text: vi.fn().mockResolvedValue(JSON.stringify(validBackupData))
      } as any;
      mockStorageService.importData.mockResolvedValue();

      await expect(backupService.createBackupFromFile(mockFile)).resolves.not.toThrow();
      expect(mockStorageService.importData).toHaveBeenCalledWith(validBackupData);
    });

    it('should throw error for invalid backup file', async () => {
      const invalidBackupData = {
        users: 'not an array',
        logs: [],
        notices: []
      };
      const mockFile = {
        text: vi.fn().mockResolvedValue(JSON.stringify(invalidBackupData))
      } as any;

      await expect(backupService.createBackupFromFile(mockFile)).rejects.toThrow('無効なバックアップファイルです');
    });

    it('should throw error when file reading fails', async () => {
      const mockFile = {
        text: vi.fn().mockRejectedValue(new Error('File read error'))
      } as any;

      await expect(backupService.createBackupFromFile(mockFile)).rejects.toThrow('File read error');
    });
  });

  describe('getBackupInfo', () => {
    it('should return backup information', () => {
      const backupData = {
        users: [{ id: 'user1' }, { id: 'user2' }],
        logs: [{ id: 'log1' }, { id: 'log2' }, { id: 'log3' }],
        notices: [{ id: 'notice1' }],
        exportDate: '2024-06-01T00:00:00Z',
        version: '1.0.0'
      };

      const info = backupService.getBackupInfo(backupData);

      expect(info.userCount).toBe(2);
      expect(info.logCount).toBe(3);
      expect(info.noticeCount).toBe(1);
      expect(info.exportDate).toBe('2024-06-01T00:00:00Z');
      expect(info.version).toBe('1.0.0');
    });

    it('should handle missing data gracefully', () => {
      const backupData = {
        users: undefined,
        logs: null,
        notices: []
      };

      const info = backupService.getBackupInfo(backupData);

      expect(info.userCount).toBe(0);
      expect(info.logCount).toBe(0);
      expect(info.noticeCount).toBe(0);
      expect(info.exportDate).toBe('不明');
      expect(info.version).toBe('不明');
    });
  });

  describe('error handling', () => {
    it('should handle storage service errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation();
      mockStorageService.exportData.mockRejectedValue(new Error('Storage error'));

      try {
        await expect(backupService.createBackup()).rejects.toThrow();
        expect(consoleSpy).toHaveBeenCalled();
      } finally {
        consoleSpy.mockRestore();
      }
    });
  });
}); 