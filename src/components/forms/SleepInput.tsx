import React from 'react';
import { Moon, Clock, Bed } from 'lucide-react';
import { SleepRecord } from '../../types';

interface SleepInputProps {
  value: SleepRecord;
  onChange: (value: SleepRecord) => void;
}

const SleepInput: React.FC<SleepInputProps> = ({ value, onChange }) => {
  // 安全な値の取得
  const safeValue = value || {
    duration_minutes: 0,
    status: '',
    notes: ''
  };

  const handleChange = (field: keyof SleepRecord, val: any) => {
    onChange({
      ...safeValue,
      [field]: val
    });
  };

  // バリデーション関数
  const getSleepWarnings = () => {
    const warnings: string[] = [];
    if (!safeValue.duration_minutes) warnings.push('睡眠時間が未入力です');
    if (safeValue.duration_minutes > 0 && safeValue.duration_minutes < 240) warnings.push('睡眠時間が短いです（4時間未満）');
    if (safeValue.duration_minutes > 900) warnings.push('睡眠時間が長すぎます（15時間超）');
    if (!safeValue.status) warnings.push('睡眠の質が未選択です');
    if (['不眠', '夜間覚醒', '過眠'].includes(safeValue.status)) warnings.push(`睡眠の質に「${safeValue.status}」が選択されています。体調変化に注意してください`);
    return warnings;
  };
  const sleepWarnings = getSleepWarnings();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Moon className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-800">睡眠</h3>
      </div>
      
      <div className="space-y-4">
        {/* 睡眠時間 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
            <Bed className="w-4 h-4 text-indigo-500" />
            睡眠時間 (分)
          </label>
          <input
            type="number"
            placeholder="例: 480 (8時間)"
            value={safeValue.duration_minutes || ''}
            onChange={(e) => handleChange('duration_minutes', e.target.value ? parseInt(e.target.value) : 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* バリデーション警告表示 */}
        {sleepWarnings.length > 0 && (
          <div className="mt-2 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
            <ul className="list-disc pl-5">
              {sleepWarnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}

        {/* 睡眠の質 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
            <Clock className="w-4 h-4 text-orange-500" />
            睡眠の質
          </label>
          <select
            value={safeValue.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">選択してください</option>
            <option value="良好">良好</option>
            <option value="普通">普通</option>
            <option value="浅い">浅い</option>
            <option value="不眠">不眠</option>
            <option value="過眠">過眠</option>
            <option value="夜間覚醒">夜間覚醒</option>
          </select>
        </div>

        {/* 特記事項 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            特記事項
          </label>
          <textarea
            placeholder="睡眠に関する特記事項があれば記録してください"
            value={safeValue.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-indigo-50 rounded-md">
        <p className="text-sm text-indigo-700">
          💡 重心児者の睡眠パターンは健康状態に大きく影響します。変化があれば詳細を記録してください。
        </p>
      </div>
    </div>
  );
};

export default SleepInput; 