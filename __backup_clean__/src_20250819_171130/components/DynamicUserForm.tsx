/**
 * 利用者管理ページ用の動的フォームコンポーネント
 * 管理者が設定したフィールドを動的に表示・編集
 */

import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { useConfigurableComponent } from '../../services/DynamicConfigSystem';

interface DynamicUserFormProps {
  user?: User;
  onSave: (userData: Partial<User>) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const DynamicUserForm: React.FC<DynamicUserFormProps> = ({
  user,
  onSave,
  onCancel,
  isEdit = false
}) => {
  const { userFields } = useConfigurableComponent('userForm');
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user && isEdit) {
      setFormData({
        name: user.name || '',
        age: user.age || '',
        gender: user.gender || '',
        disabilityType: user.disabilityType || '',
        disabilityLevel: user.disabilityLevel || '',
        ...user
      });
    }
  }, [user, isEdit]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldId]: value
    }));

    // エラークリア
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    userFields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.name}は必須項目です`;
      }

      if (field.type === 'number' && formData[field.id] && isNaN(Number(formData[field.id]))) {
        newErrors[field.id] = `${field.name}は数値で入力してください`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const renderField = (field: any) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors[field.id] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`${field.name}を入力`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.id, parseInt(e.target.value) || '')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors[field.id] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`${field.name}を入力`}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors[field.id] ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">{field.name}を選択</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options?.map((option: string) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onChange={(e) => {
                    const currentArray = Array.isArray(value) ? value : [];
                    const newArray = e.target.checked
                      ? [...currentArray, option]
                      : currentArray.filter(item => item !== option);
                    handleFieldChange(field.id, newArray);
                  }}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors[field.id] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`${field.name}を入力`}
          />
        );

      case 'toggle':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              className="mr-2"
            />
            {field.name}
          </label>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors[field.id] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`${field.name}を入力`}
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? '利用者情報編集' : '新規利用者追加'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {renderField(field)}
              
              {field.description && (
                <p className="text-xs text-gray-500">{field.description}</p>
              )}
              
              {errors[field.id] && (
                <p className="text-sm text-red-500">{errors[field.id]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            {isEdit ? '更新' : '追加'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicUserForm;
