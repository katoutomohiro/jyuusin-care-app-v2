import { apiGet, apiPost } from '../utils/apiClient';

export type PreviewVaultEntry = {
  id: string;
  userId: string;
  dateKey: string; // YYYY-MM-DD (local)
  kind: 'vitals' | string;
  title: string;   // 表示用タイトル（例: 2025-08-09 36.5℃ / 120-80 / SpO2 90 / HR 80 / RR 25）
  created_at: string; // ISO
  payload?: any;   // 任意の追加データ
};

const localKey = (userId: string) => `preview_vault_${userId}`;

export const PreviewVaultService = {
  async list(userId: string): Promise<PreviewVaultEntry[]> {
    try {
      return await apiGet<PreviewVaultEntry[]>(`/api/preview-vault?userId=${encodeURIComponent(userId)}`);
    } catch (err) {
      console.error('[vault][error][service.list]', err);
    }
    try {
      const raw = localStorage.getItem(localKey(userId));
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('[vault][error][service.list.local]', err);
      return [];
    }
  },

  async add(entry: PreviewVaultEntry): Promise<PreviewVaultEntry> {
    try {
      return await apiPost<PreviewVaultEntry>('/api/preview-vault', entry);
    } catch (err) {
      console.error('[vault][error][service.add]', err);
    }
    try {
      const key = localKey(entry.userId);
      const current: PreviewVaultEntry[] = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = [entry, ...current];
      localStorage.setItem(key, JSON.stringify(updated));
      return entry;
    } catch (err) {
      console.error('[vault][error][service.add.local]', err);
      return entry;
    }
  }
};
