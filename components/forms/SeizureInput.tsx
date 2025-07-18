import React, { useState } from 'react';
import { AlertTriangle, Clock, Activity, Eye, Brain } from 'lucide-react';

interface SeizureData {
  hasSeizure: string;
  seizureType: string;
  duration: string;
  time: string;
  symptoms: string[];
  aura: string;
  medication: string;
  postSeizure: string;
  notes: string;
}

interface SeizureInputProps {
  data: SeizureData;
  onChange: (data: SeizureData) => void;
}

const SeizureInput: React.FC<SeizureInputProps> = ({ data, onChange }) => {
  const [localData, setLocalData] = useState<SeizureData>(data);

  const handleChange = (field: keyof SeizureData, value: string | string[]) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(newData);
  };

  const handleSymptomToggle = (symptom: string) => {
    const currentSymptoms = localData.symptoms || [];
    const newSymptoms = currentSymptoms.includes(symptom)
      ? currentSymptoms.filter(s => s !== symptom)
      : [...currentSymptoms, symptom];
    handleChange('symptoms', newSymptoms);
  };

  const seizureTypes = [
    { value: 'none', label: '発作なし', color: 'bg-green-100 text-green-700' },
    { value: 'tonic_clonic', label: '強直間代発作', color: 'bg-red-100 text-red-700' },
    { value: 'absence', label: '欠神発作', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'myoclonic', label: 'ミオクロニー発作', color: 'bg-orange-100 text-orange-700' },
    { value: 'atonic', label: '脱力発作', color: 'bg-purple-100 text-purple-700' },
    { value: 'focal', label: '焦点発作', color: 'bg-blue-100 text-blue-700' },
    { value: 'other', label: 'その他', color: 'bg-gray-100 text-gray-700' }
  ];

  const durations = [
    { value: 'under_1min', label: '1分未満' },
    { value: '1_5min', label: '1-5分' },
    { value: '5_10min', label: '5-10分' },
    { value: '10_30min', label: '10-30分' },
    { value: 'over_30min', label: '30分以上' }
  ];

  const symptoms = [
    '意識消失',
    'けいれん',
    '硬直',
    '脱力',
    '眼球上転',
    '口から泡',
    '失禁',
    '嘔吐',
    '発熱',
    '呼吸停止',
    'チアノーゼ',
    '瞳孔散大',
    '発汗',
    '顔面蒼白',
    '不規則呼吸'
  ];

  const auras = [
    { value: 'none', label: 'なし' },
    { value: 'visual', label: '視覚異常' },
    { value: 'auditory', label: '聴覚異常' },
    { value: 'olfactory', label: '嗅覚異常' },
    { value: 'gustatory', label: '味覚異常' },
    { value: 'somatic', label: '体感異常' },
    { value: 'psychic', label: '精神症状' },
    { value: 'autonomic', label: '自律神経症状' }
  ];

  const medications = [
    { value: 'none', label: 'なし' },
    { value: 'diazepam', label: 'ジアゼパム' },
    { value: 'midazolam', label: 'ミダゾラム' },
    { value: 'phenytoin', label: 'フェニトイン' },
    { value: 'valproate', label: 'バルプロ酸' },
    { value: 'levetiracetam', label: 'レベチラセタム' },
    { value: 'other', label: 'その他' }
  ];

  const postSeizureStates = [
    { value: 'normal', label: '正常' },
    { value: 'sleepy', label: '眠気' },
    { value: 'confused', label: '混乱' },
    { value: 'agitated', label: '興奮' },
    { value: 'weak', label: '脱力' },
    { value: 'headache', label: '頭痛' },
    { value: 'nausea', label: '吐き気' }
  ];

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h3 className="text-lg font-semibold text-gray-800">発作記録</h3>
      </div>

      {/* 発作の有無 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">発作の有無</label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 'no', label: '発作なし' },
            { value: 'yes', label: '発作あり' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange('hasSeizure', option.value)}
              className={`p-4 border rounded-lg transition-colors ${
                localData.hasSeizure === option.value
                  ? option.value === 'no'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-lg font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {localData.hasSeizure === 'yes' && (
        <>
          {/* 発作の種類 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">発作の種類</label>
            <div className="grid grid-cols-2 gap-2">
              {seizureTypes.filter(type => type.value !== 'none').map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange('seizureType', type.value)}
                  className={`p-3 border rounded-lg transition-colors ${
                    localData.seizureType === type.value
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 発作時間 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">発作時刻</label>
              <input
                type="time"
                value={localData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">持続時間</label>
              <div className="grid grid-cols-1 gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration.value}
                    type="button"
                    onClick={() => handleChange('duration', duration.value)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      localData.duration === duration.value
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 症状 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">症状（複数選択可）</label>
            <div className="grid grid-cols-3 gap-2">
              {symptoms.map((symptom) => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => handleSymptomToggle(symptom)}
                  className={`p-2 text-xs border rounded-md transition-colors ${
                    localData.symptoms?.includes(symptom)
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* 前兆 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Eye className="w-4 h-4 text-purple-500" />
              前兆（アウラ）
            </label>
            <div className="grid grid-cols-4 gap-2">
              {auras.map((aura) => (
                <button
                  key={aura.value}
                  type="button"
                  onClick={() => handleChange('aura', aura.value)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.aura === aura.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {aura.label}
                </button>
              ))}
            </div>
          </div>

          {/* 投薬 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Brain className="w-4 h-4 text-blue-500" />
              投薬
            </label>
            <div className="grid grid-cols-4 gap-2">
              {medications.map((med) => (
                <button
                  key={med.value}
                  type="button"
                  onClick={() => handleChange('medication', med.value)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.medication === med.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {med.label}
                </button>
              ))}
            </div>
          </div>

          {/* 発作後の状態 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">発作後の状態</label>
            <div className="grid grid-cols-4 gap-2">
              {postSeizureStates.map((state) => (
                <button
                  key={state.value}
                  type="button"
                  onClick={() => handleChange('postSeizure', state.value)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.postSeizure === state.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {state.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 特記事項 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">特記事項</label>
        <textarea
          value={localData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="発作に関する特記事項があれば記入してください..."
        />
      </div>

      {/* 定型文ボタン */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">定型文</label>
        <div className="flex flex-wrap gap-2">
          {[
            '発作なし',
            '軽微な発作',
            '重篤な発作',
            '救急搬送',
            '前兆あり',
            '前兆なし',
            '投薬効果あり',
            '投薬効果なし',
            '意識回復',
            '意識障害継続',
            'けいれん重積',
            '発熱伴う',
            '外傷なし',
            '外傷あり'
          ].map((template) => (
            <button
              key={template}
              type="button"
              onClick={() => {
                const currentNotes = localData.notes;
                const newNotes = currentNotes ? `${currentNotes}、${template}` : template;
                handleChange('notes', newNotes);
              }}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
            >
              {template}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeizureInput; 