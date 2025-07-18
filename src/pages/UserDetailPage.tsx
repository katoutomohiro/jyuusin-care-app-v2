import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ServiceType, DailyLog } from '../types';
import UserCharts from '../components/UserCharts';

const sections = [
  { key: 'basic', title: '基本情報' },
  { key: 'care', title: '医療・ケア情報' },
  { key: 'charts', title: '📊 詳細グラフ（月間集計）' },
  { key: 'words', title: '〇〇さんの言葉じてん（非言語辞書）' },
  { key: 'soul', title: '魂の物語：心の成長の記録' },
];

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { users } = useData();
  const user = users.find(u => u.id === id);
  const [open, setOpen] = useState<string | null>('charts'); // デフォルトでグラフを開く

  // サンプルログデータ（実際の実装では、APIから取得）
  const sampleLogs: DailyLog[] = Array.from({ length: 90 }, (_, dayIndex) => ({
    id: `${id}-${dayIndex}`,
    userId: id || 'user1',
    staff_id: `staff${(dayIndex % 7) + 1}`,
    author: `職員${(dayIndex % 7) + 1}`,
    authorId: `author${(dayIndex % 7) + 1}`,
    record_date: new Date(2025, 4, dayIndex + 1).toISOString().split('T')[0], // 3ヶ月分
    recorder_name: `職員${(dayIndex % 7) + 1}`,
    weather: ['晴れ', '曇り', '雨'][dayIndex % 3],
    mood: [
      ['笑顔', 'リラックス'],
      ['穏やか'],
      ['不安', '疲労'],
      ['笑顔', '穏やか'],
      ['リラックス']
    ][dayIndex % 5],
    meal_intake: {
      breakfast: ['全量摂取', '半量摂取', '少量摂取'][dayIndex % 3],
      lunch: ['全量摂取', '半量摂取'][dayIndex % 2],
      snack: ['全量摂取', '少量摂取', 'なし'][dayIndex % 3],
      dinner: ['全量摂取', '半量摂取'][dayIndex % 2],
    },
    hydration: 300 + (dayIndex % 5) * 50,
    toileting: [],
    activity: {
      participation: [
        ['散歩', '音楽療法'],
        ['読書', 'リハビリ'],
        ['創作活動'],
        ['散歩', '料理'],
        ['音楽療法', 'リハビリ']
      ][dayIndex % 5],
      mood: ['リラックス', '穏やか', '集中'][dayIndex % 3],
      notes: `${dayIndex + 1}日目の活動記録`,
    },
    special_notes: [],
    vitals: undefined,
    intake: undefined,
    excretion: undefined,
    sleep: undefined,
    seizures: undefined,
    care_provided: undefined,
  }));

  // 魂の物語のサンプルデータ
  const soulStory = {
    title: `${user?.name}さんの魂の物語`,
    subtitle: '心のきらめきの記録',
    chapters: [
      {
        date: '2024年1月15日',
        title: '初めての笑顔',
        content: '今日、職員の目を見て、初めてにこっと笑ってくれました。その瞬間、心が温かくなりました。',
        emotion: '喜び',
        icon: '😊'
      },
      {
        date: '2024年1月20日',
        title: '小さな一歩',
        content: 'リハビリの時間に、少しだけ手を動かそうとしてくれました。小さな変化ですが、大きな希望です。',
        emotion: '希望',
        icon: '🌱'
      },
      {
        date: '2024年1月25日',
        title: '心の繋がり',
        content: '音楽を聴いている時、とても穏やかな表情を見せてくれました。心が通じ合う瞬間でした。',
        emotion: '穏やか',
        icon: '🎵'
      }
    ]
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">利用者が見つかりません。</div>
        <div className="text-gray-600 text-sm">
          <p>URL ID: {id}</p>
          <p>利用可能なユーザー数: {users.length}名</p>
          <p>利用可能なID: {users.slice(0, 5).map(u => u.id).join(', ')}...</p>
        </div>
        <Link
          to="/users"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          利用者一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5] p-8">
      <div className="max-w-7xl mx-auto"> {/* 幅を広げる */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {user.name}様の詳細情報
            <span className="text-sm text-gray-400 font-normal block">(仲間の物語)</span>
          </h1>
          <Link
            to="/users"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            ← 利用者一覧に戻る
          </Link>
        </div>

        {/* アコーディオンメニュー */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.key} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => setOpen(open === section.key ? null : section.key)}
                className="w-full px-6 py-4 text-left font-bold text-lg text-gray-700 hover:bg-gray-50 transition-colors flex justify-between items-center"
              >
                <span>{section.title}</span>
                <span className={`transform transition-transform ${open === section.key ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {open === section.key && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  {/* 基本情報 */}
                  {section.key === 'basic' && (
                    <div className="mt-4">
                      {/* 基本情報 */}
                      <div className="text-gray-600 text-sm mb-6">
                        {user.age}歳（{user.gender}）<br />
                        障害種別：{user.disabilityType ?? '-'}<br />
                        障がい程度区分：{user.disabilityLevel ?? '-'}<br />
                        基礎疾患：{user.underlyingDiseases ?? '-'}<br />
                        医療ケア：{user.medicalCare ?? '-'}<br />
                        手帳等：{user.certificates ?? '-'}<br />
                        介助状況：{user.careLevel ?? '-'}<br />
                        利用サービス：{user.serviceType?.map(service => service === ServiceType.LIFE_CARE ? '生活介護' : '放課後等デイサービス').join(', ') ?? '-'}<br />
                        備考：{user.notes ?? '-'}
                      </div>
                      
                      {/* アクションボタン */}
                      <div className="grid grid-cols-2 gap-4">
                        <Link
                          to={`/daily-log/${user.id}`}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold flex items-center justify-center"
                        >
                          📝 構造化記録入力
                        </Link>
                        <button
                          onClick={() => {/* TODO: 日誌表示機能 */}}
                          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center font-semibold flex items-center justify-center"
                        >
                          📊 記録一覧
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* 医療・ケア情報 */}
                  {section.key === 'care' && (
                    <div className="text-gray-600 text-sm mt-4">
                      ここに医療・ケア情報が入ります
                    </div>
                  )}
                  
                  {/* 詳細グラフ */}
                  {section.key === 'charts' && (
                    <div className="mt-4">
                      <UserCharts user={user} logs={sampleLogs} />
                    </div>
                  )}
                  
                  {/* 非言語辞書 */}
                  {section.key === 'words' && (
                    <div className="text-gray-600 text-sm mt-4">
                      ここに非言語辞書が入ります
                    </div>
                  )}
                  
                  {/* 魂の物語 */}
                  {section.key === 'soul' && (
                    <div className="mt-4">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-purple-800">{soulStory.title}</h2>
                        <p className="text-purple-600">{soulStory.subtitle}</p>
                      </div>
                      
                      <div className="space-y-4">
                        {soulStory.chapters.map((chapter, index) => (
                          <div key={index} className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-purple-800 flex items-center gap-2">
                                <span className="text-2xl">{chapter.icon}</span>
                                {chapter.title}
                              </h3>
                              <span className="text-sm text-purple-600">{chapter.date}</span>
                            </div>
                            <p className="text-gray-700">{chapter.content}</p>
                            <div className="mt-2">
                              <span className="inline-block bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">
                                {chapter.emotion}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;