import * as React from "react"; 
const C: React.FC<any> = () => null; export default C;
import * as React from 'react';
/** dev adapter: keep legacy import name; replaced later by real VitalsForm */
const VitalSignsInput: React.FC<any> = () => null;
export default VitalSignsInput;

// The rest of the original file content is removed for brevity.
import React, { useState } from 'react';

interface VitalSignsInputProps {
  onSave?: (data: any) => void; // 型安全バイパス
  isSubmitting?: boolean;
}

const measurementPositions = [
  '仰臥位',
  '側臥位（右）',
  '側臥位（左）',
  '半坐位',
  '坐位',
  '車椅子坐位',
  '抱っこ',
  'ベッドアップ30度',
  'ベッドアップ45度',
  'ベッドアップ60度',
  '立位',
  '歩行中',
  'その他'
];

const measurementLocations = [
  '腋窩',
  '口腔',
  '直腸',
  '耳介',
  '皮膚',
  '手指',
  '足趾',
  'その他'
];

const VitalSignsInput: React.FC<VitalSignsInputProps> = ({ onSave, isSubmitting }) => {
  // 正確な現在時刻を取得する関数
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  // 絵文字付き選択肢（単一選択用）
  const measurementConditions = [
    { value: '', label: '選択してください' },
    { value: 'rest', label: '🛌 安静時' },
    { value: 'after_activity', label: '🏃 活動後' },
    { value: 'before_meal', label: '🍽️ 食事前' },
    { value: 'after_meal', label: '🍚 食事後' },
    { value: 'after_bath', label: '🛁 入浴後' },
    { value: 'after_suction', label: '🧹 吸引後' },
    { value: 'after_transfer', label: '🔄 体位変換後' },
    { value: 'after_medication', label: '💊 投薬後' },
    { value: 'after_tube_feeding', label: '🥤 経管栄養後' },
    { value: 'after_excretion', label: '🚽 排泄後' },
    { value: 'after_family_visit', label: '👪 家族面会後' },
    { value: 'after_outdoor', label: '🌳 外出後' },
    { value: 'after_sleep', label: '😴 睡眠後' },
    { value: 'other', label: '📝 その他' },
  ];

  const vitalStatusOptions = [
    { value: '', label: '選択してください' },
    { value: 'stable', label: '🟢 安定' },
    { value: 'slightly_high', label: '🟡 やや高値' },
    { value: 'slightly_low', label: '🟡 やや低値' },
    { value: 'high', label: '🔴 高値' },
    { value: 'low', label: '🔵 低値' },
    { value: 'irregular', label: '⚠️ 不整脈' },
    { value: 'tachycardia', label: '💓 頻脈' },
    { value: 'bradycardia', label: '💙 徐脈' },
    { value: 'desaturation', label: '🫁 低酸素' },
    { value: 'fever', label: '🌡️ 発熱' },
    { value: 'hypothermia', label: '❄️ 低体温' },
    { value: 'respiratory_distress', label: '😮‍💨 呼吸苦' },
    { value: 'cyanosis', label: '💙 チアノーゼ' },
    { value: 'other', label: '📝 その他' },
  ];

  const specialFindings = [
    { value: '', label: '選択してください' },
    { value: 'seizure', label: '⚡ 発作' },
    { value: 'spasm', label: '🦵 痙攣' },
    { value: 'vomiting', label: '🤮 嘔吐' },
    { value: 'aspiration', label: '💧 誤嚥' },
    { value: 'bleeding', label: '🩸 出血' },
    { value: 'rash', label: '🌺 発疹' },
    { value: 'swelling', label: '💧 浮腫' },
    { value: 'pain', label: '😣 痛み' },
    { value: 'wheezing', label: '🌬️ 喘鳴' },
    { value: 'sweating', label: '💦 発汗' },
    { value: 'cyanosis', label: '💙 チアノーゼ' },
    { value: 'unusual_color', label: '🎨 異常な皮膚色' },
    { value: 'unusual_odor', label: '👃 異臭' },
    { value: 'other', label: '📝 その他' },
  ];

  const interventionOptions = [
    { value: '', label: '選択してください' },
    { value: 'none', label: '👌 介入不要' },
    { value: 'observation', label: '👀 経過観察' },
    { value: 'oral_care', label: '🦷 口腔ケア' },
    { value: 'suction', label: '🧹 吸引' },
    { value: 'oxygen', label: '🫁 酸素投与' },
    { value: 'medication', label: '💊 投薬' },
    { value: 'positioning', label: '🔄 体位調整' },
    { value: 'cooling', label: '❄️ 冷却' },
    { value: 'warming', label: '🔥 保温' },
    { value: 'hydration', label: '🥤 水分補給' },
    { value: 'doctor_call', label: '📞 医師連絡' },
    { value: 'emergency', label: '🚑 緊急対応' },
    { value: 'family_contact', label: '👪 家族連絡' },
    { value: 'other', label: '📝 その他' },
  ];

  const commonNotes = [
    { value: '', label: '選択してください' },
    { value: 'usual', label: '🟢 いつも通り' },
    { value: 'sleepy', label: '😪 眠そう' },
    { value: 'irritable', label: '😠 不機嫌' },
    { value: 'active', label: '🏃 活動的' },
    { value: 'quiet', label: '🤫 静か' },
    { value: 'crying', label: '😭 泣いている' },
    { value: 'smiling', label: '😊 笑顔多い' },
    { value: 'no_appetite', label: '🍽️ 食欲なし' },
    { value: 'good_appetite', label: '🍚 食欲良好' },
    { value: 'good_sleep', label: '🛌 睡眠良好' },
    { value: 'bad_sleep', label: '🌙 睡眠不良' },
    { value: 'constipation', label: '🚽 便秘傾向' },
    { value: 'diarrhea', label: '💩 下痢傾向' },
    { value: 'other', label: '📝 その他' },
  ];

  const [formData, setFormData] = useState({
    event_timestamp: getCurrentDateTime(),
    temperature: '36.5',
    pulse: '70',
    blood_pressure_systolic: '120',
    blood_pressure_diastolic: '80',
    spo2: '95',
    respiratory_rate: '30',
    measurement_condition: '',
    measurement_position: '',
    measurement_location: '',
    vital_status: '',
    special_finding: '',
    intervention_required: '',
    common_note: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const setCurrentTime = () => {
    const exactNow = getCurrentDateTime();
    setFormData({ ...formData, event_timestamp: exactNow });
    console.log('現在時刻を設定:', new Date().toLocaleString('ja-JP'));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 測定時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏰ バイタルサイン測定時刻 *
        </label>
        <div className="flex space-x-2">
          <input
            type="datetime-local"
            value={formData.event_timestamp}
            onChange={(e) => setFormData({ ...formData, event_timestamp: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
            required
          />
          <button
            type="button"
            onClick={setCurrentTime}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 whitespace-nowrap font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            🕐 今すぐ
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          💡 「今すぐ」ボタンで正確な現在時刻を自動入力
        </p>
      </div>

      {/* バイタルサイン数値 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">📊 バイタルサイン数値</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">体温 (℃)</label>
            <select
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
            >
              {Array.from({ length: 51 }, (_, i) => {
                const temp = (34.0 + i * 0.1).toFixed(1);
                return (
                  <option key={temp} value={temp}>
                    {temp}°C {temp === "36.5" ? "(基準値)" : ""}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">脈拍 (回/分)</label>
            <select
              value={formData.pulse}
              onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
            >
              {Array.from({ length: 121 }, (_, i) => {
                const pulse = 40 + i;
                return (
                  <option key={pulse} value={pulse}>
                    {pulse}回/分 {pulse === 70 ? "(基準値)" : ""}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">収縮期血圧 (mmHg)</label>
            <select
              value={formData.blood_pressure_systolic}
              onChange={(e) => setFormData({ ...formData, blood_pressure_systolic: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
            >
              {Array.from({ length: 131 }, (_, i) => {
                const systolic = 70 + i;
                return (
                  <option key={systolic} value={systolic}>
                    {systolic}mmHg {systolic === 120 ? "(基準値)" : ""}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">拡張期血圧 (mmHg)</label>
            <select
              value={formData.blood_pressure_diastolic}
              onChange={(e) => setFormData({ ...formData, blood_pressure_diastolic: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
            >
              {Array.from({ length: 91 }, (_, i) => {
                const diastolic = 40 + i;
                return (
                  <option key={diastolic} value={diastolic}>
                    {diastolic}mmHg {diastolic === 80 ? "(基準値)" : ""}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">SpO2 (%)</label>
            <select
              value={formData.spo2}
              onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
            >
              {Array.from({ length: 36 }, (_, i) => {
                const spo2 = 65 + i;
                return (
                  <option key={spo2} value={spo2}>
                    {spo2}% {spo2 === 95 ? "(基準値)" : ""}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">呼吸数 (回/分)</label>
            <select
              value={formData.respiratory_rate}
              onChange={(e) => setFormData({ ...formData, respiratory_rate: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
            >
              {Array.from({ length: 41 }, (_, i) => {
                const respiratory = 10 + i;
                return (
                  <option key={respiratory} value={respiratory}>
                    {respiratory}回/分 {respiratory === 30 ? "(基準値)" : ""}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* 測定条件（単一選択） */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔍 測定条件（単一選択）
        </label>
        <select
          value={formData.measurement_condition}
          onChange={e => setFormData({ ...formData, measurement_condition: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
        >
          {measurementConditions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 測定体位 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🛏️ 測定時の体位
        </label>
        <select
          value={formData.measurement_position}
          onChange={(e) => setFormData({ ...formData, measurement_position: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">選択してください</option>
          {measurementPositions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>
      </div>

      {/* 測定部位 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📍 測定部位
        </label>
        <select
          value={formData.measurement_location}
          onChange={(e) => setFormData({ ...formData, measurement_location: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
        >
          <option value="">選択してください</option>
          {measurementLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* バイタル状態（単一選択） */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📈 バイタル状態（単一選択）
        </label>
        <select
          value={formData.vital_status}
          onChange={e => setFormData({ ...formData, vital_status: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white"
        >
          {vitalStatusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 特別な所見（単一選択） */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          👁️ 特別な所見（単一選択）
        </label>
        <select
          value={formData.special_finding}
          onChange={e => setFormData({ ...formData, special_finding: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
        >
          {specialFindings.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 介入の必要性（単一選択） */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🚨 介入の必要性（単一選択）
        </label>
        <select
          value={formData.intervention_required}
          onChange={e => setFormData({ ...formData, intervention_required: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white"
        >
          {interventionOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 特記事項 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📝 よく使用する特記事項（単一選択）
        </label>
        <select
          value={formData.common_note}
          onChange={e => setFormData({ ...formData, common_note: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white mb-4"
        >
          {commonNotes.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 保存ボタン */}
      <div className="sticky bottom-0 bg-gray-50 p-4 -mx-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            '💓 バイタルサイン記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};

export default VitalSignsInput;
