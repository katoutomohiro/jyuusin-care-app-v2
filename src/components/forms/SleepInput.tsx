import * as React from 'react';
import * as React from "react"; const C: React.FC<any> = () => null; export default C;
export default SleepInput;
import React, { useState } from 'react';

interface SleepInputProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

const SleepInput: React.FC<SleepInputProps> = ({ onSave, isSubmitting }) => {
  // 正確な現在時刻を取得する関数
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    event_timestamp: getCurrentDateTime(),
    sleep_event_type: '',
    sleep_start_time: '',
    sleep_end_time: '',
    duration_minutes: '',
    sleep_quality: '',
    sleep_position: '',
    sleep_location: '',
    sleep_depth: '',
    awakening_frequency: '',
    awakening_reasons: [] as string[],
    sleep_aids_used: [] as string[],
    environmental_factors: [] as string[],
    behavioral_observations: [] as string[],
    physiological_signs: [] as string[],
    breathing_patterns: [] as string[],
    movement_during_sleep: [] as string[],
    comfort_measures: [] as string[],
    medications_given: [] as string[],
    complications: [] as string[],
    intervention_needed: [] as string[],
    notes: ''
  });

  // 睡眠イベントタイプ（重心特化）
  const sleepEventTypes = [
    '入眠', '覚醒', '昼寝開始', '昼寝終了',
    '夜間睡眠開始', '夜間睡眠終了', '中途覚醒',
    '睡眠中観察', '睡眠困難', 'その他'
  ];

  // 睡眠の質
  const sleepQualityOptions = [
    '良好', 'やや良好', '普通', 'やや不良',
    '不良', '深い眠り', '浅い眠り', '断続的',
    '不安定', 'その他'
  ];

  // 睡眠体位
  const sleepPositionOptions = [
    '仰臥位', '側臥位（右）', '側臥位（左）', '腹臥位',
    '半側臥位', 'うつ伏せ', '丸まった姿勢',
    '足上げ位', '頭部挙上位', '体位変換後',
    'クッション使用', 'その他'
  ];

  // 睡眠場所
  const sleepLocationOptions = [
    'ベッド', 'マット', '車椅子', 'リクライニングチェア',
    'ソファ', '床', '抱っこ', '医療ベッド',
    'その他'
  ];

  // 睡眠の深さ
  const sleepDepthOptions = [
    '深睡眠', '浅睡眠', 'レム睡眠', 'ノンレム睡眠',
    'うとうと', '完全覚醒', '半覚醒状態',
    '評価困難', 'その他'
  ];

  // 中途覚醒頻度
  const awakeningFrequencyOptions = [
    'なし', '1回', '2-3回', '4-5回',
    '6回以上', '頻繁', '断続的', '一晩中',
    '測定不可', 'その他'
  ];

  // 覚醒理由
  const awakeningReasons = [
    'なし', '発作', 'けいれん', '呼吸困難',
    '咳・痰', '体位不良', '疼痛', '不快感',
    '騒音', '光', '温度変化', '湿度',
    '排泄', 'おむつ交換', '薬剤投与', '吸引',
    '環境変化', '悪夢', '不安', 'その他'
  ];

  // 使用した睡眠補助具
  const sleepAidsUsed = [
    'なし', '枕', 'クッション', '抱き枕',
    'ポジショニングクッション', '体位保持具', 'マットレス',
    '毛布', 'タオル', '湯たんぽ', 'アイマスク',
    '耳栓', '音楽', 'アロマ', '照明調整',
    '温度調整', '加湿器', 'その他'
  ];

  // 環境要因
  const environmentalFactors = [
    '静寂', '騒音あり', '適温', '暑い', '寒い',
    '明るい', '暗い', '乾燥', '湿気',
    '換気良好', '換気不良', '他者の存在',
    '一人', '機械音', '自然音', 'その他'
  ];

  // 行動観察
  const behavioralObservations = [
    '安静', '寝返り', '手足の動き', '表情変化',
    '笑顔', '泣く', 'うなる', 'いびき',
    '歯ぎしり', '口の動き', '目の動き',
    '不随意運動', 'けいれん様動作', '興奮',
    '落ち着きなし', 'その他'
  ];

  // 生理学的徴候
  const physiologicalSigns = [
    '正常', '発汗', '冷汗', '顔面紅潮',
    '顔面蒼白', 'チアノーゼ', '体温上昇',
    '体温低下', '脈拍変化', '血圧変化',
    '呼吸変化', '唾液分泌増加', '嘔吐',
    '失禁', 'その他'
  ];

  // 呼吸パターン
  const breathingPatterns = [
    '正常呼吸', '深呼吸', '浅呼吸', '頻呼吸',
    '徐呼吸', '不規則呼吸', '無呼吸',
    '喘鳴', '咳嗽', '痰絡み', '鼻閉',
    '口呼吸', '努力呼吸', 'その他'
  ];

  // 睡眠中の動き
  const movementDuringSleep = [
    'なし', '軽微な動き', '寝返り', '手足の動き',
    '頭の動き', '体位変換', '不随意運動',
    'けいれん', 'ミオクローヌス', '周期性四肢運動',
    'レストレスレッグス', '激しい動き', 'その他'
  ];

  // 快適性向上措置
  const comfortMeasures = [
    'なし', 'マッサージ', '背部叩打', '体位変換',
    '室温調整', '湿度調整', '照明調整', '音響調整',
    '衣類調整', '寝具調整', '吸引', '口腔ケア',
    '薬剤投与', '水分補給', 'その他'
  ];

  // 投与薬剤
  const medicationsGiven = [
    'なし', '睡眠薬', '鎮静薬', '抗不安薬',
    '抗けいれん薬', '鎮痛薬', '解熱薬',
    '気管支拡張薬', '去痰薬', '整腸薬',
    'その他'
  ];

  // 合併症
  const complicationsOptions = [
    'なし', '発作', 'けいれん', '呼吸困難',
    '無呼吸', '体温異常', '脱水', '誤嚥',
    '褥瘡', '関節拘縮', '循環障害',
    '感染徴候', 'その他'
  ];

  // 介入の必要性
  const interventionOptions = [
    '経過観察', '医師報告', '看護師報告', '家族連絡',
    '体位変換頻度増加', '環境調整', '薬剤調整',
    '睡眠時間調整', '日中活動調整', 'リハビリ相談',
    '栄養相談', '心理ケア', 'その他'
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

  const calculateDuration = () => {
    if (formData.sleep_start_time && formData.sleep_end_time) {
      const start = new Date(formData.sleep_start_time);
      const end = new Date(formData.sleep_end_time);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.round(diffMs / (1000 * 60));
      setFormData({ ...formData, duration_minutes: diffMins.toString() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 記録時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏰ 記録時刻 *
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

      {/* 睡眠イベントタイプ */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🛌 睡眠イベントタイプ *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {sleepEventTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, sleep_event_type: type })}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                formData.sleep_event_type === type
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 睡眠時間 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ⏰ 睡眠時間
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">開始時刻</label>
            <input
              type="datetime-local"
              value={formData.sleep_start_time}
              onChange={(e) => {
                setFormData({ ...formData, sleep_start_time: e.target.value });
                if (formData.sleep_end_time) calculateDuration();
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">終了時刻</label>
            <input
              type="datetime-local"
              value={formData.sleep_end_time}
              onChange={(e) => {
                setFormData({ ...formData, sleep_end_time: e.target.value });
                if (formData.sleep_start_time) calculateDuration();
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-600 mb-1">継続時間（分）</label>
          <input
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="例: 120（2時間）"
          />
        </div>
      </div>

      {/* 睡眠の質 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          😴 睡眠の質
        </label>
        <div className="grid grid-cols-3 gap-2">
          {sleepQualityOptions.map((quality) => (
            <button
              key={quality}
              type="button"
              onClick={() => setFormData({ ...formData, sleep_quality: quality })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.sleep_quality === quality
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {quality}
            </button>
          ))}
        </div>
      </div>

      {/* 睡眠体位 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🛏️ 睡眠体位
        </label>
        <div className="grid grid-cols-3 gap-2">
          {sleepPositionOptions.map((position) => (
            <button
              key={position}
              type="button"
              onClick={() => setFormData({ ...formData, sleep_position: position })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.sleep_position === position
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {position}
            </button>
          ))}
        </div>
      </div>

      {/* 睡眠場所 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📍 睡眠場所
        </label>
        <div className="grid grid-cols-3 gap-2">
          {sleepLocationOptions.map((location) => (
            <button
              key={location}
              type="button"
              onClick={() => setFormData({ ...formData, sleep_location: location })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.sleep_location === location
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* 睡眠の深さ */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🌊 睡眠の深さ
        </label>
        <div className="grid grid-cols-3 gap-2">
          {sleepDepthOptions.map((depth) => (
            <button
              key={depth}
              type="button"
              onClick={() => setFormData({ ...formData, sleep_depth: depth })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.sleep_depth === depth
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {depth}
            </button>
          ))}
        </div>
      </div>

      {/* 中途覚醒頻度 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔄 中途覚醒頻度
        </label>
        <div className="grid grid-cols-3 gap-2">
          {awakeningFrequencyOptions.map((frequency) => (
            <button
              key={frequency}
              type="button"
              onClick={() => setFormData({ ...formData, awakening_frequency: frequency })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.awakening_frequency === frequency
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {frequency}
            </button>
          ))}
        </div>
      </div>

      {/* 覚醒理由 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🤔 覚醒理由（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {awakeningReasons.map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => toggleArrayItem(
                formData.awakening_reasons, 
                reason, 
                (newArray) => setFormData({ ...formData, awakening_reasons: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.awakening_reasons.includes(reason)
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
      </div>

      {/* 睡眠補助具 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🛏️ 使用した睡眠補助具（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {sleepAidsUsed.map((aid) => (
            <button
              key={aid}
              type="button"
              onClick={() => toggleArrayItem(
                formData.sleep_aids_used, 
                aid, 
                (newArray) => setFormData({ ...formData, sleep_aids_used: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.sleep_aids_used.includes(aid)
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {aid}
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
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {factor}
            </button>
          ))}
        </div>
      </div>

      {/* 行動観察 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          👁️ 行動観察（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {behavioralObservations.map((observation) => (
            <button
              key={observation}
              type="button"
              onClick={() => toggleArrayItem(
                formData.behavioral_observations, 
                observation, 
                (newArray) => setFormData({ ...formData, behavioral_observations: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.behavioral_observations.includes(observation)
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {observation}
            </button>
          ))}
        </div>
      </div>

      {/* 生理学的徴候 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          💓 生理学的徴候（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {physiologicalSigns.map((sign) => (
            <button
              key={sign}
              type="button"
              onClick={() => toggleArrayItem(
                formData.physiological_signs, 
                sign, 
                (newArray) => setFormData({ ...formData, physiological_signs: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.physiological_signs.includes(sign)
                  ? 'bg-lime-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {sign}
            </button>
          ))}
        </div>
      </div>

      {/* 呼吸パターン */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🫁 呼吸パターン（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {breathingPatterns.map((pattern) => (
            <button
              key={pattern}
              type="button"
              onClick={() => toggleArrayItem(
                formData.breathing_patterns, 
                pattern, 
                (newArray) => setFormData({ ...formData, breathing_patterns: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.breathing_patterns.includes(pattern)
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {pattern}
            </button>
          ))}
        </div>
      </div>

      {/* 睡眠中の動き */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🤸 睡眠中の動き（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {movementDuringSleep.map((movement) => (
            <button
              key={movement}
              type="button"
              onClick={() => toggleArrayItem(
                formData.movement_during_sleep, 
                movement, 
                (newArray) => setFormData({ ...formData, movement_during_sleep: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.movement_during_sleep.includes(movement)
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {movement}
            </button>
          ))}
        </div>
      </div>

      {/* 快適性向上措置 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🛡️ 快適性向上措置（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {comfortMeasures.map((measure) => (
            <button
              key={measure}
              type="button"
              onClick={() => toggleArrayItem(
                formData.comfort_measures, 
                measure, 
                (newArray) => setFormData({ ...formData, comfort_measures: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.comfort_measures.includes(measure)
                  ? 'bg-violet-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {measure}
            </button>
          ))}
        </div>
      </div>

      {/* 投与薬剤 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          💊 投与薬剤（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {medicationsGiven.map((medication) => (
            <button
              key={medication}
              type="button"
              onClick={() => toggleArrayItem(
                formData.medications_given, 
                medication, 
                (newArray) => setFormData({ ...formData, medications_given: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.medications_given.includes(medication)
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {medication}
            </button>
          ))}
        </div>
      </div>

      {/* 合併症 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ⚠️ 合併症（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {complicationsOptions.map((complication) => (
            <button
              key={complication}
              type="button"
              onClick={() => toggleArrayItem(
                formData.complications, 
                complication, 
                (newArray) => setFormData({ ...formData, complications: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.complications.includes(complication)
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {complication}
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
                  ? 'bg-orange-600 text-white shadow-md'
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          rows={4}
          placeholder="睡眠時の特記事項、医師への申し送り、家族への連絡内容、睡眠環境の改善点など..."
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
            '😴 睡眠記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};

export default SleepInput;