import * as React from "react"; const C: React.FC<any> = () => null; export default C;
import React, { useState } from 'react';

interface ExpressionFormProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

// 表情・感情の種類（単一選択）
const EXPRESSION_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: 'smile', label: '😊 笑顔' },
  { value: 'cry', label: '😭 泣く' },
  { value: 'pain', label: '😣 痛み' },
  { value: 'anxiety', label: '😰 不安' },
  { value: 'anger', label: '😠 怒り' },
  { value: 'surprise', label: '😲 驚き' },
  { value: 'calm', label: '😌 穏やか' },
  { value: 'sleepy', label: '😪 眠気' },
  { value: 'no_expression', label: '😐 無表情' },
  { value: 'refusal', label: '🙅 拒否' },
  { value: 'excited', label: '🤩 興奮' },
  { value: 'relaxed', label: '😴 リラックス' },
  { value: 'confused', label: '😕 混乱' },
  { value: 'tense', label: '😬 緊張' },
  { value: 'pre_seizure', label: '⚡ 発作前兆' },
  { value: 'other', label: '📝 その他' },
];

// きっかけ・誘因（単一選択・重症心身障害児者に特化・最新15項目例）
const TRIGGER_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: 'pain', label: '痛み・不快感' },
  { value: 'position_change', label: '体位変換・移乗' },
  { value: 'suction', label: '吸引・口腔ケア' },
  { value: 'tube_feeding', label: '経管栄養・注入' },
  { value: 'medication', label: '服薬・注射' },
  { value: 'noise', label: '騒音・大きな音' },
  { value: 'light', label: '強い光・まぶしさ' },
  { value: 'temperature', label: '室温・寒暖差' },
  { value: 'crowd', label: '人混み・来客' },
  { value: 'family', label: '家族・面会' },
  { value: 'staff', label: '職員の声かけ・接触' },
  { value: 'other_users', label: '他利用者の行動' },
  { value: 'medical_exam', label: '医療的処置・診察' },
  { value: 'hunger', label: '空腹・食事前後' },
  { value: 'other', label: '📝 その他' },
];

// 観察の状況（単一選択・重症心身障害児者に特化・最新15項目例）
const CONTEXT_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: 'meal', label: '食事中・食事直後' },
  { value: 'tube_feeding', label: '経管栄養中' },
  { value: 'bathing', label: '入浴・清拭中' },
  { value: 'toileting', label: '排泄・おむつ交換中' },
  { value: 'transfer', label: '移乗・体位変換中' },
  { value: 'rest', label: '安静・休憩中' },
  { value: 'activity', label: '活動・レクリエーション中' },
  { value: 'medical', label: '医療的ケア中' },
  { value: 'family', label: '家族・面会中' },
  { value: 'outdoor', label: '外出・散歩中' },
  { value: 'sleep', label: '睡眠・起床時' },
  { value: 'group', label: '集団活動中' },
  { value: 'alone', label: '一人で過ごしている時' },
  { value: 'other', label: '📝 その他' },
];

const ExpressionForm: React.FC<ExpressionFormProps> = ({ onSave, isSubmitting }) => {
  const [selected, setSelected] = useState('');
  const [otherText, setOtherText] = useState('');
    const [intensity, setIntensity] = useState(0);
  const [trigger, setTrigger] = useState('');
  const [triggerOther, setTriggerOther] = useState('');
  const [context, setContext] = useState('');
  const [contextOther, setContextOther] = useState('');
  const [notes, setNotes] = useState('');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };

  const handleTriggerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTrigger(e.target.value);
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setContext(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      expression: selected,
      otherText: selected === 'other' ? otherText : '',
      intensity,
      trigger,
      triggerOther: trigger === 'other' ? triggerOther : '',
      context,
      contextOther: context === 'other' ? contextOther : '',
      notes,
    });
    setSelected('');
    setOtherText('');
    setIntensity(3);
    setTrigger('');
    setTriggerOther('');
    setContext('');
    setContextOther('');
    setNotes('');
  };

  return (
  <form onSubmit={handleSubmit} className="space-y-6" style={{ display: 'none' }}>
      {/* 表情・感情の種類 */}
      <div>
        <label className="block font-semibold mb-2">
          表情・感情の種類
        </label>
        <select
          value={selected}
          onChange={handleSelectChange}
          className="w-full border rounded p-2 text-base"
        >
          {EXPRESSION_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {selected === 'other' && (
          <div className="mt-2">
            <input
              type="text"
              value={otherText}
              onChange={e => setOtherText(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="その他の内容を入力"
            />
          </div>
        )}
      </div>
      {/* 表情の強さ */}
      <div>
        <label className="block font-semibold mb-2">表情の強さ</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map(level => (
            <button
              key={level}
              type="button"
              onClick={() => setIntensity(level)}
              className={`flex-1 h-12 rounded-lg border-2 font-bold transition-all
                ${intensity === level
                  ? 'border-blue-500 bg-blue-100 text-blue-900 shadow-md'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'}
              `}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="text-center text-sm text-gray-600 mt-2">
          現在の選択: <span className="font-semibold">
            {['とても弱い', '弱い', '普通', '強い', 'とても強い'][intensity - 1]}
          </span>
        </div>
      </div>
      {/* きっかけ・誘因 */}
      <div>
        <label className="block font-semibold mb-2">
          きっかけ・誘因（単一選択）
        </label>
        <select
          value={trigger}
          onChange={handleTriggerChange}
          className="w-full border rounded p-2 text-base"
        >
          {TRIGGER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {trigger === 'other' && (
          <div className="mt-2">
            <input
              type="text"
              value={triggerOther}
              onChange={e => setTriggerOther(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="その他の内容を入力"
            />
          </div>
        )}
      </div>
      {/* 観察の状況 */}
      <div>
        <label className="block font-semibold mb-2">
          観察の状況（単一選択）
        </label>
        <select
          value={context}
          onChange={handleContextChange}
          className="w-full border rounded p-2 text-base"
        >
          {CONTEXT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {context === 'other' && (
          <div className="mt-2">
            <input
              type="text"
              value={contextOther}
              onChange={e => setContextOther(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="その他の内容を入力"
            />
          </div>
        )}
      </div>
      {/* 詳細メモ */}
      <div>
        <label className="block font-semibold mb-2">詳細メモ（任意）</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="表情・反応の詳細、観察時の状況、申し送り事項など"
          className="w-full border rounded p-2 min-h-[60px]"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold w-full text-lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? '保存中...' : '表情記録を保存'}
      </button>
    </form>
  );
};

const ExpressionForm: React.FC<any> = () => null;
export default ExpressionForm;
export default ExpressionForm;