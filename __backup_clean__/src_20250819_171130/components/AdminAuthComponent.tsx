/**
 * 管理者認証コンポーネント
 */

import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';

const AdminAuthComponent: React.FC = () => {
  const { isAdminMode, isAuthenticated, setAdminMode, authenticateAdmin } = useAdmin();
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const handleAdminToggle = () => {
    if (isAdminMode) {
      // 管理者モード無効化
      setAdminMode(false);
      setShowPasswordInput(false);
      setPassword('');
    } else {
      // 管理者モード有効化のためパスワード入力表示
      setShowPasswordInput(true);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticateAdmin(password)) {
      setAdminMode(true);
      setShowPasswordInput(false);
      setPassword('');
      alert('✅ 管理者モードが有効になりました！');
    } else {
      alert('❌ パスワードが正しくありません');
      setPassword('');
    }
  };

  return (
    <div className="mb-4">
      {/* 管理者ステータス表示 */}
      <div className={`p-3 rounded-lg border-2 ${
        isAdminMode && isAuthenticated 
          ? 'bg-green-100 border-green-500 text-green-800' 
          : isAdminMode 
          ? 'bg-yellow-100 border-yellow-500 text-yellow-800'
          : 'bg-gray-100 border-gray-300 text-gray-600'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              {isAdminMode && isAuthenticated ? '👑' : isAdminMode ? '🔐' : '🔒'}
            </span>
            <span className="font-medium">
              {isAdminMode && isAuthenticated 
                ? '管理者モード（認証済み）' 
                : isAdminMode 
                ? '管理者モード（未認証）'
                : '一般モード'
              }
            </span>
          </div>
          <button
            onClick={handleAdminToggle}
            className={`px-4 py-2 rounded-lg font-medium ${
              isAdminMode 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isAdminMode ? '管理者モード終了' : '管理者モード開始'}
          </button>
        </div>
      </div>

      {/* パスワード入力フォーム */}
      {showPasswordInput && (
        <form onSubmit={handlePasswordSubmit} className="mt-3 p-4 bg-blue-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">
              管理者パスワード:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="パスワードを入力"
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              認証
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPasswordInput(false);
                setPassword('');
              }}
              className="text-gray-600 hover:text-gray-800 px-2 py-2"
            >
              キャンセル
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 デフォルトパスワード: jyushin2025
          </p>
        </form>
      )}

      {/* 管理者機能へのリンク */}
      {isAdminMode && isAuthenticated && (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700 mb-2">管理者機能:</p>
          <div className="flex flex-wrap gap-2">
            <a
              href="/admin-config"
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium"
            >
              ⚙️ アプリ設定管理
            </a>
            <a
              href="/users"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
            >
              👥 利用者管理
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuthComponent;
