import React, { useState } from 'react';

interface CareInputProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

const CareInput: React.FC<CareInputProps> = ({ onSave, isSubmitting }) => {
  // 正確な現在時刻を取得する関数
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    event_timestamp: getCurrentDateTime(),
    care_type: '',
    care_category: '',
    performed_by: '',
    assistance_level: '',
    duration_minutes: '',
    location: '',
    equipment_used: [] as string[],
    procedures_performed: [] as string[],
    medical_interventions: [] as string[],
    medications_administered: [] as string[],
    vital_signs_monitoring: [] as string[],
    respiratory_care: [] as string[],
    nutritional_support: [] as string[],
    hygiene_care: [] as string[],
    skin_care: [] as string[],
    positioning_care: [] as string[],
    safety_measures: [] as string[],
    patient_response: [] as string[],
    complications: [] as string[],
    follow_up_needed: [] as string[],
    notes: ''
  });

  // 医療ケアタイプ（重心特化）
  const careTypes = [
    '吸引', '酸素療法', '人工呼吸器管理', '気管切開ケア',
    '経管栄養', '胃ろうケア', '褥瘡ケア', '体位変換',
    'ROM訓練', '口腔ケア', '薬物投与', 'バイタル測定',
    '導尿・カテーテル管理', 'ストーマケア', '創傷処置',
    'IVH管理', '血糖測定', '発作時対応', 'その他'
  ];

  // ケアカテゴリー
  const careCategories = [
    '呼吸器ケア', '栄養ケア', '排泄ケア', '清潔ケア',
    '安全管理', '薬物療法', '処置・治療', 'リハビリテーション',
    '感染対策', '疼痛管理', 'その他'
  ];

  // 実施者
  const performedByOptions = [
    '看護師', '准看護師', '介護福祉士', '医師',
    'PT（理学療法士）', 'OT（作業療法士）', 'ST（言語聴覚士）',
    '生活支援員', '保育士', '栄養士', '家族',
    'その他'
  ];

  // 介助レベル
  const assistanceLevels = [
    '完全実施', '一部介助', '見守り', '指導',
    '家族指導', '他職種連携', '医師指示',
    'その他'
  ];

  // 場所
  const locationOptions = [
    '居室・ベッドサイド', '処置室', '医務室', '訓練室',
    '浴室', 'トイレ', '食堂', '廊下', '車内',
    '屋外', 'その他'
  ];

  // 使用機器
  const equipmentUsed = [
    'なし', '吸引器', '酸素濃縮器', '人工呼吸器',
    'パルスオキシメーター', '血圧計', '体温計', '血糖測定器',
    '注射器', '点滴セット', 'カテーテル', 'ストーマ用品',
    '車椅子', 'ベッド', 'クッション', 'マットレス',
    '滅菌ガーゼ', '消毒薬', '手袋', 'マスク',
    'その他'
  ];

  // 実施手技
  const proceduresPerformed = [
    'なし', '吸引（口腔）', '吸引（鼻腔）', '吸引（気管）',
    '酸素投与', 'バッグマスク換気', '気管カニューレ交換',
    '経管栄養注入', '胃ろう注入', '薬剤投与（経口）',
    '薬剤投与（注射）', '点滴管理', '血糖測定',
    '導尿', 'カテーテル交換', 'ストーマ交換',
    '創傷処置', '褥瘡処置', '体位変換', 'ROM訓練',
    '口腔ケア', '清拭', '入浴介助', 'その他'
  ];

  // 医学的介入
  const medicalInterventions = [
    'なし', '医師診察', '薬剤調整', '検査実施',
    '処方変更', '治療方針変更', '専門医紹介',
    '入院調整', '救急搬送', '家族面談',
    'その他'
  ];

  // 投与薬剤
  const medicationsAdministered = [
    'なし', '抗けいれん薬', '抗不安薬', '鎮痛薬',
    '解熱薬', '抗生剤', '気管支拡張薬', '去痰薬',
    '胃薬', '整腸薬', '便秘薬', '利尿薬',
    '血圧薬', '血糖降下薬', 'ビタミン剤',
    '栄養剤', 'インスリン', 'その他'
  ];

  // バイタルサイン監視
  const vitalSignsMonitoring = [
    'なし', '体温測定', '脈拍測定', '血圧測定',
    '呼吸数測定', 'SpO2測定', '血糖測定',
    '意識レベル確認', '瞳孔確認', '皮膚色確認',
    '浮腫確認', 'その他'
  ];

  // 呼吸器ケア
  const respiratoryCare = [
    'なし', '酸素投与', '吸引', '体位ドレナージ',
    '胸部理学療法', '呼吸訓練', '気道加湿',
    '人工呼吸器設定確認', 'アラーム対応',
    '気管切開部ケア', 'その他'
  ];

  // 栄養サポート
  const nutritionalSupport = [
    'なし', '経口摂取介助', '経管栄養', '胃ろう栄養',
    '中心静脈栄養', '末梢点滴', '水分補給',
    '栄養評価', '体重測定', '摂取量確認',
    'その他'
  ];

  // 清潔ケア
  const hygieneCareOptions = [
    'なし', '全身清拭', '部分清拭', '入浴介助',
    'シャワー浴', '洗髪', '口腔ケア', '歯磨き',
    '爪切り', '髭剃り', '着替え', 'おむつ交換',
    'その他'
  ];

  // スキンケア
  const skinCareOptions = [
    'なし', '褥瘡予防', '褥瘡処置', '皮膚保湿',
    '発疹処置', '創傷処置', 'マッサージ',
    '圧迫除去', '体位変換', '清潔保持',
    'その他'
  ];

  // ポジショニングケア
  const positioningCare = [
    'なし', '仰臥位', '側臥位', '座位', '立位',
    'ファウラー位', 'セミファウラー位', '腹臥位',
    'クッション使用', '体位変換', '関節可動域訓練',
    'その他'
  ];

  // 安全対策
  const safetyMeasures = [
    'なし', 'ベッド柵使用', '車椅子ベルト',
    '転倒予防', '誤嚥予防', '発作時対応',
    '感染対策', '薬剤管理', '機器点検',
    '環境整備', '見守り強化', 'その他'
  ];

  // 患者反応
  const patientResponse = [
    '良好', '協力的', '拒否的', '不安', '疼痛',
    '不快感', '安心', 'リラックス', '興奮',
    '無反応', '眠気', '覚醒良好', 'その他'
  ];

  // 合併症
  const complicationsOptions = [
    'なし', '発作', 'けいれん', '呼吸困難', '低酸素',
    '発熱', '血圧変動', '不整脈', '嘔吐', '誤嚥',
    '感染徴候', '皮膚トラブル', '疼痛', '出血',
    'アレルギー反応', 'その他'
  ];

  // フォローアップ必要性
  const followUpNeeded = [
    'なし', '医師報告', '看護師申し送り', '家族連絡',
    '他職種連携', '薬剤調整', '処置継続',
    '観察強化', '検査実施', '専門医受診',
    '入院検討', 'その他'
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
      {/* ケア実施時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏰ ケア実施時刻 *
        </label>
        <div className="flex space-x-2">
          <input
            type="datetime-local"
            value={formData.event_timestamp}
            onChange={(e) => setFormData({ ...formData, event_timestamp: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
            required
          />
          <button
            type="button"
            onClick={setCurrentTime}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 whitespace-nowrap font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            🕐 今すぐ
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          💡 「今すぐ」ボタンで正確な現在時刻を自動入力
        </p>
      </div>

      {/* 医療ケアタイプ */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🏥 医療ケアタイプ *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {careTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, care_type: type })}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                formData.care_type === type
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ケアカテゴリー */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📋 ケアカテゴリー
        </label>
        <div className="grid grid-cols-2 gap-2">
          {careCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFormData({ ...formData, care_category: category })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.care_category === category
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 実施者 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          👩‍⚕️ 実施者
        </label>
        <div className="grid grid-cols-3 gap-2">
          {performedByOptions.map((performer) => (
            <button
              key={performer}
              type="button"
              onClick={() => setFormData({ ...formData, performed_by: performer })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.performed_by === performer
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {performer}
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
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* 実施時間 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏱️ 実施時間（分）
        </label>
        <input
          type="number"
          value={formData.duration_minutes}
          onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          placeholder="例: 15（15分間）"
        />
      </div>

      {/* 実施場所 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📍 実施場所
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

      {/* 実施手技 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🩺 実施手技（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {proceduresPerformed.map((procedure) => (
            <button
              key={procedure}
              type="button"
              onClick={() => toggleArrayItem(
                formData.procedures_performed, 
                procedure, 
                (newArray) => setFormData({ ...formData, procedures_performed: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.procedures_performed.includes(procedure)
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {procedure}
            </button>
          ))}
        </div>
      </div>

      {/* 医学的介入 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          👨‍⚕️ 医学的介入（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {medicalInterventions.map((intervention) => (
            <button
              key={intervention}
              type="button"
              onClick={() => toggleArrayItem(
                formData.medical_interventions, 
                intervention, 
                (newArray) => setFormData({ ...formData, medical_interventions: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.medical_interventions.includes(intervention)
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {intervention}
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
          {medicationsAdministered.map((medication) => (
            <button
              key={medication}
              type="button"
              onClick={() => toggleArrayItem(
                formData.medications_administered, 
                medication, 
                (newArray) => setFormData({ ...formData, medications_administered: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.medications_administered.includes(medication)
                  ? 'bg-lime-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {medication}
            </button>
          ))}
        </div>
      </div>

      {/* バイタルサイン監視 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📊 バイタルサイン監視（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {vitalSignsMonitoring.map((monitoring) => (
            <button
              key={monitoring}
              type="button"
              onClick={() => toggleArrayItem(
                formData.vital_signs_monitoring, 
                monitoring, 
                (newArray) => setFormData({ ...formData, vital_signs_monitoring: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.vital_signs_monitoring.includes(monitoring)
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {monitoring}
            </button>
          ))}
        </div>
      </div>

      {/* 呼吸器ケア */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🫁 呼吸器ケア（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {respiratoryCare.map((care) => (
            <button
              key={care}
              type="button"
              onClick={() => toggleArrayItem(
                formData.respiratory_care, 
                care, 
                (newArray) => setFormData({ ...formData, respiratory_care: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.respiratory_care.includes(care)
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {care}
            </button>
          ))}
        </div>
      </div>

      {/* 栄養サポート */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🍽️ 栄養サポート（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {nutritionalSupport.map((support) => (
            <button
              key={support}
              type="button"
              onClick={() => toggleArrayItem(
                formData.nutritional_support, 
                support, 
                (newArray) => setFormData({ ...formData, nutritional_support: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.nutritional_support.includes(support)
                  ? 'bg-violet-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {support}
            </button>
          ))}
        </div>
      </div>

      {/* 清潔ケア */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🧼 清潔ケア（複数選択可）
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
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {care}
            </button>
          ))}
        </div>
      </div>

      {/* スキンケア */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🧴 スキンケア（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {skinCareOptions.map((care) => (
            <button
              key={care}
              type="button"
              onClick={() => toggleArrayItem(
                formData.skin_care, 
                care, 
                (newArray) => setFormData({ ...formData, skin_care: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.skin_care.includes(care)
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {care}
            </button>
          ))}
        </div>
      </div>

      {/* ポジショニングケア */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🛏️ ポジショニングケア（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {positioningCare.map((care) => (
            <button
              key={care}
              type="button"
              onClick={() => toggleArrayItem(
                formData.positioning_care, 
                care, 
                (newArray) => setFormData({ ...formData, positioning_care: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.positioning_care.includes(care)
                  ? 'bg-slate-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {care}
            </button>
          ))}
        </div>
      </div>

      {/* 安全対策 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🛡️ 安全対策（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {safetyMeasures.map((measure) => (
            <button
              key={measure}
              type="button"
              onClick={() => toggleArrayItem(
                formData.safety_measures, 
                measure, 
                (newArray) => setFormData({ ...formData, safety_measures: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.safety_measures.includes(measure)
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {measure}
            </button>
          ))}
        </div>
      </div>

      {/* 患者反応 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          😊 患者反応（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {patientResponse.map((response) => (
            <button
              key={response}
              type="button"
              onClick={() => toggleArrayItem(
                formData.patient_response, 
                response, 
                (newArray) => setFormData({ ...formData, patient_response: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.patient_response.includes(response)
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {response}
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

      {/* フォローアップ必要性 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔄 フォローアップ必要性（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {followUpNeeded.map((followUp) => (
            <button
              key={followUp}
              type="button"
              onClick={() => toggleArrayItem(
                formData.follow_up_needed, 
                followUp, 
                (newArray) => setFormData({ ...formData, follow_up_needed: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.follow_up_needed.includes(followUp)
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {followUp}
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          rows={4}
          placeholder="医療ケア時の特記事項、医師への申し送り、家族への連絡内容、技術的な詳細、安全性の確認など..."
        />
      </div>

      {/* 保存ボタン */}
      <div className="sticky bottom-0 bg-gray-50 p-4 -mx-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            '🏥 医療ケア記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};

export default CareInput;