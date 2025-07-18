import React, { useState } from 'react';
import { Heart, Droplets, Pill, Syringe, Shield } from 'lucide-react';

interface CareData {
  positioning: {
    frequency: string;
    method: string;
    skinCondition: string;
  };
  hygiene: {
    type: string;
    method: string;
    assistance: string;
  };
  medication: {
    type: string;
    time: string;
    method: string;
    compliance: string;
  };
  medical: {
    type: string;
    time: string;
    provider: string;
    result: string;
  };
  safety: {
    risk: string;
    measures: string[];
    incidents: string;
  };
  notes: string;
}

interface CareInputProps {
  data: CareData;
  onChange: (data: CareData) => void;
}

const CareInput: React.FC<CareInputProps> = ({ data, onChange }) => {
  const [localData, setLocalData] = useState<CareData>(data);

  const handleChange = (field: keyof CareData, value: string | string[] | any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(newData);
  };

  const handlePositioningChange = (field: keyof CareData['positioning'], value: string) => {
    const newPositioning = { ...localData.positioning, [field]: value };
    handleChange('positioning', newPositioning);
  };

  const handleHygieneChange = (field: keyof CareData['hygiene'], value: string) => {
    const newHygiene = { ...localData.hygiene, [field]: value };
    handleChange('hygiene', newHygiene);
  };

  const handleMedicationChange = (field: keyof CareData['medication'], value: string) => {
    const newMedication = { ...localData.medication, [field]: value };
    handleChange('medication', newMedication);
  };

  const handleMedicalChange = (field: keyof CareData['medical'], value: string) => {
    const newMedical = { ...localData.medical, [field]: value };
    handleChange('medical', newMedical);
  };

  const handleSafetyChange = (field: keyof CareData['safety'], value: string | string[]) => {
    const newSafety = { ...localData.safety, [field]: value };
    handleChange('safety', newSafety);
  };

  const handleSafetyMeasureToggle = (measure: string) => {
    const currentMeasures = localData.safety.measures || [];
    const newMeasures = currentMeasures.includes(measure)
      ? currentMeasures.filter(m => m !== measure)
      : [...currentMeasures, measure];
    handleSafetyChange('measures', newMeasures);
  };

  const positioningFrequencies = [
    { value: 'none', label: 'なし' },
    { value: '2hour', label: '2時間ごと' },
    { value: '3hour', label: '3時間ごと' },
    { value: '4hour', label: '4時間ごと' },
    { value: '6hour', label: '6時間ごと' },
    { value: 'as_needed', label: '必要時' }
  ];

  const positioningMethods = [
    { value: 'supine', label: '仰臥位' },
    { value: 'lateral', label: '側臥位' },
    { value: 'prone', label: '腹臥位' },
    { value: 'sitting', label: '座位' },
    { value: 'semi_fowler', label: 'ファーラー位' }
  ];

  const skinConditions = [
    { value: 'normal', label: '正常', color: 'bg-green-100 text-green-700' },
    { value: 'redness', label: '発赤', color: 'bg-red-100 text-red-700' },
    { value: 'pressure', label: '圧迫痕', color: 'bg-orange-100 text-orange-700' },
    { value: 'ulcer', label: '褥瘡', color: 'bg-red-200 text-red-800' }
  ];

  const hygieneTypes = [
    { value: 'bath', label: '入浴' },
    { value: 'shower', label: 'シャワー' },
    { value: 'bed_bath', label: '清拭' },
    { value: 'hair_wash', label: '洗髪' },
    { value: 'oral_care', label: '口腔ケア' },
    { value: 'none', label: 'なし' }
  ];

  const assistanceLevels = [
    { value: 'independent', label: '自立' },
    { value: 'minimal', label: '最小介助' },
    { value: 'moderate', label: '中等度介助' },
    { value: 'maximal', label: '最大介助' },
    { value: 'dependent', label: '全介助' }
  ];

  const medicationTypes = [
    { value: 'oral', label: '内服薬' },
    { value: 'injection', label: '注射' },
    { value: 'inhalation', label: '吸入' },
    { value: 'topical', label: '外用薬' },
    { value: 'suppository', label: '坐薬' },
    { value: 'none', label: 'なし' }
  ];

  const medicationTimes = [
    { value: 'morning', label: '朝' },
    { value: 'noon', label: '昼' },
    { value: 'evening', label: '夕' },
    { value: 'night', label: '夜' },
    { value: 'as_needed', label: '必要時' }
  ];

  const complianceLevels = [
    { value: 'good', label: '良好', color: 'bg-green-100 text-green-700' },
    { value: 'fair', label: '普通', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'poor', label: '不良', color: 'bg-red-100 text-red-700' },
    { value: 'refused', label: '拒否', color: 'bg-red-200 text-red-800' }
  ];

  const medicalTypes = [
    { value: 'none', label: 'なし' },
    { value: 'blood_test', label: '採血' },
    { value: 'xray', label: 'レントゲン' },
    { value: 'ecg', label: '心電図' },
    { value: 'ultrasound', label: 'エコー' },
    { value: 'catheter', label: 'カテーテル' },
    { value: 'drainage', label: 'ドレナージ' },
    { value: 'other', label: 'その他' }
  ];

  const providers = [
    { value: 'doctor', label: '医師' },
    { value: 'nurse', label: '看護師' },
    { value: 'therapist', label: '療法士' },
    { value: 'caregiver', label: '介護職員' }
  ];

  const results = [
    { value: 'normal', label: '正常', color: 'bg-green-100 text-green-700' },
    { value: 'abnormal', label: '異常', color: 'bg-red-100 text-red-700' },
    { value: 'pending', label: '結果待ち', color: 'bg-yellow-100 text-yellow-700' }
  ];

  const safetyRisks = [
    { value: 'none', label: 'なし', color: 'bg-green-100 text-green-700' },
    { value: 'fall', label: '転倒', color: 'bg-red-100 text-red-700' },
    { value: 'aspiration', label: '誤嚥', color: 'bg-orange-100 text-orange-700' },
    { value: 'seizure', label: '発作', color: 'bg-purple-100 text-purple-700' },
    { value: 'infection', label: '感染', color: 'bg-yellow-100 text-yellow-700' }
  ];

  const safetyMeasures = [
    'ベッド柵使用',
    '車椅子ベルト',
    '体位変換',
    '吸引準備',
    '酸素準備',
    '救急用品準備',
    '監視強化',
    '環境整備'
  ];

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-red-600" />
        <h3 className="text-lg font-semibold text-gray-800">ケア記録</h3>
      </div>

      {/* 体位変換 */}
      <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-medium text-gray-700">体位変換</h4>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">頻度</label>
            <div className="grid grid-cols-1 gap-2">
              {positioningFrequencies.map((freq) => (
                <button
                  key={freq.value}
                  type="button"
                  onClick={() => handlePositioningChange('frequency', freq.value)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.positioning.frequency === freq.value
                      ? 'border-blue-500 bg-blue-100 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">方法</label>
            <div className="grid grid-cols-1 gap-2">
              {positioningMethods.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => handlePositioningChange('method', method.value)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.positioning.method === method.value
                      ? 'border-blue-500 bg-blue-100 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">皮膚状態</label>
            <div className="grid grid-cols-1 gap-2">
              {skinConditions.map((condition) => (
                <button
                  key={condition.value}
                  type="button"
                  onClick={() => handlePositioningChange('skinCondition', condition.value)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.positioning.skinCondition === condition.value
                      ? 'border-blue-500 bg-blue-100 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {condition.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 清潔ケア */}
      <div className="space-y-4 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-green-600" />
          <h4 className="text-sm font-medium text-gray-700">清潔ケア</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">種類</label>
            <div className="grid grid-cols-1 gap-2">
              {hygieneTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleHygieneChange('type', type.value)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.hygiene.type === type.value
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">介助方法</label>
              <div className="grid grid-cols-1 gap-2">
                {assistanceLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => handleHygieneChange('assistance', level.value)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      localData.hygiene.assistance === level.value
                        ? 'border-green-500 bg-green-100 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 服薬 */}
      <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Pill className="w-4 h-4 text-purple-600" />
          <h4 className="text-sm font-medium text-gray-700">服薬</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">種類</label>
            <div className="grid grid-cols-1 gap-2">
              {medicationTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleMedicationChange('type', type.value)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.medication.type === type.value
                      ? 'border-purple-500 bg-purple-100 text-purple-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">時間</label>
              <div className="grid grid-cols-1 gap-2">
                {medicationTimes.map((time) => (
                  <button
                    key={time.value}
                    type="button"
                    onClick={() => handleMedicationChange('time', time.value)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      localData.medication.time === time.value
                        ? 'border-purple-500 bg-purple-100 text-purple-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">服薬状況</label>
              <div className="grid grid-cols-1 gap-2">
                {complianceLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => handleMedicationChange('compliance', level.value)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      localData.medication.compliance === level.value
                        ? 'border-purple-500 bg-purple-100 text-purple-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 医療処置 */}
      <div className="space-y-4 p-4 bg-orange-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Syringe className="w-4 h-4 text-orange-600" />
          <h4 className="text-sm font-medium text-gray-700">医療処置</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">種類</label>
            <div className="grid grid-cols-1 gap-2">
              {medicalTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleMedicalChange('type', type.value)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.medical.type === type.value
                      ? 'border-orange-500 bg-orange-100 text-orange-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">実施者</label>
              <div className="grid grid-cols-1 gap-2">
                {providers.map((provider) => (
                  <button
                    key={provider.value}
                    type="button"
                    onClick={() => handleMedicalChange('provider', provider.value)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      localData.medical.provider === provider.value
                        ? 'border-orange-500 bg-orange-100 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {provider.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">結果</label>
              <div className="grid grid-cols-1 gap-2">
                {results.map((result) => (
                  <button
                    key={result.value}
                    type="button"
                    onClick={() => handleMedicalChange('result', result.value)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      localData.medical.result === result.value
                        ? 'border-orange-500 bg-orange-100 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {result.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 安全対策 */}
      <div className="space-y-4 p-4 bg-red-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-600" />
          <h4 className="text-sm font-medium text-gray-700">安全対策</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">リスク</label>
            <div className="grid grid-cols-1 gap-2">
              {safetyRisks.map((risk) => (
                <button
                  key={risk.value}
                  type="button"
                  onClick={() => handleSafetyChange('risk', risk.value)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.safety.risk === risk.value
                      ? 'border-red-500 bg-red-100 text-red-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {risk.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">対策（複数選択可）</label>
            <div className="grid grid-cols-1 gap-2">
              {safetyMeasures.map((measure) => (
                <button
                  key={measure}
                  type="button"
                  onClick={() => handleSafetyMeasureToggle(measure)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.safety.measures?.includes(measure)
                      ? 'border-red-500 bg-red-100 text-red-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {measure}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">事故・インシデント</label>
          <textarea
            value={localData.safety.incidents}
            onChange={(e) => handleSafetyChange('incidents', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="事故やインシデントがあれば記入してください..."
          />
        </div>
      </div>

      {/* 特記事項 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">特記事項</label>
        <textarea
          value={localData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="ケアに関する特記事項があれば記入してください..."
        />
      </div>

      {/* 定型文ボタン */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">定型文</label>
        <div className="flex flex-wrap gap-2">
          {[
            '体位変換実施',
            '皮膚状態良好',
            '褥瘡リスク',
            '清潔ケア実施',
            '服薬完了',
            '服薬拒否',
            '医療処置実施',
            '安全確保',
            '事故なし',
            '事故あり',
            '介助必要',
            '自立可能',
            '協力的',
            '非協力的',
            '状態安定',
            '状態変化'
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

export default CareInput; 