import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAdmin } from '../contexts/AdminContext';
import { MedicalCare, ServiceType } from '../types';

const UserListPage: React.FC = () => {
  const { users, addUser, updateUser, removeUser } = useData();
  const { isAdminMode } = useAdmin();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    age: '',
    gender: '男性',
    serviceType: [ServiceType.LIFE_CARE],
    disabilityLevel: '区分6',
    careLevel: '全介助',
    medicalCare: [] as MedicalCare[],
    allergies: [] as string[],
    medications: [] as string[],
    emergencyContact: '',
    notes: ''
  });

  const serviceTypes = [ServiceType.LIFE_CARE, ServiceType.DAY_SERVICE];
  const disabilityLevels = ['区分1', '区分2', '区分3', '区分4', '区分5', '区分6'];
  const careLevels = ['自立', '見守り', '一部介助', '全介助'];
  const medicalCareOptions = [
    MedicalCare.TUBE_FEEDING,
    MedicalCare.SUCTION,
    MedicalCare.VENTILATOR,
    MedicalCare.INHALATION,
    MedicalCare.ENEMA,
    MedicalCare.CATHETERIZATION,
    MedicalCare.IVH
  ];

  const handleAddUser = () => {
    if (!newUser.name || !newUser.age) return;

    const userToAdd = {
      id: Date.now().toString(),
      name: newUser.name,
      age: parseInt(newUser.age),
      gender: newUser.gender as '男性' | '女性',
      disabilityType: '重症心身障害者',
      disabilityLevel: newUser.disabilityLevel,
      underlyingDiseases: '',
      serviceType: newUser.serviceType,
      careLevel: newUser.careLevel,
      medicalCare: newUser.medicalCare,
      certificates: '',
      emergencyContact: newUser.emergencyContact,
      notes: newUser.notes,
      initials: newUser.name.charAt(0)
    };

    addUser(userToAdd);
    setNewUser({
      name: '',
      age: '',
      gender: '男性',
      serviceType: [ServiceType.LIFE_CARE],
      disabilityLevel: '区分6',
      careLevel: '全介助',
      medicalCare: [],
      allergies: [],
      medications: [],
      emergencyContact: '',
      notes: ''
    });
    setIsAddingUser(false);
  };

  const handleUpdateUser = (userId: string, updatedData: any) => {
    updateUser(userId, updatedData);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('本当にこの利用者を削除しますか？')) {
      removeUser(userId);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              利用者管理
              <span className="text-sm text-gray-400 font-normal ml-2">(大切な仲間たち)</span>
            </h1>
            <p className="text-gray-600">登録利用者数: {users.length}名</p>
          </div>
          {isAdminMode && (
            <button
              onClick={() => setIsAddingUser(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              ➕ 新しい利用者を追加
            </button>
          )}
        </div>

        {/* 管理者権限の確認 */}
        {!isAdminMode && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              ⚠️ 利用者情報の編集・追加・削除は管理者モードでのみ可能です。設定画面で管理者モードを有効にしてください。
            </p>
          </div>
        )}

        {/* 新規利用者追加フォーム */}
        {isAddingUser && isAdminMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">新しい利用者を追加</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">お名前 *</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="山田太郎"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">年齢 *</label>
                    <input
                      type="number"
                      value={newUser.age}
                      onChange={(e) => setNewUser({...newUser, age: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
                    <select
                      value={newUser.gender}
                      onChange={(e) => setNewUser({...newUser, gender: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="男性">男性</option>
                      <option value="女性">女性</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">障害区分</label>
                    <select
                      value={newUser.disabilityLevel}
                      onChange={(e) => setNewUser({...newUser, disabilityLevel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {disabilityLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">介助レベル</label>
                    <select
                      value={newUser.careLevel}
                      onChange={(e) => setNewUser({...newUser, careLevel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {careLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">サービス種別</label>
                  <div className="space-y-2">
                    {serviceTypes.map(service => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newUser.serviceType.includes(service)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewUser({...newUser, serviceType: [...newUser.serviceType, service]});
                            } else {
                              setNewUser({...newUser, serviceType: newUser.serviceType.filter(s => s !== service)});
                            }
                          }}
                          className="mr-2"
                        />
                        {service}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">医療ケア</label>
                  <div className="grid grid-cols-2 gap-2">
                    {medicalCareOptions.map(care => (
                      <label key={care} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={newUser.medicalCare.includes(care)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewUser({...newUser, medicalCare: [...newUser.medicalCare, care]});
                            } else {
                              setNewUser({...newUser, medicalCare: newUser.medicalCare.filter(c => c !== care)});
                            }
                          }}
                          className="mr-1"
                        />
                        {care}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">緊急連絡先</label>
                  <input
                    type="text"
                    value={newUser.emergencyContact}
                    onChange={(e) => setNewUser({...newUser, emergencyContact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="090-1234-5678（お母様）"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">特記事項</label>
                  <textarea
                    value={newUser.notes}
                    onChange={(e) => setNewUser({...newUser, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="特別な配慮事項やご本人の好きなこと等"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsAddingUser(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={!newUser.name || !newUser.age}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  追加する
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 利用者一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
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
                {isAdminMode && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingUser(user.id)}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                      title="編集"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      title="削除"
                    >
                      🗑️
                    </button>
                  </div>
                )}
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
                {user.medicalCare && user.medicalCare.length > 0 && (
                  <div>
                    <span className="text-gray-600 text-xs">医療ケア:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.medicalCare.slice(0, 3).map(care => (
                        <span key={care} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                          {care}
                        </span>
                      ))}
                      {user.medicalCare.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{user.medicalCare.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <Link
                  to={`/users/${user.id}`}
                  className="block w-full px-3 py-2 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 transition-colors"
                >
                  詳細を見る
                </Link>
                <Link
                  to={`/daily-log?userId=${user.id}`}
                  className="block w-full px-3 py-2 bg-green-500 text-white text-center rounded-lg hover:bg-green-600 transition-colors"
                >
                  記録を入力
                </Link>
              </div>

              {user.notes && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-600 line-clamp-2">{user.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">まだ利用者が登録されていません</p>
            {isAdminMode && (
              <button
                onClick={() => setIsAddingUser(true)}
                className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                最初の利用者を追加
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListPage;