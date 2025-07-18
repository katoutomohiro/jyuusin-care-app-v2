import React from 'react';
import { Droplets, Coffee, Utensils } from 'lucide-react';
import { IntakeRecord } from '../../types';

interface IntakeInputProps {
  value: IntakeRecord;
  onChange: (value: IntakeRecord) => void;
}

const IntakeInput: React.FC<IntakeInputProps> = ({ value, onChange }) => {
  // 安全な値の取得
  const safeValue = value || {
    methods: [],
    amount_ml: 0,
    meal_form: '',
    meal_amount: '',
    status: [],
    notes: ''
  };

  const handleChange = (field: keyof IntakeRecord, val: any) => {
    onChange({
      ...safeValue,
      [field]: val
    });
  };

  const toggleMethod = (method: string) => {
    const currentMethods = safeValue.methods || [];
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter(m => m !== method)
      : [...currentMethods, method];
    handleChange('methods', newMethods);
  };

  const toggleStatus = (status: string) => {
    const currentStatus = safeValue.status || [];
    const newStatus = currentStatus.includes(status)
      ? currentStatus.filter(s => s !== status)
      : [...currentStatus, status];
    handleChange('status', newStatus);
  };

  // バリデーション関数
  const getIntakeWarnings = () => {
    const warnings: string[] = [];
    if (safeValue.amount_ml !== undefined && safeValue.amount_ml < 500) warnings.push('水分摂取量が少ない可能性があります（500ml未満）');
    if (safeValue.meal_amount === '拒否') warnings.push('食事を拒否しています。原因や対応を特記事項に記入してください');
    if (safeValue.meal_amount === '嘔吐') warnings.push('嘔吐が記録されています。体調変化に注意してください');
    if (!safeValue.methods || safeValue.methods.length === 0) warnings.push('摂取方法が未選択です');
    if (!safeValue.meal_form) warnings.push('食事形態が未選択です');
    if (!safeValue.meal_amount) warnings.push('食事量が未選択です');
    return warnings;
  };
  const intakeWarnings = getIntakeWarnings();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Droplets className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">摂取量</h3>
      </div>
      
      <div className="space-y-4">
        {/* 摂取方法 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            摂取方法（複数選択可）
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['経口', '経管栄養', '胃瘻', 'その他'].map((method) => (
              <label key={method} className="flex items-center gap-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={(safeValue.methods || []).includes(method)}
                  onChange={() => toggleMethod(method)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{method}</span>
              </label>
            ))}
          </div>
        </div>
        {/* バリデーション警告表示 */}
        {intakeWarnings.length > 0 && (
          <div className="mt-2 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
            <ul className="list-disc pl-5">
              {intakeWarnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}

        {/* 水分摂取量 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
            <Coffee className="w-4 h-4 text-blue-500" />
            水分摂取量 (ml)
          </label>
          <input
            type="number"
            placeholder="例: 500"
            value={safeValue.amount_ml || ''}
            onChange={(e) => handleChange('amount_ml', e.target.value ? parseInt(e.target.value) : 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 食事形態 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            食事形態
          </label>
          <select
            value={safeValue.meal_form || ''}
            onChange={(e) => handleChange('meal_form', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">選択してください</option>
            <option value="普通食">普通食</option>
            <option value="軟食">軟食</option>
            <option value="刻み食">刻み食</option>
            <option value="ミキサー食">ミキサー食</option>
            <option value="流動食">流動食</option>
            <option value="その他">その他</option>
          </select>
        </div>

        {/* 食事量 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
            <Utensils className="w-4 h-4 text-green-500" />
            食事量
          </label>
          <select
            value={safeValue.meal_amount || ''}
            onChange={(e) => handleChange('meal_amount', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">選択してください</option>
            <option value="全量">全量</option>
            <option value="3/4">3/4</option>
            <option value="1/2">1/2</option>
            <option value="1/4">1/4</option>
            <option value="拒否">拒否</option>
            <option value="嘔吐">嘔吐</option>
          </select>
        </div>

        {/* 摂取状況 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            摂取状況（複数選択可）
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['良好', 'むせ込みあり', '疲労', '拒否', '嘔吐', 'その他'].map((status) => (
              <label key={status} className="flex items-center gap-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={(safeValue.status || []).includes(status)}
                  onChange={() => toggleStatus(status)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 特記事項 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            特記事項
          </label>
          <textarea
            placeholder="摂取に関する特記事項があれば記録してください"
            value={safeValue.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-md">
        <p className="text-sm text-green-700">
          💡 重心児者の栄養管理は重要です。摂取量の変化や拒否の理由も記録してください。
        </p>
      </div>
    </div>
  );
};

export default IntakeInput; 