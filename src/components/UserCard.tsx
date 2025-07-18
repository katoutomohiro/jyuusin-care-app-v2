import React from 'react';
import { Link } from 'react-router-dom';
import { User, ServiceType } from '../types';
import { PencilIcon, TrashIcon, DocumentTextIcon, PlusIcon, UsersIcon } from './icons'; 

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
              <Link to={`/users/${user.id}`} className="text-xl font-bold text-gray-800 hover:text-sky-600" data-testid="user-fullname">
                {user.name || '-'}
              </Link>
              <p className="text-sm text-gray-500">
                {user.age ?? '-'}歳 • {user.gender || '-'}
              </p>
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
          <div>
            <span className="text-xs font-semibold text-gray-500 mr-2">障害種別:</span>
            <span className="text-sm text-gray-700">{user.disabilityType || '-'}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 mr-2">障がい程度区分:</span>
            <span className="text-sm text-gray-700">{user.disabilityLevel || '-'}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 mr-2">基礎疾患:</span>
            <span className="text-sm text-gray-700">{user.underlyingDiseases || '-'}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 mr-2">医療ケア:</span>
            <span className="text-sm text-gray-700">{user.medicalCare || '-'}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 mr-2">手帳等:</span>
            <span className="text-sm text-gray-700">{user.certificates || '-'}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 mr-2">介助状況:</span>
            <span className="text-sm text-gray-700">{user.careLevel || '-'}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 mr-2">利用サービス:</span>
            <span className="text-sm text-gray-700">{user.serviceType?.map(service => service === ServiceType.LIFE_CARE ? '生活介護' : '放課後等デイサービス').join(', ') || '-'}</span>
          </div>
          {user.notes && (
            <div>
              <span className="text-xs font-semibold text-gray-500 mr-2">特記事項:</span>
              <span className="text-sm text-gray-700">{user.notes || ''}</span>
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