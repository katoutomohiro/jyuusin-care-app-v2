// SupabaseService.ts
// Supabase連携用サービス（現場運用・RLS/暗号化/監査対応設計）
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true },
    });
  }

  getClient() {
    return this.client;
  }

  // 例: ユーザー一覧取得
  async fetchUsers() {
    const { data, error } = await this.client.from('users').select('*');
    if (error) throw error;
    return data;
  }

  // 例: 日誌データ保存
  async saveDailyLog(log: any) {
    const { data, error } = await this.client.from('daily_logs').insert([log]);
    if (error) throw error;
    return data;
  }

  // 例: 日誌データ取得
  async fetchDailyLogs(userId: string) {
    const { data, error } = await this.client.from('daily_logs').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  }

  // ...必要に応じて他のCRUD/API追加
}
