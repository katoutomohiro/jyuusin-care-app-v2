/**
 * 【魂の記録・入浴清潔ケアフォーム】
 * 清らかな体と心の記録
 */
import React, { useState } from 'react';

interface BathingFormData {
  bathing_type: string;
  bathing_time: string;
  water_temperature: number;
  duration_minutes: number;
  assistance_level: string;
  bathing_position: string;
  safety_equipment: string[];
  skin_condition: {
    overall_condition: string;
    problem_areas: string[];
    redness_areas: string[];
    dryness_level: string;
    special_care_needed: string[];
  };
  hygiene_care: {
    hair_washing: boolean;
    hair_condition: string;
    oral_care: boolean;
    oral_condition: string;
    nail_care: boolean;
    nail_condition: string;
  };
  emotional_response: {
    enjoyment_level: string;
    anxiety_level: string;
    cooperation_level: string;
    preferred_elements: string[];
  };
  physical_response: {
    muscle_tension: string;
    circulation_response: string;
    breathing_pattern: string;
    vital_signs_stable: boolean;
  };
  sensory_preferences: {
    water_temperature_preference: string;
    soap_fragrance_response: string;
    tactile_sensitivity: string;
    environmental_preferences: string[];
  };
  products_used: {
    soap_shampoo: string;
    moisturizer: string;
    special_products: string[];
  };
  environmental_factors: {
    room_temperature: number;
    humidity_level: string;
    lighting: string;
    noise_level: string;
  };
  post_bath_care: {
    moisturizing_done: boolean;
    positioning_care: string;
    clothing_assistance: string;
    relaxation_period: number;
  };
  family_notes: string;
  staff_observations: string;
  next_session_notes: string;
}

interface BathingFormProps {
  onSave: (data: BathingFormData) => void;
  isSubmitting?: boolean;
}

