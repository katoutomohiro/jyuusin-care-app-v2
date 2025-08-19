import React, { useState } from 'react';
import { AlertTriangle, Thermometer, Heart, Droplets, Eye, Clock } from 'lucide-react';

interface IllnessFormProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

const IllnessForm: React.FC<IllnessFormProps> = ({ onSave, isSubmitting }) => {
  const [formData, setFormData] = useState({
    record_time: new Date().toLocaleTimeString('ja-JP', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    illness_type: '',
    body_temperature: '',
    temperature_measurement_site: '腋下',
    respiratory_status: '',
    sputum_characteristics: '',
    facial_condition: '',
    consciousness_level: '',
    muscle_tension: '',
    appetite_status: '',
    nausea_vomiting: '',
    skin_condition: '',
    urination_status: '',
    defecation_status: '',
    sleep_condition: '',
    activity_level: '',
    pain_signs: '',
    seizure_presence: '',
    oxygen_saturation: '',
    additional_observations: '',
    care_actions: ''
  });

  // 体調不良の種類（20項目）
  const illnessTypes = [
    { value: 'fever', label: '発熱', icon: '🌡️', color: 'text-red-600' },
    { value: 'respiratory_distress', label: '呼吸困難', icon: '🫁', color: 'text-blue-600' },
    { value: 'nausea_vomiting', label: '嘔気・嘔吐', icon: '🤢', color: 'text-green-600' },
    { value: 'appetite_loss', label: '食欲不振', icon: '🍽️', color: 'text-orange-600' },
    { value: 'consciousness_change', label: '意識レベル低下', icon: '😵', color: 'text-purple-600' },
    { value: 'facial_pallor', label: '顔色不良', icon: '😰', color: 'text-gray-600' },
    { value: 'sputum_increase', label: '痰の増加', icon: '💧', color: 'text-blue-400' },
    { value: 'muscle_tension_change', label: '筋緊張の変化', icon: '💪', color: 'text-red-400' },
    { value: 'seizure_activity', label: '発作活動', icon: '⚡', color: 'text-yellow-600' },
    { value: 'skin_abnormality', label: '皮膚異常', icon: '🩹', color: 'text-pink-600' },
    { value: 'urination_difficulty', label: '排尿困難', icon: '🚽', color: 'text-cyan-600' },
    { value: 'constipation', label: '便秘', icon: '🤰', color: 'text-brown-600' },
    { value: 'sleep_disturbance', label: '睡眠障害', icon: '😴', color: 'text-indigo-600' },
    { value: 'activity_decline', label: '活動性低下', icon: '😔', color: 'text-gray-500' },
    { value: 'pain_signs', label: '疼痛兆候', icon: '😣', color: 'text-red-500' },
    { value: 'oxygen_saturation_low', label: '酸素飽和度低下', icon: '🩺', color: 'text-blue-500' },
    { value: 'temperature_regulation', label: '体温調節障害', icon: '🌡️', color: 'text-orange-500' },
    { value: 'gastric_reflux', label: '胃食道逆流', icon: '🤮', color: 'text-green-500' },
    { value: 'respiratory_infection', label: '呼吸器感染症疑い', icon: '🦠', color: 'text-red-600' },
    { value: 'general_malaise', label: '全身倦怠感', icon: '😪', color: 'text-purple-500' }
  ];

  // 体温測定部位
  const temperatureSites = [
    '腋下', '耳内', '額', '口腔', '直腸'
  ];

  // 呼吸状態
  const respiratoryStatuses = [
    '正常', '浅い呼吸', '深い呼吸', '不規則', '努力性呼吸', '陥没呼吸', '喘鳴あり', '呼吸音減弱', '副雑音あり'
  ];

  // 痰の性状
  const sputumCharacteristics = [
    '少量・透明', '少量・白色', '中等量・白色', '中等量・黄色', '多量・黄色', '多量・緑色', '血液混入', '粘稠', '泡沫状'
  ];

  // 顔色・皮膚状態
  const facialConditions = [
    '正常', '蒼白', 'チアノーゼ', '紅潮', '発疹', '浮腫', '発汗', '乾燥', '冷感'
  ];

  // 意識レベル
  const consciousnessLevels = [
    '清明', '軽度混濁', '中等度混濁', '重度混濁', '昏睡', '反応鈍い', '刺激に反応', '無反応'
  ];

  // 筋緊張
  const muscleTensions = [
    '正常', '亢進', '低下', '弛緩', '痙性', '固縮', '不随意運動', '振戦'
  ];

  // 食欲状態
  const appetiteStatuses = [
    '正常', '軽度低下', '中等度低下', '著明低下', '全く摂取しない', '選択的摂取', '嚥下困難', '誤嚥リスク'
  ];

  // 嘔気・嘔吐
  const nauseaVomitingOptions = [
    'なし', '軽度嘔気', '中等度嘔気', '嘔吐1回', '嘔吐2-3回', '嘔吐4回以上', '胃内容物', '胆汁性', '血液混入'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center mb-6">
        <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">体調不良記録</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 記録時刻 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            記録時刻 *
          </label>
          <input
            type="time"
            value={formData.record_time}
            onChange={(e) => handleInputChange('record_time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        {/* 体調不良の種類 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            体調不良の種類 *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {illnessTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange('illness_type', type.value)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  formData.illness_type === type.value
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-red-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">{type.icon}</span>
                  <span className={`text-sm font-medium ${type.color}`}>
                    {type.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 体温 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Thermometer className="w-4 h-4 inline mr-1" />
              体温（℃）
            </label>
            <input
              type="number"
              step="0.1"
              min="30"
              max="45"
              value={formData.body_temperature}
              onChange={(e) => handleInputChange('body_temperature', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="36.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              測定部位
            </label>
            <select
              value={formData.temperature_measurement_site}
              onChange={(e) => handleInputChange('temperature_measurement_site', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {temperatureSites.map((site) => (
                <option key={site} value={site}>{site}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 呼吸状態 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            呼吸状態
          </label>
          <div className="grid grid-cols-3 gap-2">
            {respiratoryStatuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleInputChange('respiratory_status', status)}
                className={`p-2 rounded-lg border text-sm ${
                  formData.respiratory_status === status
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* 痰の性状 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Droplets className="w-4 h-4 inline mr-1" />
            痰の性状
          </label>
          <div className="grid grid-cols-3 gap-2">
            {sputumCharacteristics.map((char) => (
              <button
                key={char}
                type="button"
                onClick={() => handleInputChange('sputum_characteristics', char)}
                className={`p-2 rounded-lg border text-sm ${
                  formData.sputum_characteristics === char
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        {/* 顔色・皮膚状態 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Eye className="w-4 h-4 inline mr-1" />
            顔色・皮膚状態
          </label>
          <div className="grid grid-cols-3 gap-2">
            {facialConditions.map((condition) => (
              <button
                key={condition}
                type="button"
                onClick={() => handleInputChange('facial_condition', condition)}
                className={`p-2 rounded-lg border text-sm ${
                  formData.facial_condition === condition
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>

        {/* 意識レベル */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            意識レベル
          </label>
          <div className="grid grid-cols-4 gap-2">
            {consciousnessLevels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => handleInputChange('consciousness_level', level)}
                className={`p-2 rounded-lg border text-sm ${
                  formData.consciousness_level === level
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* その他の観察項目 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            追加観察事項・実施したケア
          </label>
          <textarea
            value={formData.additional_observations}
            onChange={(e) => handleInputChange('additional_observations', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="例：水分摂取促進、体位変換実施、医師に報告済み"
          />
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !formData.illness_type}
            className={`px-6 py-2 rounded-lg font-medium ${
              isSubmitting || !formData.illness_type
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isSubmitting ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IllnessForm;