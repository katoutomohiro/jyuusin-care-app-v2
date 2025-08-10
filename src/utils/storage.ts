// src/utils/storage.ts
// バージョン付きローカルストレージラッパ（後方互換マイグレーション拡張用）

const NS = "jyuusin";
const SCHEMA_KEY = `${NS}:schema`;
const SCHEMA_VERSION = 1; // 将来変更時にインクリメント

export function getNSKey(k: string) { return `${NS}:${k}`; }

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(getNSKey(key));
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

export function write<T>(key: string, val: T) {
  try {
    localStorage.setItem(getNSKey(key), JSON.stringify(val));
  } catch {
    // storage full / quota exceeded 等は無視（UIを落とさない）
  }
}

export function ensureSchema() {
  try {
    const cur = Number(localStorage.getItem(SCHEMA_KEY) || "0");
    if (cur === 0) {
      localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
      return;
    }
    if (cur < SCHEMA_VERSION) {
      // 将来: cur から SCHEMA_VERSION へ段階的マイグレーションを実装
      localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
    }
  } catch {
    // 何もしない
  }
}
