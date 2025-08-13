import * as React from "react"; const C: React.FC<any> = () => null; export default C;
import * as React from 'react';
const InlineEditableList: React.FC<any> = () => null;
export default InlineEditableList;
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from './icons';

interface EditableListItem {
  id: string;
  label: string;
  value: string;
  type?: 'text' | 'textarea' | 'select';
  options?: string[];
  required?: boolean;
}

interface InlineEditableListProps {
  items: EditableListItem[];
  onItemsChange: (items: EditableListItem[]) => void;
  title: string;
  adminOnly?: boolean;
  className?: string;
  allowAdd?: boolean;
  allowDelete?: boolean;
  allowReorder?: boolean;
}

/**
 * 管理者がアプリ画面上で直接編集できるリストコンポーネント
 * 発作項目、ナビゲーション項目などの動的編集に使用
 */
const InlineEditableList: React.FC<InlineEditableListProps> = ({
  items,
  onItemsChange,
  title,
  adminOnly = false,
  className = '',
  allowAdd = true,
  allowDelete = true,
  allowReorder = false
}) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingItemData, setEditingItemData] = useState<Partial<EditableListItem>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItemData, setNewItemData] = useState<Partial<EditableListItem>>({});
  const { isAdminMode } = useAdmin();

  const canEdit = !adminOnly || isAdminMode;

  const handleStartEdit = (item: EditableListItem) => {
    if (!canEdit) return;
    setEditingItem(item.id);
    setEditingItemData({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingItem || !editingItemData.label) return;
    
    const updatedItems = items.map(item => 
      item.id === editingItem 
        ? { ...item, ...editingItemData } as EditableListItem
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
    if (!canEdit) return;
    setIsAddingNew(true);
    setNewItemData({
      id: '',
      label: '',
      value: '',
      type: 'text'
    });
  };

  const handleSaveNew = () => {
    if (!newItemData.label) return;
    
    const newItem: EditableListItem = {
      id: Date.now().toString(),
      label: newItemData.label || '',
      value: newItemData.value || '',
      type: newItemData.type || 'text',
      options: newItemData.options,
      required: newItemData.required || false
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
    if (!canEdit || !allowDelete) return;
    
    if (confirm('この項目を削除しますか？')) {
      const updatedItems = items.filter(item => item.id !== itemId);
      onItemsChange(updatedItems);
    }
  };

  const handleMoveUp = (index: number) => {
    if (!canEdit || !allowReorder || index === 0) return;
    
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    onItemsChange(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (!canEdit || !allowReorder || index === items.length - 1) return;
    
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    onItemsChange(newItems);
  };

  const renderEditForm = (data: Partial<EditableListItem>, onChange: (data: Partial<EditableListItem>) => void) => (
    <div className="bg-gray-50 p-4 rounded-lg border-2 border-blue-200">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">項目名</label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => onChange({ ...data, label: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="項目名を入力"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">初期値</label>
          <input
            type="text"
            value={data.value || ''}
            onChange={(e) => onChange({ ...data, value: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="初期値を入力（任意）"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">入力タイプ</label>
          <select
            value={data.type || 'text'}
            onChange={(e) => onChange({ ...data, type: e.target.value as 'text' | 'textarea' | 'select' })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="text">テキスト</option>
            <option value="textarea">複数行テキスト</option>
            <option value="select">選択肢</option>
          </select>
        </div>
        
        {data.type === 'select' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">選択肢（改行区切り）</label>
            <textarea
              value={data.options?.join('\n') || ''}
              onChange={(e) => onChange({ ...data, options: e.target.value.split('\n').filter(Boolean) })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="選択肢1&#10;選択肢2&#10;選択肢3"
            />
          </div>
        )}
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`required-${data.id}`}
            checked={data.required || false}
            onChange={(e) => onChange({ ...data, required: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor={`required-${data.id}`} className="ml-2 block text-sm text-gray-700">
            必須項目
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {canEdit && allowAdd && (
          <button
            onClick={handleAddNew}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium"
          >
            <PlusIcon className="h-4 w-4" />
            <span>項目追加</span>
          </button>
        )}
        {adminOnly && !isAdminMode && (
          <span className="text-xs text-gray-400">(管理者のみ編集可能)</span>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="group hover:bg-gray-50 p-3 rounded-lg border border-gray-200">
            {editingItem === item.id ? (
              <div>
                {renderEditForm(editingItemData, setEditingItemData)}
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    <CheckIcon className="h-4 w-4" />
                    <span>保存</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    <span>キャンセル</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{item.label}</div>
                  <div className="text-sm text-gray-500">
                    タイプ: {item.type === 'text' ? 'テキスト' : item.type === 'textarea' ? '複数行' : '選択肢'}
                    {item.required && ' (必須)'}
                    {item.value && ` • 初期値: ${item.value}`}
                  </div>
                </div>
                
                {canEdit && (
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {allowReorder && (
                      <>
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="上に移動"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === items.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="下に移動"
                        >
                          ↓
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="編集"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    {allowDelete && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="削除"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isAddingNew && (
          <div className="border-2 border-blue-300 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">新しい項目を追加</h4>
            {renderEditForm(newItemData, setNewItemData)}
            <div className="flex items-center space-x-2 mt-3">
              <button
                onClick={handleSaveNew}
                className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                <CheckIcon className="h-4 w-4" />
                <span>追加</span>
              </button>
              <button
                onClick={handleCancelNew}
                className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>キャンセル</span>
              </button>
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            項目がありません
            {canEdit && allowAdd && (
              <div className="mt-2">
                <button
                  onClick={handleAddNew}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  最初の項目を追加する
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InlineEditableList;