const BathingForm: React.FC<BathingFormProps> = ({ onSave, isSubmitting = false }) => {
  const [formData, setFormData] = useState<BathingFormData>({
    bathing_type: '',
    bathing_time: '',
    water_temperature: 0,
    duration_minutes: 0,
    assistance_level: '',
    bathing_position: '',
    safety_equipment: [],
    skin_condition: {
      overall_condition: '',
      problem_areas: [],
      redness_areas: [],
      dryness_level: '',
      special_care_needed: []
    },
    hygiene_care: {
      hair_washing: false,
      hair_condition: '',
      oral_care: false,
      oral_condition: '',
      nail_care: false,
      nail_condition: ''
    },
    emotional_response: {
      enjoyment_level: '',
      anxiety_level: '',
      cooperation_level: '',
      preferred_elements: []
    },
    physical_response: {
      muscle_tension: '',
      circulation_response: '',
      breathing_pattern: '',
      vital_signs_stable: true
    },
    sensory_preferences: {
      water_temperature_preference: '',
      soap_fragrance_response: '',
      tactile_sensitivity: '',
      environmental_preferences: []
    },
    products_used: {
      soap_shampoo: '',
      moisturizer: '',
      special_products: []
    },
    environmental_factors: {
      room_temperature: 0,
      humidity_level: '',
      lighting: '',
      noise_level: ''
    },
    post_bath_care: {
      moisturizing_done: false,
      positioning_care: '',
      clothing_assistance: '',
      relaxation_period: 0
    },
    family_notes: '',
    staff_observations: '',
    next_session_notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const bathingTypes = [
    '全身浴（浴槽）',
    'シャワー浴',
    '部分浴（手足のみ）',
    '清拭（ベッド上）',
    '機械浴',
    'リフト浴',
    'その他'
  ];

  const assistanceLevels = [
    '自立',
    '見守り',
    '一部介助',
    '中等度介助',
    '重度介助',
    '全介助'
  ];

  const bathingPositions = [
    '座位（椅子）',
    '座位（浴槽内）',
    '仰臥位',
    '側臥位',
    '半座位',
    'リフト使用',
    'その他'
  ];

  const safetyEquipment = [
    '浴槽台',
    'シャワーチェア',
    '手すり',
    '滑り止めマット',
    'リフト',
    '介助ベルト',
    '浮力補助具',
    'その他'
  ];

  const overallConditions = [
    '良好',
    'やや乾燥',
    '乾燥気味',
    '発疹あり',
    '湿疹あり',
    'かぶれあり',
    '要注意',
    'その他'
  ];

  const problemAreas = [
    '背部',
    '臀部',
    '大腿部',
    '膝',
    '足',
    '手',
    '肘',
    '肩',
    'その他'
  ];

  const drynessLevels = [
    '正常',
    '軽度乾燥',
    '中等度乾燥',
    '重度乾燥',
    '極度乾燥'
  ];

  const enjoymentLevels = [
    '非常に楽しんでいた',
    '楽しんでいた',
    '普通',
    'やや嫌がっていた',
    '明らかに嫌がっていた'
  ];

  const anxietyLevels = [
    'リラックス',
    '軽度の緊張',
    '中程度の不安',
    '強い不安',
    'パニック状態'
  ];

  const cooperationLevels = [
    '積極的に協力',
    '協力的',
    '普通',
    'やや非協力的',
    '非協力的'
  ];

  const preferredElements = [
    '温かいお湯',
    'ぬるめのお湯',
    'シャワーの水流',
    '泡立ち',
    '香り',
    '音楽',
    '静かな環境',
    'スタッフの声かけ'
  ];

  const muscleTensionLevels = [
    'リラックス',
    '正常',
    'やや緊張',
    '緊張',
    '強い緊張'
  ];

  const breathingPatterns = [
    '正常',
    '深い呼吸',
    '浅い呼吸',
    '不規則',
    '努力呼吸'
  ];

  const humidityLevels = [
    '適切',
    'やや高い',
    '高い',
    'やや低い',
    '低い'
  ];

  const lightingLevels = [
    '明るい',
    '適度',
    'やや暗い',
    '暗い'
  ];

  const noiseLevels = [
    '静か',
    '適度',
    'やや騒がしい',
    '騒がしい'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🛁</div>
          <h3 className="text-lg font-bold text-gray-800">【入浴・清潔ケア記録】</h3>
          <p className="text-sm text-gray-600">清らかな体と魂の清めの神聖なる記録</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 入浴種別 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🛁 入浴種別
            </label>
            <select
              value={formData.bathing_type}
              onChange={(e) => setFormData({ ...formData, bathing_type: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">選択してください</option>
              {bathingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* 入浴時刻と温度 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🕐 入浴開始時刻
              </label>
              <input
                type="time"
                value={formData.bathing_time}
                onChange={(e) => setFormData({ ...formData, bathing_time: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🌡️ 湯温（℃）
              </label>
              <input
                type="number"
                min="35"
                max="45"
                step="0.5"
                value={formData.water_temperature}
                onChange={(e) => setFormData({ ...formData, water_temperature: parseFloat(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="38.0"
                required
              />
            </div>
          </div>

          {/* 時間と介助レベル */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ⏱️ 入浴時間（分）
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🤝 介助レベル
              </label>
              <select
                value={formData.assistance_level}
                onChange={(e) => setFormData({ ...formData, assistance_level: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">選択してください</option>
                {assistanceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 入浴姿勢 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🪑 入浴姿勢
            </label>
            <select
              value={formData.bathing_position}
              onChange={(e) => setFormData({ ...formData, bathing_position: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">選択してください</option>
              {bathingPositions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

          {/* 安全器具 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🛡️ 使用安全器具（複数選択可）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {safetyEquipment.map((equipment) => (
                <label key={equipment} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={formData.safety_equipment.includes(equipment)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          safety_equipment: [...formData.safety_equipment, equipment]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          safety_equipment: formData.safety_equipment.filter(eq => eq !== equipment)
                        });
                      }
                    }}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  {equipment}
                </label>
              ))}
            </div>
          </div>

          {/* 皮膚状態 */}
          <div className="bg-pink-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">🌸 皮膚状態観察</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  全体的な皮膚状態
                </label>
                <select
                  value={formData.skin_condition.overall_condition}
                  onChange={(e) => setFormData({
                    ...formData,
                    skin_condition: {
                      ...formData.skin_condition,
                      overall_condition: e.target.value
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">選択してください</option>
                  {overallConditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  乾燥レベル
                </label>
                <select
                  value={formData.skin_condition.dryness_level}
                  onChange={(e) => setFormData({
                    ...formData,
                    skin_condition: {
                      ...formData.skin_condition,
                      dryness_level: e.target.value
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  {drynessLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  問題のある部位（複数選択可）
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {problemAreas.map((area) => (
                    <label key={area} className="flex items-center text-xs">
                      <input
                        type="checkbox"
                        checked={formData.skin_condition.problem_areas.includes(area)}
                        onChange={(e) => {
                          const currentAreas = formData.skin_condition.problem_areas;
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              skin_condition: {
                                ...formData.skin_condition,
                                problem_areas: [...currentAreas, area]
                              }
                            });
                          } else {
                            setFormData({
                              ...formData,
                              skin_condition: {
                                ...formData.skin_condition,
                                problem_areas: currentAreas.filter(a => a !== area)
                              }
                            });
                          }
                        }}
                        className="mr-1 h-3 w-3 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      {area}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 清潔ケア */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">✨ 清潔ケア実施内容</h4>
            
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hygiene_care.hair_washing}
                    onChange={(e) => setFormData({
                      ...formData,
                      hygiene_care: {
                        ...formData.hygiene_care,
                        hair_washing: e.target.checked
                      }
                    })}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-semibold">洗髪</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hygiene_care.oral_care}
                    onChange={(e) => setFormData({
                      ...formData,
                      hygiene_care: {
                        ...formData.hygiene_care,
                        oral_care: e.target.checked
                      }
                    })}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-semibold">口腔ケア</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hygiene_care.nail_care}
                    onChange={(e) => setFormData({
                      ...formData,
                      hygiene_care: {
                        ...formData.hygiene_care,
                        nail_care: e.target.checked
                      }
                    })}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-semibold">爪ケア</span>
                </label>
              </div>
            </div>
          </div>

          {/* 感情反応 */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">😊 感情反応・参加状況</h4>
            
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  楽しみ度
                </label>
                <select
                  value={formData.emotional_response.enjoyment_level}
                  onChange={(e) => setFormData({
                    ...formData,
                    emotional_response: {
                      ...formData.emotional_response,
                      enjoyment_level: e.target.value
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">選択してください</option>
                  {enjoymentLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  協力度
                </label>
                <select
                  value={formData.emotional_response.cooperation_level}
                  onChange={(e) => setFormData({
                    ...formData,
                    emotional_response: {
                      ...formData.emotional_response,
                      cooperation_level: e.target.value
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">選択してください</option>
                  {cooperationLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 使用製品 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🧴 使用製品
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.products_used.soap_shampoo}
                onChange={(e) => setFormData({
                  ...formData,
                  products_used: {
                    ...formData.products_used,
                    soap_shampoo: e.target.value
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="石鹸・シャンプー"
              />
              <input
                type="text"
                value={formData.products_used.moisturizer}
                onChange={(e) => setFormData({
                  ...formData,
                  products_used: {
                    ...formData.products_used,
                    moisturizer: e.target.value
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="保湿剤"
              />
            </div>
          </div>

          {/* 入浴後ケア */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">🌟 入浴後ケア</h4>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.post_bath_care.moisturizing_done}
                  onChange={(e) => setFormData({
                    ...formData,
                    post_bath_care: {
                      ...formData.post_bath_care,
                      moisturizing_done: e.target.checked
                    }
                  })}
                  className="mr-2 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <span className="text-sm font-semibold">保湿ケア実施</span>
              </label>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  休息時間（分）
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={formData.post_bath_care.relaxation_period}
                  onChange={(e) => setFormData({
                    ...formData,
                    post_bath_care: {
                      ...formData.post_bath_care,
                      relaxation_period: parseInt(e.target.value)
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="入浴後の休息時間"
                />
              </div>
            </div>
          </div>

          {/* 家族への報告 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              👨‍👩‍👧‍👦 家族への報告事項
            </label>
            <textarea
              value={formData.family_notes}
              onChange={(e) => setFormData({ ...formData, family_notes: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="入浴の様子、皮膚状態、楽しんでいた様子など"
              rows={2}
            />
          </div>

          {/* スタッフ記録 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📝 スタッフ観察記録
            </label>
            <textarea
              value={formData.staff_observations}
              onChange={(e) => setFormData({ ...formData, staff_observations: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="総合的な観察記録、特記事項、今後の注意点"
              rows={3}
              required
            />
          </div>

          {/* 保存ボタン */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200'
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
              <span>🛁 入浴・清潔ケア記録を保存</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BathingForm;
