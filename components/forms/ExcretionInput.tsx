import React, { useState } from 'react';
import { Droplets, Activity, Clock, AlertTriangle } from 'lucide-react';

interface ExcretionData {
  urination: {
    count: string;
    amount: string;
    color: string;
    assistance: string;
  };
  defecation: {
    count: string;
    amount: string;
    consistency: string;
    color: string;
    assistance: string;
  };
  incontinence: string;
  catheter: string;
  notes: string;
}

interface ExcretionInputProps {
  data: ExcretionData;
  onChange: (data: ExcretionData) => void;
}

const ExcretionInput: React.FC<ExcretionInputProps> = ({ data, onChange }) => {
  const [localData, setLocalData] = useState<ExcretionData>(data);

  const handleChange = (field: keyof ExcretionData, value: string | any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(newData);
  };

  const handleUrinationChange = (field: keyof ExcretionData['urination'], value: string) => {
    const newUrination = { ...localData.urination, [field]: value };
    handleChange('urination', newUrination);
  };

  const handleDefecationChange = (field: keyof ExcretionData['defecation'], value: string) => {
    const newDefecation = { ...localData.defecation, [field]: value };
    handleChange('defecation', newDefecation);
  };

  const urinationCounts = [
    { value: '0', label: '0回' },
    { value: '1', label: '1回' },
    { value: '2', label: '2回' },
    { value: '3', label: '3回' },
    { value: '4', label: '4回' },
    { value: '5+', label: '5回以上' }
  ];

  const urinationAmounts = [
    { value: 'none', label: 'なし' },
    { value: 'little', label: '少量' },
    { value: 'normal', label: '普通' },
    { value: 'much', label: '多量' }
  ];

  const urinationColors = [
    { value: 'clear', label: '透明', color: 'bg-blue-100' },
    { value: 'light', label: '薄い黄色', color: 'bg-yellow-100' },
    { value: 'normal', label: '黄色', color: 'bg-yellow-200' },
    { value: 'dark', label: '濃い黄色', color: 'bg-orange-200' },
    { value: 'red', label: '赤色', color: 'bg-red-200' }
  ];

  const defecationCounts = [
    { value: '0', label: '0回' },
    { value: '1', label: '1回' },
    { value: '2', label: '2回' },
    { value: '3', label: '3回' },
    { value: '4+', label: '4回以上' }
  ];

  const defecationAmounts = [
    { value: 'none', label: 'なし' },
    { value: 'little', label: '少量' },
    { value: 'normal', label: '普通' },
    { value: 'much', label: '多量' }
  ];

  const consistencies = [
    { value: 'hard', label: '硬い' },
    { value: 'normal', label: '普通' },
    { value: 'soft', label: '柔らかい' },
    { value: 'liquid', label: '水様' }
  ];

  const assistanceMethods = [
    { value: 'independent', label: '自立' },
    { value: 'assisted', label: '介助' },
    { value: 'dependent', label: '全介助' },
    { value: 'diaper', label: 'オムツ' }
  ];

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">排泄記録</h3>
      </div>

      {/* 排尿 */}
      <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-medium text-gray-700">排尿</h4>
        </div>

        {/* 排尿回数 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">回数</label>
          <div className="grid grid-cols-6 gap-2">
            {urinationCounts.map((count) => (
              <button
                key={count.value}
                type="button"
                onClick={() => handleUrinationChange('count', count.value)}
                className={`p-2 text-xs border rounded-md transition-colors ${
                  localData.urination.count === count.value
                    ? 'border-blue-500 bg-blue-100 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {count.label}
              </button>
            ))}
          </div>
        </div>

        {/* 排尿量 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">量</label>
          <div className="grid grid-cols-4 gap-2">
            {urinationAmounts.map((amount) => (
              <button
                key={amount.value}
                type="button"
                onClick={() => handleUrinationChange('amount', amount.value)}
                className={`p-2 text-xs border rounded-md transition-colors ${
                  localData.urination.amount === amount.value
                    ? 'border-blue-500 bg-blue-100 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {amount.label}
              </button>
            ))}
          </div>
        </div>

        {/* 尿色 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">色</label>
          <div className="grid grid-cols-5 gap-2">
            {urinationColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleUrinationChange('color', color.value)}
                className={`p-2 text-xs border rounded-md transition-colors ${
                  localData.urination.color === color.value
                    ? 'border-blue-500 bg-blue-100 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                } ${color.color}`}
              >
                {color.label}
              </button>
            ))}
          </div>
        </div>

        {/* 排尿介助 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">介助方法</label>
          <div className="grid grid-cols-4 gap-2">
            {assistanceMethods.map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => handleUrinationChange('assistance', method.value)}
                className={`p-2 text-xs border rounded-md transition-colors ${
                  localData.urination.assistance === method.value
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

      {/* 排便 */}
      <div className="space-y-4 p-4 bg-yellow-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-yellow-600" />
          <h4 className="text-sm font-medium text-gray-700">排便</h4>
        </div>

        {/* 排便回数 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">回数</label>
          <div className="grid grid-cols-5 gap-2">
            {defecationCounts.map((count) => (
              <button
                key={count.value}
                type="button"
                onClick={() => handleDefecationChange('count', count.value)}
                className={`p-2 text-xs border rounded-md transition-colors ${
                  localData.defecation.count === count.value
                    ? 'border-yellow-500 bg-yellow-100 text-yellow-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {count.label}
              </button>
            ))}
          </div>
        </div>

        {/* 排便量 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">量</label>
          <div className="grid grid-cols-4 gap-2">
            {defecationAmounts.map((amount) => (
              <button
                key={amount.value}
                type="button"
                onClick={() => handleDefecationChange('amount', amount.value)}
                className={`p-2 text-xs border rounded-md transition-colors ${
                  localData.defecation.amount === amount.value
                    ? 'border-yellow-500 bg-yellow-100 text-yellow-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {amount.label}
              </button>
            ))}
          </div>
        </div>

        {/* 便の性状 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">性状</label>
          <div className="grid grid-cols-4 gap-2">
            {consistencies.map((consistency) => (
              <button
                key={consistency.value}
                type="button"
                onClick={() => handleDefecationChange('consistency', consistency.value)}
                className={`p-2 text-xs border rounded-md transition-colors ${
                  localData.defecation.consistency === consistency.value
                    ? 'border-yellow-500 bg-yellow-100 text-yellow-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {consistency.label}
              </button>
            ))}
          </div>
        </div>

        {/* 便色 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">色</label>
          <div className="grid grid-cols-5 gap-2">
            {urinationColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleDefecationChange('color', color.value)}
                className={`p-2 text-xs border rounded-md transition-colors ${
                  localData.defecation.color === color.value
                    ? 'border-yellow-500 bg-yellow-100 text-yellow-700'
                    : 'border-gray-300 hover:border-gray-400'
                } ${color.color}`}
              >
                {color.label}
              </button>
            ))}
          </div>
        </div>

        {/* 排便介助 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">介助方法</label>
          <div className="grid grid-cols-4 gap-2">
            {assistanceMethods.map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => handleDefecationChange('assistance', method.value)}
                className={`p-2 text-xs border rounded-md transition-colors ${
                  localData.defecation.assistance === method.value
                    ? 'border-yellow-500 bg-yellow-100 text-yellow-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 失禁 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">失禁</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'none', label: 'なし' },
            { value: 'urination', label: '排尿失禁' },
            { value: 'defecation', label: '排便失禁' }
          ].map((incontinence) => (
            <button
              key={incontinence.value}
              type="button"
              onClick={() => handleChange('incontinence', incontinence.value)}
              className={`p-3 border rounded-lg transition-colors ${
                localData.incontinence === incontinence.value
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {incontinence.label}
            </button>
          ))}
        </div>
      </div>

      {/* カテーテル */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">カテーテル</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'none', label: 'なし' },
            { value: 'foley', label: 'フォーリー' },
            { value: 'suprapubic', label: '膀胱瘻' }
          ].map((catheter) => (
            <button
              key={catheter.value}
              type="button"
              onClick={() => handleChange('catheter', catheter.value)}
              className={`p-3 border rounded-lg transition-colors ${
                localData.catheter === catheter.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {catheter.label}
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="排泄に関する特記事項があれば記入してください..."
        />
      </div>

      {/* 定型文ボタン */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">定型文</label>
        <div className="flex flex-wrap gap-2">
          {[
            '排尿正常',
            '排尿困難',
            '頻尿',
            '乏尿',
            '血尿',
            '排便正常',
            '便秘',
            '下痢',
            '失禁あり',
            'オムツ使用',
            'カテーテル使用',
            '排尿痛',
            '残尿感'
          ].map((template) => (
            <button
              key={template}
              type="button"
              onClick={() => {
                const currentNotes = localData.notes;
                const newNotes = currentNotes ? `${currentNotes}、${template}` : template;
                handleChange('notes', newNotes);
              }}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
            >
              {template}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExcretionInput; 