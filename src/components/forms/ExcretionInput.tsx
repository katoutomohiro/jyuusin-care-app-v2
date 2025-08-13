import * as React from "react"; const C: React.FC<any> = () => null; export default C;
import React, { useState } from 'react';

interface ExcretionInputProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

const ExcretionInput: React.FC<ExcretionInputProps> = ({ onSave, isSubmitting }) => {
  // 正確な現在時刻を取得する関数
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    event_timestamp: getCurrentDateTime(),
    excretion_type: '',
    urine_amount: '',
    urine_color: '',
    urine_odor: '',
    urine_clarity: '',
    stool_amount: '',
    stool_consistency: '',
    bristol_scale: '',
    stool_color: '',
    blood_presence: [] as string[],
    diaper_condition: '',
    assistance_level: '',
    location: '',
    position: '',
    duration: '',
    toilet_type: '',
    incontinence_status: [] as string[],
    catheter_status: [] as string[],
    ostomy_status: [] as string[],
    hygiene_care: [] as string[],
    complications: [] as string[],
    intervention_needed: [] as string[],
    notes: ''
  });

  // 排泄タイプ（重心特化）
  const excretionTypes = [
    '排尿', '排便', '両方', 'おむつ交換のみ',
    'カテーテル排尿', 'ストーマ排泄', '失禁',
    '便意なし', '尿意なし', 'その他'
  ];

  // 尿量
  const urineAmountOptions = [
    '少量（50ml未満）', '中等量（50-150ml）', '多量（150ml以上）',
    '全量（おむつ湿潤）', '微量', '無尿',
    '測定不可', 'その他'
  ];

  // 尿の色
  const urineColorOptions = [
    '淡黄色（正常）', '濃黄色', '無色透明', '褐色',
    '赤色（血尿）', 'ピンク色', '混濁',
    '泡立ちあり', 'その他'
  ];

  // 尿の臭い
  const urineOdorOptions = [
    '正常', '強い臭い', '甘い臭い', '薬品臭',
    '魚臭', 'アンモニア臭', '無臭', 'その他'
  ];

  // 尿の透明度
  const urineClarityOptions = [
    '透明', '軽度混濁', '混濁', '強度混濁',
    '沈殿物あり', '浮遊物あり', 'その他'
  ];

  // 便量
  const stoolAmountOptions = [
    '少量', '中等量', '多量', '微量',
    '軟便', '水様便', '便塊', '測定不可', 'その他'
  ];

  // 便の性状
  const stoolConsistencyOptions = [
    '正常便', '軟便', '泥状便', '水様便',
    '硬便', '兎糞状', '粘液便', '血便',
    '粘血便', 'タール便', 'その他'
  ];

  // ブリストルスケール
  const bristolScaleOptions = [
    'タイプ1（硬いコロコロ便）', 'タイプ2（硬い塊便）',
    'タイプ3（ひび割れソーセージ便）', 'タイプ4（滑らかソーセージ便）',
    'タイプ5（軟らかい塊便）', 'タイプ6（泥状便）',
    'タイプ7（水様便）', '評価不可'
  ];

  // 便の色
  const stoolColorOptions = [
    '茶色（正常）', '黄色', '緑色', '黒色',
    '赤色', '白色', '灰色', 'タール色',
    '血液混入', 'その他'
  ];

  // 血液の存在
  const bloodPresenceOptions = [
    'なし', '尿に血液', '便に血液', '鮮血',
    '暗赤色血液', '血塊', '粘血便',
    '血尿', '肉眼的血尿', '顕微鏡的血尿',
    'その他'
  ];

  // おむつの状態
  const diaperConditionOptions = [
    '清潔', '軽度汚染', '中等度汚染', '重度汚染',
    '漏れあり', '皮膚トラブルあり', '発疹あり',
    'びらんあり', 'ただれあり', 'その他'
  ];

  // 介助レベル
  const assistanceLevels = [
    '自立', '見守り', '声かけ', '一部介助',
    '大部分介助', '全介助', 'おむつ交換',
    'カテーテル管理', 'ストーマ管理', 'その他'
  ];

  // 場所
  const locationOptions = [
    'トイレ', 'ポータブルトイレ', 'ベッド上',
    '車椅子', 'おむつ', 'トイレ室', '浴室',
    'その他'
  ];

  // 体位
  const positionOptions = [
    '座位', '立位', '仰臥位', '側臥位',
    '半座位', 'しゃがみ位', '抱っこ', 'その他'
  ];

  // トイレの種類
  const toiletTypeOptions = [
    '洋式便器', '和式便器', 'ポータブルトイレ',
    '車椅子対応トイレ', '介護用便座', 'おまる',
    'その他'
  ];

  // 失禁状態
  const incontinenceStatusOptions = [
    'なし', '尿失禁', '便失禁', '両方失禁',
    '切迫性失禁', '腹圧性失禁', '溢流性失禁',
    '機能性失禁', '夜間失禁', 'その他'
  ];

  // カテーテル状態
  const catheterStatusOptions = [
    '使用なし', '留置カテーテル', '間欠導尿',
    '自己導尿', 'カテーテル閉塞', 'カテーテル漏れ',
    'カテーテル抜去', 'カテーテル交換',
    '感染徴候', 'その他'
  ];

  // ストーマ状態
  const ostomyStatusOptions = [
    '使用なし', '人工肛門', '人工膀胱', 'ストーマ閉塞',
    'ストーマ周囲炎', '装具漏れ', '装具交換',
    '出血', '浮腫', 'その他'
  ];

  // 衛生ケア
  const hygieneCareOptions = [
    '実施済み', '清拭', '洗浄', '軟膏塗布',
    'おむつ交換', '着替え', 'リネン交換',
    '消毒', '保湿', 'その他'
  ];

  // 合併症
  const complicationsOptions = [
    'なし', '皮膚トラブル', '発疹', 'びらん',
    'ただれ', '感染徴候', '出血', '疼痛',
    '腹部膨満', '便秘', '下痢', '脱水',
    'その他'
  ];

  // 介入の必要性
  const interventionOptions = [
    '経過観察', '医師報告', '看護師報告', '皮膚科医相談',
    '泌尿器科医相談', '消化器科医相談', '薬剤調整',
    '水分調整', '食事調整', '体位変換',
    '清潔ケア強化', '軟膏処置', '感染対策',
    '家族相談', 'その他'
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
      {/* 排泄時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏰ 排泄時刻 *
        </label>
        <div className="flex space-x-2">
          <input
            type="datetime-local"
            value={formData.event_timestamp}
            onChange={(e) => setFormData({ ...formData, event_timestamp: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
            required
          />
          <button
            type="button"
            onClick={setCurrentTime}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 whitespace-nowrap font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            🕐 今すぐ
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          💡 「今すぐ」ボタンで正確な現在時刻を自動入力
        </p>
      </div>

      {/* 排泄タイプ */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🚽 排泄タイプ *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {excretionTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, excretion_type: type })}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                formData.excretion_type === type
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 尿量 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          💧 尿量
        </label>
        <div className="grid grid-cols-2 gap-2">
          {urineAmountOptions.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setFormData({ ...formData, urine_amount: amount })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.urine_amount === amount
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {amount}
            </button>
          ))}
        </div>
      </div>

      {/* 尿の色 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🎨 尿の色
        </label>
        <div className="grid grid-cols-3 gap-2">
          {urineColorOptions.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData({ ...formData, urine_color: color })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.urine_color === color
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* 尿の臭い */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          👃 尿の臭い
        </label>
        <div className="grid grid-cols-3 gap-2">
          {urineOdorOptions.map((odor) => (
            <button
              key={odor}
              type="button"
              onClick={() => setFormData({ ...formData, urine_odor: odor })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.urine_odor === odor
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {odor}
            </button>
          ))}
        </div>
      </div>

      {/* 尿の透明度 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔍 尿の透明度
        </label>
        <div className="grid grid-cols-3 gap-2">
          {urineClarityOptions.map((clarity) => (
            <button
              key={clarity}
              type="button"
              onClick={() => setFormData({ ...formData, urine_clarity: clarity })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.urine_clarity === clarity
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {clarity}
            </button>
          ))}
        </div>
      </div>

      {/* 便量 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          💩 便量
        </label>
        <div className="grid grid-cols-3 gap-2">
          {stoolAmountOptions.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setFormData({ ...formData, stool_amount: amount })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.stool_amount === amount
                  ? 'bg-brown-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {amount}
            </button>
          ))}
        </div>
      </div>

      {/* 便の性状 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🎯 便の性状
        </label>
        <div className="grid grid-cols-2 gap-2">
          {stoolConsistencyOptions.map((consistency) => (
            <button
              key={consistency}
              type="button"
              onClick={() => setFormData({ ...formData, stool_consistency: consistency })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.stool_consistency === consistency
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {consistency}
            </button>
          ))}
        </div>
      </div>

      {/* ブリストルスケール */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📊 ブリストルスケール
        </label>
        <div className="grid grid-cols-1 gap-2">
          {bristolScaleOptions.map((scale) => (
            <button
              key={scale}
              type="button"
              onClick={() => setFormData({ ...formData, bristol_scale: scale })}
              className={`p-3 rounded-lg text-sm font-medium transition-all text-left ${
                formData.bristol_scale === scale
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {scale}
            </button>
          ))}
        </div>
      </div>

      {/* 便の色 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🌈 便の色
        </label>
        <div className="grid grid-cols-3 gap-2">
          {stoolColorOptions.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData({ ...formData, stool_color: color })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.stool_color === color
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* 血液の存在 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🩸 血液の存在（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {bloodPresenceOptions.map((blood) => (
            <button
              key={blood}
              type="button"
              onClick={() => toggleArrayItem(
                formData.blood_presence, 
                blood, 
                (newArray) => setFormData({ ...formData, blood_presence: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.blood_presence.includes(blood)
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {blood}
            </button>
          ))}
        </div>
      </div>

      {/* おむつの状態 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🍼 おむつの状態
        </label>
        <div className="grid grid-cols-3 gap-2">
          {diaperConditionOptions.map((condition) => (
            <button
              key={condition}
              type="button"
              onClick={() => setFormData({ ...formData, diaper_condition: condition })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.diaper_condition === condition
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {condition}
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
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* 場所 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📍 場所
        </label>
        <div className="grid grid-cols-4 gap-2">
          {locationOptions.map((location) => (
            <button
              key={location}
              type="button"
              onClick={() => setFormData({ ...formData, location: location })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.location === location
                  ? 'bg-lime-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* 体位 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🛏️ 体位
        </label>
        <div className="grid grid-cols-4 gap-2">
          {positionOptions.map((position) => (
            <button
              key={position}
              type="button"
              onClick={() => setFormData({ ...formData, position: position })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.position === position
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {position}
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="例: 5分, 10分, 長時間, 短時間 など"
        />
      </div>

      {/* トイレの種類 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🚻 トイレの種類
        </label>
        <div className="grid grid-cols-3 gap-2">
          {toiletTypeOptions.map((toilet) => (
            <button
              key={toilet}
              type="button"
              onClick={() => setFormData({ ...formData, toilet_type: toilet })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.toilet_type === toilet
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {toilet}
            </button>
          ))}
        </div>
      </div>

      {/* 失禁状態 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ⚠️ 失禁状態（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {incontinenceStatusOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => toggleArrayItem(
                formData.incontinence_status, 
                status, 
                (newArray) => setFormData({ ...formData, incontinence_status: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.incontinence_status.includes(status)
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* カテーテル状態 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔗 カテーテル状態（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {catheterStatusOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => toggleArrayItem(
                formData.catheter_status, 
                status, 
                (newArray) => setFormData({ ...formData, catheter_status: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.catheter_status.includes(status)
                  ? 'bg-violet-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ストーマ状態 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔄 ストーマ状態（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ostomyStatusOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => toggleArrayItem(
                formData.ostomy_status, 
                status, 
                (newArray) => setFormData({ ...formData, ostomy_status: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.ostomy_status.includes(status)
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 衛生ケア */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🧼 衛生ケア（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {hygieneCareOptions.map((care) => (
            <button
              key={care}
              type="button"
              onClick={() => toggleArrayItem(
                formData.hygiene_care, 
                care, 
                (newArray) => setFormData({ ...formData, hygiene_care: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.hygiene_care.includes(care)
                  ? 'bg-slate-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {care}
            </button>
          ))}
        </div>
      </div>

      {/* 合併症 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ⚡ 合併症（複数選択可）
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
                  ? 'bg-red-700 text-white shadow-md'
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          rows={4}
          placeholder="排泄時の特記事項、医師への申し送り、家族への連絡内容、スキンケア、感染対策など..."
        />
      </div>

      {/* 保存ボタン */}
      <div className="sticky bottom-0 bg-gray-50 p-4 -mx-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            '🚽 排泄記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};

export default ExcretionInput;