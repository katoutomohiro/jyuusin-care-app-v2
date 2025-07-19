import React, { useState } from 'react';

interface IntakeInputProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

const IntakeInput: React.FC<IntakeInputProps> = ({ onSave, isSubmitting }) => {
  // 正確な現在時刻を取得する関数
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    event_timestamp: getCurrentDateTime(),
    intake_type: '',
    food_type: '',
    amount: '',
    texture: '',
    temperature: '',
    eating_position: '',
    eating_method: [] as string[],
    assistance_level: '',
    duration: '',
    appetite: '',
    swallowing_status: [] as string[],
    special_considerations: [] as string[],
    adverse_reactions: [] as string[],
    intervention_needed: [] as string[],
    notes: ''
  });

  // 摂取タイプ（重心特化）
  const intakeTypes = [
    '経口摂取', '経管栄養（胃ろう）', '経管栄養（経鼻）', '経管栄養（腸ろう）',
    '点滴（静脈内）', '中心静脈栄養', 'IVH', '水分補給',
    '薬剤投与', 'その他'
  ];

  // 食事内容
  const foodTypes = [
    '主食（ご飯）', '主食（パン）', '主食（麺類）', '主菜（肉・魚・卵）',
    '副菜（野菜）', '汁物', 'デザート・果物', '牛乳・乳製品',
    '飲み物（水分）', '栄養補助食品', 'ペースト食', 'ムース食',
    'ゼリー食', 'とろみ付き', '刻み食', 'きざみとろみ食',
    '濃厚流動食', '栄養剤', 'その他'
  ];

  // 食事形態・テクスチャー
  const textureOptions = [
    '常食', '軟菜食', '刻み食', 'みじん切り', 'ペースト食',
    'ムース食', 'ゼリー食', '濃厚流動食', '流動食',
    'とろみ付き（弱）', 'とろみ付き（中）', 'とろみ付き（強）',
    '嚥下調整食0j', '嚥下調整食1j', '嚥下調整食2-1',
    '嚥下調整食2-2', '嚥下調整食3', '嚥下調整食4', 'その他'
  ];

  // 摂取温度
  const temperatureOptions = [
    '常温', '冷たい', '温かい', '熱い', '冷蔵庫から出したて',
    '体温程度', '人肌程度', '室温', 'その他'
  ];

  // 摂取時の体位
  const eatingPositions = [
    '座位（椅子）', '座位（車椅子）', '半座位（30度）', '半座位（45度）',
    '半座位（60度）', '立位', '仰臥位', '側臥位（右）',
    '側臥位（左）', '抱っこ', 'その他'
  ];

  // 摂取方法
  const eatingMethods = [
    '自力摂取', '一部介助', '全介助', 'スプーン使用',
    'フォーク使用', 'ストロー使用', 'コップ使用',
    '哺乳瓶使用', 'シリンジ使用', '注射器使用',
    '経管栄養（シリンジ）', '経管栄養（ポンプ）',
    '点滴', 'その他'
  ];

  // 介助レベル
  const assistanceLevels = [
    '自立', '見守り', '声かけ', '一部介助',
    '大部分介助', '全介助', '準備のみ', 'その他'
  ];

  // 食欲状態
  const appetiteOptions = [
    '良好', 'やや良好', '普通', 'やや不良',
    '不良', '拒食', '食べムラあり', '偏食あり',
    '好き嫌い多い', 'その他'
  ];

  // 嚥下状態
  const swallowingStatus = [
    '良好', 'やや困難', '困難', 'むせあり',
    '咳込みあり', '嚥下反射低下', '口腔残留あり',
    '咽頭残留あり', '逆流あり', '嘔吐あり',
    '口から漏れる', '鼻からの逆流', '痰絡み',
    'その他'
  ];

  // 特別な配慮
  const specialConsiderations = [
    'アレルギー対応', '糖尿病対応', '腎疾患対応', '心疾患対応',
    '消化器疾患対応', '減塩対応', '低たんぱく対応', 'カロリー制限',
    '水分制限', '禁食指示', '絶飲食', '薬剤との相互作用注意',
    '温度管理必要', '時間調整必要', 'その他'
  ];

  // 有害反応
  const adverseReactions = [
    'なし', 'むせ', '咳込み', '嘔吐', '逆流',
    'アレルギー症状', '皮疹', '蕁麻疹', '呼吸困難',
    '顔面紅潮', '顔面蒼白', '発熱', '下痢',
    '便秘', '腹痛', '膨満感', 'その他'
  ];

  // 介入の必要性
  const interventionOptions = [
    '経過観察', '再評価必要', '医師報告', '看護師報告',
    '栄養士相談', '言語聴覚士相談', 'STによる嚥下評価',
    '体位調整', '摂取方法変更', '食事形態変更',
    '温度調整', '量調整', '時間調整', '環境調整',
    'アレルギー対応', '薬剤調整', '家族相談',
    '緊急対応', 'その他'
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
      {/* 摂取時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏰ 摂取時刻 *
        </label>
        <div className="flex space-x-2">
          <input
            type="datetime-local"
            value={formData.event_timestamp}
            onChange={(e) => setFormData({ ...formData, event_timestamp: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            required
          />
          <button
            type="button"
            onClick={setCurrentTime}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 whitespace-nowrap font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            🕐 今すぐ
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          💡 「今すぐ」ボタンで正確な現在時刻を自動入力
        </p>
      </div>

      {/* 摂取タイプ */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🍽️ 摂取タイプ *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {intakeTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, intake_type: type })}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                formData.intake_type === type
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 食事内容 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🥄 食事内容
        </label>
        <div className="grid grid-cols-2 gap-2">
          {foodTypes.map((food) => (
            <button
              key={food}
              type="button"
              onClick={() => setFormData({ ...formData, food_type: food })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.food_type === food
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {food}
            </button>
          ))}
        </div>
      </div>

      {/* 摂取量 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📏 摂取量
        </label>
        <input
          type="text"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="例: 300ml, 全量, 半分, 3口程度, 100cc など"
        />
      </div>

      {/* 食事形態 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🥣 食事形態・テクスチャー
        </label>
        <div className="grid grid-cols-2 gap-2">
          {textureOptions.map((texture) => (
            <button
              key={texture}
              type="button"
              onClick={() => setFormData({ ...formData, texture: texture })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.texture === texture
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {texture}
            </button>
          ))}
        </div>
      </div>

      {/* 摂取温度 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🌡️ 摂取温度
        </label>
        <div className="grid grid-cols-3 gap-2">
          {temperatureOptions.map((temp) => (
            <button
              key={temp}
              type="button"
              onClick={() => setFormData({ ...formData, temperature: temp })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.temperature === temp
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {temp}
            </button>
          ))}
        </div>
      </div>

      {/* 摂取時の体位 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🛏️ 摂取時の体位
        </label>
        <div className="grid grid-cols-3 gap-2">
          {eatingPositions.map((position) => (
            <button
              key={position}
              type="button"
              onClick={() => setFormData({ ...formData, eating_position: position })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.eating_position === position
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {position}
            </button>
          ))}
        </div>
      </div>

      {/* 摂取方法 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🥄 摂取方法（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {eatingMethods.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => toggleArrayItem(
                formData.eating_method, 
                method, 
                (newArray) => setFormData({ ...formData, eating_method: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.eating_method.includes(method)
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* 介助レベル */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🤝 介助レベル
        </label>
        <div className="grid grid-cols-4 gap-2">
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

      {/* 所要時間 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏱️ 所要時間
        </label>
        <input
          type="text"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="例: 30分, 45分, 1時間, 短時間 など"
        />
      </div>

      {/* 食欲状態 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          😋 食欲状態
        </label>
        <div className="grid grid-cols-3 gap-2">
          {appetiteOptions.map((appetite) => (
            <button
              key={appetite}
              type="button"
              onClick={() => setFormData({ ...formData, appetite: appetite })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.appetite === appetite
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {appetite}
            </button>
          ))}
        </div>
      </div>

      {/* 嚥下状態 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          👄 嚥下状態（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {swallowingStatus.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => toggleArrayItem(
                formData.swallowing_status, 
                status, 
                (newArray) => setFormData({ ...formData, swallowing_status: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.swallowing_status.includes(status)
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 特別な配慮 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ⚠️ 特別な配慮（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {specialConsiderations.map((consideration) => (
            <button
              key={consideration}
              type="button"
              onClick={() => toggleArrayItem(
                formData.special_considerations, 
                consideration, 
                (newArray) => setFormData({ ...formData, special_considerations: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.special_considerations.includes(consideration)
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {consideration}
            </button>
          ))}
        </div>
      </div>

      {/* 有害反応 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🚨 有害反応（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {adverseReactions.map((reaction) => (
            <button
              key={reaction}
              type="button"
              onClick={() => toggleArrayItem(
                formData.adverse_reactions, 
                reaction, 
                (newArray) => setFormData({ ...formData, adverse_reactions: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.adverse_reactions.includes(reaction)
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {reaction}
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="摂取時の特記事項、医師への申し送り、家族への連絡内容、アレルギー反応など..."
        />
      </div>

      {/* 保存ボタン */}
      <div className="sticky bottom-0 bg-gray-50 p-4 -mx-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            '🍽️ 摂取記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};

export default IntakeInput;