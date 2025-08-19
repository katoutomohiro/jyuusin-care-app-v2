/**
 * 【魂の記録・コミュニケーションフォーム】
 * 心の対話と表現の記録
 */
import React, { useState } from 'react';

interface CommunicationFormData {
  communication_type: string;
  interaction_partner: string;
  communication_method: string[];
  response_quality: string;
  emotional_expression: string[];
  verbal_communication: {
    sounds_made: boolean;
    words_attempted: boolean;
    words_clear: string[];
    voice_tone: string;
  };
  non_verbal_communication: {
    eye_contact: string;
    facial_expressions: string[];
    gestures: string[];
    body_language: string;
  };
  understanding_level: string;
  attention_span: string;
  social_interaction: {
    initiative_taken: boolean;
    response_to_others: string;
    preferred_activities: string[];
  };
  sensory_preferences: {
    visual_stimuli: string[];
    auditory_stimuli: string[];
    tactile_preferences: string[];
  };
  communication_goals_progress: string;
  environmental_factors: string[];
  assistive_technology: string;
  family_communication_notes: string;
  staff_observations: string;
}

interface CommunicationFormProps {
  onSave: (data: CommunicationFormData) => void;
  isSubmitting?: boolean;
}

const CommunicationForm: React.FC<CommunicationFormProps> = ({ onSave, isSubmitting = false }) => {
  const [formData, setFormData] = useState<CommunicationFormData>({
    communication_type: '',
    interaction_partner: '',
    communication_method: [],
    response_quality: '',
    emotional_expression: [],
    verbal_communication: {
      sounds_made: false,
      words_attempted: false,
      words_clear: [],
      voice_tone: ''
    },
    non_verbal_communication: {
      eye_contact: '',
      facial_expressions: [],
      gestures: [],
      body_language: ''
    },
    understanding_level: '',
    attention_span: '',
    social_interaction: {
      initiative_taken: false,
      response_to_others: '',
      preferred_activities: []
    },
    sensory_preferences: {
      visual_stimuli: [],
      auditory_stimuli: [],
      tactile_preferences: []
    },
    communication_goals_progress: '',
    environmental_factors: [],
    assistive_technology: '',
    family_communication_notes: '',
    staff_observations: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const communicationTypes = [
    '言語療法セッション',
    '日常会話',
    '活動中の交流',
    '食事時の交流',
    '遊び・レクリエーション',
    '家族との面会',
    '集団活動',
    'その他'
  ];

  const interactionPartners = [
    'スタッフ（1対1）',
    'スタッフ（複数）',
    '他の利用者',
    '家族',
    'ボランティア',
    'セラピスト',
    'その他'
  ];

  const communicationMethods = [
    '音声・発話',
    '身振り・手振り',
    '表情',
    'アイコンタクト',
    '指差し',
    '絵カード・PECS',
    'タブレット・AAC',
    '筆談',
    '触覚・タッチ',
    'その他'
  ];

  const responseQualities = [
    '積極的で明確',
    '積極的だが不明確',
    '受動的だが反応あり',
    '限定的な反応',
    '反応が困難',
    '拒否的反応'
  ];

  const emotionalExpressions = [
    '喜び・笑顔',
    '興味・関心',
    '安心・リラックス',
    '驚き',
    '困惑',
    '不安・心配',
    '怒り・不機嫌',
    '悲しみ',
    '無表情',
    'その他'
  ];

  const voiceTones = [
    '明るく元気',
    '穏やか',
    '小さな声',
    '大きな声',
    '単調',
    '感情的',
    '不明瞭',
    'その他'
  ];

  const eyeContactLevels = [
    '積極的にアイコンタクト',
    '時々アイコンタクト',
    '短時間のアイコンタクト',
    'アイコンタクト回避',
    'アイコンタクト困難'
  ];

  const facialExpressions = [
    '豊かな表情',
    '微笑み',
    '真剣な表情',
    '困った表情',
    '無表情',
    '眉をひそめる',
    '口元の動き',
    'その他'
  ];

  const gestures = [
    '手を振る',
    '指差し',
    '拍手',
    '手をつなぐ',
    '押し返す',
    '引っ張る',
    '身体を向ける',
    'その他'
  ];

  const understandingLevels = [
    '完全に理解',
    'ほぼ理解',
    '部分的理解',
    '限定的理解',
    '理解困難'
  ];

  const attentionSpans = [
    '30分以上集中',
    '15-30分集中',
    '5-15分集中',
    '数分間集中',
    '集中困難'
  ];

  const responseToOthers = [
    '自然に反応',
    '促されて反応',
    '選択的に反応',
    '限定的反応',
    '反応困難'
  ];

  const preferredActivities = [
    '音楽活動',
    '絵本・読み聞かせ',
    '手遊び歌',
    '感覚遊び',
    'おもちゃ遊び',
    '散歩・外出',
    '食事関連',
    'その他'
  ];

  const visualStimuli = [
    '明るい色彩',
    '動く物体',
    '光・照明',
    '絵・写真',
    '鏡',
    'その他'
  ];

  const auditoryStimuli = [
    '音楽',
    '歌声',
    '楽器音',
    '自然音',
    '機械音',
    '声のトーン',
    'その他'
  ];

  const tactilePreferences = [
    '柔らかい触感',
    '硬い触感',
    '温かい感触',
    '冷たい感触',
    '振動',
    'マッサージ',
    'その他'
  ];

  const environmentalFactors = [
    '静かな環境',
    '騒がしい環境',
    '明るい環境',
    '暗い環境',
    '少人数',
    '大勢の人',
    '馴染みの場所',
    '新しい場所'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">💬</div>
          <h3 className="text-lg font-bold text-gray-800">【コミュニケーション記録】</h3>
          <p className="text-sm text-gray-600">魂と魂の対話の神聖なる記録</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* コミュニケーション種別 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💬 コミュニケーション種別
            </label>
            <select
              value={formData.communication_type}
              onChange={(e) => setFormData({ ...formData, communication_type: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">選択してください</option>
              {communicationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* 交流相手 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              👥 交流相手
            </label>
            <select
              value={formData.interaction_partner}
              onChange={(e) => setFormData({ ...formData, interaction_partner: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">選択してください</option>
              {interactionPartners.map((partner) => (
                <option key={partner} value={partner}>
                  {partner}
                </option>
              ))}
            </select>
          </div>

          {/* コミュニケーション方法 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🗣️ コミュニケーション方法（複数選択可）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {communicationMethods.map((method) => (
                <label key={method} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={formData.communication_method.includes(method)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          communication_method: [...formData.communication_method, method]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          communication_method: formData.communication_method.filter(m => m !== method)
                        });
                      }
                    }}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>

          {/* 反応の質 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📊 反応の質・レベル
            </label>
            <select
              value={formData.response_quality}
              onChange={(e) => setFormData({ ...formData, response_quality: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">選択してください</option>
              {responseQualities.map((quality) => (
                <option key={quality} value={quality}>
                  {quality}
                </option>
              ))}
            </select>
          </div>

          {/* 感情表現 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              😊 感情表現（複数選択可）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {emotionalExpressions.map((expression) => (
                <label key={expression} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={formData.emotional_expression.includes(expression)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          emotional_expression: [...formData.emotional_expression, expression]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          emotional_expression: formData.emotional_expression.filter(e => e !== expression)
                        });
                      }
                    }}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  {expression}
                </label>
              ))}
            </div>
          </div>

          {/* 言語的コミュニケーション */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">🗣️ 言語的コミュニケーション</h4>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.verbal_communication.sounds_made}
                  onChange={(e) => setFormData({
                    ...formData,
                    verbal_communication: {
                      ...formData.verbal_communication,
                      sounds_made: e.target.checked
                    }
                  })}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-semibold">声・音を出した</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.verbal_communication.words_attempted}
                  onChange={(e) => setFormData({
                    ...formData,
                    verbal_communication: {
                      ...formData.verbal_communication,
                      words_attempted: e.target.checked
                    }
                  })}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-semibold">言葉を話そうとした</span>
              </label>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  明確に聞こえた言葉
                </label>
                <input
                  type="text"
                  value={formData.verbal_communication.words_clear.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    verbal_communication: {
                      ...formData.verbal_communication,
                      words_clear: e.target.value.split(',').map(w => w.trim()).filter(w => w)
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="聞こえた言葉をカンマ区切りで入力"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  声のトーン
                </label>
                <select
                  value={formData.verbal_communication.voice_tone}
                  onChange={(e) => setFormData({
                    ...formData,
                    verbal_communication: {
                      ...formData.verbal_communication,
                      voice_tone: e.target.value
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  {voiceTones.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 非言語的コミュニケーション */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">👁️ 非言語的コミュニケーション</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  アイコンタクト
                </label>
                <select
                  value={formData.non_verbal_communication.eye_contact}
                  onChange={(e) => setFormData({
                    ...formData,
                    non_verbal_communication: {
                      ...formData.non_verbal_communication,
                      eye_contact: e.target.value
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  {eyeContactLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  表情（複数選択可）
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {facialExpressions.map((expression) => (
                    <label key={expression} className="flex items-center text-xs">
                      <input
                        type="checkbox"
                        checked={formData.non_verbal_communication.facial_expressions.includes(expression)}
                        onChange={(e) => {
                          const currentExpressions = formData.non_verbal_communication.facial_expressions;
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              non_verbal_communication: {
                                ...formData.non_verbal_communication,
                                facial_expressions: [...currentExpressions, expression]
                              }
                            });
                          } else {
                            setFormData({
                              ...formData,
                              non_verbal_communication: {
                                ...formData.non_verbal_communication,
                                facial_expressions: currentExpressions.filter(e => e !== expression)
                              }
                            });
                          }
                        }}
                        className="mr-1 h-3 w-3 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      {expression}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 理解レベル */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🧠 理解レベル
            </label>
            <select
              value={formData.understanding_level}
              onChange={(e) => setFormData({ ...formData, understanding_level: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">選択してください</option>
              {understandingLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* 注意持続時間 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ⏰ 注意持続時間
            </label>
            <select
              value={formData.attention_span}
              onChange={(e) => setFormData({ ...formData, attention_span: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">選択してください</option>
              {attentionSpans.map((span) => (
                <option key={span} value={span}>
                  {span}
                </option>
              ))}
            </select>
          </div>

          {/* 環境要因 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🌍 環境要因（複数選択可）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {environmentalFactors.map((factor) => (
                <label key={factor} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={formData.environmental_factors.includes(factor)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          environmental_factors: [...formData.environmental_factors, factor]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          environmental_factors: formData.environmental_factors.filter(f => f !== factor)
                        });
                      }
                    }}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  {factor}
                </label>
              ))}
            </div>
          </div>

          {/* コミュニケーション目標の進捗 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎯 コミュニケーション目標の進捗
            </label>
            <textarea
              value={formData.communication_goals_progress}
              onChange={(e) => setFormData({ ...formData, communication_goals_progress: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="設定している目標に対する今日の進捗・変化"
              rows={3}
            />
          </div>

          {/* 家族への連絡事項 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              👨‍👩‍👧‍👦 家族への連絡事項
            </label>
            <textarea
              value={formData.family_communication_notes}
              onChange={(e) => setFormData({ ...formData, family_communication_notes: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="家族に伝えたいコミュニケーションの様子、成長の兆し"
              rows={2}
            />
          </div>

          {/* スタッフ観察記録 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📝 スタッフ観察記録
            </label>
            <textarea
              value={formData.staff_observations}
              onChange={(e) => setFormData({ ...formData, staff_observations: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="総合的な観察記録、今後の支援方針、引き継ぎ事項"
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
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200'
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
              <span>💬 コミュニケーション記録を保存</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunicationForm;
