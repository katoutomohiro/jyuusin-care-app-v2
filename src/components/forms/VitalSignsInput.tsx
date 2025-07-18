import React, { useState } from 'react';
import { Heart, Activity, Thermometer } from 'lucide-react';
import { VitalSigns } from '../../types';

interface VitalSignsInputProps {
  value?: VitalSigns;
  onChange?: (value: VitalSigns) => void;
  onSave?: (eventData: any) => Promise<void>;
  isSubmitting?: boolean;
}

// 体温プルダウン生成
const temperatureOptions = Array.from({ length: 81 }, (_, i) => (34 + i * 0.1).toFixed(1));
// 脈拍プルダウン生成
const pulseOptions = Array.from({ length: 141 }, (_, i) => (40 + i).toString());
// SPO2プルダウン生成
const spo2Options = Array.from({ length: 21 }, (_, i) => (80 + i).toString());
// 血圧プルダウン生成
const bpOptions = Array.from({ length: 101 }, (_, i) => (80 + i).toString());

const vitalTemplates = [
  '体温・脈拍・SPO2ともに安定しています',
  '体温やや高めですが、他に異常なし',
  '脈拍やや速いが、表情・顔色良好',
  'SPO2低下傾向あり、呼吸状態注意',
];

const VitalSignsInput: React.FC<VitalSignsInputProps> = ({ 
  value, 
  onChange, 
  onSave,
  isSubmitting 
}) => {
  const [note, setNote] = useState('');

  // デフォルト値設定
  const safeValue = value || {
    temperature: 36.5,
    pulse: 80,
    spO2: 98,
    bloodPressure: { systolic: 120, diastolic: 80 }
  };

  const handleChange = (field: keyof VitalSigns, val: any) => {
    onChange({
      ...safeValue,
      [field]: val
    });
  };

  const handleBloodPressureChange = (type: 'systolic' | 'diastolic', val: string) => {
    onChange({
      ...safeValue,
      bloodPressure: {
        ...safeValue.bloodPressure,
        [type]: parseInt(val)
      }
    });
  };

  const handleTemplateClick = (template: string) => {
    setNote(template);
    // 必要ならonChangeで親に伝える
  };

  // バリデーション関数
  const getVitalWarnings = () => {
    const warnings: string[] = [];
    if (safeValue.temperature < 35.0) warnings.push('体温が低すぎます（35.0℃未満）');
    if (safeValue.temperature > 38.0) warnings.push('体温が高めです（38.0℃超）');
    if (safeValue.pulse < 50) warnings.push('脈拍が低すぎます（50未満）');
    if (safeValue.pulse > 120) warnings.push('脈拍が高めです（120超）');
    if (safeValue.spO2 < 94) warnings.push('SPO₂が低めです（94%未満）');
    if (safeValue.bloodPressure?.systolic > 150 || safeValue.bloodPressure?.diastolic > 100) warnings.push('血圧が高めです（上150/下100超）');
    if (safeValue.bloodPressure?.systolic < 90 || safeValue.bloodPressure?.diastolic < 60) warnings.push('血圧が低めです（上90/下60未満）');
    return warnings;
  };
  const vitalWarnings = getVitalWarnings();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">バイタルサイン</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 体温 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">体温 (℃)</label>
          <select
            value={safeValue.temperature}
            onChange={e => handleChange('temperature', parseFloat(e.target.value))}
            className={`w-full px-3 py-2 border rounded-md ${safeValue.temperature < 35.0 || safeValue.temperature > 38.0 ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          >
            {temperatureOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        {/* 脈拍 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" /> 脈拍 (回/分)
          </label>
          <select
            value={safeValue.pulse}
            onChange={e => handleChange('pulse', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-md ${safeValue.pulse < 50 || safeValue.pulse > 120 ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          >
            {pulseOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        {/* SPO2 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">SPO₂ (%)</label>
          <select
            value={safeValue.spO2}
            onChange={e => handleChange('spO2', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-md ${safeValue.spO2 < 94 ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          >
            {spo2Options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        {/* 血圧 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">血圧 (mmHg)</label>
          <div className="flex gap-2">
            <select
              value={safeValue.bloodPressure?.systolic || 120}
              onChange={e => handleBloodPressureChange('systolic', e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-md ${safeValue.bloodPressure?.systolic > 150 || safeValue.bloodPressure?.systolic < 90 ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
            >
              {bpOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="text-gray-500 self-center">/</span>
            <select
              value={safeValue.bloodPressure?.diastolic || 80}
              onChange={e => handleBloodPressureChange('diastolic', e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-md ${safeValue.bloodPressure?.diastolic > 100 || safeValue.bloodPressure?.diastolic < 60 ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
            >
              {bpOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* バリデーション警告表示 */}
      {vitalWarnings.length > 0 && (
        <div className="mt-3 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
          <ul className="list-disc pl-5">
            {vitalWarnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}
      {/* 定型文ボタン */}
      <div className="mt-4 flex flex-wrap gap-2">
        {vitalTemplates.map((tpl, idx) => (
          <button
            key={idx}
            type="button"
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            onClick={() => handleTemplateClick(tpl)}
          >
            {tpl}
          </button>
        ))}
      </div>
      {/* 自由記述欄 */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">自由記述</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={2}
          placeholder="バイタルに関する特記事項や気づきを記入"
        />
      </div>
    </div>
  );
};

export default VitalSignsInput; 