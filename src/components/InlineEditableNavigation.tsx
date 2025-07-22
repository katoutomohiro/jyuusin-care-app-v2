import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon, Bars3Icon } from './icons';

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

interface InlineEditableNavigationProps {
  items: NavigationItem[];
  onItemsChange: (items: NavigationItem[]) => void;
  className?: string;
}

/**
 * ナビゲーションメニューの動的編集コンポーネント
 * 管理者がアプリ画面上で直接ナビゲーション項目を編集・追加・削除・並び替え可能
 */
const InlineEditableNavigation: React.FC<InlineEditableNavigationProps> = ({
  items,
  onItemsChange,
  className = ''
}) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingItemData, setEditingItemData] = useState<Partial<NavigationItem>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItemData, setNewItemData] = useState<Partial<NavigationItem>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const { isAdminMode } = useAdmin();

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  const handleStartEdit = (item: NavigationItem) => {
    if (!isAdminMode) return;
    setEditingItem(item.id);
    setEditingItemData({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingItem || !editingItemData.label || !editingItemData.path) return;
    
    const updatedItems = items.map(item => 
      item.id === editingItem 
        ? { ...item, ...editingItemData } as NavigationItem
        : item
    );
    
    onItemsChange(updatedItems);
    setEditingItem(null);
    setEditingItemData({});
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditingItemData({});
  };

  const handleAddNew = () => {
    if (!isAdminMode) return;
    setIsAddingNew(true);
    setNewItemData({
      id: '',
      path: '',
      label: '',
      subtitle: '',
      icon: '',
      order: Math.max(...items.map(i => i.order), 0) + 1,
      visible: true,
      adminOnly: false
    });
  };

  const handleSaveNew = () => {
    if (!newItemData.label || !newItemData.path) return;
    
    const newItem: NavigationItem = {
      id: Date.now().toString(),
      path: newItemData.path || '',
      label: newItemData.label || '',
      subtitle: newItemData.subtitle || '',
      icon: newItemData.icon || '',
      order: newItemData.order || Math.max(...items.map(i => i.order), 0) + 1,
      visible: newItemData.visible !== false,
      adminOnly: newItemData.adminOnly || false
    };
    
    onItemsChange([...items, newItem]);
    setIsAddingNew(false);
    setNewItemData({});
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewItemData({});
  };

  const handleDelete = (itemId: string) => {
    if (!isAdminMode) return;
    
    if (confirm('このナビゲーション項目を削除しますか？')) {
      const updatedItems = items.filter(item => item.id !== itemId);
      onItemsChange(updatedItems);
    }
  };

  const handleToggleVisibility = (itemId: string) => {
    if (!isAdminMode) return;
    
    const updatedItems = items.map(item => 
      item.id === itemId 
        ? { ...item, visible: !item.visible }
        : item
    );
    
    onItemsChange(updatedItems);
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (!isAdminMode) return;
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetItemId) return;

    const draggedIndex = sortedItems.findIndex(item => item.id === draggedItem);
    const targetIndex = sortedItems.findIndex(item => item.id === targetItemId);
    
    const newItems = [...sortedItems];
    const [draggedItemData] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItemData);

    // 順序を再設定
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    onItemsChange(reorderedItems);
    setDraggedItem(null);
  };

  const renderEditForm = (data: Partial<NavigationItem>, onChange: (data: Partial<NavigationItem>) => void) => (
    <div className="bg-gray-50 p-4 rounded-lg border-2 border-blue-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">表示名</label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => onChange({ ...data, label: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="メニュー表示名"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">パス</label>
          <input
            type="text"
            value={data.path || ''}
            onChange={(e) => onChange({ ...data, path: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="/example-path"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">サブタイトル</label>
          <input
            type="text"
            value={data.subtitle || ''}
            onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="説明文（任意）"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">アイコン</label>
          <input
            type="text"
            value={data.icon || ''}
            onChange={(e) => onChange({ ...data, icon: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="🏠 (絵文字またはアイコン名)"
          />
        </div>
        
        <div className="md:col-span-2">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`visible-${data.id}`}
                checked={data.visible !== false}
                onChange={(e) => onChange({ ...data, visible: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`visible-${data.id}`} className="ml-2 block text-sm text-gray-700">
                表示する
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`admin-only-${data.id}`}
                checked={data.adminOnly || false}
                onChange={(e) => onChange({ ...data, adminOnly: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`admin-only-${data.id}`} className="ml-2 block text-sm text-gray-700">
                管理者専用
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isAdminMode) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <p>ナビゲーション編集は管理者モードで利用可能です</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">ナビゲーション編集</h3>
        <button
          onClick={handleAddNew}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <PlusIcon className="h-4 w-4" />
          <span>メニュー追加</span>
        </button>
      </div>

      <div className="space-y-3">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            draggable={isAdminMode && editingItem !== item.id}
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item.id)}
            className={`group hover:bg-gray-50 p-4 rounded-lg border border-gray-200 transition-colors ${
              draggedItem === item.id ? 'opacity-50' : ''
            } ${!item.visible ? 'opacity-60 bg-gray-100' : ''}`}
          >
            {editingItem === item.id ? (
              <div>
                {renderEditForm(editingItemData, setEditingItemData)}
                <div className="flex items-center space-x-2 mt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center space-x-1 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                  >
                    <CheckIcon className="h-4 w-4" />
                    <span>保存</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    <span>キャンセル</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="cursor-move text-gray-400">
                    <Bars3Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {item.icon && <span className="text-lg">{item.icon}</span>}
                    <div>
                      <div className="font-medium text-gray-800">{item.label}</div>
                      {item.subtitle && (
                        <div className="text-sm text-gray-500">{item.subtitle}</div>
                      )}
                      <div className="text-xs text-gray-400">
                        パス: {item.path}
                        {item.adminOnly && ' • 管理者専用'}
                        {!item.visible && ' • 非表示'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleToggleVisibility(item.id)}
                    className={`p-2 rounded ${
                      item.visible 
                        ? 'text-green-600 hover:bg-green-100' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={item.visible ? '非表示にする' : '表示する'}
                  >
                    {item.visible ? '👁️' : '👁️‍🗨️'}
                  </button>
                  
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded"
                    title="編集"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded"
                    title="削除"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isAddingNew && (
          <div className="border-2 border-blue-300 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">新しいメニュー項目を追加</h4>
            {renderEditForm(newItemData, setNewItemData)}
            <div className="flex items-center space-x-2 mt-4">
              <button
                onClick={handleSaveNew}
                className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
              >
                <CheckIcon className="h-4 w-4" />
                <span>追加</span>
              </button>
              <button
                onClick={handleCancelNew}
                className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>キャンセル</span>
              </button>
            </div>
          </div>
        )}

        {sortedItems.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            ナビゲーション項目がありません
            <div className="mt-2">
              <button
                onClick={handleAddNew}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                最初のメニュー項目を追加する
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InlineEditableNavigation;
