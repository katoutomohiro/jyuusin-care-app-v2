import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAdmin } from '../contexts/AdminContext';
import { ServiceType, MedicalCare } from '../types';
import EditableText from '../components/EditableText';

/**
 * 利用者一覧ページ。利用者の新規追加、一覧表示、詳細ページへのリンク、
 * 編集ページへのリンク、削除機能を提供します。ヘッダーや副題は
 * EditableText コンポーネントを通じて管理者モード時に編集可能です。
 */
const UserListPage: React.FC = () => {
  const { users, addUser, removeUser } = useData();
  const { isAdminMode } = useAdmin();
  const [isAddingUser, setIsAddingUser] = useState(false);
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
  emergencyContact: { name: '', relationship: '', phone: '', emergencyPhone: '' },
    notes: ''
  });

  // 選択肢の定義
  const serviceTypes = [ServiceType.LIFE_CARE, ServiceType.DAY_SERVICE];
  const disabilityLevels = ['区分1','区分2','区分3','区分4','区分5','区分6'];
  const careLevels = ['自立','見守り','一部介助','全介助'];
  const medicalCareOptions = [
    MedicalCare.TUBE_FEEDING,
    MedicalCare.SUCTION,
    MedicalCare.VENTILATOR,
    MedicalCare.INHALATION,
    MedicalCare.ENEMA,
    MedicalCare.CATHETERIZATION,
    MedicalCare.IVH
  ];

  // 新規利用者を追加する
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
    emergencyContact: { name: '', relationship: '', phone: '', emergencyPhone: '' },
      notes: ''
    });
    setIsAddingUser(false);
  };

  // 利用者を削除
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('本当にこの利用者を削除しますか？')) {
      removeUser(userId);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] p-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              <EditableText textKey="userList_title" defaultText="利用者管理" />
              <span className="text-sm text-gray-400 font-normal ml-2">
                <EditableText textKey="userList_subtitle" defaultText="大切な仲間たち" />
              </span>
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

        {/* 管理者モードでない場合の注意喚起 */}
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
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="山田太郎"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">年齢 *</label>
                    <input
                      type="number"
                      value={newUser.age}
                      onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
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
                      onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
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
                      onChange={(e) => setNewUser({ ...newUser, disabilityLevel: e.target.value })}
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
                      onChange={(e) => setNewUser({ ...newUser, careLevel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {careLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">サービス種別</label>
                    <div className="space-y-2">
                      {serviceTypes.map(type => (
                        <label key={type} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newUser.serviceType.includes(type)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setNewUser({
                                ...newUser,
                                serviceType: checked
                                  ? [...newUser.serviceType, type]
                                  : newUser.serviceType.filter(st => st !== type)
                              });
                            }}
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">医療的ケア</label>
                    <div className="space-y-2">
                      {medicalCareOptions.map(care => (
                        <label key={care} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newUser.medicalCare.includes(care)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setNewUser({
                                ...newUser,
                                medicalCare: checked
                                  ? [...newUser.medicalCare, care]
                                  : newUser.medicalCare.filter(c => c !== care)
                              });
                            }}
                          />
                          <span>{care}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">緊急連絡先</label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      value={newUser.emergencyContact.name}
                      onChange={e => setNewUser({ ...newUser, emergencyContact: { ...newUser.emergencyContact, name: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="氏名（例：お母様）"
                    />
                    <input
                      type="text"
                      value={newUser.emergencyContact.relationship}
                      onChange={e => setNewUser({ ...newUser, emergencyContact: { ...newUser.emergencyContact, relationship: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="続柄（例：母）"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newUser.emergencyContact.phone}
                      onChange={e => setNewUser({ ...newUser, emergencyContact: { ...newUser.emergencyContact, phone: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="電話番号（例：090-1234-5678）"
                    />
                    <input
                      type="text"
                      value={newUser.emergencyContact.emergencyPhone}
                      onChange={e => setNewUser({ ...newUser, emergencyContact: { ...newUser.emergencyContact, emergencyPhone: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="緊急時連絡先（任意）"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">特記事項</label>
                  <textarea
                    value={newUser.notes}
                    onChange={(e) => setNewUser({ ...newUser, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="特別な配慮事項やご本人の好きなこと等"
                  />
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
          </div>
        )}

        {/* 利用者一覧テーブル */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">氏名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年齢</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">障害区分</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">介助レベル</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.disabilityLevel}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.careLevel}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <Link to={`/users/${u.id}`} className="text-blue-600 hover:underline">詳細</Link>
                    {isAdminMode && (
                      <>
                        <Link to={`/users/edit/${u.id}`} className="text-green-600 hover:underline">編集</Link>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-red-600 hover:underline"
                        >
                          削除
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;