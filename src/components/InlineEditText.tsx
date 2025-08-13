import * as React from "react"; const C: React.FC<any> = (p) => <span>{p?.value ?? ""}</span>; export default C;
import * as React from 'react';
const InlineEditText: React.FC<any> = (p) => <span>{p?.value ?? ''}</span>;
export default InlineEditText;
import React, { useState, useRef, useEffect } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from './icons';
import { useAdmin } from '../contexts/AdminContext';

interface InlineEditTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  showEditIcon?: boolean;
  multiline?: boolean;
  adminOnly?: boolean;
  label?: string;
}

/**
 * インライン編集可能テキストコンポーネント
 * 鉛筆アイコンクリックで編集モードに切り替え
 */
const InlineEditText: React.FC<InlineEditTextProps> = ({
  value,
  onSave,
  className = '',
  placeholder = '入力してください',
  disabled = false,
  showEditIcon = true,
  multiline = false,
  adminOnly = false,
  label = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { isAdminMode } = useAdmin();

  // 管理者専用かつ管理者モードでない場合は編集不可
  const canEdit = !disabled && (!adminOnly || isAdminMode);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (!canEdit) return;
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && multiline && e.ctrlKey) {
      handleSave();
    }
  };

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <div className="flex items-center space-x-2">
        {label && <span className="text-sm font-medium text-gray-700">{label}:</span>}
        <div className="flex-1">
          <InputComponent
            ref={inputRef as any}
            type={multiline ? undefined : "text"}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${multiline ? 'min-h-[80px] resize-vertical' : ''} ${className}`}
            rows={multiline ? 3 : undefined}
          />
          <div className="flex items-center space-x-1 mt-1">
            <button
              onClick={handleSave}
              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
              title="保存"
            >
              <CheckIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
              title="キャンセル"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
            <span className="text-xs text-gray-500">
              {multiline ? 'Ctrl+Enter: 保存' : 'Enter: 保存'} / Esc: キャンセル
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group inline-flex items-center space-x-1 ${canEdit ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleEdit}
    >
      {label && <span className="text-sm font-medium text-gray-700">{label}:</span>}
      <span className={`${className} ${canEdit ? 'hover:bg-gray-100 rounded px-1' : ''}`}>
        {value || placeholder}
      </span>
      {showEditIcon && canEdit && (isHovering || isEditing) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
          className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
          title={adminOnly ? '管理者編集' : '編集'}
        >
          <PencilIcon className="h-4 w-4" />
        </button>
      )}
      {adminOnly && !isAdminMode && (
        <span className="text-xs text-gray-400 ml-1">(管理者のみ)</span>
      )}
    </div>
  );
};

export default InlineEditText;
