/**
 * 管理者用アプリ設定・編集システム
 * プログラム知識不要で全項目を編集可能
 */

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';

interface AppConfigItem {
  id: string;
  category: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'textarea' | 'toggle';
  value: any;
  options?: string[];
  description: string;
  required: boolean;
}

interface AppConfig {
  eventTypes: AppConfigItem[];
  userFields: AppConfigItem[];
  formFields: AppConfigItem[];
  systemSettings: AppConfigItem[];
  aiSettings: AppConfigItem[];
}

const AdminAppConfigPage: React.FC = () => {
  const { isAdminMode, isAuthenticated } = useAdmin();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('eventTypes');
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<AppConfigItem>>({});

  // 設定カテゴリ一覧
  const categories = [
    { id: 'eventTypes', name: '📝 記録項目設定', icon: '📝' },
    { id: 'userFields', name: '👥 利用者項目設定', icon: '👥' },
    { id: 'formFields', name: '📋 入力フォーム設定', icon: '📋' },
    { id: 'systemSettings', name: '⚙️ システム設定', icon: '⚙️' },
    { id: 'aiSettings', name: '🤖 AI分析設定', icon: '🤖' }
  ];

  // 初期設定の読み込み
  useEffect(() => {
    loadAppConfig();
  }, []);

  const loadAppConfig = () => {
    try {
      const savedConfig = localStorage.getItem('admin_app_config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      } else {
        // デフォルト設定を生成
        setConfig(generateDefaultConfig());
      }
    } catch (error) {
      console.error('設定読み込みエラー:', error);
      setConfig(generateDefaultConfig());
    } finally {
      setIsLoading(false);
    }
  };

  const generateDefaultConfig = (): AppConfig => {
    return {
      eventTypes: [
        {
          id: 'seizure',
          category: 'eventTypes',
          name: '発作',
          type: 'text',
          value: '発作',
          description: '発作・てんかん関連の記録項目',
          required: true
        },
        {
          id: 'expression',
          category: 'eventTypes',
          name: '表情・反応',
          type: 'text',
          value: '表情・反応',
          description: '利用者の表情や反応の記録',
          required: true
        },
        {
          id: 'vital',
          category: 'eventTypes',
          name: 'バイタル',
          type: 'text',
          value: 'バイタル',
          description: '体温・血圧等のバイタルサイン',
          required: true
        },
        {
          id: 'meal',
          category: 'eventTypes',
          name: '食事・水分',
          type: 'text',
          value: '食事・水分',
          description: '食事摂取・水分補給の記録',
          required: true
        },
        {
          id: 'excretion',
          category: 'eventTypes',
          name: '排泄',
          type: 'text',
          value: '排泄',
          description: '排泄に関する記録',
          required: true
        },
        {
          id: 'sleep',
          category: 'eventTypes',
          name: '睡眠',
          type: 'text',
          value: '睡眠',
          description: '睡眠状態の記録',
          required: true
        },
        {
          id: 'activity',
          category: 'eventTypes',
          name: '活動',
          type: 'text',
          value: '活動',
          description: '日中活動・リハビリの記録',
          required: true
        },
        {
          id: 'care',
          category: 'eventTypes',
          name: 'ケア',
          type: 'text',
          value: 'ケア',
          description: '身体ケア・医療的ケアの記録',
          required: true
        },
        {
          id: 'medication',
          category: 'eventTypes',
          name: '服薬',
          type: 'text',
          value: '服薬',
          description: '薬物投与・服薬管理の記録',
          required: true
        },
        {
          id: 'other',
          category: 'eventTypes',
          name: 'その他',
          type: 'text',
          value: 'その他',
          description: 'その他の特記事項',
          required: true
        }
      ],
      userFields: [
        {
          id: 'user_name',
          category: 'userFields',
          name: '利用者名',
          type: 'text',
          value: '利用者名',
          description: '利用者の氏名',
          required: true
        },
        {
          id: 'user_age',
          category: 'userFields',
          name: '年齢',
          type: 'number',
          value: '年齢',
          description: '利用者の年齢',
          required: true
        },
        {
          id: 'user_gender',
          category: 'userFields',
          name: '性別',
          type: 'select',
          value: '性別',
          options: ['男性', '女性', '男児', '女児', '不明'],
          description: '利用者の性別',
          required: true
        },
        {
          id: 'disability_type',
          category: 'userFields',
          name: '障害種別',
          type: 'text',
          value: '障害種別',
          description: '主たる障害の種別',
          required: true
        },
        {
          id: 'disability_level',
          category: 'userFields',
          name: '障害程度',
          type: 'select',
          value: '障害程度',
          options: ['区分1', '区分2', '区分3', '区分4', '区分5', '区分6'],
          description: '障害支援区分',
          required: true
        }
      ],
      formFields: [
        {
          id: 'timestamp',
          category: 'formFields',
          name: '記録時刻',
          type: 'text',
          value: '記録時刻',
          description: '記録を行った時刻',
          required: true
        },
        {
          id: 'staff_name',
          category: 'formFields',
          name: '記録者名',
          type: 'text',
          value: '記録者名',
          description: '記録を行った職員名',
          required: true
        },
        {
          id: 'notes',
          category: 'formFields',
          name: '備考',
          type: 'textarea',
          value: '備考',
          description: '自由記述欄',
          required: false
        }
      ],
      systemSettings: [
        {
          id: 'facility_name',
          category: 'systemSettings',
          name: '施設名',
          type: 'text',
          value: '重症心身障害者施設',
          description: 'システムで表示される施設名',
          required: true
        },
        {
          id: 'auto_save',
          category: 'systemSettings',
          name: '自動保存',
          type: 'toggle',
          value: true,
          description: '記録の自動保存機能',
          required: false
        },
        {
          id: 'backup_interval',
          category: 'systemSettings',
          name: 'バックアップ間隔（分）',
          type: 'number',
          value: 30,
          description: 'データバックアップの実行間隔',
          required: true
        }
      ],
      aiSettings: [
        {
          id: 'ai_analysis_enabled',
          category: 'aiSettings',
          name: 'AI分析機能',
          type: 'toggle',
          value: true,
          description: 'AI分析機能の有効/無効',
          required: false
        },
        {
          id: 'analysis_periods',
          category: 'aiSettings',
          name: '分析期間',
          type: 'multiselect',
          value: ['1month', '6months', '1year'],
          options: ['1week', '1month', '3months', '6months', '1year'],
          description: 'AI分析で使用する期間',
          required: true
        },
        {
          id: 'alert_threshold',
          category: 'aiSettings',
          name: 'アラート閾値',
          type: 'number',
          value: 2,
          description: '異常検出のアラート閾値（標準偏差）',
          required: true
        }
      ]
    };
  };

  // 設定保存
  const saveConfig = async () => {
    try {
      setSaveStatus('保存中...');
      
      // LocalStorageに保存
      localStorage.setItem('admin_app_config', JSON.stringify(config));
      
      // アプリ全体に設定を反映
      await applyConfigToApp(config!);
      
      setSaveStatus('✅ 設定を保存しました');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('設定保存エラー:', error);
      setSaveStatus('❌ 保存に失敗しました');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // アプリ全体に設定を反映
  const applyConfigToApp = async (newConfig: AppConfig) => {
    // イベントタイプの更新
    const eventTypesConfig = newConfig.eventTypes.reduce((acc, item) => {
      acc[item.id] = {
        name: item.value,
        icon: getIconForEventType(item.id),
        color: getColorForEventType(item.id)
      };
      return acc;
    }, {} as any);
    localStorage.setItem('app_event_types', JSON.stringify(eventTypesConfig));

    // ユーザーフィールドの更新
    localStorage.setItem('app_user_fields', JSON.stringify(newConfig.userFields));

    // システム設定の更新
    const systemSettings = newConfig.systemSettings.reduce((acc, item) => {
      acc[item.id] = item.value;
      return acc;
    }, {} as any);
    localStorage.setItem('app_system_settings', JSON.stringify(systemSettings));

    // AI設定の更新
    const aiSettings = newConfig.aiSettings.reduce((acc, item) => {
      acc[item.id] = item.value;
      return acc;
    }, {} as any);
    localStorage.setItem('app_ai_settings', JSON.stringify(aiSettings));

    // ページリロードで設定を反映
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // アイコンとカラーのマッピング
  const getIconForEventType = (id: string): string => {
    const iconMap: { [key: string]: string } = {
      seizure: '⚡',
      expression: '😊',
      vital: '🌡️',
      meal: '🍽️',
      excretion: '🚽',
      sleep: '😴',
      activity: '🎯',
      care: '🤲',
      medication: '💊',
      other: '📝'
    };
    return iconMap[id] || '📝';
  };

  const getColorForEventType = (id: string): string => {
    const colorMap: { [key: string]: string } = {
      seizure: 'bg-red-500',
      expression: 'bg-blue-500',
      vital: 'bg-green-500',
      meal: 'bg-orange-500',
      excretion: 'bg-purple-500',
      sleep: 'bg-indigo-500',
      activity: 'bg-teal-500',
      care: 'bg-pink-500',
      medication: 'bg-cyan-500',
      other: 'bg-gray-500'
    };
    return colorMap[id] || 'bg-gray-500';
  };

  // 項目の更新
  const updateItem = (categoryId: string, itemId: string, field: string, value: any) => {
    if (!config) return;

    const newConfig = { ...config };
    const category = newConfig[categoryId as keyof AppConfig] as AppConfigItem[];
    const itemIndex = category.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
      category[itemIndex] = { ...category[itemIndex], [field]: value };
      setConfig(newConfig);
    }
  };

  // 項目の追加
  const addItem = (categoryId: string) => {
    if (!config || !newItem.name) return;

    const newConfig = { ...config };
    const category = newConfig[categoryId as keyof AppConfig] as AppConfigItem[];
    
    const newItemData: AppConfigItem = {
      id: `custom_${Date.now()}`,
      category: categoryId,
      name: newItem.name || '新規項目',
      type: newItem.type || 'text',
      value: newItem.value || newItem.name || '新規項目',
      options: newItem.options || [],
      description: newItem.description || '',
      required: newItem.required || false
    };

    category.push(newItemData);
    setConfig(newConfig);
    setShowAddModal(false);
    setNewItem({});
  };

  // 項目の削除
  const deleteItem = (categoryId: string, itemId: string) => {
    if (!config) return;

    const newConfig = { ...config };
    const category = newConfig[categoryId as keyof AppConfig] as AppConfigItem[];
    const updatedCategory = category.filter(item => item.id !== itemId);
    (newConfig[categoryId as keyof AppConfig] as AppConfigItem[]) = updatedCategory;
    setConfig(newConfig);
  };

  if (!isAdminMode || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ アクセス制限</h2>
          <p className="text-gray-600">管理者認証が必要です</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">設定を読み込み中...</p>
        </div>
      </div>
    );
  }

  const currentCategory = config?.[activeCategory as keyof AppConfig] as AppConfigItem[] || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">⚙️ アプリ設定管理</h1>
              <p className="text-gray-600 mt-2">アプリのすべての項目を編集・追加・削除できます</p>
            </div>
            <div className="flex space-x-4">
              {saveStatus && (
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                  {saveStatus}
                </div>
              )}
              <button
                onClick={saveConfig}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                💾 設定を保存
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* サイドバー */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">設定カテゴリ</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {categories.find(c => c.id === activeCategory)?.name}
                </h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  ➕ 新規追加
                </button>
              </div>

              {/* 項目一覧 */}
              <div className="space-y-4">
                {currentCategory.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* 項目名 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          項目名
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(activeCategory, item.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* 値 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          表示値
                        </label>
                        {item.type === 'select' || item.type === 'multiselect' ? (
                          <select
                            value={Array.isArray(item.value) ? item.value[0] : item.value}
                            onChange={(e) => updateItem(activeCategory, item.id, 'value', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {item.options?.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : item.type === 'toggle' ? (
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={item.value}
                              onChange={(e) => updateItem(activeCategory, item.id, 'value', e.target.checked)}
                              className="mr-2"
                            />
                            {item.value ? '有効' : '無効'}
                          </label>
                        ) : (
                          <input
                            type={item.type === 'number' ? 'number' : 'text'}
                            value={item.value}
                            onChange={(e) => updateItem(activeCategory, item.id, 'value', 
                              item.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>

                      {/* アクション */}
                      <div className="flex items-end space-x-2">
                        {!item.required && (
                          <button
                            onClick={() => deleteItem(activeCategory, item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm"
                          >
                            🗑️ 削除
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 説明 */}
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        説明
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateItem(activeCategory, item.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                    </div>

                    {/* オプション（select/multiselect用） */}
                    {(item.type === 'select' || item.type === 'multiselect') && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          選択肢（カンマ区切り）
                        </label>
                        <input
                          type="text"
                          value={item.options?.join(', ') || ''}
                          onChange={(e) => updateItem(activeCategory, item.id, 'options', 
                            e.target.value.split(',').map(s => s.trim()).filter(s => s)
                          )}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="選択肢1, 選択肢2, 選択肢3"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 新規追加モーダル */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">新規項目追加</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    項目名 *
                  </label>
                  <input
                    type="text"
                    value={newItem.name || ''}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="新しい項目名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    項目タイプ
                  </label>
                  <select
                    value={newItem.type || 'text'}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">テキスト</option>
                    <option value="number">数値</option>
                    <option value="select">選択肢</option>
                    <option value="multiselect">複数選択</option>
                    <option value="textarea">長文</option>
                    <option value="toggle">ON/OFF</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    説明
                  </label>
                  <textarea
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="項目の説明"
                  />
                </div>

                {(newItem.type === 'select' || newItem.type === 'multiselect') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      選択肢（カンマ区切り）
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setNewItem({ 
                        ...newItem, 
                        options: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="選択肢1, 選択肢2, 選択肢3"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewItem({});
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => addItem(activeCategory)}
                  disabled={!newItem.name}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  追加
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppConfigPage;
