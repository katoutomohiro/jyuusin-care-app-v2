import React, { useState } from 'react';

interface OtherInputProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

const OtherInput: React.FC<OtherInputProps> = ({ onSave, isSubmitting }) => {
  // 正確な現在時刻を取得する関数
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    event_timestamp: getCurrentDateTime(),
    event_category: '',
    event_type: '',
    severity_level: '',
    location: '',
    duration_minutes: '',
    people_involved: [] as string[],
    triggers: [] as string[],
    interventions_provided: [] as string[],
    equipment_used: [] as string[],
    environmental_factors: [] as string[],
    emotional_state: [] as string[],
    behavioral_changes: [] as string[],
    communication_attempts: [] as string[],
    family_involvement: '',
    medical_consultation: '' as string,
    documentation_shared: [] as string[],
    follow_up_actions: [] as string[],
    learning_outcomes: [] as string[],
    safety_concerns: [] as string[],
    positive_observations: [] as string[],
    improvement_suggestions: [] as string[],
    notes: ''
  });

  // イベントカテゴリー（重心特化）
  const eventCategories = [
    '行動・情緒', '家族関係', '施設内事故', '医療的事象',
    '社会参加', '療育・訓練', '環境調整', 'コミュニケーション',
    '発達・成長', '季節行事', '外出・移動', '機器トラブル',
    '職員関連', 'その他'
  ];

  // イベントタイプ
  const eventTypes = [
    '自傷行為', '他害行為', 'パニック', '拒否行動',
    '常同行動', '睡眠障害', '摂食問題', '排泄トラブル',
    '転倒・転落', '誤嚥', '発作', '呼吸困難',
    '機器故障', '感染症対応', '緊急搬送', '家族面談',
    '療育評価', '個別支援計画', '外部連携', '研修・学習',
    'レクリエーション', '季節行事', 'その他'
  ];

  // 重要度レベル
  const severityLevels = [
    '緊急（生命に関わる）', '重要（即座の対応必要）', 
    '中程度（当日中に対応）', '軽微（経過観察）',
    '情報共有のみ'
  ];

  // 場所
  const locationOptions = [
    '居室', '食堂', 'トイレ', '浴室', '訓練室',
    '医務室', '廊下', '玄関', '駐車場', '車内',
    '園庭', '屋外', '外出先', 'その他'
  ];

  // 関与者
  const peopleInvolved = [
    '本人のみ', '看護師', '介護士', '生活支援員',
    'PT', 'OT', 'ST', '保育士', '栄養士',
    '他利用者', '家族', 'ボランティア', '実習生',
    '外部専門家', 'その他'
  ];

  // トリガー・きっかけ
  const triggers = [
    '不明', '環境変化', '人の変化', 'スケジュール変更',
    '体調不良', '疲労', '空腹・満腹', '排泄欲求',
    '痛み・不快感', '音・光・におい', '他者との関わり',
    '要求不満', '期待とのずれ', '季節・天候', 'その他'
  ];

  // 提供した介入
  const interventionsProvided = [
    'なし', '見守り', '声かけ', '身体的介助',
    '環境調整', '活動変更', '休息提供', '医療的処置',
    '他職種連携', '家族連絡', '医師報告', '記録作成',
    'カンファレンス', '計画見直し', 'その他'
  ];

  // 使用機器
  const equipmentUsed = [
    'なし', '車椅子', 'ベッド', 'クッション', 'マットレス',
    '吸引器', '酸素', 'バイタル測定器', '緊急時薬剤',
    '通信機器', 'カメラ', '記録端末', '移動用具',
    '感染防護具', 'その他'
  ];

  // 環境要因
  const environmentalFactors = [
    'なし', '気温', '湿度', '照明', '騒音',
    '臭い', '人数', '混雑', '時間帯', '曜日',
    '季節', '天候', '建物構造', '設備状況', 'その他'
  ];

  // 感情状態
  const emotionalState = [
    '安定', '喜び', '満足', '興奮', '不安',
    '恐怖', '怒り', '悲しみ', '混乱', '無反応',
    '疲労', 'リラックス', '集中', '拒否的', 'その他'
  ];

  // 行動変化
  const behavioralChanges = [
    'なし', '活動性増加', '活動性減少', '攻撃性増加',
    '引きこもり', '常同行動増加', '睡眠パターン変化',
    '摂食パターン変化', 'コミュニケーション変化',
    '表情変化', '姿勢変化', '発声変化', 'その他'
  ];

  // コミュニケーション試行
  const communicationAttempts = [
    'なし', '言語的働きかけ', '非言語的働きかけ',
    '視覚的手がかり', '触覚的働きかけ', 'サイン・ジェスチャー',
    '文字・絵カード', '音楽・歌', 'IT機器活用',
    '家族情報活用', '好みの活用', 'その他'
  ];

  // 医療相談
  const medicalConsultationOptions = [
    'なし', '看護師相談', '主治医報告', '専門医相談',
    '緊急受診', '処方調整依頼', '検査依頼',
    '他職種相談', '外部機関相談'
  ];

  // 共有した記録
  const documentationShared = [
    'なし', '申し送りノート', '個別記録', '医療記録',
    '家族連絡帳', 'カンファレンス記録', '事故報告書',
    'ヒヤリハット', '支援計画', '外部報告書', 'その他'
  ];

  // フォローアップ行動
  const followUpActions = [
    'なし', '継続観察', '支援方法見直し', '環境調整',
    '医療的フォロー', '家族との相談', '専門家相談',
    '職員研修', 'チーム会議', '計画変更', 'その他'
  ];

  // 学習成果
  const learningOutcomes = [
    'なし', '新しい支援方法発見', '環境要因特定',
    'トリガー特定', '効果的介入確認', 'チーム連携向上',
    '家族理解促進', '本人理解深化', '予防策確立',
    '職員スキル向上', 'その他'
  ];

  // 安全上の懸念
  const safetyConcerns = [
    'なし', '転倒リスク', '誤嚥リスク', '自傷リスク',
    '他害リスク', '機器トラブルリスク', '感染リスク',
    '緊急時対応課題', '人員不足', '設備不備',
    '知識・技術不足', 'その他'
  ];

  // ポジティブな観察
  const positiveObservations = [
    'なし', '新しい反応発見', '成長・発達確認',
    '好みの発見', '能力の発見', '関係性向上',
    '適応行動増加', 'コミュニケーション向上',
    '自立度向上', '笑顔増加', '安定性向上', 'その他'
  ];

  // 改善提案
  const improvementSuggestions = [
    'なし', '環境整備', '人員配置見直し', '機器導入',
    '研修実施', '手順見直し', '連携強化',
    '情報共有方法改善', '記録方法改善', '評価方法改善',
    '家族連携強化', 'その他'
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
      {/* イベント発生時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏰ イベント発生時刻 *
        </label>
        <div className="flex space-x-2">
          <input
            type="datetime-local"
            value={formData.event_timestamp}
            onChange={(e) => setFormData({ ...formData, event_timestamp: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            required
          />
          <button
            type="button"
            onClick={setCurrentTime}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 whitespace-nowrap font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            🕐 今すぐ
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          💡 「今すぐ」ボタンで正確な現在時刻を自動入力
        </p>
      </div>

      {/* イベントカテゴリー */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📂 イベントカテゴリー *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {eventCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFormData({ ...formData, event_category: category })}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                formData.event_category === category
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* イベントタイプ */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🏷️ イベントタイプ *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {eventTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, event_type: type })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.event_type === type
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 重要度レベル */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ⚠️ 重要度レベル *
        </label>
        <div className="grid grid-cols-1 gap-2">
          {severityLevels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFormData({ ...formData, severity_level: level })}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                formData.severity_level === level
                  ? level.includes('緊急') ? 'bg-red-600 text-white shadow-md'
                    : level.includes('重要') ? 'bg-orange-500 text-white shadow-md'
                    : level.includes('中程度') ? 'bg-yellow-500 text-white shadow-md'
                    : level.includes('軽微') ? 'bg-green-500 text-white shadow-md'
                    : 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* 発生場所 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📍 発生場所
        </label>
        <div className="grid grid-cols-3 gap-2">
          {locationOptions.map((location) => (
            <button
              key={location}
              type="button"
              onClick={() => setFormData({ ...formData, location: location })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.location === location
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* 継続時間 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏱️ 継続時間（分）
        </label>
        <input
          type="number"
          value={formData.duration_minutes}
          onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="例: 30（30分間）"
        />
      </div>

      {/* 関与者 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          👥 関与者（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {peopleInvolved.map((person) => (
            <button
              key={person}
              type="button"
              onClick={() => toggleArrayItem(
                formData.people_involved, 
                person, 
                (newArray) => setFormData({ ...formData, people_involved: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.people_involved.includes(person)
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {person}
            </button>
          ))}
        </div>
      </div>

      {/* トリガー・きっかけ */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🎯 トリガー・きっかけ（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {triggers.map((trigger) => (
            <button
              key={trigger}
              type="button"
              onClick={() => toggleArrayItem(
                formData.triggers, 
                trigger, 
                (newArray) => setFormData({ ...formData, triggers: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.triggers.includes(trigger)
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {trigger}
            </button>
          ))}
        </div>
      </div>

      {/* 提供した介入 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🤝 提供した介入（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {interventionsProvided.map((intervention) => (
            <button
              key={intervention}
              type="button"
              onClick={() => toggleArrayItem(
                formData.interventions_provided, 
                intervention, 
                (newArray) => setFormData({ ...formData, interventions_provided: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.interventions_provided.includes(intervention)
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {intervention}
            </button>
          ))}
        </div>
      </div>

      {/* 使用機器 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔧 使用機器（複数選択可）
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

      {/* 環境要因 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🌡️ 環境要因（複数選択可）
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
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {factor}
            </button>
          ))}
        </div>
      </div>

      {/* 感情状態 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          😊 感情状態（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {emotionalState.map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => toggleArrayItem(
                formData.emotional_state, 
                state, 
                (newArray) => setFormData({ ...formData, emotional_state: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.emotional_state.includes(state)
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* 行動変化 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔄 行動変化（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {behavioralChanges.map((change) => (
            <button
              key={change}
              type="button"
              onClick={() => toggleArrayItem(
                formData.behavioral_changes, 
                change, 
                (newArray) => setFormData({ ...formData, behavioral_changes: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.behavioral_changes.includes(change)
                  ? 'bg-violet-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {change}
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
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {attempt}
            </button>
          ))}
        </div>
      </div>

      {/* 家族の関与 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          👨‍👩‍👧‍👦 家族の関与
        </label>
        <select
          value={formData.family_involvement}
          onChange={(e) => setFormData({ ...formData, family_involvement: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">選択</option>
          <option value="家族同席">家族同席</option>
          <option value="家族連絡済み">家族連絡済み</option>
          <option value="家族連絡予定">家族連絡予定</option>
          <option value="家族相談必要">家族相談必要</option>
          <option value="家族関与なし">家族関与なし</option>
        </select>
      </div>

      {/* 医療相談 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🩺 医療相談
        </label>
        <div className="grid grid-cols-2 gap-2">
          {medicalConsultationOptions.map((consultation) => (
            <button
              key={consultation}
              type="button"
              onClick={() => setFormData({ ...formData, medical_consultation: consultation })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.medical_consultation === consultation
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {consultation}
            </button>
          ))}
        </div>
      </div>

      {/* 共有した記録 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📋 共有した記録（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {documentationShared.map((doc) => (
            <button
              key={doc}
              type="button"
              onClick={() => toggleArrayItem(
                formData.documentation_shared, 
                doc, 
                (newArray) => setFormData({ ...formData, documentation_shared: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.documentation_shared.includes(doc)
                  ? 'bg-slate-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {doc}
            </button>
          ))}
        </div>
      </div>

      {/* フォローアップ行動 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔄 フォローアップ行動（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {followUpActions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => toggleArrayItem(
                formData.follow_up_actions, 
                action, 
                (newArray) => setFormData({ ...formData, follow_up_actions: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.follow_up_actions.includes(action)
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* 学習成果 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📚 学習成果（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {learningOutcomes.map((outcome) => (
            <button
              key={outcome}
              type="button"
              onClick={() => toggleArrayItem(
                formData.learning_outcomes, 
                outcome, 
                (newArray) => setFormData({ ...formData, learning_outcomes: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.learning_outcomes.includes(outcome)
                  ? 'bg-lime-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {outcome}
            </button>
          ))}
        </div>
      </div>

      {/* 安全上の懸念 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🛡️ 安全上の懸念（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {safetyConcerns.map((concern) => (
            <button
              key={concern}
              type="button"
              onClick={() => toggleArrayItem(
                formData.safety_concerns, 
                concern, 
                (newArray) => setFormData({ ...formData, safety_concerns: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.safety_concerns.includes(concern)
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {concern}
            </button>
          ))}
        </div>
      </div>

      {/* ポジティブな観察 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ✨ ポジティブな観察（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {positiveObservations.map((observation) => (
            <button
              key={observation}
              type="button"
              onClick={() => toggleArrayItem(
                formData.positive_observations, 
                observation, 
                (newArray) => setFormData({ ...formData, positive_observations: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.positive_observations.includes(observation)
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {observation}
            </button>
          ))}
        </div>
      </div>

      {/* 改善提案 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          💡 改善提案（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {improvementSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => toggleArrayItem(
                formData.improvement_suggestions, 
                suggestion, 
                (newArray) => setFormData({ ...formData, improvement_suggestions: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.improvement_suggestions.includes(suggestion)
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* 詳細記録・特記事項 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📝 詳細記録・特記事項
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          rows={5}
          placeholder="イベントの詳細、状況の背景、発見事項、改善点、感想、今後の課題、関係者への申し送り事項など、具体的に記録してください..."
        />
      </div>

      {/* 保存ボタン */}
      <div className="sticky bottom-0 bg-gray-50 p-4 -mx-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            '📝 その他記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};

export default OtherInput;
