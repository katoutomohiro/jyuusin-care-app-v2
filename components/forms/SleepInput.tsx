import React, { useState } from 'react';
import { Moon, Clock, Activity, Pill } from 'lucide-react';

interface SleepData {
  sleepTime: string;
  wakeTime: string;
  totalHours: string;
  quality: string;
  wakeCount: string;
  medication: string;
  environment: string;
  notes: string;
}

interface SleepInputProps {
  data: SleepData;
  onChange: (data: SleepData) => void;
}

const SleepInput: React.FC<SleepInputProps> = ({ data, onChange }) => {
  const [localData, setLocalData] = useState<SleepData>(data);

  const handleChange = (field: keyof SleepData, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(newData);
  };

  const sleepQualities = [
    { value: 'excellent', label: '良好', color: 'bg-green-100 text-green-700' },
    { value: 'good', label: '良い', color: 'bg-blue-100 text-blue-700' },
    { value: 'fair', label: '普通', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'poor', label: '悪い', color: 'bg-orange-100 text-orange-700' },
    { value: 'very_poor', label: '非常に悪い', color: 'bg-red-100 text-red-700' }
  ];

  const wakeCounts = [
    { value: '0', label: '0回' },
    { value: '1', label: '1回' },
    { value: '2', label: '2回' },
    { value: '3', label: '3回' },
    { value: '4', label: '4回' },
    { value: '5+', label: '5回以上' }
  ];

  const medications = [
    { value: 'none', label: 'なし' },
    { value: 'sleeping_pill', label: '睡眠薬' },
    { value: 'anxiety_med', label: '抗不安薬' },
    { value: 'pain_med', label: '鎮痛薬' },
    { value: 'other', label: 'その他' }
  ];

  const environments = [
    { value: 'quiet', label: '静か' },
    { value: 'noisy', label: '騒がしい' },
    { value: 'bright', label: '明るい' },
    { value: 'dark', label: '暗い' },
    { value: 'hot', label: '暑い' },
    { value: 'cold', label: '寒い' },
    { value: 'comfortable', label: '快適' }
  ];

  // 睡眠時間の自動計算
  const calculateSleepHours = () => {
    if (localData.sleepTime && localData.wakeTime) {
      const sleep = new Date(`2000-01-01T${localData.sleepTime}`);
      const wake = new Date(`2000-01-01T${localData.wakeTime}`);
      
      // 日をまたぐ場合の処理
      if (wake < sleep) {
        wake.setDate(wake.getDate() + 1);
      }
      
      const diffMs = wake.getTime() - sleep.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours.toFixed(1);
    }
    return '';
  };

  const handleTimeChange = (field: 'sleepTime' | 'wakeTime', value: string) => {
    handleChange(field, value);
    // 自動計算
    if (field === 'sleepTime' && localData.wakeTime) {
      const hours = calculateSleepHours();
      handleChange('totalHours', hours);
    } else if (field === 'wakeTime' && localData.sleepTime) {
      const hours = calculateSleepHours();
      handleChange('totalHours', hours);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Moon className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-800">睡眠記録</h3>
      </div>

      {/* 睡眠時間 */}
      <div className="space-y-4 p-4 bg-indigo-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <h4 className="text-sm font-medium text-gray-700">睡眠時間</h4>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* 就寝時間 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">就寝時間</label>
            <input
              type="time"
              value={localData.sleepTime}
              onChange={(e) => handleTimeChange('sleepTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* 起床時間 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">起床時間</label>
            <input
              type="time"
              value={localData.wakeTime}
              onChange={(e) => handleTimeChange('wakeTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* 総睡眠時間 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">総睡眠時間</label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                min="0"
                max="24"
                value={localData.totalHours}
                onChange={(e) => handleChange('totalHours', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="8.0"
              />
              <span className="text-sm text-gray-500 self-center">時間</span>
            </div>
          </div>
        </div>
      </div>

      {/* 睡眠の質 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">睡眠の質</label>
        <div className="grid grid-cols-5 gap-2">
          {sleepQualities.map((quality) => (
            <button
              key={quality.value}
              type="button"
              onClick={() => handleChange('quality', quality.value)}
              className={`p-3 border rounded-lg transition-colors ${
                localData.quality === quality.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-sm font-medium">{quality.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 覚醒回数 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">夜間覚醒回数</label>
        <div className="grid grid-cols-6 gap-2">
          {wakeCounts.map((count) => (
            <button
              key={count.value}
              type="button"
              onClick={() => handleChange('wakeCount', count.value)}
              className={`p-3 border rounded-lg transition-colors ${
                localData.wakeCount === count.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {count.label}
            </button>
          ))}
        </div>
      </div>

      {/* 睡眠薬・薬剤 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Pill className="w-4 h-4 text-purple-500" />
          睡眠薬・薬剤
        </label>
        <div className="grid grid-cols-5 gap-2">
          {medications.map((med) => (
            <button
              key={med.value}
              type="button"
              onClick={() => handleChange('medication', med.value)}
              className={`p-3 border rounded-lg transition-colors ${
                localData.medication === med.value
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-sm">{med.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 睡眠環境 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">睡眠環境</label>
        <div className="grid grid-cols-4 gap-2">
          {environments.map((env) => (
            <button
              key={env.value}
              type="button"
              onClick={() => handleChange('environment', env.value)}
              className={`p-2 text-sm border rounded-md transition-colors ${
                localData.environment === env.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {env.label}
            </button>
          ))}
        </div>
      </div>

      {/* 特記事項 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">特記事項</label>
        <textarea
          value={localData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="睡眠に関する特記事項があれば記入してください..."
        />
      </div>

      {/* 定型文ボタン */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">定型文</label>
        <div className="flex flex-wrap gap-2">
          {[
            '睡眠良好',
            '睡眠不足',
            '不眠',
            '早朝覚醒',
            '中途覚醒',
            'いびきあり',
            '無呼吸',
            '寝返り多い',
            '落ち着かない',
            '睡眠薬使用',
            '昼寝あり',
            '疲労感'
          ].map((template) => (
            <button
              key={template}
              type="button"
              onClick={() => {
                const currentNotes = localData.notes;
                const newNotes = currentNotes ? `${currentNotes}、${template}` : template;
                handleChange('notes', newNotes);
              }}
              className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
            >
              {template}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SleepInput; 