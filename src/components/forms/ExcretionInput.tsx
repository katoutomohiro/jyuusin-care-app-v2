import React from 'react';
import { Droplets, Activity } from 'lucide-react';
import { ExcretionRecord } from '../../types';

interface ExcretionInputProps {
  value: ExcretionRecord;
  onChange: (value: ExcretionRecord) => void;
}

const ExcretionInput: React.FC<ExcretionInputProps> = ({ value, onChange }) => {
  // 安全な値の取得
  const safeValue = value || {
    bristol_scale: 0,
    status: [],
    notes: ''
  };

  const handleChange = (field: keyof ExcretionRecord, val: any) => {
    onChange({
      ...safeValue,
      [field]: val
    });
  };

  const toggleStatus = (status: string) => {
    const currentStatus = safeValue.status || [];
    const newStatus = currentStatus.includes(status)
      ? currentStatus.filter(s => s !== status)
      : [...currentStatus, status];
    handleChange('status', newStatus);
  };

  // バリデーション関数
  const getExcretionWarnings = () => {
    const warnings: string[] = [];
    if (!safeValue.bristol_scale) warnings.push('ブリストルスケールが未選択です');
    if (!safeValue.status || safeValue.status.length === 0) warnings.push('排泄状況が未選択です');
    if ((safeValue.status || []).includes('便秘')) warnings.push('便秘が記録されています。水分摂取や排便状況に注意してください');
    if ((safeValue.status || []).includes('下痢')) warnings.push('下痢が記録されています。脱水や体調変化に注意してください');
    if ((safeValue.status || []).includes('失禁')) warnings.push('失禁が記録されています。皮膚トラブルやケアに注意してください');
    if ((safeValue.status || []).includes('排尿困難')) warnings.push('排尿困難が記録されています。尿量や排尿間隔に注意してください');
    return warnings;
  };
  const excretionWarnings = getExcretionWarnings();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">排泄</h3>
      </div>
      
      <div className="space-y-4">
        {/* ブリストルスケール */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            ブリストルスケール
          </label>
          <select
            value={safeValue.bristol_scale || ''}
            onChange={(e) => handleChange('bristol_scale', e.target.value ? parseInt(e.target.value) : 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">選択してください</option>
            <option value="1">1 - 硬い便</option>
            <option value="2">2 - ソーセージ状の硬い便</option>
            <option value="3">3 - ソーセージ状の便</option>
            <option value="4">4 - ソーセージ状の軟らかい便</option>
            <option value="5">5 - 軟らかい塊</option>
            <option value="6">6 - 泥状</option>
            <option value="7">7 - 水様便</option>
          </select>
        </div>
        {/* バリデーション警告表示 */}
        {excretionWarnings.length > 0 && (
          <div className="mt-2 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
            <ul className="list-disc pl-5">
              {excretionWarnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}

        {/* 排泄状況 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            排泄状況（複数選択可）
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['正常', '便秘', '下痢', '失禁', '頻回', '排尿困難', 'その他'].map((status) => (
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
            placeholder="排泄に関する特記事項があれば記録してください"
            value={safeValue.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-md">
        <p className="text-sm text-yellow-700">
          💡 排泄の変化は健康状態の重要な指標です。異常があれば詳細を記録してください。
        </p>
      </div>
    </div>
  );
};

export default ExcretionInput; 