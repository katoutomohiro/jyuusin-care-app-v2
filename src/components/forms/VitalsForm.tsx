import React, { useState } from 'react';

interface VitalsFormProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

export const VitalsForm: React.FC<VitalsFormProps> = ({ onSave, isSubmitting }) => {
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
    spo2: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    respiratory_rate: '',
    measurement_position: '',
    measurement_location: '', // 体温測定部位
    notes: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  // 測定時の体位
  const measurementPositions = [
    { value: 'supine', label: '🛌 仰臥位' },
    { value: 'side_right', label: '→️ 右側臥位' },
    { value: 'side_left', label: '←️ 左側臥位' },
    { value: 'semi_fowler', label: '🛏️ セミファウラー位' },
    { value: 'fowler', label: '🛏️ ファウラー位' },
    { value: 'sitting', label: '🪑 座位' },
    { value: 'wheelchair', label: '🦽 車椅子座位' },
    { value: 'held', label: '🤱 抱っこ' }
  ];

  // 体温測定部位
  const measurementLocations = [
    { value: 'axillary', label: '🌡️ 腋窩' },
    { value: 'oral', label: '👄 口腔' },
    { value: 'ear', label: '👂 耳介' },
    { value: 'forehead', label: '🧠 額' },
    { value: 'rectal', label: '🍑 直腸' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // バリデーション
    if (!formData.temperature && !formData.pulse && !formData.spo2) {
      setErrorMsg('少なくとも1つのバイタルサインを入力してください');
      return;
    }

    // 体温の範囲チェック
    if (formData.temperature && (parseFloat(formData.temperature) < 30 || parseFloat(formData.temperature) > 45)) {
      setErrorMsg('体温は30-45℃の範囲で入力してください');
      return;
    }

    // 脈拍の範囲チェック
    if (formData.pulse && (parseInt(formData.pulse) < 20 || parseInt(formData.pulse) > 200)) {
      setErrorMsg('脈拍は20-200回/分の範囲で入力してください');
      return;
    }

    // SpO2の範囲チェック
    if (formData.spo2 && (parseInt(formData.spo2) < 70 || parseInt(formData.spo2) > 100)) {
      setErrorMsg('SpO2は70-100%の範囲で入力してください');
      return;
    }

    // 血圧の範囲チェック
    if (formData.blood_pressure_systolic && (parseInt(formData.blood_pressure_systolic) < 50 || parseInt(formData.blood_pressure_systolic) > 250)) {
      setErrorMsg('収縮期血圧は50-250mmHgの範囲で入力してください');
      return;
    }

    if (formData.blood_pressure_diastolic && (parseInt(formData.blood_pressure_diastolic) < 30 || parseInt(formData.blood_pressure_diastolic) > 150)) {
      setErrorMsg('拡張期血圧は30-150mmHgの範囲で入力してください');
      return;
    }

    const eventData = {
      ...formData,
      event_type: 'vitals'
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

      {/* 測定時刻 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          ⏰ 測定時刻 *
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="datetime-local"
            value={formData.event_timestamp}
            onChange={(e) => setFormData({ ...formData, event_timestamp: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, event_timestamp: getCurrentDateTime() }))}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
          >
            今すぐ
          </button>
        </div>
      </div>

      {/* 体温 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          🌡️ 体温 (℃)
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            step="0.1"
            min="30"
            max="45"
            value={formData.temperature}
            onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="例: 36.5"
          />
          <select
            value={formData.measurement_location}
            onChange={(e) => setFormData({ ...formData, measurement_location: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">測定部位</option>
            {measurementLocations.map(loc => (
              <option key={loc.value} value={loc.value}>{loc.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 脈拍 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          💓 脈拍 (回/分)
        </label>
        <input
          type="number"
          min="20"
          max="200"
          value={formData.pulse}
          onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="例: 80"
        />
      </div>

      {/* SpO2 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          🫁 SpO2 (%)
        </label>
        <input
          type="number"
          min="70"
          max="100"
          value={formData.spo2}
          onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="例: 98"
        />
      </div>

      {/* 血圧 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          🩸 血圧 (mmHg)
        </label>
        <div className="flex space-x-2 items-center">
          <input
            type="number"
            min="50"
            max="250"
            value={formData.blood_pressure_systolic}
            onChange={(e) => setFormData({ ...formData, blood_pressure_systolic: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="収縮期 (例: 120)"
          />
          <span className="text-gray-500 font-bold">/</span>
          <input
            type="number"
            min="30"
            max="150"
            value={formData.blood_pressure_diastolic}
            onChange={(e) => setFormData({ ...formData, blood_pressure_diastolic: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="拡張期 (例: 80)"
          />
        </div>
      </div>

      {/* 呼吸数 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          🫁 呼吸数 (回/分)
        </label>
        <input
          type="number"
          min="5"
          max="60"
          value={formData.respiratory_rate}
          onChange={(e) => setFormData({ ...formData, respiratory_rate: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="例: 20"
        />
      </div>

      {/* 測定時の体位 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          🛏️ 測定時の体位
        </label>
        <select
          value={formData.measurement_position}
          onChange={(e) => setFormData({ ...formData, measurement_position: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">選択してください</option>
          {measurementPositions.map(pos => (
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
          placeholder="測定時の様子、特記事項など..."
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

export default VitalsForm;
