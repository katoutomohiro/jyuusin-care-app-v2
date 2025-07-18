import React, { useState } from 'react';

interface ActivityFormProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ onSave, isSubmitting }) => {
  // 正確な現在時刻を取得する関数
  const getCurrentDateTime = () => {
    const now = new Date();
    // タイムゾーンを考慮した正確な現在時刻
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    event_timestamp: getCurrentDateTime(),
    activity_type: [] as string[],
    participation_level: 'full' as 'full' | 'partial' | 'observation' | 'refused',
    duration_minutes: 30,
    assistance_needed: [] as string[],
    response_quality: 'positive' as 'positive' | 'neutral' | 'negative' | 'mixed',
    goals_achieved: [] as string[],
    challenges: [] as string[],
    next_session_notes: '',
    notes: ''
  });

  const activityTypes = [
    { category: '療育・訓練', activities: [
      '音楽療法', '作業療法', '理学療法', '言語療法', 
      '感覚統合療法', 'マッサージ', 'リハビリ訓練'
    ]},
    { category: '日常生活', activities: [
      '食事訓練', '移動訓練', '更衣訓練', 'コミュニケーション訓練',
      '身辺自立訓練', 'トイレ訓練'
    ]},
    { category: 'レクリエーション', activities: [
      '音楽鑑賞', '映画鑑賞', '読み聞かせ', '手遊び',
      'ダンス・体操', 'お絵描き', '工作活動', '感覚遊び'
    ]},
    { category: '外出・交流', activities: [
      '散歩', 'ドライブ', '買い物同行', '地域交流',
      'イベント参加', '公園遊び'
    ]},
    { category: 'その他', activities: [
      '自由時間', '休息', 'その他'
    ]}
  ];

  const participationLevels = [
    { value: 'full', label: '積極的参加', emoji: '😄', color: 'green', description: '自ら進んで参加' },
    { value: 'partial', label: '部分的参加', emoji: '😊', color: 'blue', description: '一部の活動に参加' },
    { value: 'observation', label: '見学のみ', emoji: '👀', color: 'yellow', description: '参加せず観察' },
    { value: 'refused', label: '参加拒否', emoji: '😔', color: 'red', description: '参加を拒否' }
  ];

  const assistanceOptions = [
    '声かけ・励まし', '手を添える', '一緒に動作', '見本を見せる',
    '環境調整', '道具の準備', '姿勢保持', '安全確保',
    '集中力サポート', 'コミュニケーション支援', '感情調整支援', 'なし'
  ];

  const responseQualities = [
    { value: 'positive', label: 'ポジティブ', emoji: '😊', color: 'green', description: '楽しそう、嬉しそう' },
    { value: 'neutral', label: '普通', emoji: '😐', color: 'gray', description: '特に反応なし' },
    { value: 'negative', label: 'ネガティブ', emoji: '😟', color: 'red', description: '嫌そう、苦痛そう' },
    { value: 'mixed', label: '混合', emoji: '🤔', color: 'orange', description: '時々により異なる' }
  ];

  const commonGoals = [
    'コミュニケーション向上', '運動機能向上', '認知機能向上', 
    '感情表現の促進', '社会性の向上', '集中力の向上',
    '筋力・筋持久力向上', '関節可動域維持・拡大', 
    'バランス能力向上', '協調性の向上', '創造性の発揮',
    'リラクゼーション', 'ストレス軽減', '楽しみの提供'
  ];

  const commonChallenges = [
    '集中力が続かない', '疲労しやすい', '興味を示さない',
    '身体的制限', '理解が困難', 'コミュニケーションが取りにくい',
    '感情的になりやすい', '環境に敏感', '体調不良',
    '道具の使用が困難', '姿勢保持が困難', '時間的制約'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const setCurrentTime = () => {
    const exactNow = getCurrentDateTime();
    setFormData({ ...formData, event_timestamp: exactNow });
    console.log('現在時刻を設定:', new Date().toLocaleString('ja-JP'));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const getParticipationColor = (level: string) => {
    const participation = participationLevels.find(p => p.value === level);
    return participation ? participation.color : 'gray';
  };

  const getResponseColor = (quality: string) => {
    const response = responseQualities.find(r => r.value === quality);
    return response ? response.color : 'gray';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 実施時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏰ 活動実施時刻 *
        </label>
        <div className="flex space-x-2">
          <input
            type="datetime-local"
            value={formData.event_timestamp}
            onChange={(e) => setFormData({ ...formData, event_timestamp: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
            required
          />
          <button
            type="button"
            onClick={setCurrentTime}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 whitespace-nowrap font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            🕐 今すぐ
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          💡 「今すぐ」ボタンで正確な現在時刻を自動入力
        </p>
      </div>

      {/* 活動内容 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🎯 実施した活動内容 ※複数選択可
        </label>
        {activityTypes.map(categoryGroup => (
          <div key={categoryGroup.category} className="mb-4">
            <div className="text-sm font-semibold text-purple-700 mb-2 border-b border-purple-200 pb-1">
              【{categoryGroup.category}】
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categoryGroup.activities.map(activity => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    activity_type: toggleArrayItem(formData.activity_type, activity)
                  })}
                  className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                    formData.activity_type.includes(activity)
                      ? 'border-purple-500 bg-purple-50 text-purple-800'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 参加レベル */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📊 参加レベル
        </label>
        <div className="grid grid-cols-2 gap-3">
          {participationLevels.map(level => (
            <button
              key={level.value}
              type="button"
              onClick={() => setFormData({ ...formData, participation_level: level.value as any })}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                formData.participation_level === level.value
                  ? `border-${level.color}-500 bg-${level.color}-50`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{level.emoji}</div>
              <div className="font-semibold text-sm">{level.label}</div>
              <div className="text-xs text-gray-600">{level.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 実施時間 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏱️ 活動時間
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="5"
            max="180"
            step="5"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 30 })}
            className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <span className="text-sm text-gray-600">分間</span>
        </div>
        <div className="mt-2 flex space-x-2 flex-wrap">
          {[15, 30, 45, 60, 90, 120].map(minutes => (
            <button
              key={minutes}
              type="button"
              onClick={() => setFormData({ ...formData, duration_minutes: minutes })}
              className={`px-3 py-1 rounded text-sm ${
                formData.duration_minutes === minutes 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {minutes}分
            </button>
          ))}
        </div>
      </div>

      {/* 必要な支援 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🤝 必要だった支援 ※複数選択可
        </label>
        <div className="grid grid-cols-2 gap-2">
          {assistanceOptions.map(assistance => (
            <button
              key={assistance}
              type="button"
              onClick={() => setFormData({ 
                ...formData, 
                assistance_needed: toggleArrayItem(formData.assistance_needed, assistance) 
              })}
              className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                formData.assistance_needed.includes(assistance)
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {assistance}
            </button>
          ))}
        </div>
      </div>

      {/* 反応・様子 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          😊 反応・様子の質
        </label>
        <div className="grid grid-cols-2 gap-3">
          {responseQualities.map(quality => (
            <button
              key={quality.value}
              type="button"
              onClick={() => setFormData({ ...formData, response_quality: quality.value as any })}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                formData.response_quality === quality.value
                  ? `border-${quality.color}-500 bg-${quality.color}-50`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{quality.emoji}</div>
              <div className="font-semibold text-sm">{quality.label}</div>
              <div className="text-xs text-gray-600">{quality.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 達成できた目標 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🎉 達成できた目標・成果 ※複数選択可
        </label>
        <div className="grid grid-cols-2 gap-2">
          {commonGoals.map(goal => (
            <button
              key={goal}
              type="button"
              onClick={() => setFormData({ 
                ...formData, 
                goals_achieved: toggleArrayItem(formData.goals_achieved, goal) 
              })}
              className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                formData.goals_achieved.includes(goal)
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {/* 課題・困難 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ⚠️ 課題・困難だった点 ※複数選択可
        </label>
        <div className="grid grid-cols-2 gap-2">
          {commonChallenges.map(challenge => (
            <button
              key={challenge}
              type="button"
              onClick={() => setFormData({ 
                ...formData, 
                challenges: toggleArrayItem(formData.challenges, challenge) 
              })}
              className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                formData.challenges.includes(challenge)
                  ? 'border-orange-500 bg-orange-50 text-orange-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {challenge}
            </button>
          ))}
        </div>
      </div>

      {/* 次回への申し送り */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ➡️ 次回セッションへの申し送り
        </label>
        <textarea
          value={formData.next_session_notes}
          onChange={(e) => setFormData({ ...formData, next_session_notes: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          rows={2}
          placeholder="次回の活動で注意すべき点、継続すべき支援方法、変更すべき点など..."
        />
      </div>

      {/* 特記事項 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📝 特記事項・詳細メモ
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          rows={3}
          placeholder="活動中の詳細な様子、印象的だった出来事、家族への報告事項など..."
        />
      </div>

      {/* 保存ボタン */}
      <div className="sticky bottom-0 bg-gray-50 p-4 -mx-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeOpacity="0.25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              保存中...
            </>
          ) : (
            '🎯 活動参加記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};
