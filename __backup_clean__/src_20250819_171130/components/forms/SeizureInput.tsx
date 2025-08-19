import React from 'react';
import { AlertTriangle, Clock, Activity } from 'lucide-react';
import { SeizureRecord } from '../../types';

interface SeizureInputProps {
  value: SeizureRecord[];
  onChange: (value: SeizureRecord[]) => void;
}

const SeizureInput: React.FC<SeizureInputProps> = ({ value, onChange }) => {
  // 安全な値の取得
  const safeValue = value || [];

  const addSeizure = () => {
    const newSeizure: SeizureRecord = {
      type: '',
      duration_sec: 0,
      details: [],
      notes: ''
    };
    onChange([...safeValue, newSeizure]);
  };

  const updateSeizure = (index: number, updatedSeizure: SeizureRecord) => {
    const newSeizures = [...safeValue];
    newSeizures[index] = updatedSeizure;
    onChange(newSeizures);
  };

  const removeSeizure = (index: number) => {
    const newSeizures = safeValue.filter((_, i) => i !== index);
    onChange(newSeizures);
  };

  const toggleDetail = (seizureIndex: number, detail: string) => {
    const seizure = safeValue[seizureIndex];
    const currentDetails = seizure.details || [];
    const newDetails = currentDetails.includes(detail)
      ? currentDetails.filter(d => d !== detail)
      : [...currentDetails, detail];
    
    updateSeizure(seizureIndex, {
      ...seizure,
      details: newDetails
    });
  };

  // バリデーション関数
  const getSeizureWarnings = (seizure: SeizureRecord) => {
    const warnings: string[] = [];
    if (!seizure.type) warnings.push('発作の種類が未選択です');
    if (seizure.duration_sec > 60) warnings.push('持続時間が60秒を超えています。医師への報告を検討してください');
    if (!seizure.details || seizure.details.length === 0) warnings.push('詳細症状が未選択です');
    return warnings;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h3 className="text-lg font-semibold text-gray-800">発作</h3>
      </div>
      
      <div className="space-y-4">
        {safeValue.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            発作は記録されていません
          </div>
        ) : (
          safeValue.map((seizure, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-800">発作 {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeSeizure(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  削除
                </button>
              </div>

              {/* バリデーション警告表示 */}
              {getSeizureWarnings(seizure).length > 0 && (
                <div className="mb-2 p-2 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
                  <ul className="list-disc pl-5">
                    {getSeizureWarnings(seizure).map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}

              {/* 発作の種類 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  発作の種類
                </label>
                <select
                  value={seizure.type || ''}
                  onChange={(e) => updateSeizure(index, { ...seizure, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  <option value="強直間代発作">強直間代発作</option>
                  <option value="欠神発作">欠神発作</option>
                  <option value="部分発作">部分発作</option>
                  <option value="ミオクローヌス">ミオクローヌス</option>
                  <option value="脱力発作">脱力発作</option>
                  <option value="その他">その他</option>
                </select>
              </div>

              {/* 持続時間 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  持続時間 (秒)
                </label>
                <input
                  type="number"
                  placeholder="例: 30"
                  value={seizure.duration_sec || ''}
                  onChange={(e) => updateSeizure(index, { ...seizure, duration_sec: e.target.value ? parseInt(e.target.value) : 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* 詳細症状 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  詳細症状（複数選択可）
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['意識消失', 'けいれん', '眼球上転', '口から泡', '失禁', 'その他'].map((detail) => (
                    <label key={detail} className="flex items-center gap-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={(seizure.details || []).includes(detail)}
                        onChange={() => toggleDetail(index, detail)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">{detail}</span>
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
                  placeholder="発作に関する特記事項があれば記録してください"
                  value={seizure.notes || ''}
                  onChange={(e) => updateSeizure(index, { ...seizure, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          ))
        )}

        <button
          type="button"
          onClick={addSeizure}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
        >
          + 発作を追加
        </button>
      </div>

      <div className="mt-4 p-3 bg-red-50 rounded-md">
        <p className="text-sm text-red-700">
          ⚠️ 発作が発生した場合は、必ず詳細を記録し、必要に応じて医師に報告してください。
        </p>
      </div>
    </div>
  );
};

export default SeizureInput; 