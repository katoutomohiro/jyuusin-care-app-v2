import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdminMode: boolean;
  isAuthenticated: boolean;
  adminPassword: string;
  autoSaveEnabled: boolean;
  setAdminMode: (enabled: boolean) => void;
  authenticateAdmin: (password: string) => boolean;
  setAutoSave: (enabled: boolean) => void;
  exportData: () => void;
  importData: (data: any) => void;
  resetAllData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

// デフォルト管理者パスワード（実際の運用では環境変数等で管理）
const DEFAULT_ADMIN_PASSWORD = 'jyushin2025';

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(
    localStorage.getItem('jyushin_admin_mode') === 'true'
  );
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('jyushin_admin_auth') === 'true'
  );
  
  const [adminPassword, setAdminPassword] = useState<string>(
    localStorage.getItem('jyushin_admin_password') || DEFAULT_ADMIN_PASSWORD
  );
  
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(
    localStorage.getItem('jyushin_auto_save') !== 'false' // デフォルト有効
  );

  const setAdminMode = (enabled: boolean) => {
    setIsAdminMode(enabled);
    localStorage.setItem('jyushin_admin_mode', enabled.toString());
    
    if (!enabled) {
      // 管理者モード無効化時は認証もクリア
      setIsAuthenticated(false);
      localStorage.setItem('jyushin_admin_auth', 'false');
    }
  };

  const authenticateAdmin = (password: string): boolean => {
    const isValid = password === adminPassword;
    setIsAuthenticated(isValid);
    localStorage.setItem('jyushin_admin_auth', isValid.toString());
    
    if (isValid) {
      console.log('👑 管理者認証成功 - 編集権限が有効になりました');
    } else {
      console.log('❌ 管理者認証失敗 - パスワードが正しくありません');
    }
    
    return isValid;
  };

  const setAutoSave = (enabled: boolean) => {
    setAutoSaveEnabled(enabled);
    localStorage.setItem('jyushin_auto_save', enabled.toString());
    console.log(`💾 自動保存設定: ${enabled ? '有効' : '無効'}`);
  };

  const exportData = () => {
    try {
      const allData: Record<string, any> = {};
      const today = new Date().toISOString().split('T')[0];
      
      // 全ての記録データをエクスポート
      const eventTypes = [
        'seizure', 'expression', 'vital', 'intake', 'excretion', 
        'sleep', 'activity', 'care', 'medication', 'other'
      ];
      
      eventTypes.forEach(eventType => {
        const key = `${eventType}_records_${today}`;
        const records = localStorage.getItem(key);
        if (records) {
          allData[key] = JSON.parse(records);
        }
      });
      
      // 設定データもエクスポート
      allData.settings = {
        admin_mode: isAdminMode,
        auto_save: autoSaveEnabled,
        export_date: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `jyushin_care_data_${today}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('📤 データエクスポート完了:', `jyushin_care_data_${today}.json`);
    } catch (error) {
      console.error('❌ データエクスポートエラー:', error);
    }
  };

  const importData = (data: any) => {
    try {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      Object.keys(data).forEach(key => {
        if (key !== 'settings') {
          localStorage.setItem(key, JSON.stringify(data[key]));
        }
      });
      
      // 設定データの復元
      if (data.settings) {
        if (data.settings.auto_save !== undefined) {
          setAutoSave(data.settings.auto_save);
        }
      }
      
      console.log('📥 データインポート完了 - ページを再読み込みしてください');
      
      // 自動リロード（オプション）
      if (autoSaveEnabled) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('❌ データインポートエラー:', error);
    }
  };

  const resetAllData = () => {
    if (window.confirm('⚠️ 全てのデータを削除しますか？この操作は取り消せません。')) {
      try {
        // 記録データのみクリア（設定は保持）
        const eventTypes = [
          'seizure', 'expression', 'vital', 'intake', 'excretion',
          'sleep', 'activity', 'care', 'medication', 'other'
        ];
        
        const today = new Date().toISOString().split('T')[0];
        eventTypes.forEach(eventType => {
          const key = `${eventType}_records_${today}`;
          localStorage.removeItem(key);
        });
        
        console.log('🗑️ 全記録データをリセットしました');
        
        // 自動リロード
        if (autoSaveEnabled) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (error) {
        console.error('❌ データリセットエラー:', error);
      }
    }
  };

  const value: AdminContextType = {
    isAdminMode,
    isAuthenticated,
    adminPassword,
    autoSaveEnabled,
    setAdminMode,
    authenticateAdmin,
    setAutoSave,
    exportData,
    importData,
    resetAllData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;
