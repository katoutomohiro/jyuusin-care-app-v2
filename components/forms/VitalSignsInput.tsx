import React, { useState } from 'react';
import { Activity, Heart, Droplets, Gauge, Thermometer } from 'lucide-react';

interface VitalSignsData {
  temperature: string;
  pulse: string;
  respiration: string;
  bloodPressure: {
    systolic: string;
    diastolic: string;
  };
  spO2: string;
  notes: string;
}

interface VitalSignsInputProps {
  data: VitalSignsData;
  onChange: (data: VitalSignsData) => void;
}

const VitalSignsInput: React.FC<VitalSignsInputProps> = ({ data, onChange }) => {
  const [localData, setLocalData] = useState<VitalSignsData>(data);

  const handleChange = (field: keyof VitalSignsData, value: string | { systolic: string; diastolic: string }) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(newData);
  };

  const handleBloodPressureChange = (type: 'systolic' | 'diastolic', value: string) => {
    const newBloodPressure = { ...localData.bloodPressure, [type]: value };
    handleChange('bloodPressure', newBloodPressure);
  };

  // 異常値チェック
  const isAbnormal = (value: string, min: number, max: number) => {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && (numValue < min || numValue > max);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">バイタルサイン</h3>
      </div>

      {/* 体温 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Thermometer className="w-4 h-4 text-red-500" />
          体温 (°C)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            min="30"
            max="45"
            value={localData.temperature}
            onChange={(e) => handleChange('temperature', e.target.value)}
            className={`flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isAbnormal(localData.temperature, 35, 42) ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="36.5"
          />
          <span className="text-sm text-gray-500 self-center">°C</span>
        </div>
        {isAbnormal(localData.temperature, 35, 42) && (
          <p className="text-sm text-red-600">⚠️ 異常値の可能性があります</p>
        )}
      </div>

      {/* 脈拍 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Heart className="w-4 h-4 text-red-500" />
          脈拍 (回/分)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min="30"
            max="200"
            value={localData.pulse}
            onChange={(e) => handleChange('pulse', e.target.value)}
            className={`flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isAbnormal(localData.pulse, 50, 150) ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="80"
          />
          <span className="text-sm text-gray-500 self-center">回/分</span>
        </div>
        {isAbnormal(localData.pulse, 50, 150) && (
          <p className="text-sm text-red-600">⚠️ 異常値の可能性があります</p>
        )}
      </div>

      {/* 呼吸 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Droplets className="w-4 h-4 text-blue-500" />
          呼吸 (回/分)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min="10"
            max="60"
            value={localData.respiration}
            onChange={(e) => handleChange('respiration', e.target.value)}
            className={`flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isAbnormal(localData.respiration, 12, 40) ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="20"
          />
          <span className="text-sm text-gray-500 self-center">回/分</span>
        </div>
        {isAbnormal(localData.respiration, 12, 40) && (
          <p className="text-sm text-red-600">⚠️ 異常値の可能性があります</p>
        )}
      </div>

      {/* 血圧 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Gauge className="w-4 h-4 text-purple-500" />
          血圧 (mmHg)
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="60"
            max="250"
            value={localData.bloodPressure.systolic}
            onChange={(e) => handleBloodPressureChange('systolic', e.target.value)}
            className={`flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isAbnormal(localData.bloodPressure.systolic, 80, 200) ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="120"
          />
          <span className="text-gray-500">/</span>
          <input
            type="number"
            min="40"
            max="150"
            value={localData.bloodPressure.diastolic}
            onChange={(e) => handleBloodPressureChange('diastolic', e.target.value)}
            className={`flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isAbnormal(localData.bloodPressure.diastolic, 50, 120) ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="80"
          />
          <span className="text-sm text-gray-500">mmHg</span>
        </div>
        {(isAbnormal(localData.bloodPressure.systolic, 80, 200) || 
          isAbnormal(localData.bloodPressure.diastolic, 50, 120)) && (
          <p className="text-sm text-red-600">⚠️ 異常値の可能性があります</p>
        )}
      </div>

      {/* SpO2 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Activity className="w-4 h-4 text-green-500" />
          SpO2 (%)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min="70"
            max="100"
            value={localData.spO2}
            onChange={(e) => handleChange('spO2', e.target.value)}
            className={`flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isAbnormal(localData.spO2, 90, 100) ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="98"
          />
          <span className="text-sm text-gray-500 self-center">%</span>
        </div>
        {isAbnormal(localData.spO2, 90, 100) && (
          <p className="text-sm text-red-600">⚠️ 低酸素血症の可能性があります</p>
        )}
      </div>

      {/* 特記事項 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">特記事項</label>
        <textarea
          value={localData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="バイタルに関する特記事項があれば記入してください..."
        />
      </div>

      {/* 定型文ボタン */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">定型文</label>
        <div className="flex flex-wrap gap-2">
          {[
            '安定',
            '微熱あり',
            '発熱あり',
            '脈拍速い',
            '脈拍遅い',
            '呼吸速い',
            '呼吸困難',
            '血圧高め',
            '血圧低め',
            'SpO2低下'
          ].map((template) => (
            <button
              key={template}
              type="button"
              onClick={() => {
                const currentNotes = localData.notes;
                const newNotes = currentNotes ? `${currentNotes}、${template}` : template;
                handleChange('notes', newNotes);
              }}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              {template}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VitalSignsInput; 