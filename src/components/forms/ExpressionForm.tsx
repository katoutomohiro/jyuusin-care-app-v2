import React, { useState } from 'react';

interface ExpressionFormProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

export const ExpressionForm: React.FC<ExpressionFormProps> = ({ onSave, isSubmitting }) => {
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
    expression_type: 'happy',
    intensity: 3,
    triggers: [] as string[],
    duration_minutes: 5,
    context: '',
    notes: ''
  });

  const expressions = [
    { value: 'happy', label: '嬉しい', emoji: '😊', color: 'green' },
    { value: 'sad', label: '悲しい', emoji: '😢', color: 'blue' },
    { value: 'angry', label: '怒り', emoji: '😠', color: 'red' },
    { value: 'calm', label: '穏やか', emoji: '😌', color: 'purple' },
    { value: 'excited', label: '興奮', emoji: '🤩', color: 'orange' },
    { value: 'anxious', label: '不安', emoji: '😰', color: 'yellow' },
    { value: 'neutral', label: '普通', emoji: '😐', color: 'gray' },
    { value: 'pain', label: '痛み', emoji: '😣', color: 'red' }
  ];

  const commonTriggers = [
    '音楽', '歌声', '食事', '入浴', '散歩', '活動参加',
    '職員との関わり', '他利用者との関わり', '家族の面会',
    '体調不良', '環境変化', '騒音', '人の移動',
    '天候変化', '薬の副作用', '便秘', '眠気'
  ];

  const contexts = [
    '食事中', '入浴中', '活動中', '休憩中', '移動中',
    '医療処置中', '清拭中', '更衣中', '排泄介助中',
    '自由時間', '面会中', 'その他'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getIntensityColor = (level: number) => {
    const colors = ['bg-gray-200', 'bg-blue-200', 'bg-green-300', 'bg-yellow-400', 'bg-red-500'];
    return colors[level - 1] || 'bg-gray-200';
  };

  const getIntensityLabel = (level: number) => {
    const labels = ['とても弱い', '弱い', '普通', '強い', 'とても強い'];
    return labels[level - 1] || '普通';
  };

  const setCurrentTime = () => {
    const exactNow = getCurrentDateTime();
    setFormData({ ...formData, event_timestamp: exactNow });
    console.log('現在時刻を設定:', new Date().toLocaleString('ja-JP'));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 観察時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏰ 表情・気分観察時刻 *
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

      {/* 表情・感情の種類 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          😊 表情・感情の種類
        </label>
        <div className="grid grid-cols-2 gap-3">
          {expressions.map(expr => (
            <button
              key={expr.value}
              type="button"
              onClick={() => setFormData({ ...formData, expression_type: expr.value })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.expression_type === expr.value
                  ? `border-${expr.color}-500 bg-${expr.color}-50 shadow-md`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{expr.emoji}</div>
              <div className="text-sm font-medium text-gray-800">{expr.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 強さ・明確さ */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📊 表情の明確さ・強さ
        </label>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>わずか</span>
            <span>とても明確</span>
          </div>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData({ ...formData, intensity: level })}
                className={`flex-1 h-16 rounded-lg border-2 font-bold transition-all ${
                  formData.intensity === level
                    ? `border-blue-500 ${getIntensityColor(level)} text-white shadow-md`
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                }`}
              >
                <div className="text-lg">{level}</div>
              </button>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600 mt-2">
            現在の選択: <span className="font-semibold">{getIntensityLabel(formData.intensity)}</span>
          </div>
        </div>
      </div>

      {/* 持続時間 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏱️ 持続時間
        </label>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, duration_minutes: Math.max(1, formData.duration_minutes - 1) })}
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold hover:bg-gray-300"
          >
            −
          </button>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-gray-800">{formData.duration_minutes}</div>
            <div className="text-sm text-gray-600">分</div>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, duration_minutes: formData.duration_minutes + 1 })}
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold hover:bg-gray-300"
          >
            ＋
          </button>
        </div>
        <div className="mt-3 flex space-x-2 flex-wrap gap-2">
          {[1, 5, 10, 15, 30, 60].map(minutes => (
            <button
              key={minutes}
              type="button"
              onClick={() => setFormData({ ...formData, duration_minutes: minutes })}
              className={`px-3 py-1 rounded text-sm ${
                formData.duration_minutes === minutes 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {minutes}分
            </button>
          ))}
        </div>
      </div>

      {/* きっかけ・誘因 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🎯 きっかけ・誘因（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {commonTriggers.map(trigger => (
            <button
              key={trigger}
              type="button"
              onClick={() => {
                const newTriggers = formData.triggers.includes(trigger)
                  ? formData.triggers.filter(t => t !== trigger)
                  : [...formData.triggers, trigger];
                setFormData({ ...formData, triggers: newTriggers });
              }}
              className={`p-2 text-sm rounded-lg border transition-colors ${
                formData.triggers.includes(trigger)
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {trigger}
            </button>
          ))}
        </div>
      </div>

      {/* 状況・文脈 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📍 観察時の状況
        </label>
        <div className="grid grid-cols-3 gap-2">
          {contexts.map(context => (
            <button
              key={context}
              type="button"
              onClick={() => setFormData({ ...formData, context })}
              className={`p-2 text-sm rounded-lg border transition-colors ${
                formData.context === context
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {context}
            </button>
          ))}
        </div>
      </div>

      {/* メモ */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📝 詳細メモ（任意）
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="表情の詳細な様子、背景、他の職員との申し送り事項など..."
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
            '表情記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};
export default ExpressionForm;
