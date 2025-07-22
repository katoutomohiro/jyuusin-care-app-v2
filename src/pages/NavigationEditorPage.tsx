import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import InlineEditableNavigation from '../components/InlineEditableNavigation';

interface NavigationItem {
  id: string;
  path: string;
  label: string;
  subtitle?: string;
  icon?: string;
  order: number;
  visible: boolean;
  adminOnly?: boolean;
}

/**
 * ⑤ナビゲーション動的編集ページ
 * 管理者がアプリのナビゲーションメニューを自由に編集・追加・削除・並び替え可能
 */
const NavigationEditorPage: React.FC = () => {
  const { isAdminMode } = useAdmin();
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);

  useEffect(() => {
    // デフォルトのナビゲーション項目
    const defaultNavItems: NavigationItem[] = [
      { id: '1', path: '/', label: 'ダッシュボード', subtitle: '魂の物語', icon: '🏠', order: 1, visible: true },
      { id: '2', path: '/users', label: '利用者管理', subtitle: '大切な仲間たち', icon: '👥', order: 2, visible: true },
      { id: '3', path: '/daily-log', label: '日誌入力', subtitle: 'きらめきの記録', icon: '📝', order: 3, visible: true },
      { id: '4', path: '/ai-analysis', label: 'AI分析', subtitle: '🤖 重症心身障害専門AI分析', icon: '🤖', order: 4, visible: true },
      { id: '5', path: '/admin-config', label: 'アプリ設定管理', subtitle: '⚙️ 管理者専用設定', icon: '⚙️', order: 5, visible: true, adminOnly: true },
      { id: '6', path: '/staff-schedule', label: '職員スケジュール', subtitle: '今日のチーム体制', icon: '📅', order: 6, visible: true },
      { id: '7', path: '/transport-plan', label: '送迎計画', subtitle: '魂の旅路の案内', icon: '🚌', order: 7, visible: true },
      { id: '8', path: '/kaizen', label: '改善提案', subtitle: 'ヒヤリハット・学びの種', icon: '💡', order: 8, visible: true },
      { id: '9', path: '/learning', label: '研修資料', subtitle: '学びの広場', icon: '📚', order: 9, visible: true },
      { id: '10', path: '/supplies', label: '備品管理', subtitle: '備品チェックリスト', icon: '📦', order: 10, visible: true },
      { id: '11', path: '/reports', label: '多職種連携レポート', subtitle: '魂の翻訳機', icon: '📊', order: 11, visible: true },
      { id: '12', path: '/settings', label: '設定', subtitle: '理想郷の調律', icon: '⚙️', order: 12, visible: true },
    ];

    // ローカルストレージから保存された設定を読み込み
    const savedNavItems = localStorage.getItem('customNavItems');
    if (savedNavItems) {
      try {
        setNavItems(JSON.parse(savedNavItems));
      } catch (error) {
        console.error('ナビゲーション設定の読み込みに失敗:', error);
        setNavItems(defaultNavItems);
      }
    } else {
      setNavItems(defaultNavItems);
    }
  }, []);

  const handleNavItemsChange = (newNavItems: NavigationItem[]) => {
    setNavItems(newNavItems);
    localStorage.setItem('customNavItems', JSON.stringify(newNavItems));
    
    // アプリ全体に変更を通知するイベントを発火
    window.dispatchEvent(new CustomEvent('navigationChanged', { 
      detail: newNavItems 
    }));
  };

  if (!isAdminMode) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">ナビゲーション編集</h1>
          <p className="text-gray-600 mb-6">
            このページは管理者モードでのみご利用いただけます。
          </p>
          <p className="text-sm text-gray-500">
            管理者モードを有効にするには、設定画面で認証を行ってください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">⑤ ナビゲーション編集</h1>
        <p className="mt-2 text-lg text-gray-600">
          アプリのナビゲーションメニューを自由に編集・追加・削除・並び替えできます
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ナビゲーション編集パネル */}
        <div>
          <InlineEditableNavigation
            items={navItems}
            onItemsChange={handleNavItemsChange}
          />
        </div>

        {/* プレビューパネル */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">プレビュー</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-3">現在のナビゲーション:</div>
            <div className="space-y-2">
              {navItems
                .filter(item => item.visible)
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center space-x-3 p-2 rounded ${
                      item.adminOnly ? 'bg-yellow-100 border border-yellow-300' : 'bg-white border border-gray-200'
                    }`}
                  >
                    {item.icon && <span className="text-lg">{item.icon}</span>}
                    <div>
                      <div className="font-medium text-gray-800">{item.label}</div>
                      {item.subtitle && (
                        <div className="text-xs text-gray-500">{item.subtitle}</div>
                      )}
                      <div className="text-xs text-gray-400">{item.path}</div>
                    </div>
                    {item.adminOnly && (
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                        管理者専用
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* 統計情報 */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-sm text-blue-600">表示中の項目</div>
              <div className="text-xl font-bold text-blue-800">
                {navItems.filter(item => item.visible).length}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-600">非表示の項目</div>
              <div className="text-xl font-bold text-gray-800">
                {navItems.filter(item => !item.visible).length}
              </div>
            </div>
          </div>

          {/* リセット機能 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                if (confirm('ナビゲーション設定をデフォルトに戻しますか？')) {
                  localStorage.removeItem('customNavItems');
                  window.location.reload();
                }
              }}
              className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded font-medium transition-colors"
            >
              デフォルト設定に戻す
            </button>
          </div>
        </div>
      </div>

      {/* 使用方法の説明 */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">🎯 使用方法</h3>
        <div className="space-y-2 text-blue-700">
          <p>• <strong>編集:</strong> 各項目の編集ボタンをクリックして、表示名やパスを変更できます</p>
          <p>• <strong>追加:</strong> "メニュー追加"ボタンで新しいナビゲーション項目を作成できます</p>
          <p>• <strong>削除:</strong> 不要な項目は削除ボタンで取り除けます</p>
          <p>• <strong>並び替え:</strong> ドラッグ&amp;ドロップで項目の順序を変更できます</p>
          <p>• <strong>表示/非表示:</strong> 👁️ボタンで項目の表示/非表示を切り替えできます</p>
          <p>• <strong>管理者専用:</strong> チェックボックスで管理者のみに表示する項目を設定できます</p>
        </div>
      </div>
    </div>
  );
};

export default NavigationEditorPage;
