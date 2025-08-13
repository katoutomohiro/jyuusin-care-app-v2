import { useState } from 'react';

/**
 * localStorageのキーごとに値を取得・保存・削除できる共通フック
 * 例: const [value, setValue, removeValue] = useLocalStorage('user_profile', defaultValue)
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T) => void, () => void] {
  // 初期値はlocalStorageから取得、なければinitialValue
  const getStoredValue = (): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue());

  // 保存
  const setValue = (value: T) => {
    setStoredValue(value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };

  // 削除
  const removeValue = () => {
    setStoredValue(initialValue);
    try {
      localStorage.removeItem(key);
    } catch {}
  };

  return [storedValue, setValue, removeValue];
}

/**
 * localStorageの全データ取得・保存・削除を行うサービス
 */
export const LocalStorageService = {
  get(key: string) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
  getAll(): Record<string, any> {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      try {
        const value = localStorage.getItem(key);
        data[key] = value ? JSON.parse(value) : null;
      } catch {
        data[key] = null;
      }
    }
    return data;
  },
  clear() {
    localStorage.clear();
  }
};
import { useState } from 'react';

/**
 * localStorageのキーごとに値を取得・保存・削除できる共通フック
 * 例: const [value, setValue, removeValue] = useLocalStorage('user_profile', defaultValue)
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T) => void, () => void] {
  // 初期値はlocalStorageから取得、なければinitialValue
  const getStoredValue = (): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue());

  // 保存
  const setValue = (value: T) => {
    setStoredValue(value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };

  // 削除
  const removeValue = () => {
    setStoredValue(initialValue);
    try {
      localStorage.removeItem(key);
    } catch {}
  };

  return [storedValue, setValue, removeValue];
}

/**
 * localStorageの全データ取得・保存・削除を行うサービス
 */
export const LocalStorageService = {
  get(key: string) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
  getAll(): Record<string, any> {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      try {
        const value = localStorage.getItem(key);
        data[key] = value ? JSON.parse(value) : null;
      } catch {
        data[key] = null;
      }
    }
    return data;
  },
  clear() {
    localStorage.clear();
  }
};
