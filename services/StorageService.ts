import { User, DailyLog, Notice, FacilityInfo, Staff } from '../types';

export class StorageService {
  private readonly PREFIX = 'care-app-';
  private readonly STORAGE_KEYS = {
    USERS: `${this.PREFIX}users`,
    LOGS: `${this.PREFIX}logs`,
    NOTICES: `${this.PREFIX}notices`,
    FACILITY_INFO: `${this.PREFIX}facilityInfo`,
    STAFF: `${this.PREFIX}staff`,
    AUTH: `${this.PREFIX}auth`
  };

  async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to get ${key} from storage:`, error);
      return defaultValue;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set ${key} in storage:`, error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    try {
      // Clear only app-specific data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear app data from storage:', error);
      throw error;
    }
  }

  async getUsage(): Promise<string> {
    try {
      const usage = Object.keys(localStorage)
        .filter(key => key.startsWith(this.PREFIX))
        .map(key => (localStorage[key] || '').length * 2) // Rough estimate in bytes
        .reduce((sum, len) => sum + len, 0);
      
      return `${(usage / 1024).toFixed(2)} KB`;
    } catch (error) {
      console.error('Failed to get storage usage:', error);
      return "計算エラー";
    }
  }

  async exportData(): Promise<object> {
    const data: { [key: string]: any } = {};
    const keys = Object.values(this.STORAGE_KEYS);
    
    for (const key of keys) {
      data[key] = await this.get(key, null);
    }
    
    return {
      ...data,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  async importData(data: { [key: string]: any }): Promise<void> {
    const keys = Object.values(this.STORAGE_KEYS);
    for (const key of keys) {
      if (data[key]) {
        await this.set(key, data[key]);
      }
    }
  }
}