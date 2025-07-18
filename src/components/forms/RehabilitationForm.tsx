/**
 * 【魂の記録・リハビリテーションフォーム】
 * 魂の挑戦と成長の記録
 */
import React, { useState } from 'react';

interface RehabilitationFormData {
  rehabilitation_type: string;
  duration_minutes: number;
  intensity_level: string;
  participation_attitude: string;
  physical_response: string;
  achievement_level: string;
  specific_activities: string[];
  progress_notes: string;
  equipment_used: string;
  assistance_level: string;
  goals_targeted: string[];
  next_session_notes: string;
  vital_signs_before: {
    blood_pressure?: string;
    heart_rate?: number;
    temperature?: number;
  };
  vital_signs_after: {
    blood_pressure?: string;
    heart_rate?: number;
    temperature?: number;
  };
  staff_notes: string;
}

interface RehabilitationFormProps {
  onSave: (data: RehabilitationFormData) => void;
  isSubmitting?: boolean;
}

const RehabilitationForm: React.FC<RehabilitationFormProps> = ({ onSave, isSubmitting = false }) => {
  const [formData, setFormData] = useState<RehabilitationFormData>({
    rehabilitation_type: '',
    duration_minutes: 0,
    intensity_level: '',
    participation_attitude: '',
    physical_response: '',
    achievement_level: '',
    specific_activities: [],
    progress_notes: '',
    equipment_used: '',
    assistance_level: '',
    goals_targeted: [],
    next_session_notes: '',
    vital_signs_before: {},
    vital_signs_after: {},
    staff_notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const rehabilitationTypes = [
    '理学療法（PT）',
    '作業療法（OT）',
    '言語療法（ST）',
    '音楽療法',
    '感覚統合療法',
    '摂食嚥下訓練',
    '歩行訓練',
    '座位訓練',
    '関節可動域訓練（ROM）',
    'バランス訓練',
    '機能訓練',
    '日常生活動作訓練（ADL）',
    'その他'
  ];

  const intensityLevels = [
    '軽度（リラクゼーション中心）',
    '中軽度（軽い刺激）',
    '中程度（適度な負荷）',
    '中強度（しっかりした負荷）',
    '高強度（集中的訓練）'
  ];

  const participationAttitudes = [
    '積極的な参加',
    '自発的な参加',
    '促しで参加',
    '消極的だが参加',
    '拒否的',
    '体調不良で中止'
  ];

  const physicalResponses = [
    '良好な反応',
    'やや疲労感',
    '軽度の疲労',
    '中程度の疲労',
    '強い疲労',
    '痛みの訴え',
    '興奮状態',
    '落ち着いた状態'
  ];

  const achievementLevels = [
    '目標以上の達成',
    '目標達成',
    '目標の8割達成',
    '目標の半分達成',
    '目標の3割達成',
    '取り組めなかった'
  ];

  const assistanceLevels = [
    '自立',
    '見守り',
    '軽度介助',
    '中等度介助',
    '重度介助',
    '全介助'
  ];

  const availableActivities = [
    'ストレッチング',
    '関節運動',
    'マッサージ',
    '歩行練習',
    '立位保持',
    '座位保持',
    'バランス訓練',
    '筋力トレーニング',
    '呼吸練習',
    '嚥下訓練',
    '発声練習',
    '手指訓練',
    '感覚刺激',
    '認知課題',
    '音楽活動',
    'その他'
  ];

  const rehabilitationGoals = [
    '筋力維持・向上',
    '関節可動域維持',
    'バランス能力向上',
    '歩行能力向上',
    '座位保持向上',
    '摂食嚥下機能向上',
    'コミュニケーション向上',
    '認知機能維持',
    '感覚機能向上',
    '日常生活動作向上',
    '体力維持・向上',
    '精神的安定',
    'その他'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">💪</div>
          <h3 className="text-lg font-bold text-gray-800">【リハビリテーション記録】</h3>
          <p className="text-sm text-gray-600">魂の挑戦と成長の神聖なる記録</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* リハビリ種別 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💪 リハビリテーション種別
            </label>
            <select
              value={formData.rehabilitation_type}
              onChange={(e) => setFormData({ ...formData, rehabilitation_type: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">選択してください</option>
              {rehabilitationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* 実施時間 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ⏱️ 実施時間（分）
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="実施時間を分で入力"
              required
            />
          </div>

          {/* 強度レベル */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📊 強度・負荷レベル
            </label>
            <select
              value={formData.intensity_level}
              onChange={(e) => setFormData({ ...formData, intensity_level: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">選択してください</option>
              {intensityLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* 参加態度 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              😊 参加態度・意欲
            </label>
            <select
              value={formData.participation_attitude}
              onChange={(e) => setFormData({ ...formData, participation_attitude: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">選択してください</option>
              {participationAttitudes.map((attitude) => (
                <option key={attitude} value={attitude}>
                  {attitude}
                </option>
              ))}
            </select>
          </div>

          {/* 具体的活動内容 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎯 具体的活動内容（複数選択可）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableActivities.map((activity) => (
                <label key={activity} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={formData.specific_activities.includes(activity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          specific_activities: [...formData.specific_activities, activity]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          specific_activities: formData.specific_activities.filter(a => a !== activity)
                        });
                      }
                    }}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  {activity}
                </label>
              ))}
            </div>
          </div>

          {/* ターゲット目標 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎯 ターゲット目標（複数選択可）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {rehabilitationGoals.map((goal) => (
                <label key={goal} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={formData.goals_targeted.includes(goal)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          goals_targeted: [...formData.goals_targeted, goal]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          goals_targeted: formData.goals_targeted.filter(g => g !== goal)
                        });
                      }
                    }}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  {goal}
                </label>
              ))}
            </div>
          </div>

          {/* 達成度 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📈 目標達成度
            </label>
            <select
              value={formData.achievement_level}
              onChange={(e) => setFormData({ ...formData, achievement_level: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">選択してください</option>
              {achievementLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* 介助レベル */}
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

          {/* 身体反応 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💓 身体反応・疲労度
            </label>
            <select
              value={formData.physical_response}
              onChange={(e) => setFormData({ ...formData, physical_response: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">選択してください</option>
              {physicalResponses.map((response) => (
                <option key={response} value={response}>
                  {response}
                </option>
              ))}
            </select>
          </div>

          {/* 使用機器 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔧 使用機器・道具
            </label>
            <input
              type="text"
              value={formData.equipment_used}
              onChange={(e) => setFormData({ ...formData, equipment_used: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="使用した機器・道具を記入"
            />
          </div>

          {/* 進捗記録 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📈 進捗記録・観察内容
            </label>
            <textarea
              value={formData.progress_notes}
              onChange={(e) => setFormData({ ...formData, progress_notes: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="今日の進捗、気づいた変化、特記事項など"
              rows={3}
            />
          </div>

          {/* 次回に向けて */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔮 次回セッションへの申し送り
            </label>
            <textarea
              value={formData.next_session_notes}
              onChange={(e) => setFormData({ ...formData, next_session_notes: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="次回のリハビリに向けての注意点、調整事項など"
              rows={2}
            />
          </div>

          {/* スタッフ記録 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📝 スタッフ記録・総合評価
            </label>
            <textarea
              value={formData.staff_notes}
              onChange={(e) => setFormData({ ...formData, staff_notes: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="総合的な評価、家族への報告事項、今後の方針など"
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
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200'
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
              <span>💪 リハビリ記録を保存</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RehabilitationForm;
