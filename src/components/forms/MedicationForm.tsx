/**
 * 【魂の記録・服薬フォーム】
 * 生命を繋ぐ薬物の記録
 */
import React, { useState } from 'react';

interface MedicationFormData {
  medication_name: string;
  dosage: string;
  administration_time: string;
  administration_method: string;
  response_observation: string;
  side_effects_observed: boolean;
  side_effects_description: string;
  difficulty_level: string;
  assistance_required: boolean;
  staff_notes: string;
}

interface MedicationFormProps {
  onSave: (data: MedicationFormData) => void;
  isSubmitting?: boolean;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ onSave, isSubmitting = false }) => {
  const [formData, setFormData] = useState<MedicationFormData>({
    medication_name: '',
    dosage: '',
    administration_time: '',
    administration_method: '',
    response_observation: '',
    side_effects_observed: false,
    side_effects_description: '',
    difficulty_level: '',
    assistance_required: false,
    staff_notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const administrationMethods = [
    '経口（錠剤）',
    '経口（液体）',
    '経口（粉薬）',
    '経鼻胃管',
    '胃瘻',
    '座薬',
    '点滴・注射',
    'その他'
  ];

  const difficultyLevels = [
    '問題なく服薬',
    '軽度の困難',
    '中程度の困難',
    '重度の困難',
    '服薬拒否'
  ];

  const responseObservations = [
    '安定した様子',
    '眠気の様子',
    '興奮状態',
    '不安な様子',
    '痛みの軽減',
    '痙攣の抑制',
    'その他の変化',
    '特に変化なし'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">💊</div>
          <h3 className="text-lg font-bold text-gray-800">【服薬の記録】</h3>
          <p className="text-sm text-gray-600">魂の調和を保つ神聖なる薬物記録</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 薬剤名 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💊 薬剤名
            </label>
            <input
              type="text"
              value={formData.medication_name}
              onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="薬剤名を入力"
              required
            />
          </div>

          {/* 用量 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📏 用量・分量
            </label>
            <input
              type="text"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例：1錠、5ml、0.5g"
              required
            />
          </div>

          {/* 投与時刻 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🕐 投与時刻
            </label>
            <input
              type="time"
              value={formData.administration_time}
              onChange={(e) => setFormData({ ...formData, administration_time: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* 投与方法 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔧 投与方法
            </label>
            <select
              value={formData.administration_method}
              onChange={(e) => setFormData({ ...formData, administration_method: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">選択してください</option>
              {administrationMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          {/* 服薬困難度 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📊 服薬困難度
            </label>
            <select
              value={formData.difficulty_level}
              onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">選択してください</option>
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* 反応・観察 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              👁️ 服薬後の反応・観察
            </label>
            <select
              value={formData.response_observation}
              onChange={(e) => setFormData({ ...formData, response_observation: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">選択してください</option>
              {responseObservations.map((response) => (
                <option key={response} value={response}>
                  {response}
                </option>
              ))}
            </select>
          </div>

          {/* 副作用観察 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ⚠️ 副作用の観察
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.side_effects_observed}
                  onChange={(e) => setFormData({ ...formData, side_effects_observed: e.target.checked })}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">副作用が観察された</span>
              </label>
              
              {formData.side_effects_observed && (
                <textarea
                  value={formData.side_effects_description}
                  onChange={(e) => setFormData({ ...formData, side_effects_description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="観察された副作用の詳細を記入"
                  rows={3}
                />
              )}
            </div>
          </div>

          {/* 介助の必要性 */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.assistance_required}
                onChange={(e) => setFormData({ ...formData, assistance_required: e.target.checked })}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-semibold text-gray-700">🤝 介助が必要だった</span>
            </label>
          </div>

          {/* スタッフ記録 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📝 スタッフ記録・特記事項
            </label>
            <textarea
              value={formData.staff_notes}
              onChange={(e) => setFormData({ ...formData, staff_notes: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="服薬に関する特記事項、今後の注意点など"
              rows={3}
            />
          </div>

          {/* 保存ボタン */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                記録中...
              </div>
            ) : (
              <span>💊 服薬記録を保存</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicationForm;
