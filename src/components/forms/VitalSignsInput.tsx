import React, { useState } from 'react';

interface VitalSignsInputProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

const VitalSignsInput: React.FC<VitalSignsInputProps> = ({ onSave, isSubmitting }) => {
  // 正確な現在時刻を取得する関数
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    event_timestamp: getCurrentDateTime(),
    temperature: '',
    pulse: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    spo2: '',
    respiratory_rate: '',
    measurement_conditions: [] as string[],
    measurement_position: '',
    measurement_location: '',
    vital_status: [] as string[],
    special_findings: [] as string[],
    intervention_required: [] as string[],
    notes: ''
  });

  // 測定条件（重心特化）
  const measurementConditions = [
    '安静時', '活動後', '食事前', '食事後', '入浴前', '入浴後',
    '吸引前', '吸引後', '体位変換前', '体位変換後', '発作後',
    '薬剤投与前', '薬剤投与後', '呼吸器装着中', '酸素投与中',
    '興奮時', '覚醒時', '傾眠時', '啼泣時', 'その他'
  ];

  // 測定体位
  const measurementPositions = [
    '仰臥位', '側臥位（右）', '側臥位（左）', '半坐位', '坐位',
    '車椅子坐位', '抱っこ', 'ベッドアップ30度', 'ベッドアップ45度',
    'ベッドアップ60度', '立位', '歩行中', 'その他'
  ];

  // 測定部位
  const measurementLocations = [
    '腋窩（脇の下）', '口腔', '耳朶（耳）', '直腸', '額（おでこ）',
    '手首（橈骨動脈）', '首（頸動脈）', '足首', '胸部',
    '上腕（血圧計）', '指先（パルスオキシメーター）', 'その他'
  ];

  // バイタル状態（重心特化）
  const vitalStatusOptions = [
    '正常範囲内', '軽度異常', '要注意', '要観察', '異常あり',
    '発熱あり', '低体温', '頻脈', '徐脈', '不整脈',
    '頻呼吸', '呼吸浅い', '呼吸深い', '低酸素', '酸素飽和度低下',
    '血圧高値', '血圧低値', '顔色良好', '顔色不良', 'チアノーゼあり'
  ];

  // 特別な所見（重心特化）
  const specialFindings = [
    '発汗多量', '冷汗', '顔面紅潮', '顔面蒼白', 'チアノーゼ',
    '呼吸困難', '喘鳴', '咳嗽', '痰絡み', '鼻汁',
    '口唇乾燥', '舌乾燥', '皮膚乾燥', '浮腫', '発疹',
    '興奮状態', '不穏状態', '傾眠傾向', '意識レベル低下',
    'けいれん様動き', '不随意運動', 'その他'
  ];

  // 介入の必要性
  const interventionOptions = [
    '経過観察', '15分後再測定', '30分後再測定', '1時間後再測定',
    '看護師報告', '主治医報告', '家族連絡', '救急対応',
    '吸引実施', '体位変換', '酸素投与', '薬剤投与',
    '水分補給', '冷却', '保温', '安静保持',
    '環境調整', 'バイタル頻回測定', 'その他'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleArrayItem = (array: string[], item: string, setter: (newArray: string[]) => void) => {
    const newArray = array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
    setter(newArray);
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
            <input
              type="number"
              step="0.1"
              min="30"
              max="45"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="36.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">脈拍 (回/分)</label>
            <input
              type="number"
              min="30"
              max="200"
              value={formData.pulse}
              onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="70"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">収縮期血圧</label>
            <input
              type="number"
              min="50"
              max="250"
              value={formData.blood_pressure_systolic}
              onChange={(e) => setFormData({ ...formData, blood_pressure_systolic: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="120"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">拡張期血圧</label>
            <input
              type="number"
              min="30"
              max="150"
              value={formData.blood_pressure_diastolic}
              onChange={(e) => setFormData({ ...formData, blood_pressure_diastolic: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="80"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">SpO2 (%)</label>
            <input
              type="number"
              min="70"
              max="100"
              value={formData.spo2}
              onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="98"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">呼吸数 (回/分)</label>
            <input
              type="number"
              min="5"
              max="60"
              value={formData.respiratory_rate}
              onChange={(e) => setFormData({ ...formData, respiratory_rate: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="20"
            />
          </div>
        </div>
      </div>

      {/* 測定条件 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔍 測定条件（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {measurementConditions.map((condition) => (
            <button
              key={condition}
              type="button"
              onClick={() => toggleArrayItem(
                formData.measurement_conditions, 
                condition, 
                (newArray) => setFormData({ ...formData, measurement_conditions: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.measurement_conditions.includes(condition)
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {condition}
            </button>
          ))}
        </div>
      </div>

      {/* 測定体位 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🛏️ 測定時の体位
        </label>
        <div className="grid grid-cols-3 gap-2">
          {measurementPositions.map((position) => (
            <button
              key={position}
              type="button"
              onClick={() => setFormData({ ...formData, measurement_position: position })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.measurement_position === position
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {position}
            </button>
          ))}
        </div>
      </div>

      {/* 測定部位 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📍 測定部位
        </label>
        <div className="grid grid-cols-3 gap-2">
          {measurementLocations.map((location) => (
            <button
              key={location}
              type="button"
              onClick={() => setFormData({ ...formData, measurement_location: location })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.measurement_location === location
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* バイタル状態 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📈 バイタル状態（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {vitalStatusOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => toggleArrayItem(
                formData.vital_status, 
                status, 
                (newArray) => setFormData({ ...formData, vital_status: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.vital_status.includes(status)
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 特別な所見 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          👁️ 特別な所見（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {specialFindings.map((finding) => (
            <button
              key={finding}
              type="button"
              onClick={() => toggleArrayItem(
                formData.special_findings, 
                finding, 
                (newArray) => setFormData({ ...formData, special_findings: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.special_findings.includes(finding)
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {finding}
            </button>
          ))}
        </div>
      </div>

      {/* 介入の必要性 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🚨 介入の必要性（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {interventionOptions.map((intervention) => (
            <button
              key={intervention}
              type="button"
              onClick={() => toggleArrayItem(
                formData.intervention_required, 
                intervention, 
                (newArray) => setFormData({ ...formData, intervention_required: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.intervention_required.includes(intervention)
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {intervention}
            </button>
          ))}
        </div>
      </div>

      {/* 特記事項 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📝 特記事項・詳細メモ
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          rows={4}
          placeholder="測定時の特記事項、医師への申し送り、家族への連絡内容など..."
        />
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
