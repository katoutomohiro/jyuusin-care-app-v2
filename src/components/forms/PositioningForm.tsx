import React, { useState } from 'react';

interface PositioningFormProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

export const PositioningForm: React.FC<PositioningFormProps> = ({ onSave, isSubmitting }) => {
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
    position_from: 'supine' as 'supine' | 'prone' | 'side_left' | 'side_right' | 'sitting' | 'wheelchair' | 'other',
    position_to: 'side_left' as 'supine' | 'prone' | 'side_left' | 'side_right' | 'sitting' | 'wheelchair' | 'other',
    positioning_aids: [] as string[],
    reason: [] as string[],
    skin_condition: 'normal' as 'normal' | 'red_marks' | 'pressure_sore_risk' | 'pressure_sore' | 'other',
    comfort_level: 'comfortable' as 'comfortable' | 'slightly_uncomfortable' | 'uncomfortable' | 'distressed',
    duration_planned_minutes: 120,
    notes: ''
  });

  const positions = [
    { value: 'supine', label: '仰臥位（あお向け）', emoji: '🛌', description: '背中を下にして寝る' },
    { value: 'prone', label: '腹臥位（うつ伏せ）', emoji: '😴', description: 'お腹を下にして寝る' },
    { value: 'side_left', label: '左側臥位', emoji: '↪️', description: '左を下にして横向き' },
    { value: 'side_right', label: '右側臥位', emoji: '↩️', description: '右を下にして横向き' },
    { value: 'sitting', label: '座位', emoji: '🪑', description: 'ベッド上で座る' },
    { value: 'wheelchair', label: '車椅子', emoji: '♿', description: '車椅子に乗る' },
    { value: 'other', label: 'その他', emoji: '🔄', description: 'その他の体位' }
  ];

  const positioningAids = [
    'クッション', 'ピロー', '体位保持器具', 'タオル', 
    '足枕', '膝下枕', '背当てクッション', '側臥位枕',
    'エアマット', '圧迫軽減マット', 'ポジショニングベルト',
    '車椅子クッション', 'その他'
  ];

  const reasons = [
    '定期的な体位変換', '圧迫予防', '呼吸改善', '循環改善',
    '拘縮予防', '安楽な姿勢確保', '摂食嚥下改善', '気道確保',
    '本人の希望', '活動参加のため', '医師指示', 'その他'
  ];

  const skinConditions = [
    { value: 'normal', label: '正常', color: 'green', description: '発赤なし、問題なし' },
    { value: 'red_marks', label: '発赤あり', color: 'yellow', description: '軽度の発赤、要注意' },
    { value: 'pressure_sore_risk', label: '褥瘡リスク', color: 'orange', description: '褥瘡発生のリスクあり' },
    { value: 'pressure_sore', label: '褥瘡あり', color: 'red', description: '褥瘡が発生している' },
    { value: 'other', label: 'その他', color: 'gray', description: 'その他の皮膚状態' }
  ];

  const comfortLevels = [
    { value: 'comfortable', label: '快適', emoji: '😊', color: 'green' },
    { value: 'slightly_uncomfortable', label: 'やや不快', emoji: '😐', color: 'yellow' },
    { value: 'uncomfortable', label: '不快', emoji: '😟', color: 'orange' },
    { value: 'distressed', label: '苦痛', emoji: '😰', color: 'red' }
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

  const getPositionEmoji = (position: string) => {
    const pos = positions.find(p => p.value === position);
    return pos ? pos.emoji : '🔄';
  };

  const getComfortColor = (level: string) => {
    const comfort = comfortLevels.find(c => c.value === level);
    return comfort ? comfort.color : 'gray';
  };

  const getSkinColor = (condition: string) => {
    const skin = skinConditions.find(s => s.value === condition);
    return skin ? skin.color : 'gray';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 実施時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏰ ポジショニング実施時刻 *
        </label>
        <div className="flex space-x-2">
          <input
            type="datetime-local"
            value={formData.event_timestamp}
            onChange={(e) => setFormData({ ...formData, event_timestamp: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
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

      {/* 体位変換 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔄 体位変換
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 変換前 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              変換前の体位
            </label>
            <select
              value={formData.position_from}
              onChange={(e) => setFormData({ ...formData, position_from: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {positions.map(position => (
                <option key={position.value} value={position.value}>
                  {position.emoji} {position.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* 変換後 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              変換後の体位 *
            </label>
            <select
              value={formData.position_to}
              onChange={(e) => setFormData({ ...formData, position_to: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              {positions.map(position => (
                <option key={position.value} value={position.value}>
                  {position.emoji} {position.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* 体位変換の視覚的表示 */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-2xl">
              {getPositionEmoji(formData.position_from)}
            </div>
            <div className="text-xl">→</div>
            <div className="text-2xl">
              {getPositionEmoji(formData.position_to)}
            </div>
          </div>
        </div>
      </div>

      {/* ポジショニング用具 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🛏️ 使用したポジショニング用具 ※複数選択可
        </label>
        <div className="grid grid-cols-2 gap-2">
          {positioningAids.map(aid => (
            <button
              key={aid}
              type="button"
              onClick={() => setFormData({ 
                ...formData, 
                positioning_aids: toggleArrayItem(formData.positioning_aids, aid) 
              })}
              className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                formData.positioning_aids.includes(aid)
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {aid}
            </button>
          ))}
        </div>
      </div>

      {/* 体位変換の理由 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🎯 体位変換の理由・目的 ※複数選択可
        </label>
        <div className="grid grid-cols-2 gap-2">
          {reasons.map(reason => (
            <button
              key={reason}
              type="button"
              onClick={() => setFormData({ 
                ...formData, 
                reason: toggleArrayItem(formData.reason, reason) 
              })}
              className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                formData.reason.includes(reason)
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
      </div>

      {/* 皮膚状態 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔍 皮膚状態の確認
        </label>
        <div className="grid grid-cols-2 gap-3">
          {skinConditions.map(condition => (
            <button
              key={condition.value}
              type="button"
              onClick={() => setFormData({ ...formData, skin_condition: condition.value as any })}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                formData.skin_condition === condition.value
                  ? `border-${condition.color}-500 bg-${condition.color}-50`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-sm">{condition.label}</div>
              <div className="text-xs text-gray-600">{condition.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 快適度 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          😊 快適度の評価
        </label>
        <div className="grid grid-cols-2 gap-3">
          {comfortLevels.map(comfort => (
            <button
              key={comfort.value}
              type="button"
              onClick={() => setFormData({ ...formData, comfort_level: comfort.value as any })}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                formData.comfort_level === comfort.value
                  ? `border-${comfort.color}-500 bg-${comfort.color}-50`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{comfort.emoji}</div>
              <div className="font-semibold text-sm">{comfort.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 予定時間 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏱️ この体位の予定時間
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="15"
            max="480"
            step="15"
            value={formData.duration_planned_minutes}
            onChange={(e) => setFormData({ ...formData, duration_planned_minutes: parseInt(e.target.value) || 120 })}
            className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-600">分間</span>
        </div>
        <div className="mt-2 flex space-x-2 flex-wrap">
          {[30, 60, 90, 120, 180, 240].map(minutes => (
            <button
              key={minutes}
              type="button"
              onClick={() => setFormData({ ...formData, duration_planned_minutes: minutes })}
              className={`px-3 py-1 rounded text-sm ${
                formData.duration_planned_minutes === minutes 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {minutes}分
            </button>
          ))}
        </div>
      </div>

      {/* 特記事項 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📝 特記事項・詳細メモ
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          rows={3}
          placeholder="体位変換時の様子、皮膚の詳細な状態、本人の反応、次回への申し送り事項など..."
        />
      </div>

      {/* 保存ボタン */}
      <div className="sticky bottom-0 bg-gray-50 p-4 -mx-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            '🛏️ ポジショニング記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};
