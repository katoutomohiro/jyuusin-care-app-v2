import React, { useState } from 'react';

interface TubeFeedingFormProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

export const TubeFeedingForm: React.FC<TubeFeedingFormProps> = ({ onSave, isSubmitting }) => {
  // 正確な現在時刻を取得する関数
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    event_timestamp: getCurrentDateTime(),
    feeding_type: '', // 'gastrostomy' | 'jejunostomy' | 'nasal' | 'peg'
    formula_brand: '', // 銘柄
    amount: '',
    infusion_method: '', // 'bolus' | 'continuous'
    infusion_rate: '', // ml/min
    pre_care: [] as string[], // 前処置
    position: '', // 体位
    complications: [] as string[], // 合併症
    post_care: [] as string[], // 後処置
    notes: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  // 経管栄養の種類
  const feedingTypes = [
    { value: 'gastrostomy', label: '🫗 胃瘻' },
    { value: 'jejunostomy', label: '🫗 腸瘻' }, 
    { value: 'nasal', label: '👃 経鼻経管' },
    { value: 'peg', label: '🔌 PEG' }
  ];

  // 栄養剤銘柄
  const formulaBrands = [
    { value: 'ensure_liquid', label: 'エンシュア・リキッド' },
    { value: 'racol_nf', label: 'ラコールNF' },
    { value: 'inoras', label: 'イノラス' },
    { value: 'peptisupport', label: 'ペプチサポート' },
    { value: 'meibalance', label: 'メイバランス' },
    { value: 'hine_e_gel', label: 'ハイネイーゲル' },
    { value: 'custom', label: 'その他・調整食品' }
  ];

  // 注入方法
  const infusionMethods = [
    { value: 'bolus', label: '💉 ボーラス（一回注入）' },
    { value: 'continuous', label: '🔄 持続注入' }
  ];

  // 前処置
  const preCareOptions = [
    { value: 'gastric_residual', label: '胃内容物確認' },
    { value: 'position_check', label: 'チューブ位置確認' },
    { value: 'flush_water', label: '白湯フラッシュ' },
    { value: 'warming', label: '栄養剤の加温' }
  ];

  // 体位
  const positions = [
    { value: 'semi_fowler', label: '🛏️ セミファウラー位' },
    { value: 'fowler', label: '🛏️ ファウラー位' },
    { value: 'left_side', label: '←️ 左側臥位' },
    { value: 'right_side', label: '→️ 右側臥位' },
    { value: 'sitting', label: '🪑 座位' }
  ];

  // 合併症
  const complications = [
    { value: 'aspiration', label: '💧 誤嚥' },
    { value: 'vomiting', label: '🤮 嘔吐' },
    { value: 'diarrhea', label: '💩 下痢' },
    { value: 'bloating', label: '🫃 腹部膨満' },
    { value: 'tube_block', label: '🚫 チューブ閉塞' },
    { value: 'leakage', label: '💧 漏れ' }
  ];

  // 後処置
  const postCareOptions = [
    { value: 'flush_water', label: '白湯フラッシュ' },
    { value: 'clamp_tube', label: 'チューブクランプ' },
    { value: 'position_maintain', label: '体位保持' },
    { value: 'observation', label: '経過観察' }
  ];

  // チェックボックス選択
  const handleCheckboxChange = (field: string, value: string) => {
    setFormData(prev => {
      const arr = Array.isArray(prev[field]) ? prev[field] : [];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter((v: string) => v !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // バリデーション
    if (!formData.feeding_type) {
      setErrorMsg('経管栄養の種類を選択してください');
      return;
    }
    if (!formData.formula_brand) {
      setErrorMsg('栄養剤の銘柄を選択してください');
      return;
    }
    if (!formData.amount) {
      setErrorMsg('注入量を入力してください');
      return;
    }

    const eventData = {
      ...formData,
      event_type: 'tube_feeding'
    };

    onSave(eventData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorMsg}
        </div>
      )}

      {/* 実施時刻 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          ⏰ 実施時刻 *
        </label>
        <input
          type="datetime-local"
          value={formData.event_timestamp}
          onChange={(e) => setFormData({ ...formData, event_timestamp: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* 経管栄養の種類 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          🫗 経管栄養の種類 *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {feedingTypes.map(type => (
            <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="feeding_type"
                value={type.value}
                checked={formData.feeding_type === type.value}
                onChange={(e) => setFormData({ ...formData, feeding_type: e.target.value })}
                className="form-radio"
              />
              <span className="text-sm">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 栄養剤銘柄 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          🥤 栄養剤銘柄 *
        </label>
        <select
          value={formData.formula_brand}
          onChange={(e) => setFormData({ ...formData, formula_brand: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">選択してください</option>
          {formulaBrands.map(brand => (
            <option key={brand.value} value={brand.value}>{brand.label}</option>
          ))}
        </select>
      </div>

      {/* 注入量 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          💧 注入量 (ml) *
        </label>
        <input
          type="number"
          min="1"
          max="1000"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="例: 200"
          required
        />
      </div>

      {/* 注入方法 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          💉 注入方法
        </label>
        <div className="space-y-2">
          {infusionMethods.map(method => (
            <label key={method.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="infusion_method"
                value={method.value}
                checked={formData.infusion_method === method.value}
                onChange={(e) => setFormData({ ...formData, infusion_method: e.target.value })}
                className="form-radio"
              />
              <span className="text-sm">{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 前処置 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          🔧 前処置（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {preCareOptions.map(care => (
            <label key={care.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.pre_care.includes(care.value)}
                onChange={() => handleCheckboxChange('pre_care', care.value)}
                className="form-checkbox"
              />
              <span className="text-sm">{care.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 体位 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          🛏️ 体位
        </label>
        <select
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">選択してください</option>
          {positions.map(pos => (
            <option key={pos.value} value={pos.value}>{pos.label}</option>
          ))}
        </select>
      </div>

      {/* メモ */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          📝 詳細メモ
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="栄養剤の詳細、注入時の様子、特記事項など..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={3}
        />
      </div>

      {/* 保存ボタン */}
      <div className="sticky bottom-0 bg-white p-4 -mx-4">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 rounded-lg shadow-lg transition-colors duration-150"
          disabled={isSubmitting}
        >
          {isSubmitting ? '保存中...' : '記録を保存する'}
        </button>
      </div>
    </form>
  );
};

export default TubeFeedingForm;
