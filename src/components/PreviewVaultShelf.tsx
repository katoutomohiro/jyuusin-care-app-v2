import React, { useEffect, useState, useCallback } from 'react';
import { PreviewVaultEntry } from '../services/PreviewVaultService';
import { apiGet, apiPost } from '../utils/apiClient';

type YearlyPreviewIndex = PreviewVaultEntry[];

export default function PreviewVaultShelf({ userId }: { userId: string }) {
  const [items, setItems] = useState<PreviewVaultEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchIndex = useCallback(async () => {
    try {
      setLoading(true);
      const yyyy = new Date().getFullYear();
      const data = await apiGet<YearlyPreviewIndex>(`/api/preview-vault?userId=${encodeURIComponent(userId)}&year=${yyyy}`);
      setItems(data);
    } catch (err) {
      console.error('[vault][error][fetchIndex]', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchIndex(); }, [fetchIndex]);

  const handleStoreToday = async () => {
    try {
      setSaving(true);
      const now = new Date();
      const dateKey = now.toISOString().slice(0, 10);
      const entry: PreviewVaultEntry = {
        id: `${dateKey}-${now.getTime()}`,
        userId,
        dateKey,
        kind: 'vitals',
        title: `${dateKey} プレビュー保存`,
        created_at: now.toISOString(),
        payload: {}
      };
      await apiPost('/api/preview-vault', entry);
      setItems(prev => [entry, ...prev.filter(p => p.id !== entry.id)]);
    } catch (err) {
      console.error('[vault][error][handleStoreToday]', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 p-3 bg-white border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">📚 年間プレビュー記録ストック棚</div>
        <button
          onClick={handleStoreToday}
          className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded disabled:opacity-50"
          disabled={saving}
        >{saving ? '保存中…' : '今日のプレビューを保存'}</button>
      </div>
      {loading ? (
        <div className="text-sm text-gray-500">読み込み中…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-500">まだ記録がありません</div>
      ) : (
        <ul className="space-y-1">
          {items.map(it => (
            <li key={it.id} className="text-sm text-gray-700">
              <span className="mr-2">{it.dateKey}</span>
              <span>{it.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
