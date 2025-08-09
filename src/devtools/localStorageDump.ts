// localStorageの全データをダンプして確認するデバッグ用スクリプト
// ブラウザのDevToolsコンソールで実行してもOK
export function dumpAllLocalStorage() {
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
  // 結果を見やすく出力
  console.log('[localStorage全ダンプ]', data);
  return data;
}

// 使い方: import { dumpAllLocalStorage } from '../devtools/localStorageDump'; dumpAllLocalStorage();
// もしくはブラウザのコンソールで dumpAllLocalStorage() を直接実行してください。
