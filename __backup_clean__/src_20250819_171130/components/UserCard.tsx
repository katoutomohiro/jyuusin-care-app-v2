import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ServiceType } from '../types';
import { PencilIcon, TrashIcon, DocumentTextIcon, PlusIcon, UsersIcon } from './icons'; 
import InlineEditText from './InlineEditText';
import { useAdmin } from '../contexts/AdminContext';
import { useData } from '../contexts/DataContext';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
}

const ServiceTag: React.FC<{ service: ServiceType }> = ({ service }) => {
  const style = service === ServiceType.LIFE_CARE
    ? 'bg-blue-100 text-blue-800'
    : 'bg-green-100 text-green-800';
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${style}`}>
      {service}
    </span>
  );
};

export const UserCard: React.FC<UserCardProps & { className?: string }> = ({ user, onEdit, onDelete, className = '' }) => {
  const { isAdminMode } = useAdmin();
  const { updateUser } = useData();
  const [isEditing, setIsEditing] = useState(false);

  // インライン編集のハンドラー
  const handleInlineUpdate = (field: keyof User, value: string) => {
    const updatedUser = { ...user, [field]: value };
    updateUser(user.id, updatedUser);
  };

  const handleEditToggle = () => {
    if (!isAdminMode) return;
    setIsEditing(!isEditing);
  };
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <div className="p-5 flex-grow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Link to={`/users/${user.id}`} className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sky-800 font-bold text-xl">
                {user.initials || user.name[0] || ''}
              </span>
            </Link>
            <div>
              {/* インライン編集可能な利用者名 */}
              {isEditing ? (
                <InlineEditText
                  value={user.name || ''}
                  onSave={(value) => handleInlineUpdate('name', value)}
                  className="text-xl font-bold text-gray-800"
                  placeholder="利用者名を入力"
                  adminOnly={true}
                />
              ) : (
                <Link to={`/users/${user.id}`} className="text-xl font-bold text-gray-800 hover:text-sky-600" data-testid="user-fullname">
                  {user.name || '-'}
                  {isAdminMode && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditToggle();
                      }}
                      className="ml-2 p-1 text-gray-400 hover:text-blue-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="管理者編集"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  )}
                </Link>
              )}
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <InlineEditText
                      value={user.age?.toString() || ''}
                      onSave={(value) => handleInlineUpdate('age', value)}
                      className="text-sm text-gray-500"
                      placeholder="年齢"
                      adminOnly={true}
                    />
                    <span className="text-sm text-gray-500">歳 •</span>
                    <InlineEditText
                      value={user.gender || ''}
                      onSave={(value) => handleInlineUpdate('gender', value)}
                      className="text-sm text-gray-500"
                      placeholder="性別"
                      adminOnly={true}
                    />
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    {user.age ?? '-'}歳 • {user.gender || '-'}
                  </p>
                )}
              </div>
            </div>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex space-x-1 flex-shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(user)}
                  className="p-2 text-gray-500 hover:text-sky-600 rounded-full hover:bg-gray-100"
                  aria-label="編集"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(user.id)}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                  aria-label="削除"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2 my-4">
          {/* インライン編集可能な各項目 */}
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500 mr-2 min-w-[80px]">障害種別:</span>
            {isEditing ? (
              <InlineEditText
                value={user.disabilityType || ''}
                onSave={(value) => handleInlineUpdate('disabilityType', value)}
                className="text-sm text-gray-700 flex-1"
                placeholder="障害種別を入力"
                adminOnly={true}
              />
            ) : (
              <span className="text-sm text-gray-700">{user.disabilityType || '-'}</span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500 mr-2 min-w-[80px]">障がい程度区分:</span>
            {isEditing ? (
              <InlineEditText
                value={user.disabilityLevel || ''}
                onSave={(value) => handleInlineUpdate('disabilityLevel', value)}
                className="text-sm text-gray-700 flex-1"
                placeholder="障がい程度区分を入力"
                adminOnly={true}
              />
            ) : (
              <span className="text-sm text-gray-700">{user.disabilityLevel || '-'}</span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500 mr-2 min-w-[80px]">基礎疾患:</span>
            {isEditing ? (
              <InlineEditText
                value={user.underlyingDiseases || ''}
                onSave={(value) => handleInlineUpdate('underlyingDiseases', value)}
                className="text-sm text-gray-700 flex-1"
                placeholder="基礎疾患を入力"
                adminOnly={true}
                multiline={true}
              />
            ) : (
              <span className="text-sm text-gray-700">{user.underlyingDiseases || '-'}</span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500 mr-2 min-w-[80px]">医療ケア:</span>
            {isEditing ? (
              <InlineEditText
                value={Array.isArray(user.medicalCare) ? user.medicalCare.join(', ') : user.medicalCare || ''}
                onSave={(value) => handleInlineUpdate('medicalCare', value)}
                className="text-sm text-gray-700 flex-1"
                placeholder="医療ケアを入力"
                adminOnly={true}
                multiline={true}
              />
            ) : (
              <span className="text-sm text-gray-700">
                {Array.isArray(user.medicalCare) ? user.medicalCare.join(', ') : user.medicalCare || '-'}
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500 mr-2 min-w-[80px]">手帳等:</span>
            {isEditing ? (
              <InlineEditText
                value={user.certificates || ''}
                onSave={(value) => handleInlineUpdate('certificates', value)}
                className="text-sm text-gray-700 flex-1"
                placeholder="手帳等を入力"
                adminOnly={true}
              />
            ) : (
              <span className="text-sm text-gray-700">{user.certificates || '-'}</span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500 mr-2 min-w-[80px]">介助状況:</span>
            {isEditing ? (
              <InlineEditText
                value={user.careLevel || ''}
                onSave={(value) => handleInlineUpdate('careLevel', value)}
                className="text-sm text-gray-700 flex-1"
                placeholder="介助状況を入力"
                adminOnly={true}
              />
            ) : (
              <span className="text-sm text-gray-700">{user.careLevel || '-'}</span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="text-xs font-semibold text-gray-500 mr-2 min-w-[80px]">利用サービス:</span>
            <span className="text-sm text-gray-700">{user.serviceType?.map(service => service === ServiceType.LIFE_CARE ? '生活介護' : '放課後等デイサービス').join(', ') || '-'}</span>
          </div>
          
          {(user.notes || isEditing) && (
            <div className="flex items-start">
              <span className="text-xs font-semibold text-gray-500 mr-2 min-w-[80px] mt-1">特記事項:</span>
              {isEditing ? (
                <InlineEditText
                  value={user.notes || ''}
                  onSave={(value) => handleInlineUpdate('notes', value)}
                  className="text-sm text-gray-700 flex-1"
                  placeholder="特記事項を入力"
                  adminOnly={true}
                  multiline={true}
                />
              ) : (
                <span className="text-sm text-gray-700">{user.notes || ''}</span>
              )}
            </div>
          )}
          
          {/* 編集モード切り替えボタン */}
          {isAdminMode && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleEditToggle}
                className={`px-3 py-1 text-xs rounded ${
                  isEditing 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {isEditing ? '編集完了' : '詳細編集'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 grid grid-cols-2 gap-2">
        <Link
          to={`/users/${user.id}`}
          className="flex items-center justify-center px-3 py-2 text-sm font-medium text-center text-sky-700 bg-sky-100 rounded-md hover:bg-sky-200 transition-colors"
        >
          <DocumentTextIcon className="h-4 w-4 mr-2" />
          詳細
        </Link>
        
        <Link
          to={`/users/${user.id}/logs/new`}
          className="flex items-center justify-center px-3 py-2 text-sm font-medium text-center text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          記録
        </Link>

        <Link
          to={`/users/${user.id}/collaboration`}
          className="flex items-center justify-center px-3 py-2 text-sm font-medium text-center text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200 transition-colors"
        >
          <UsersIcon className="h-4 w-4 mr-2" />
          連携ノート
        </Link>
      </div>
    </div>
  );
};

export default UserCard;