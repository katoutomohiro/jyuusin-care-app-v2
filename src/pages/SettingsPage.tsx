import React, { useState, useRef } from 'react';
import { useAdmin } from '../contexts/AdminContext';

const SettingsPage: React.FC = () => {
  const {
    isAdminMode,
    isAuthenticated,
    autoSaveEnabled,
    setAdminMode,
    authenticateAdmin,
    setAutoSave,
    exportData,
    importData,
    resetAllData
  } = useAdmin();

  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [notification, setNotification] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasswordSubmit = () => {
    const success = authenticateAdmin(passwordInput);
    if (success) {
      setNotification('✅ 管理者認証成功！編集権限が有効になりました。');
      setShowPasswordInput(false);
      setPasswordInput('');
    } else {
      setNotification('❌ パスワードが正しくありません。');
    }
    
    setTimeout(() => setNotification(''), 3000);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          importData(data);
          setNotification('📥 データインポート完了！ページを再読み込みします...');
          setTimeout(() => setNotification(''), 3000);
        } catch (error) {
          setNotification('❌ ファイル読み込みエラー: 正しいJSONファイルを選択してください。');
          setTimeout(() => setNotification(''), 3000);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          設定・システム管理 <span className="text-sm text-gray-400 font-normal">(作業場の調律)</span>
        </h1>
        
        {/* 通知エリア */}
        {notification && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">{notification}</p>
          </div>
        )}

        <div className="grid gap-6 mt-8">
          
          {/* 管理者モード設定 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              👑 管理者モード設定
            </h2>
            
            {/* 管理者モード有効/無効 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-700">管理者モード</h3>
                  <p className="text-sm text-gray-500">
                    有効にすると、日誌記録の編集・削除・データ管理機能が使用可能になります
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium ${isAdminMode ? 'text-green-600' : 'text-gray-500'}`}>
                    {isAdminMode ? '有効' : '無効'}
                  </span>
                  <button
                    onClick={() => setAdminMode(!isAdminMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isAdminMode ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        isAdminMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 管理者認証 */}
              {isAdminMode && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-yellow-800">管理者認証</h4>
                    <span className={`text-sm px-2 py-1 rounded ${
                      isAuthenticated 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isAuthenticated ? '認証済み' : '未認証'}
                    </span>
                  </div>
                  
                  {!isAuthenticated && (
                    <div className="space-y-3">
                      {!showPasswordInput ? (
                        <button
                          onClick={() => setShowPasswordInput(true)}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          🔐 認証を行う
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="管理者パスワードを入力"
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                            onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                          />
                          <button
                            onClick={handlePasswordSubmit}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                          >
                            認証
                          </button>
                          <button
                            onClick={() => {
                              setShowPasswordInput(false);
                              setPasswordInput('');
                            }}
                            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                          >
                            キャンセル
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-yellow-700">
                        💡 デフォルトパスワード: jyushin2025
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 自動保存設定 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              💾 自動保存設定
            </h2>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-700">自動保存機能</h3>
                <p className="text-sm text-gray-500">
                  記録入力時に自動的にローカルストレージに保存します
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium ${autoSaveEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                  {autoSaveEnabled ? '有効' : '無効'}
                </span>
                <button
                  onClick={() => setAutoSave(!autoSaveEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoSaveEnabled ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      autoSaveEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* データ管理機能（管理者認証時のみ表示） */}
          {isAdminMode && isAuthenticated && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                🗂️ データ管理機能
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* データエクスポート */}
                <div className="p-4 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-700 mb-2">📤 データエクスポート</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    全ての記録データをJSONファイルとしてダウンロード
                  </p>
                  <button
                    onClick={exportData}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    エクスポート実行
                  </button>
                </div>

                {/* データインポート */}
                <div className="p-4 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-700 mb-2">📥 データインポート</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    エクスポートしたJSONファイルから記録データを復元
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ファイル選択
                  </button>
                </div>

                {/* データリセット */}
                <div className="p-4 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-700 mb-2">🗑️ データリセット</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    全ての記録データを削除（設定は保持）
                  </p>
                  <button
                    onClick={resetAllData}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    全データ削除
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* システム情報 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              ℹ️ システム情報
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700">アプリケーション名</div>
                <div className="text-gray-600">重症心身障害ケアアプリ v2</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700">最終更新</div>
                <div className="text-gray-600">2025年1月20日</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700">データ保存先</div>
                <div className="text-gray-600">ローカルストレージ</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-700">対応ブラウザ</div>
                <div className="text-gray-600">Chrome, Edge, Safari, Firefox</div>
              </div>
            </div>
          </div>

          {/* 従来の設定項目 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              ⚙️ 基本設定
            </h2>
            <ul className="space-y-4">
              <li className="p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-700">テーマカラーの変更</span>
                <span className="ml-2 text-sm text-gray-500">(開発予定)</span>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-700">通知設定</span>
                <span className="ml-2 text-sm text-gray-500">(開発予定)</span>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-700">バックアップ設定</span>
                <span className="ml-2 text-sm text-gray-500">(開発予定)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 