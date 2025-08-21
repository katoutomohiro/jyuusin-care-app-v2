import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import type { User, MedicalCare, ServiceType } from '../../types';

/**
 * 利用者の基本情報を編集するページです。利用者一覧から「編集」をクリックすると
 * このページに遷移し、氏名や年齢などの情報を更新できます。
 */
const UserEditPage: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getUserById, updateUser } = useData();

  // 選択された利用者を取得。存在しない場合はエラー表示。
  const user = getUserById(userId ?? '');
  if (!user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">利用者データが見つかりません</h2>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded"
          onClick={() => navigate('/users')}
        >
          利用者一覧に戻る
        </button>
      </div>
    );
  }

  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [disabilityLevel, setDisabilityLevel] = useState(user.disabilityLevel);
  const [careLevel, setCareLevel] = useState(user.careLevel);
  const [medicalCare, setMedicalCare] = useState(user.medicalCare.join(', '));
  const [serviceType, setServiceType] = useState(user.serviceType.join(', '));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // 文字列をカンマ区切りで配列に変換
    updateUser(user.id, {
      name,
      age,
      disabilityLevel,
      careLevel,
      medicalCare: medicalCare.split(',').map(s => s.trim()).filter(Boolean) as MedicalCare[],
      serviceType: serviceType.split(',').map(s => s.trim()).filter(Boolean) as ServiceType[],
    });
    navigate('/users');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">利用者情報編集</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">氏名</label>
          <input
            className="w-full border rounded p-2"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">年齢</label>
          <input
            className="w-full border rounded p-2"
            type="number"
            value={age}
            onChange={e => setAge(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">障害区分</label>
          <input
            className="w-full border rounded p-2"
            value={disabilityLevel}
            onChange={e => setDisabilityLevel(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">介助レベル</label>
          <input
            className="w-full border rounded p-2"
            value={careLevel}
            onChange={e => setCareLevel(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">医療的ケア（カンマ区切り）</label>
          <input
            className="w-full border rounded p-2"
            value={medicalCare}
            onChange={e => setMedicalCare(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">サービス種別（カンマ区切り）</label>
          <input
            className="w-full border rounded p-2"
            value={serviceType}
            onChange={e => setServiceType(e.target.value)}
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded font-bold"
          >
            保存
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-6 py-2 rounded"
            onClick={() => navigate('/users')}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEditPage;
