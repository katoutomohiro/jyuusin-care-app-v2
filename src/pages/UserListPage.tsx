import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const UserListPage: React.FC = () => {
  const { users } = useData();
  
  // デバッグ：データの確認
  console.log('UserListPage - 取得したユーザー数:', users.length);
  console.log('UserListPage - ユーザーデータ:', users);

  return (
    <div className="min-h-screen bg-[#FAFAF5] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          利用者管理
          <span className="text-sm text-gray-400 font-normal ml-2">(大切な仲間たち)</span>
        </h1>
        <p className="text-gray-600 mb-6">登録利用者数: {users.length}名</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {users.map(user => (
            <Link
              to={`/users/${user.id}`}
              key={user.id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-lg">
                    {user.initials || user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-lg text-gray-800">{user.name}</span>
                  <div className="text-gray-500 text-sm">
                    {user.serviceType.join(', ')}
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">年齢:</span>
                  <span className="text-gray-800">{user.age}歳</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">障害区分:</span>
                  <span className="text-gray-800">{user.disabilityLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">介助レベル:</span>
                  <span className="text-gray-800">{user.careLevel}</span>
                </div>
              </div>
              {user.notes && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-600 line-clamp-2">{user.notes}</p>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserListPage;