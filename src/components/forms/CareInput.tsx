import React from 'react';
import { Heart, Shield, AlertCircle } from 'lucide-react';
import { CareRecord } from '../../types';

interface CareInputProps {
  value?: CareRecord;
  onChange?: (value: CareRecord) => void;
  onSave?: (eventData: any) => Promise<void>;
  isSubmitting?: boolean;
}

const CareInput: React.FC<CareInputProps> = ({ value, onChange }) => {
  // 安全な値の取得
  const safeValue = value || {
    provided_care: []
  };

  const handleChange = (field: keyof CareRecord, val: any) => {
    onChange({
      ...safeValue,
      [field]: val
    });
  };

  const toggleCareType = (careType: string) => {
    const currentCareTypes = safeValue.provided_care || [];
    const newCareTypes = currentCareTypes.includes(careType)
      ? currentCareTypes.filter(c => c !== careType)
      : [...currentCareTypes, careType];
    handleChange('provided_care', newCareTypes);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-pink-600" />
        <h3 className="text-lg font-semibold text-gray-800">ケア・処置</h3>
      </div>
      
      <div className="space-y-4">
        {/* ケア内容 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            実施したケア（複数選択可）
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['体位変換', '吸引', '酸素投与', '胃管栄養', '導尿', '浣腸', '清拭', '入浴', 'リハビリ', 'その他'].map((care) => (
              <label key={care} className="flex items-center gap-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={(safeValue.provided_care || []).includes(care)}
                  onChange={() => toggleCareType(care)}
                  className="text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700">{care}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-pink-50 rounded-md">
        <p className="text-sm text-pink-700">
          💡 実施したケアの詳細や効果を記録することで、ケアの質向上に役立ちます。
        </p>
      </div>
    </div>
  );
};

export default CareInput; 