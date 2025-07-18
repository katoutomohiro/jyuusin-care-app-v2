import React, { useState } from 'react';

interface HydrationFormProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

export const HydrationForm: React.FC<HydrationFormProps> = ({ onSave, isSubmitting }) => {
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
    fluid_type: 'water' as 'water' | 'tea' | 'juice' | 'milk' | 'supplement' | 'medication' | 'other',
    amount_ml: 100,
    intake_method: 'cup' as 'cup' | 'straw' | 'spoon' | 'syringe' | 'tube' | 'iv',
    assistance_level: 'independent' as 'independent' | 'verbal_cue' | 'physical_assist' | 'full_assist',
    completion_percentage: 100,
    refusal_reason: '',
    temperature: 'room' as 'cold' | 'room' | 'warm' | 'hot',
    notes: ''
  });

  const fluidTypes = [
    { value: 'water', label: '水', emoji: '💧', color: 'blue' },
    { value: 'tea', label: 'お茶', emoji: '🍵', color: 'green' },
    { value: 'juice', label: 'ジュース', emoji: '🧃', color: 'orange' },
    { value: 'milk', label: '牛乳', emoji: '🥛', color: 'gray' },
    { value: 'supplement', label: '栄養補助食品', emoji: '🥤', color: 'purple' },
    { value: 'medication', label: '薬用水分', emoji: '💊', color: 'red' },
    { value: 'other', label: 'その他', emoji: '🥤', color: 'gray' }
  ];

  const intakeMethods = [
    { value: 'cup', label: 'コップ', emoji: '☕', description: '自分で持って飲む' },
    { value: 'straw', label: 'ストロー', emoji: '🥤', description: 'ストローで吸って飲む' },
    { value: 'spoon', label: 'スプーン', emoji: '🥄', description: 'スプーンで少しずつ' },
    { value: 'syringe', label: '注射器', emoji: '💉', description: 'シリンジで口腔内に' },
    { value: 'tube', label: '経管', emoji: '🩺', description: '経鼻胃管・胃瘻' },
    { value: 'iv', label: '点滴', emoji: '💉', description: '静脈内投与' }
  ];

  const assistanceLevels = [
    { value: 'independent', label: '自立', description: '一人で飲める', color: 'green' },
    { value: 'verbal_cue', label: '声かけ', description: '声かけで飲める', color: 'blue' },
    { value: 'physical_assist', label: '部分介助', description: '手を添える程度', color: 'yellow' },
    { value: 'full_assist', label: '全介助', description: '完全に介助が必要', color: 'red' }
  ];

  const temperatures = [
    { value: 'cold', label: '冷たい', emoji: '🧊', color: 'blue' },
    { value: 'room', label: '常温', emoji: '🌡️', color: 'gray' },
    { value: 'warm', label: 'ぬるま湯', emoji: '♨️', color: 'orange' },
    { value: 'hot', label: '温かい', emoji: '🔥', color: 'red' }
  ];

  const commonAmounts = [50, 100, 150, 200, 250, 300, 500];
  const refusalReasons = [
    '眠気', '口の中が痛い', '飲み込みにくい', '味が嫌', 
    '満腹感', '体調不良', '機嫌が悪い', 'むせる心配',
    '温度が嫌', '集中できない', 'その他'
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

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getFluidSelectedStyle = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-500 bg-blue-50 shadow-md';
      case 'green': return 'border-green-500 bg-green-50 shadow-md';
      case 'orange': return 'border-orange-500 bg-orange-50 shadow-md';
      case 'gray': return 'border-gray-500 bg-gray-50 shadow-md';
      case 'purple': return 'border-purple-500 bg-purple-50 shadow-md';
      case 'red': return 'border-red-500 bg-red-50 shadow-md';
      default: return 'border-gray-500 bg-gray-50 shadow-md';
    }
  };

  const getAssistanceSelectedStyle = (color: string) => {
    switch (color) {
      case 'green': return 'border-green-500 bg-green-50';
      case 'blue': return 'border-blue-500 bg-blue-50';
      case 'yellow': return 'border-yellow-500 bg-yellow-50';
      case 'red': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getTemperatureSelectedStyle = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-500 bg-blue-50';
      case 'gray': return 'border-gray-500 bg-gray-50';
      case 'orange': return 'border-orange-500 bg-orange-50';
      case 'red': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 摂取時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏰ 水分摂取時刻 *
        </label>
        <div className="flex space-x-2">
          <input
            type="datetime-local"
            value={formData.event_timestamp}
            onChange={(e) => setFormData({ ...formData, event_timestamp: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
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

      {/* 水分の種類 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🥤 水分の種類
        </label>
        <div className="grid grid-cols-2 gap-3">
          {fluidTypes.map(fluid => (
            <button
              key={fluid.value}
              type="button"
              onClick={() => setFormData({ ...formData, fluid_type: fluid.value as any })}
              className={`p-3 rounded-xl border-2 transition-all ${
                formData.fluid_type === fluid.value
                  ? getFluidSelectedStyle(fluid.color)
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-xl mb-1">{fluid.emoji}</div>
              <div className="text-sm font-medium text-gray-800">{fluid.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 摂取量 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📏 摂取量
        </label>
        <div className="flex items-center space-x-3 mb-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, amount_ml: Math.max(0, formData.amount_ml - 10) })}
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold hover:bg-gray-300"
          >
            −
          </button>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-gray-800">{formData.amount_ml}</div>
            <div className="text-sm text-gray-600">ml</div>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, amount_ml: formData.amount_ml + 10 })}
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold hover:bg-gray-300"
          >
            ＋
          </button>
        </div>
        <div className="flex space-x-2 flex-wrap gap-2">
          {commonAmounts.map(amount => (
            <button
              key={amount}
              type="button"
              onClick={() => setFormData({ ...formData, amount_ml: amount })}
              className={`px-3 py-1 rounded text-sm ${
                formData.amount_ml === amount 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {amount}ml
            </button>
          ))}
        </div>
      </div>

      {/* 摂取方法 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🥄 摂取方法
        </label>
        <div className="space-y-2">
          {intakeMethods.map(method => (
            <button
              key={method.value}
              type="button"
              onClick={() => setFormData({ ...formData, intake_method: method.value as any })}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                formData.intake_method === method.value
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">{method.emoji}</span>
                <div>
                  <div className="font-medium">{method.label}</div>
                  <div className="text-sm opacity-75">{method.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 介助レベル */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🤝 介助レベル
        </label>
        <div className="grid grid-cols-2 gap-2">
          {assistanceLevels.map(level => (
            <button
              key={level.value}
              type="button"
              onClick={() => setFormData({ ...formData, assistance_level: level.value as any })}
              className={`p-3 rounded-lg border transition-colors ${
                formData.assistance_level === level.value
                  ? getAssistanceSelectedStyle(level.color)
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-sm">{level.label}</div>
              <div className="text-xs text-gray-600 mt-1">{level.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 完了率 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📊 完了率
        </label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">0%</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCompletionColor(formData.completion_percentage)}`}>
              {formData.completion_percentage}%
            </span>
            <span className="text-sm text-gray-600">100%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={formData.completion_percentage}
            onChange={(e) => setFormData({ ...formData, completion_percentage: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>拒否</span>
            <span>半分</span>
            <span>完飲</span>
          </div>
        </div>
      </div>

      {/* 温度 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🌡️ 温度
        </label>
        <div className="grid grid-cols-4 gap-2">
          {temperatures.map(temp => (
            <button
              key={temp.value}
              type="button"
              onClick={() => setFormData({ ...formData, temperature: temp.value as any })}
              className={`p-3 rounded-lg border transition-colors ${
                formData.temperature === temp.value
                  ? getTemperatureSelectedStyle(temp.color)
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="text-lg mb-1">{temp.emoji}</div>
              <div className="text-xs font-medium">{temp.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 拒否理由（完了率が低い場合） */}
      {formData.completion_percentage < 80 && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            ❌ 拒否・困難の理由
          </label>
          <div className="grid grid-cols-2 gap-2">
            {refusalReasons.map(reason => (
              <button
                key={reason}
                type="button"
                onClick={() => setFormData({ ...formData, refusal_reason: reason })}
                className={`p-2 text-sm rounded-lg border transition-colors ${
                  formData.refusal_reason === reason
                    ? 'border-red-500 bg-red-50 text-red-800'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {reason}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* メモ */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📝 詳細メモ（任意）
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="水分摂取の詳細な様子、むせの有無、好みの変化など..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={3}
        />
      </div>

      {/* 保存ボタン */}
      <div className="sticky bottom-0 bg-gray-50 p-4 -mx-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            '水分摂取記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};
