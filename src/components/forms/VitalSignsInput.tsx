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
    temperature: '36.5',
    pulse: '70',
    blood_pressure_systolic: '120',
    blood_pressure_diastolic: '80',
    spo2: '95',
    respiratory_rate: '30',
    measurement_conditions: [] as string[],
    measurement_position: '',
    measurement_location: '',
    vital_status: [] as string[],
    special_findings: [] as string[],
    intervention_required: [] as string[],
    common_notes: [] as string[],
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

  // 重症心身障害児者特化の特記事項選択肢
  const commonNotes = [
    'バイタルサイン安定、経過良好',
    '発作の前兆症状なし、安定している',
    '呼吸状態良好、SpO2正常範囲',
    '体温平熱、発熱傾向なし',
    '食事摂取後の測定、消化良好',
    '吸引後のバイタル測定、改善あり',
    '体位変換後の測定、安楽な様子',
    '薬剤投与後の経過観察中',
    '興奮状態での測定、要観察',
    '傾眠傾向あり、バイタル安定',
    '啼泣後の測定、徐々に安定',
    '入浴前後のバイタル変化なし',
    '季節変化による体調管理中',
    '家族面会時の測定、リラックス状態',
    '療育活動後の測定、疲労なし',
    '排便・排尿後の測定、安定',
    '睡眠十分、覚醒時のバイタル良好',
    '水分摂取良好、脱水症状なし',
    '環境温度調整後、体温安定',
    '医師指示による頻回測定実施中'
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

      {/* 測定条件 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔍 測定条件（複数選択可）
        </label>
        <select
          multiple
          value={formData.measurement_conditions}
          onChange={(e) => {
            const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
            setFormData({ ...formData, measurement_conditions: selectedValues });
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
          size={6}
        >
          {measurementConditions.map((condition) => (
            <option key={condition} value={condition} className="p-2">
              {condition}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          💡 Ctrlキー（Windowsの場合）またはCmdキー（Macの場合）を押しながらクリックで複数選択可能
        </p>
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

      {/* バイタル状態 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📈 バイタル状態（複数選択可）
        </label>
        <select
          multiple
          value={formData.vital_status}
          onChange={(e) => {
            const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
            setFormData({ ...formData, vital_status: selectedValues });
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white"
          size={6}
        >
          {vitalStatusOptions.map((status) => (
            <option key={status} value={status} className="p-2">
              {status}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          💡 Ctrlキー（Windowsの場合）またはCmdキー（Macの場合）を押しながらクリックで複数選択可能
        </p>
      </div>

      {/* 特別な所見 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          👁️ 特別な所見（複数選択可）
        </label>
        <select
          multiple
          value={formData.special_findings}
          onChange={(e) => {
            const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
            setFormData({ ...formData, special_findings: selectedValues });
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
          size={6}
        >
          {specialFindings.map((finding) => (
            <option key={finding} value={finding} className="p-2">
              {finding}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          💡 Ctrlキー（Windowsの場合）またはCmdキー（Macの場合）を押しながらクリックで複数選択可能
        </p>
      </div>

      {/* 介入の必要性 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🚨 介入の必要性（複数選択可）
        </label>
        <select
          multiple
          value={formData.intervention_required}
          onChange={(e) => {
            const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
            setFormData({ ...formData, intervention_required: selectedValues });
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white"
          size={6}
        >
          {interventionOptions.map((intervention) => (
            <option key={intervention} value={intervention} className="p-2">
              {intervention}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          💡 Ctrlキー（Windowsの場合）またはCmdキー（Macの場合）を押しながらクリックで複数選択可能
        </p>
      </div>

      {/* 特記事項 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📝 よく使用する特記事項（複数選択可）
        </label>
        <select
          multiple
          value={formData.common_notes}
          onChange={(e) => {
            const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
            setFormData({ ...formData, common_notes: selectedValues });
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white mb-4"
          size={8}
        >
          {commonNotes.map((note) => (
            <option key={note} value={note} className="p-2">
              {note}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mb-4">
          💡 Ctrlキー（Windowsの場合）またはCmdキー（Macの場合）を押しながらクリックで複数選択可能
        </p>
        
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ✏️ 追加の詳細メモ（自由記入）
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="上記の選択肢にない特記事項、医師への申し送り、家族への連絡内容など..."
        />
        
        {/* 選択された定型文の表示 */}
        {formData.common_notes.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-2">✅ 選択された特記事項:</p>
            <ul className="text-sm text-blue-700 space-y-1">
              {formData.common_notes.map((note, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
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
