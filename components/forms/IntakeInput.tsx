import React, { useState } from 'react';
import { Utensils, Droplets, Coffee, Apple, Soup } from 'lucide-react';

interface IntakeData {
  mealType: string;
  mealAmount: string;
  mealMethod: string;
  appetite: string;
  waterAmount: string;
  waterMethod: string;
  supplements: string;
  notes: string;
}

interface IntakeInputProps {
  data: IntakeData;
  onChange: (data: IntakeData) => void;
}

const IntakeInput: React.FC<IntakeInputProps> = ({ data, onChange }) => {
  const [localData, setLocalData] = useState<IntakeData>(data);

  const handleChange = (field: keyof IntakeData, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(newData);
  };

  const mealTypes = [
    { value: 'breakfast', label: '朝食', icon: Coffee },
    { value: 'lunch', label: '昼食', icon: Utensils },
    { value: 'dinner', label: '夕食', icon: Apple },
    { value: 'snack', label: '間食', icon: Soup }
  ];

  const mealAmounts = [
    { value: 'none', label: '摂取なし' },
    { value: 'little', label: '少量 (1/4)' },
    { value: 'half', label: '半分 (1/2)' },
    { value: 'most', label: '大部分 (3/4)' },
    { value: 'all', label: '完食' }
  ];

  const mealMethods = [
    { value: 'oral', label: '経口摂取' },
    { value: 'tube', label: '経管栄養' },
    { value: 'iv', label: '点滴' },
    { value: 'assisted', label: '介助摂取' }
  ];

  const appetiteLevels = [
    { value: 'none', label: '食欲なし' },
    { value: 'poor', label: '食欲不振' },
    { value: 'normal', label: '普通' },
    { value: 'good', label: '良好' },
    { value: 'excellent', label: '旺盛' }
  ];

  const waterMethods = [
    { value: 'cup', label: 'コップ' },
    { value: 'straw', label: 'ストロー' },
    { value: 'spoon', label: 'スプーン' },
    { value: 'syringe', label: 'シリンジ' },
    { value: 'tube', label: '経管' }
  ];

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Utensils className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-800">食事・水分摂取</h3>
      </div>

      {/* 食事タイプ選択 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">食事タイプ</label>
        <div className="grid grid-cols-2 gap-2">
          {mealTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleChange('mealType', type.value)}
                className={`flex items-center gap-2 p-3 border rounded-lg transition-colors ${
                  localData.mealType === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 食事量 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">食事量</label>
        <div className="grid grid-cols-5 gap-2">
          {mealAmounts.map((amount) => (
            <button
              key={amount.value}
              type="button"
              onClick={() => handleChange('mealAmount', amount.value)}
              className={`p-2 text-xs border rounded-md transition-colors ${
                localData.mealAmount === amount.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {amount.label}
            </button>
          ))}
        </div>
      </div>

      {/* 摂取方法 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">摂取方法</label>
        <div className="grid grid-cols-2 gap-2">
          {mealMethods.map((method) => (
            <button
              key={method.value}
              type="button"
              onClick={() => handleChange('mealMethod', method.value)}
              className={`p-3 border rounded-lg transition-colors ${
                localData.mealMethod === method.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>
      </div>

      {/* 食欲 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">食欲</label>
        <div className="grid grid-cols-5 gap-2">
          {appetiteLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => handleChange('appetite', level.value)}
              className={`p-2 text-xs border rounded-md transition-colors ${
                localData.appetite === level.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* 水分摂取 */}
      <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-medium text-gray-700">水分摂取</h4>
        </div>

        {/* 水分量 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">水分量</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max="2000"
              value={localData.waterAmount}
              onChange={(e) => handleChange('waterAmount', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="500"
            />
            <span className="text-sm text-gray-500 self-center">ml</span>
          </div>
        </div>

        {/* 水分摂取方法 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">摂取方法</label>
          <div className="grid grid-cols-3 gap-2">
            {waterMethods.map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => handleChange('waterMethod', method.value)}
                className={`p-2 text-xs border rounded-md transition-colors ${
                  localData.waterMethod === method.value
                    ? 'border-blue-500 bg-blue-100 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* サプリメント・栄養剤 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">サプリメント・栄養剤</label>
        <input
          type="text"
          value={localData.supplements}
          onChange={(e) => handleChange('supplements', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="使用したサプリメントや栄養剤があれば記入..."
        />
      </div>

      {/* 特記事項 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">特記事項</label>
        <textarea
          value={localData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="食事・水分摂取に関する特記事項があれば記入してください..."
        />
      </div>

      {/* 定型文ボタン */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">定型文</label>
        <div className="flex flex-wrap gap-2">
          {[
            '食欲良好',
            '食欲不振',
            '完食',
            '残食あり',
            '嘔吐あり',
            'むせ込みあり',
            '水分不足',
            '水分過多',
            '経管栄養',
            '点滴中'
          ].map((template) => (
            <button
              key={template}
              type="button"
              onClick={() => {
                const currentNotes = localData.notes;
                const newNotes = currentNotes ? `${currentNotes}、${template}` : template;
                handleChange('notes', newNotes);
              }}
              className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
            >
              {template}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntakeInput; 