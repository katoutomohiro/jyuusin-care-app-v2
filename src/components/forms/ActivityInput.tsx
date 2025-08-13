import * as React from "react"; const C: React.FC<any> = () => null; export default C;
import React, { useState } from 'react';

interface ActivityInputProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

const ActivityInput: React.FC<ActivityInputProps> = ({ onSave, isSubmitting }) => {
  // 正確な現在時刻を取得する関数
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    event_timestamp: getCurrentDateTime(),
    activity_type: '',
    activity_category: '',
    participation_level: '',
    duration_minutes: '',
    location: '',
    position_during_activity: '',
    assistance_level: '',
    equipment_used: [] as string[],
    motor_responses: [] as string[],
    cognitive_responses: [] as string[],
    emotional_responses: [] as string[],
    sensory_preferences: [] as string[],
    communication_attempts: [] as string[],
    social_interactions: [] as string[],
    therapeutic_goals: [] as string[],
    achievements: [] as string[],
    challenges: [] as string[],
    environmental_factors: [] as string[],
    medical_considerations: [] as string[],
    intervention_needed: [] as string[],
    notes: ''
  });

  // 活動タイプ（重心特化）
  const activityTypes = [
    'リハビリテーション', '感覚刺激活動', '音楽療法', '遊び・レクリエーション',
    '学習活動', '芸術・創作活動', 'コミュニケーション活動', '運動・体操',
    '散歩・外出', '入浴・清潔ケア', '食事・摂食指導', '呼吸訓練',
    '体位変換・ポジショニング', '機能訓練', 'リラクゼーション',
    '季節行事', '集団活動', '個別活動', 'その他'
  ];

  // 活動カテゴリー
  const activityCategories = [
    'PT（理学療法）', 'OT（作業療法）', 'ST（言語聴覚療法）',
    '感覚統合', '認知訓練', '運動機能訓練', '嚥下訓練',
    '呼吸機能訓練', 'ADL訓練', '社会性訓練',
    '表現活動', '感覚遊び', '音楽・リズム', '美術・工作',
    '水治療法', 'その他'
  ];

  // 参加レベル
  const participationLevels = [
    '積極的参加', '部分的参加', '受動的参加', '観察のみ',
    '拒否・抵抗', '無反応', '眠気・傾眠', '興味関心あり',
    '集中困難', '途中離脱', 'その他'
  ];

  // 場所
  const locationOptions = [
    '訓練室', 'リハビリ室', '多目的ホール', '教室', '居室',
    'ベッドサイド', '屋外', '庭・テラス', 'プール',
    '車椅子', '移動中', 'その他'
  ];

  // 活動時の体位
  const positionOptions = [
    '座位（椅子）', '座位（車椅子）', '座位（床）', '立位',
    '仰臥位', '側臥位', '腹臥位', '半座位',
    '四つ這い', '膝立ち', '抱っこ', '支持立位',
    '歩行', 'その他'
  ];

  // 介助レベル
  const assistanceLevels = [
    '自立', '見守り', '声かけ', '軽介助',
    '中等度介助', '重介助', '全介助', '2人介助',
    '機器使用', 'その他'
  ];

  // 使用機器・道具
  const equipmentUsed = [
    'なし', '車椅子', '歩行器', '立位台', 'ベッド',
    'マット', 'クッション', 'ボール', '楽器',
    '絵具・クレヨン', '粘土', '積み木', 'パズル',
    'タブレット', 'スイッチ', '光る玩具', '音の出る玩具',
    '振動玩具', '鏡', '本・絵本', '吸引器',
    '酸素', 'その他'
  ];

  // 運動反応
  const motorResponses = [
    'なし', '自発的運動', '誘発運動', '反射的運動',
    '手の動き', '足の動き', '頭の動き', '体幹の動き',
    '眼球運動', '表情の変化', '緊張の緩和', '筋緊張亢進',
    '不随意運動', 'けいれん様動作', '協調運動',
    '姿勢保持', 'バランス反応', 'その他'
  ];

  // 認知反応
  const cognitiveResponses = [
    'なし', '注意集中', '視線追従', '音への反応',
    '声かけへの反応', '選択行動', '模倣行動',
    '記憶の表出', '理解の表出', '学習の兆候',
    '問題解決', '想像・創造', '因果関係の理解',
    'その他'
  ];

  // 情緒反応
  const emotionalResponses = [
    '笑顔', '安定した表情', '興味・関心', '喜び',
    '満足感', 'リラックス', '緊張', '不安',
    '恐れ', '怒り', '悲しみ', '拒否',
    '泣く', '興奮', '落ち着き', 'その他'
  ];

  // 感覚嗜好
  const sensoryPreferences = [
    '視覚刺激（光・色）', '聴覚刺激（音楽・音）', '触覚刺激（質感）',
    '振動', '温度刺激', '味覚刺激', '嗅覚刺激',
    '前庭刺激（揺れ）', '固有受容覚刺激', '深部圧覚',
    '軽い接触', '強い刺激', '穏やかな刺激', '動的刺激',
    '静的刺激', 'その他'
  ];

  // コミュニケーション試行
  const communicationAttempts = [
    'なし', '発声', 'クーイング', '喃語', '単語',
    '2語文', '身振り', '表情', '視線',
    'うなずき', '首振り', '指さし', 'タッチ',
    'スイッチ操作', 'VOCA使用', '絵カード',
    'その他'
  ];

  // 社会的相互作用
  const socialInteractions = [
    'なし', 'アイコンタクト', '微笑み返し', '職員との関わり',
    '他利用者との関わり', '集団への参加', '順番を待つ',
    '協力行動', '模倣', '共同注意', '社会的参照',
    '愛着行動', 'その他'
  ];

  // 治療目標
  const therapeuticGoals = [
    '運動機能向上', '認知機能向上', 'コミュニケーション向上',
    '感覚統合', '社会性向上', '情緒安定', 'ADL向上',
    '嚥下機能向上', '呼吸機能向上', '姿勢保持',
    'リラクゼーション', '覚醒レベル向上', '注意集中',
    '体力向上', 'QOL向上', 'その他'
  ];

  // 達成事項
  const achievementsOptions = [
    'なし', '新しい反応', '持続時間延長', '集中力向上',
    '自発性向上', '協力度向上', '技能習得', '理解度向上',
    '表現力向上', '社会性向上', '安定性向上',
    '機能改善', 'その他'
  ];

  // 課題・困難
  const challengesOptions = [
    'なし', '集中困難', '持続困難', '理解困難',
    '運動困難', '協力困難', '覚醒不良', '過度な興奮',
    '不安・恐怖', '体調不良', '疲労', '拒否',
    '発作', '呼吸困難', '体位保持困難', 'その他'
  ];

  // 環境要因
  const environmentalFactors = [
    '静かな環境', '騒がしい環境', '明るい環境', '暗い環境',
    '適温', '暑い', '寒い', '1対1', '小集団',
    '大集団', '馴染みの職員', '初対面の職員',
    '馴染みの場所', '新しい場所', 'その他'
  ];

  // 医学的配慮
  const medicalConsiderations = [
    'なし', '発作注意', '呼吸状態注意', '体温管理',
    '血圧管理', '心拍数管理', '酸素飽和度管理',
    '疲労管理', '体位制限', '時間制限', '感染対策',
    '薬剤の影響', '摂食制限', '水分制限',
    'アレルギー注意', 'その他'
  ];

  // 介入の必要性
  const interventionOptions = [
    '継続実施', 'プログラム調整', '時間調整', '環境調整',
    '介助方法変更', '機器変更', '医師相談', 'PT相談',
    'OT相談', 'ST相談', '心理士相談', '家族相談',
    '薬剤調整', '休息必要', 'その他'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleArrayItem = (array: string[], item: string, setter: (newArray: string[]) => void) => {
    const newArray = array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
    setter(newArray);
  };

  const setCurrentTime = () => {
    const exactNow = getCurrentDateTime();
    setFormData({ ...formData, event_timestamp: exactNow });
    console.log('現在時刻を設定:', new Date().toLocaleString('ja-JP'));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 活動時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏰ 活動時刻 *
        </label>
        <div className="flex space-x-2">
          <input
            type="datetime-local"
            value={formData.event_timestamp}
            onChange={(e) => setFormData({ ...formData, event_timestamp: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
            required
          />
          <button
            type="button"
            onClick={setCurrentTime}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 whitespace-nowrap font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            🕐 今すぐ
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          💡 「今すぐ」ボタンで正確な現在時刻を自動入力
        </p>
      </div>

      {/* 活動タイプ */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🏃 活動タイプ *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {activityTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, activity_type: type })}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                formData.activity_type === type
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 活動カテゴリー */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📚 活動カテゴリー
        </label>
        <div className="grid grid-cols-2 gap-2">
          {activityCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFormData({ ...formData, activity_category: category })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.activity_category === category
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 参加レベル */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🎯 参加レベル
        </label>
        <div className="grid grid-cols-3 gap-2">
          {participationLevels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFormData({ ...formData, participation_level: level })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.participation_level === level
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* 活動時間 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏱️ 活動時間（分）
        </label>
        <input
          type="number"
          value={formData.duration_minutes}
          onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="例: 30（30分間）"
        />
      </div>

      {/* 場所 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📍 場所
        </label>
        <div className="grid grid-cols-3 gap-2">
          {locationOptions.map((location) => (
            <button
              key={location}
              type="button"
              onClick={() => setFormData({ ...formData, location: location })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.location === location
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* 活動時の体位 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🛏️ 活動時の体位
        </label>
        <div className="grid grid-cols-3 gap-2">
          {positionOptions.map((position) => (
            <button
              key={position}
              type="button"
              onClick={() => setFormData({ ...formData, position_during_activity: position })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.position_during_activity === position
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {position}
            </button>
          ))}
        </div>
      </div>

      {/* 介助レベル */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🤝 介助レベル
        </label>
        <div className="grid grid-cols-3 gap-2">
          {assistanceLevels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFormData({ ...formData, assistance_level: level })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.assistance_level === level
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* 使用機器・道具 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔧 使用機器・道具（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {equipmentUsed.map((equipment) => (
            <button
              key={equipment}
              type="button"
              onClick={() => toggleArrayItem(
                formData.equipment_used, 
                equipment, 
                (newArray) => setFormData({ ...formData, equipment_used: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.equipment_used.includes(equipment)
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {equipment}
            </button>
          ))}
        </div>
      </div>

      {/* 運動反応 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🏃 運動反応（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {motorResponses.map((response) => (
            <button
              key={response}
              type="button"
              onClick={() => toggleArrayItem(
                formData.motor_responses, 
                response, 
                (newArray) => setFormData({ ...formData, motor_responses: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.motor_responses.includes(response)
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {response}
            </button>
          ))}
        </div>
      </div>

      {/* 認知反応 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🧠 認知反応（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {cognitiveResponses.map((response) => (
            <button
              key={response}
              type="button"
              onClick={() => toggleArrayItem(
                formData.cognitive_responses, 
                response, 
                (newArray) => setFormData({ ...formData, cognitive_responses: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.cognitive_responses.includes(response)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {response}
            </button>
          ))}
        </div>
      </div>

      {/* 情緒反応 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          😊 情緒反応（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {emotionalResponses.map((response) => (
            <button
              key={response}
              type="button"
              onClick={() => toggleArrayItem(
                formData.emotional_responses, 
                response, 
                (newArray) => setFormData({ ...formData, emotional_responses: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.emotional_responses.includes(response)
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {response}
            </button>
          ))}
        </div>
      </div>

      {/* 感覚嗜好 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          👂 感覚嗜好（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {sensoryPreferences.map((preference) => (
            <button
              key={preference}
              type="button"
              onClick={() => toggleArrayItem(
                formData.sensory_preferences, 
                preference, 
                (newArray) => setFormData({ ...formData, sensory_preferences: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.sensory_preferences.includes(preference)
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {preference}
            </button>
          ))}
        </div>
      </div>

      {/* コミュニケーション試行 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          💬 コミュニケーション試行（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {communicationAttempts.map((attempt) => (
            <button
              key={attempt}
              type="button"
              onClick={() => toggleArrayItem(
                formData.communication_attempts, 
                attempt, 
                (newArray) => setFormData({ ...formData, communication_attempts: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.communication_attempts.includes(attempt)
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {attempt}
            </button>
          ))}
        </div>
      </div>

      {/* 社会的相互作用 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          👥 社会的相互作用（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {socialInteractions.map((interaction) => (
            <button
              key={interaction}
              type="button"
              onClick={() => toggleArrayItem(
                formData.social_interactions, 
                interaction, 
                (newArray) => setFormData({ ...formData, social_interactions: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.social_interactions.includes(interaction)
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {interaction}
            </button>
          ))}
        </div>
      </div>

      {/* 治療目標 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🎯 治療目標（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {therapeuticGoals.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => toggleArrayItem(
                formData.therapeutic_goals, 
                goal, 
                (newArray) => setFormData({ ...formData, therapeutic_goals: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.therapeutic_goals.includes(goal)
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {/* 達成事項 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🏆 達成事項（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {achievementsOptions.map((achievement) => (
            <button
              key={achievement}
              type="button"
              onClick={() => toggleArrayItem(
                formData.achievements, 
                achievement, 
                (newArray) => setFormData({ ...formData, achievements: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.achievements.includes(achievement)
                  ? 'bg-lime-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {achievement}
            </button>
          ))}
        </div>
      </div>

      {/* 課題・困難 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ⚠️ 課題・困難（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {challengesOptions.map((challenge) => (
            <button
              key={challenge}
              type="button"
              onClick={() => toggleArrayItem(
                formData.challenges, 
                challenge, 
                (newArray) => setFormData({ ...formData, challenges: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.challenges.includes(challenge)
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {challenge}
            </button>
          ))}
        </div>
      </div>

      {/* 環境要因 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🌍 環境要因（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {environmentalFactors.map((factor) => (
            <button
              key={factor}
              type="button"
              onClick={() => toggleArrayItem(
                formData.environmental_factors, 
                factor, 
                (newArray) => setFormData({ ...formData, environmental_factors: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.environmental_factors.includes(factor)
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {factor}
            </button>
          ))}
        </div>
      </div>

      {/* 医学的配慮 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🩺 医学的配慮（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {medicalConsiderations.map((consideration) => (
            <button
              key={consideration}
              type="button"
              onClick={() => toggleArrayItem(
                formData.medical_considerations, 
                consideration, 
                (newArray) => setFormData({ ...formData, medical_considerations: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.medical_considerations.includes(consideration)
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {consideration}
            </button>
          ))}
        </div>
      </div>

      {/* 介入の必要性 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🛠️ 介入の必要性（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {interventionOptions.map((intervention) => (
            <button
              key={intervention}
              type="button"
              onClick={() => toggleArrayItem(
                formData.intervention_needed, 
                intervention, 
                (newArray) => setFormData({ ...formData, intervention_needed: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.intervention_needed.includes(intervention)
                  ? 'bg-orange-700 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {intervention}
            </button>
          ))}
        </div>
      </div>

      {/* 特記事項 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📝 特記事項・詳細メモ
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          rows={4}
          placeholder="活動中の特記事項、セラピストへの申し送り、家族への連絡内容、次回への改善点など..."
        />
      </div>

      {/* 保存ボタン */}
      <div className="sticky bottom-0 bg-gray-50 p-4 -mx-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeOpacity="0.25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              保存中...
            </>
          ) : (
            '🏃 活動記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};

export default ActivityInput;