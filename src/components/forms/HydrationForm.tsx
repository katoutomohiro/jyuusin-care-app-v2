import React, { useState } from 'react';
import { Fragment } from 'react';

interface HydrationFormProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

export const HydrationForm: React.FC<HydrationFormProps> = ({ onSave, isSubmitting }) => {
  // 正確な現在時刻を取得する関数
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  // 所要時間計測用
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  // フォームデータ
  const [formData, setFormData] = useState({
    event_timestamp: getCurrentDateTime(),
    intake_type: '',
    meal_content: '',
    texture: '',
    temperature: '',
    position: '',
    intake_method: [],
    assistance_level: '',
    appetite: '',
    swallowing: [],
    special_care: [],
    adverse_reaction: [],
    intervention: [],
    amount: [],
    duration: '',
    notes: ''
  });

  // ドロップダウン表示制御
  const [dropdown, setDropdown] = useState({
    intake_type: false,
    meal_content: false,
    texture: false,
    temperature: false,
    position: false,
    intake_method: false,
    assistance_level: false,
    appetite: false,
    swallowing: false,
    special_care: false,
    adverse_reaction: false,
    intervention: false,
    amount: false
  });

  // 選択肢リスト
  const intakeTypes = [
    { value: '', label: '選択してください' },
    { value: 'oral', label: '🍽️ 経口摂取' },
    { value: 'tube_nasal', label: '経鼻経管栄養注入' },
    { value: 'tube_gastrostomy', label: '経管胃ろう注入' },
    { value: 'tube_jejunostomy', label: '経管腸ろう注入' },
    { value: 'tube_peg', label: 'PEG注入' },
    { value: 'tube_ivh', label: 'IVH' },
    { value: 'iv', label: '💉 点滴' },
    { value: 'other', label: '📝 その他' }
  ];
  const mealContents = [
    { value: '', label: '選択してください' },
    { value: 'normal', label: '🍚 通常食' },
    { value: 'allergy', label: '⚠️ アレルギー対応' },
    { value: 'high_calorie', label: '🔥 高カロリー' },
    { value: 'low_salt', label: '🧂 減塩' },
    { value: 'liquid', label: '💧 流動食' },
    { value: 'supplement', label: '🥤 栄養補助' },
    { value: 'ensure_liquid', label: 'エンシュア・リキッド' },
    { value: 'racol_nf', label: 'ラコールNF' },
    { value: 'inoras', label: 'イノラス' },
    { value: 'glunol', label: 'グルノール' },
    { value: 'peptisupport', label: 'ペプチサポート' },
    { value: 'meibalance', label: 'メイバランス' },
    { value: 'hine_e_gel', label: 'ハイネイーゲル' },
    { value: 'actreat', label: 'アクトレート' },
    { value: 'fiberaid', label: 'ファイバーエイド' },
    { value: 'mixer_food', label: 'ミキサー食' },
    { value: 'snack', label: '🍪 間食' },
    { value: 'other', label: '📝 その他' }
  ];
  const textures = [
    { value: '', label: '選択してください' },
    { value: 'normal', label: '🍚 普通' },
    { value: 'soft', label: '🥣 軟菜' },
    { value: 'minced', label: '🔪 刻み' },
    { value: 'paste', label: '🍮 ペースト' },
    { value: 'gel', label: '🟣 ゼリー' },
    { value: 'liquid', label: '💧 液体' },
    { value: 'thickened', label: '🧊 トロミ' },
    { value: 'other', label: '📝 その他' }
  ];
  const temperatures = [
    { value: '', label: '選択してください' },
    { value: 'cold', label: '🧊 冷たい' },
    { value: 'room', label: '🌡️ 常温' },
    { value: 'warm', label: '♨️ ぬるい' },
    { value: 'hot', label: '🔥 温かい' }
  ];
  const positions = [
    { value: '', label: '選択してください' },
    { value: 'sitting', label: '🪑 坐位' },
    { value: 'semi_fowler', label: '🛏️ セミファウラー' },
    { value: 'fowler', label: '🛏️ ファウラー' },
    { value: 'lying', label: '🛌 仰臥位' },
    { value: 'side', label: '↔️ 側臥位' },
    { value: 'wheelchair', label: '🦽 車椅子' },
    { value: 'other', label: '📝 その他' }
  ];
  const intakeMethods = [
    { value: '', label: '選択してください' },
    { value: 'cup', label: '☕ コップ' },
    { value: 'straw', label: '🥤 ストロー' },
    { value: 'spoon', label: '🥄 スプーン' },
    { value: 'syringe', label: '💉 シリンジ' },
    { value: 'tube', label: '🧴 経管' },
    { value: 'hand', label: '✋ 手づかみ' },
    { value: 'other', label: '📝 その他' }
  ];
  const assistanceLevels = [
    { value: '', label: '選択してください' },
    { value: 'independent', label: '🟢 自立' },
    { value: 'verbal_cue', label: '🗣️ 声かけ' },
    { value: 'partial_assist', label: '🤝 部分介助' },
    { value: 'full_assist', label: '🟥 全介助' }
  ];
  const appetites = [
    { value: '', label: '選択してください' },
    { value: 'good', label: '😋 良好' },
    { value: 'normal', label: '🙂 普通' },
    { value: 'poor', label: '😑 不良' },
    { value: 'refusal', label: '🙅 拒否' }
  ];
  const swallowingStates = [
    { value: '', label: '選択してください' },
    { value: 'good', label: '👌 良好' },
    { value: 'slow', label: '🐢 ゆっくり' },
    { value: 'cough', label: '😮‍💨 咳・むせ' },
    { value: 'residue', label: '🍚 残留感' },
    { value: 'aspiration', label: '💧 誤嚥疑い' },
    { value: 'other', label: '📝 その他' }
  ];
  const specialCares = [
    { value: '', label: '選択してください' },
    { value: 'posture', label: '🛏️ 姿勢保持' },
    { value: 'slow_feed', label: '🐢 ゆっくり摂取' },
    { value: 'small_amount', label: '🥄 少量ずつ' },
    { value: 'thickener', label: '🧊 トロミ追加' },
    { value: 'oral_care', label: '🦷 口腔ケア' },
    { value: 'monitoring', label: '👀 観察強化' },
    { value: 'other', label: '📝 その他' }
  ];
  const adverseReactions = [
    { value: '', label: '選択してください' },
    { value: 'cough', label: '😮‍💨 咳・むせ' },
    { value: 'vomit', label: '🤮 嘔吐' },
    { value: 'cyanosis', label: '💙 チアノーゼ' },
    { value: 'fever', label: '🌡️ 発熱' },
    { value: 'pain', label: '😣 痛み' },
    { value: 'rash', label: '🌺 発疹' },
    { value: 'other', label: '📝 その他' }
  ];
  const interventions = [
    { value: '', label: '選択してください' },
    { value: 'none', label: '👌 介入不要' },
    { value: 'observation', label: '👀 経過観察' },
    { value: 'oral_care', label: '🦷 口腔ケア' },
    { value: 'suction', label: '🧹 吸引' },
    { value: 'oxygen', label: '🫁 酸素投与' },
    { value: 'doctor', label: '📞 医師連絡' },
    { value: 'emergency', label: '🚑 緊急対応' },
    { value: 'other', label: '📝 その他' }
  ];
  // 重症心身障害児者向け摂取量15項目
  const intakeAmounts = [
    { value: '', label: '選択してください' },
    { value: '5', label: '5ml' },
    { value: '10', label: '10ml' },
    { value: '15', label: '15ml' },
    { value: '20', label: '20ml' },
    { value: '25', label: '25ml' },
    { value: '30', label: '30ml' },
    { value: '40', label: '40ml' },
    { value: '50', label: '50ml' },
    { value: '60', label: '60ml' },
    { value: '75', label: '75ml' },
    { value: '100', label: '100ml' },
    { value: '120', label: '120ml' },
    { value: '150', label: '150ml' },
    { value: '200', label: '200ml' },
    { value: 'other', label: '📝 その他' }
  ];

  // 所要時間計測
  const handleStart = () => {
    setStartTime(new Date());
    setDuration(null);
  };
  const handleStop = () => {
    if (startTime) {
      const end = new Date();
      const diff = Math.round((end.getTime() - startTime.getTime()) / 1000);
      setDuration(diff);
      setFormData({ ...formData, duration: `${diff}秒` });
    }
  };

  // 複数選択用（チェックボックス）
  const handleMultiSelect = (field: string, value: string) => {
    setFormData(prev => {
      const arr = Array.isArray(prev[field]) ? prev[field] : [];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter((v: string) => v !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };
  // 単一選択用（ラジオボタン）
  const handleSingleSelect = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setDropdown(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // amount, intake_method, swallowing, special_care, adverse_reaction, interventionは配列で保存
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 摂取時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏰ 摂取時刻 *
        </label>
        <div className="flex space-x-2">
          <input
            type="datetime-local"
            value={formData.event_timestamp}
            onChange={(e) => setFormData({ ...formData, event_timestamp: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            required
          />
        </div>
      </div>

      {/* 🍽️ 摂取タイプ（カスタムセレクトドロップダウン） */}
      <div className="bg-white rounded-xl p-4 shadow-sm relative">
        <label className="block font-semibold mb-2">🍽️ 摂取タイプ *</label>
        <button type="button" className="w-full border rounded p-2 text-base bg-gray-100 text-gray-700" onClick={() => setDropdown(prev => ({ ...prev, intake_type: !prev.intake_type }))}>
          {formData.intake_type ? intakeTypes.find(opt => opt.value === formData.intake_type)?.label : '選択してください'}
        </button>
        {dropdown.intake_type && (
          <div className="absolute z-10 bg-white border rounded shadow-lg w-full mt-2">
            {intakeTypes.filter(opt => opt.value !== '').map(opt => (
              <div
                key={opt.value}
                className={`p-2 rounded cursor-pointer flex items-center transition-colors ${formData.intake_type === opt.value ? 'bg-blue-100 font-bold text-blue-700' : 'hover:bg-blue-50'}`}
                onClick={() => handleSingleSelect('intake_type', opt.value)}
              >
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🥄 食事内容（カスタムセレクトドロップダウン） */}
      <div className="bg-white rounded-xl p-4 shadow-sm relative">
        <label className="block font-semibold mb-2">🥄 食事内容</label>
        <button type="button" className="w-full border rounded p-2 text-base bg-gray-100 text-gray-700" onClick={() => setDropdown(prev => ({ ...prev, meal_content: !prev.meal_content }))}>
          {formData.meal_content ? mealContents.find(opt => opt.value === formData.meal_content)?.label : '選択してください'}
        </button>
        {dropdown.meal_content && (
          <div className="absolute z-10 bg-white border rounded shadow-lg w-full mt-2">
            {mealContents.filter(opt => opt.value !== '').map(opt => (
              <div
                key={opt.value}
                className={`p-2 rounded cursor-pointer flex items-center transition-colors ${formData.meal_content === opt.value ? 'bg-blue-100 font-bold text-blue-700' : 'hover:bg-blue-50'}`}
                onClick={() => handleSingleSelect('meal_content', opt.value)}
              >
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🥣 食事形態・テクスチャー（カスタムセレクトドロップダウン） */}
      <div className="bg-white rounded-xl p-4 shadow-sm relative">
        <label className="block font-semibold mb-2">🥣 食事形態・テクスチャー</label>
        <button type="button" className="w-full border rounded p-2 text-base bg-gray-100 text-gray-700" onClick={() => setDropdown(prev => ({ ...prev, texture: !prev.texture }))}>
          {formData.texture ? textures.find(opt => opt.value === formData.texture)?.label : '選択してください'}
        </button>
        {dropdown.texture && (
          <div className="absolute z-10 bg-white border rounded shadow-lg w-full mt-2">
            {textures.filter(opt => opt.value !== '').map(opt => (
              <div
                key={opt.value}
                className={`p-2 rounded cursor-pointer flex items-center transition-colors ${formData.texture === opt.value ? 'bg-blue-100 font-bold text-blue-700' : 'hover:bg-blue-50'}`}
                onClick={() => handleSingleSelect('texture', opt.value)}
              >
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🌡️ 摂取温度（カスタムセレクトドロップダウン） */}
      <div className="bg-white rounded-xl p-4 shadow-sm relative">
        <label className="block font-semibold mb-2">🌡️ 摂取温度</label>
        <button type="button" className="w-full border rounded p-2 text-base bg-gray-100 text-gray-700" onClick={() => setDropdown(prev => ({ ...prev, temperature: !prev.temperature }))}>
          {formData.temperature ? temperatures.find(opt => opt.value === formData.temperature)?.label : '選択してください'}
        </button>
        {dropdown.temperature && (
          <div className="absolute z-10 bg-white border rounded shadow-lg w-full mt-2">
            {temperatures.filter(opt => opt.value !== '').map(opt => (
              <div
                key={opt.value}
                className={`p-2 rounded cursor-pointer flex items-center transition-colors ${formData.temperature === opt.value ? 'bg-blue-100 font-bold text-blue-700' : 'hover:bg-blue-50'}`}
                onClick={() => handleSingleSelect('temperature', opt.value)}
              >
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🛏️ 摂取時の体位（カスタムセレクトドロップダウン） */}
      <div className="bg-white rounded-xl p-4 shadow-sm relative">
        <label className="block font-semibold mb-2">🛏️ 摂取時の体位</label>
        <button type="button" className="w-full border rounded p-2 text-base bg-gray-100 text-gray-700" onClick={() => setDropdown(prev => ({ ...prev, position: !prev.position }))}>
          {formData.position ? positions.find(opt => opt.value === formData.position)?.label : '選択してください'}
        </button>
        {dropdown.position && (
          <div className="absolute z-10 bg-white border rounded shadow-lg w-full mt-2">
            {positions.filter(opt => opt.value !== '').map(opt => (
              <div
                key={opt.value}
                className={`p-2 rounded cursor-pointer flex items-center transition-colors ${formData.position === opt.value ? 'bg-blue-100 font-bold text-blue-700' : 'hover:bg-blue-50'}`}
                onClick={() => handleSingleSelect('position', opt.value)}
              >
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🥄 摂取方法（カスタムセレクトドロップダウン・複数選択） */}
      <div className="bg-white rounded-xl p-4 shadow-sm relative">
        <label className="block font-semibold mb-2">🥄 摂取方法（複数選択可）</label>
        <button type="button" className="w-full border rounded p-2 text-base bg-gray-100 text-gray-700" onClick={() => setDropdown(prev => ({ ...prev, intake_method: !prev.intake_method }))}>
          {formData.intake_method.length > 0 ? formData.intake_method.map(val => intakeMethods.find(opt => opt.value === val)?.label).join(', ') : '選択してください'}
        </button>
        {dropdown.intake_method && (
          <div className="absolute z-10 bg-white border rounded shadow-lg w-full mt-2 max-h-60 overflow-y-auto">
            {intakeMethods.filter(opt => opt.value !== '').map(opt => (
              <div
                key={opt.value}
                className={`p-2 rounded cursor-pointer flex items-center transition-colors ${formData.intake_method.includes(opt.value) ? 'bg-blue-100 font-bold text-blue-700' : 'hover:bg-blue-50'}`}
                onClick={() => handleMultiSelect('intake_method', opt.value)}
              >
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🤝 介助レベル（カスタムセレクトドロップダウン） */}
      <div className="bg-white rounded-xl p-4 shadow-sm relative">
        <label className="block font-semibold mb-2">🤝 介助レベル</label>
        <button type="button" className="w-full border rounded p-2 text-base bg-gray-100 text-gray-700" onClick={() => setDropdown(prev => ({ ...prev, assistance_level: !prev.assistance_level }))}>
          {formData.assistance_level ? assistanceLevels.find(opt => opt.value === formData.assistance_level)?.label : '選択してください'}
        </button>
        {dropdown.assistance_level && (
          <div className="absolute z-10 bg-white border rounded shadow-lg w-full mt-2">
            {assistanceLevels.filter(opt => opt.value !== '').map(opt => (
              <div
                key={opt.value}
                className={`p-2 rounded cursor-pointer flex items-center transition-colors ${formData.assistance_level === opt.value ? 'bg-blue-100 font-bold text-blue-700' : 'hover:bg-blue-50'}`}
                onClick={() => handleSingleSelect('assistance_level', opt.value)}
              >
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 😋 食欲状態（カスタムセレクトドロップダウン） */}
      <div className="bg-white rounded-xl p-4 shadow-sm relative">
        <label className="block font-semibold mb-2">😋 食欲状態</label>
        <button type="button" className="w-full border rounded p-2 text-base bg-gray-100 text-gray-700" onClick={() => setDropdown(prev => ({ ...prev, appetite: !prev.appetite }))}>
          {formData.appetite ? appetites.find(opt => opt.value === formData.appetite)?.label : '選択してください'}
        </button>
        {dropdown.appetite && (
          <div className="absolute z-10 bg-white border rounded shadow-lg w-full mt-2">
            {appetites.filter(opt => opt.value !== '').map(opt => (
              <div
                key={opt.value}
                className={`p-2 rounded cursor-pointer flex items-center transition-colors ${formData.appetite === opt.value ? 'bg-blue-100 font-bold text-blue-700' : 'hover:bg-blue-50'}`}
                onClick={() => handleSingleSelect('appetite', opt.value)}
              >
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 👄 嚥下状態（カスタムセレクトドロップダウン・複数選択） */}
      <div className="bg-white rounded-xl p-4 shadow-sm relative">
        <label className="block font-semibold mb-2">👄 嚥下状態（複数選択可）</label>
        <button type="button" className="w-full border rounded p-2 text-base bg-gray-100 text-gray-700" onClick={() => setDropdown(prev => ({ ...prev, swallowing: !prev.swallowing }))}>
          {formData.swallowing.length > 0 ? formData.swallowing.map(val => swallowingStates.find(opt => opt.value === val)?.label).join(', ') : '選択してください'}
        </button>
        {dropdown.swallowing && (
          <div className="absolute z-10 bg-white border rounded shadow-lg w-full mt-2 max-h-60 overflow-y-auto">
            {swallowingStates.filter(opt => opt.value !== '').map(opt => (
              <div
                key={opt.value}
                className={`p-2 rounded cursor-pointer flex items-center transition-colors ${formData.swallowing.includes(opt.value) ? 'bg-blue-100 font-bold text-blue-700' : 'hover:bg-blue-50'}`}
                onClick={() => handleMultiSelect('swallowing', opt.value)}
              >
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ⚠️ 特別な配慮（カスタムセレクトドロップダウン・複数選択） */}
      <div className="bg-white rounded-xl p-4 shadow-sm relative">
        <label className="block font-semibold mb-2">⚠️ 特別な配慮（複数選択可）</label>
        <button type="button" className="w-full border rounded p-2 text-base bg-gray-100 text-gray-700" onClick={() => setDropdown(prev => ({ ...prev, special_care: !prev.special_care }))}>
          {formData.special_care.length > 0 ? formData.special_care.map(val => specialCares.find(opt => opt.value === val)?.label).join(', ') : '選択してください'}
        </button>
        {dropdown.special_care && (
          <div className="absolute z-10 bg-white border rounded shadow-lg w-full mt-2 max-h-60 overflow-y-auto">
            {specialCares.filter(opt => opt.value !== '').map(opt => (
              <div
                key={opt.value}
                className={`p-2 rounded cursor-pointer flex items-center transition-colors ${formData.special_care.includes(opt.value) ? 'bg-blue-100 font-bold text-blue-700' : 'hover:bg-blue-50'}`}
                onClick={() => handleMultiSelect('special_care', opt.value)}
              >
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🚨 有害反応（カスタムセレクトドロップダウン・複数選択） */}
      <div className="bg-white rounded-xl p-4 shadow-sm relative">
        <label className="block font-semibold mb-2">🚨 有害反応（複数選択可）</label>
        <button type="button" className="w-full border rounded p-2 text-base bg-gray-100 text-gray-700" onClick={() => setDropdown(prev => ({ ...prev, adverse_reaction: !prev.adverse_reaction }))}>
          {formData.adverse_reaction.length > 0 ? formData.adverse_reaction.map(val => adverseReactions.find(opt => opt.value === val)?.label).join(', ') : '選択してください'}
        </button>
        {dropdown.adverse_reaction && (
          <div className="absolute z-10 bg-white border rounded shadow-lg w-full mt-2 max-h-60 overflow-y-auto">
            {adverseReactions.filter(opt => opt.value !== '').map(opt => (
              <div
                key={opt.value}
                className={`p-2 rounded cursor-pointer flex items-center transition-colors ${formData.adverse_reaction.includes(opt.value) ? 'bg-blue-100 font-bold text-blue-700' : 'hover:bg-blue-50'}`}
                onClick={() => handleMultiSelect('adverse_reaction', opt.value)}
              >
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🛠️ 介入の必要性（カスタムセレクトドロップダウン・複数選択） */}
      <div className="bg-white rounded-xl p-4 shadow-sm relative">
        <label className="block font-semibold mb-2">🛠️ 介入の必要性（複数選択可）</label>
        <button type="button" className="w-full border rounded p-2 text-base bg-gray-100 text-gray-700" onClick={() => setDropdown(prev => ({ ...prev, intervention: !prev.intervention }))}>
          {formData.intervention.length > 0 ? formData.intervention.map(val => interventions.find(opt => opt.value === val)?.label).join(', ') : '選択してください'}
        </button>
        {dropdown.intervention && (
          <div className="absolute z-10 bg-white border rounded shadow-lg w-full mt-2 max-h-60 overflow-y-auto">
            {interventions.filter(opt => opt.value !== '').map(opt => (
              <div
                key={opt.value}
                className={`p-2 rounded cursor-pointer flex items-center transition-colors ${formData.intervention.includes(opt.value) ? 'bg-blue-100 font-bold text-blue-700' : 'hover:bg-blue-50'}`}
                onClick={() => handleMultiSelect('intervention', opt.value)}
              >
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📏 摂取量（カスタムセレクトドロップダウン・複数選択） */}
      <div className="bg-white rounded-xl p-4 shadow-sm relative">
        <label className="block font-semibold mb-2">📏 摂取量（複数選択可）</label>
        <button type="button" className="w-full border rounded p-2 text-base bg-gray-100 text-gray-700" onClick={() => setDropdown(prev => ({ ...prev, amount: !prev.amount }))}>
          {formData.amount.length > 0 ? formData.amount.map(val => intakeAmounts.find(opt => opt.value === val)?.label).join(', ') : '選択してください'}
        </button>
        {dropdown.amount && (
          <div className="absolute z-10 bg-white border rounded shadow-lg w-full mt-2 max-h-60 overflow-y-auto">
            {intakeAmounts.filter(opt => opt.value !== '').map(opt => (
              <div
                key={opt.value}
                className={`p-2 rounded cursor-pointer flex items-center transition-colors ${formData.amount.includes(opt.value) ? 'bg-blue-100 font-bold text-blue-700' : 'hover:bg-blue-50'}`}
                onClick={() => handleMultiSelect('amount', opt.value)}
              >
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ⏱️ 所要時間（ワンクリック計測） */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block font-semibold mb-2">⏱️ 所要時間</label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => {
              if (!startTime) {
                setStartTime(new Date());
                setDuration(null);
              } else {
                const end = new Date();
                const diff = Math.round((end.getTime() - startTime.getTime()) / 1000);
                setDuration(diff);
                setFormData({ ...formData, duration: `${diff}秒` });
                setStartTime(null);
              }
            }}
            className={`px-4 py-2 rounded font-semibold text-white ${!startTime ? 'bg-blue-500' : 'bg-green-500'}`}
          >
            {!startTime ? '食事開始' : '食事終了'}
          </button>
          <span className="ml-4 text-lg font-bold">
            {duration !== null ? `所要時間: ${duration}秒` : ''}
          </span>
        </div>
      </div>

      {/* メモ */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📝 詳細メモ（任意）
        </label>
        <textarea
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          placeholder="食事・水分摂取の詳細な様子、むせの有無、好みの変化など..."
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
            '食事・水分摂取記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};
