import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

/**
 * 利用者詳細ページ
 *
 * 利用者の基本情報と、今日の記録サマリーを表示します。オフライン
 * でも閲覧できるようローカルストレージから情報を取得します。
 */
const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any | null>(null);
  const [summary, setSummary] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!id) return;
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const found = users.find((u: any) => u.id === id);
      setUser(found || null);
    } catch {
      setUser(null);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const today = new Date().toISOString().split('T')[0];
    const eventTypes = ['seizure', 'expression', 'hydration', 'positioning', 'activity', 'excretion', 'sleep', 'care'];
    const counts: Record<string, number> = {};
    eventTypes.forEach(type => {
      const key = `${type}_records_${today}`;
      try {
        const records = JSON.parse(localStorage.getItem(key) || '[]');
        counts[type] = records.filter((r: any) => r.user_id === id).length;
      } catch {
        counts[type] = 0;
      }
    });
    setSummary(counts);
  }, [id]);

  if (!user) {
    return (
      <div className="p-6">
        <p>指定された利用者が見つかりません。</p>
        <Link to="/users" className="text-blue-600 underline">一覧に戻る</Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-2">{user.name} さんの詳細</h1>
      <div className="bg-white shadow rounded p-4 space-y-1">
        <div><strong>年齢:</strong> {user.age}</div>
        <div><strong>性別:</strong> {user.gender}</div>
        <div><strong>障害区分:</strong> {user.disabilityLevel}</div>
        <div><strong>介護度:</strong> {user.careLevel}</div>
        {/* serviceType 配列が存在すれば使用し、旧プロパティ serviceTypes もフォールバックとしてサポート */}
        <div><strong>サービス種別:</strong> {((user.serviceType || user.serviceTypes || []) as any[]).join(', ')}</div>
        <div><strong>医療ケア:</strong> {(user.medicalCare || []).join(', ')}</div>
        <div><strong>緊急連絡先:</strong> {user.emergencyContact || '未登録'}</div>
        {user.notes && <div><strong>備考:</strong> {user.notes}</div>}
      </div>
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-2">今日の記録サマリー</h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">種類</th>
              <th className="border px-2 py-1">件数</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summary).map(([type, count]) => (
              <tr key={type} className="odd:bg-gray-50">
                <td className="border px-2 py-1">{type}</td>
                <td className="border px-2 py-1 text-center">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <Link to={`/users/edit/${user.id}`} className="text-blue-600 underline mr-4">編集する</Link>
        <Link to="/users" className="text-blue-600 underline">一覧に戻る</Link>
      </div>
    </div>
  );
};

export default UserDetailPage;