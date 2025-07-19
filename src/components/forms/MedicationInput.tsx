import React, { useState } from 'react';

interface MedicationInputProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

const MedicationInput: React.FC<MedicationInputProps> = ({ onSave, isSubmitting }) => {
  // 正確な現在時刻を取得する関数
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    event_timestamp: getCurrentDateTime(),
    medication_name: '',
    medication_type: '',
    dosage_amount: '',
    dosage_unit: '',
    administration_route: '',
    administration_time: '',
    administered_by: '',
    indication: '',
    prescribing_doctor: '',
    medication_form: '',
    concentration: '',
    storage_location: '',
    expiry_check: '',
    side_effects_monitored: [] as string[],
    administration_method: [] as string[],
    patient_condition_before: [] as string[],
    administration_difficulties: [] as string[],
    patient_response: [] as string[],
    vital_signs_monitoring: [] as string[],
    adverse_reactions: [] as string[],
    medication_effectiveness: '' as string,
    next_dose_timing: '',
    special_instructions: [] as string[],
    family_notification: '',
    follow_up_required: [] as string[],
    notes: ''
  });

  // 薬剤タイプ（重心特化）
  const medicationTypes = [
    '抗てんかん薬', '抗けいれん薬', '鎮静薬', '筋弛緩薬',
    '気管支拡張薬', '去痰薬', '抗生剤', '解熱鎮痛薬',
    '胃薬・消化器薬', '便秘薬', '整腸薬', '利尿薬',
    '循環器薬', '血糖降下薬', 'ホルモン薬', 'ビタミン剤',
    '栄養剤', '点眼薬', '外用薬', 'ワクチン', 'その他'
  ];

  // 投与経路
  const administrationRoutes = [
    '経口', '経管（胃ろう）', '経管（経鼻）', '静脈内',
    '筋肉内', '皮下', '直腸', '外用（皮膚）',
    '点眼', '点鼻', '吸入', '舌下', 'その他'
  ];

  // 投与時間
  const administrationTimes = [
    '朝食前', '朝食後', '昼食前', '昼食後',
    '夕食前', '夕食後', '就寝前', '起床時',
    '空腹時', '頓服', '定時', '発作時',
    '緊急時', 'その他'
  ];

  // 投与者
  const administeredByOptions = [
    '看護師', '准看護師', '医師', '介護福祉士',
    '薬剤師', '保護者', '本人', 'その他'
  ];

  // 適応症
  const indications = [
    'てんかん発作', 'けいれん', '筋緊張', '痰の排出',
    '呼吸困難', '感染症', '発熱', '疼痛',
    '胃腸症状', '便秘', '栄養不足', '血糖管理',
    '循環器疾患', '眼科疾患', '皮膚疾患', 'その他'
  ];

  // 薬剤形状
  const medicationForms = [
    '錠剤', 'カプセル', '散剤', '液剤',
    'シロップ', '注射剤', '点眼液', '軟膏',
    'クリーム', '湿布', '坐薬', '吸入薬',
    '貼付薬', 'その他'
  ];

  // 単位
  const dosageUnits = [
    'mg', 'g', 'ml', 'cc', '錠', 'カプセル',
    '包', '単位', 'μg', 'mEq', '滴', 'その他'
  ];

  // 処方医
  const prescribingDoctors = [
    '主治医', '神経内科医', '小児科医', '整形外科医',
    '呼吸器科医', '循環器科医', '消化器科医', '皮膚科医',
    '眼科医', '耳鼻科医', '精神科医', 'その他'
  ];

  // 保管場所
  const storageLocations = [
    '薬剤室', '処置室', '冷蔵庫', '常温保管',
    '遮光保管', '個人薬品庫', '緊急薬品庫', 'その他'
  ];

  // 副作用監視
  const sideEffectsMonitored = [
    'なし', '眠気', 'ふらつき', '食欲不振', '嘔気・嘔吐',
    '便秘', '下痢', '皮疹', 'かゆみ', '発熱',
    '血圧変動', '心拍数変化', '呼吸状態変化', '意識レベル変化',
    '肝機能', '腎機能', '血糖値', '電解質異常', 'その他'
  ];

  // 投与方法
  const administrationMethods = [
    '経口投与', '経管注入', '点滴投与', '一回注射',
    '持続投与', '噴霧吸入', '定量吸入', '直接塗布',
    '湿布貼付', '点眼', '点鼻', '坐薬挿入', 'その他'
  ];

  // 投与前患者状態
  const patientConditionBefore = [
    '安定', '発作中', '発熱', '呼吸困難', '疼痛',
    '不穏', '食欲不振', '嘔気', '便秘', '下痢',
    '興奮', '眠気', '覚醒良好', 'その他'
  ];

  // 投与困難要因
  const administrationDifficulties = [
    'なし', '嚥下困難', '経管閉塞', '静脈確保困難',
    '患者拒否', '嘔吐', 'アレルギー歴', '相互作用',
    '投与タイミング調整', '薬剤変更', 'その他'
  ];

  // 患者反応
  const patientResponseOptions = [
    '良好', '改善', '効果あり', '効果不明', '副作用あり',
    '拒否反応', 'アレルギー反応', '嘔吐', '眠気増強',
    '興奮', '不穏', '無反応', 'その他'
  ];

  // バイタル監視
  const vitalSignsMonitoring = [
    'なし', '血圧測定', '脈拍測定', '体温測定',
    '呼吸数測定', 'SpO2測定', '血糖測定', '意識レベル',
    '瞳孔反応', '皮膚色', '浮腫', '心電図', 'その他'
  ];

  // 有害反応
  const adverseReactions = [
    'なし', 'アナフィラキシー', '皮疹', 'かゆみ',
    '呼吸困難', '血圧低下', '頻脈', '徐脈',
    '意識障害', 'けいれん', '嘔吐', '下痢',
    '肝機能異常', '腎機能異常', 'その他'
  ];

  // 薬効評価
  const medicationEffectiveness = [
    '著効', '有効', 'やや有効', '無効', '判定不能',
    '副作用のため中止', '経過観察中'
  ];

  // 特別指示
  const specialInstructions = [
    'なし', '食後30分以内', '空腹時投与', '水分制限時',
    '他剤との間隔調整', '粉砕可', '粉砕不可', '分包可',
    '冷蔵保存', '遮光保存', '開封後使用期限注意',
    '血中濃度測定', '定期検査必要', 'その他'
  ];

  // フォローアップ
  const followUpRequired = [
    'なし', '血中濃度測定', '肝機能検査', '腎機能検査',
    '血液検査', '心電図', '胸部X線', '処方調整',
    '医師報告', '薬剤師相談', '家族説明', 'その他'
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
      {/* 投薬実施時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏰ 投薬実施時刻 *
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

      {/* 薬剤名 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          💊 薬剤名 *
        </label>
        <input
          type="text"
          value={formData.medication_name}
          onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="例: テグレトール、フェノバール、ダイアップ..."
          required
        />
      </div>

      {/* 薬剤タイプ */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🏷️ 薬剤タイプ
        </label>
        <div className="grid grid-cols-2 gap-2">
          {medicationTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, medication_type: type })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.medication_type === type
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 用量・用法 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📏 用量・用法 *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">用量</label>
            <input
              type="number"
              step="0.1"
              value={formData.dosage_amount}
              onChange={(e) => setFormData({ ...formData, dosage_amount: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="例: 100"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">単位</label>
            <select
              value={formData.dosage_unit}
              onChange={(e) => setFormData({ ...formData, dosage_unit: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">選択</option>
              {dosageUnits.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 投与経路 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔄 投与経路 *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {administrationRoutes.map((route) => (
            <button
              key={route}
              type="button"
              onClick={() => setFormData({ ...formData, administration_route: route })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.administration_route === route
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {route}
            </button>
          ))}
        </div>
      </div>

      {/* 投与時間 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🕐 投与時間
        </label>
        <div className="grid grid-cols-4 gap-2">
          {administrationTimes.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => setFormData({ ...formData, administration_time: time })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.administration_time === time
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* 投与者 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          👩‍⚕️ 投与者
        </label>
        <div className="grid grid-cols-4 gap-2">
          {administeredByOptions.map((person) => (
            <button
              key={person}
              type="button"
              onClick={() => setFormData({ ...formData, administered_by: person })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.administered_by === person
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {person}
            </button>
          ))}
        </div>
      </div>

      {/* 適応症 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🎯 適応症
        </label>
        <div className="grid grid-cols-2 gap-2">
          {indications.map((indication) => (
            <button
              key={indication}
              type="button"
              onClick={() => setFormData({ ...formData, indication: indication })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.indication === indication
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {indication}
            </button>
          ))}
        </div>
      </div>

      {/* 処方医 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          👨‍⚕️ 処方医
        </label>
        <div className="grid grid-cols-3 gap-2">
          {prescribingDoctors.map((doctor) => (
            <button
              key={doctor}
              type="button"
              onClick={() => setFormData({ ...formData, prescribing_doctor: doctor })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.prescribing_doctor === doctor
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {doctor}
            </button>
          ))}
        </div>
      </div>

      {/* 薬剤形状 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📦 薬剤形状
        </label>
        <div className="grid grid-cols-3 gap-2">
          {medicationForms.map((form) => (
            <button
              key={form}
              type="button"
              onClick={() => setFormData({ ...formData, medication_form: form })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.medication_form === form
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {form}
            </button>
          ))}
        </div>
      </div>

      {/* 濃度・規格 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          🧪 濃度・規格
        </label>
        <input
          type="text"
          value={formData.concentration}
          onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="例: 100mg/錠、5%、1mg/ml..."
        />
      </div>

      {/* 保管場所 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🏪 保管場所
        </label>
        <div className="grid grid-cols-4 gap-2">
          {storageLocations.map((location) => (
            <button
              key={location}
              type="button"
              onClick={() => setFormData({ ...formData, storage_location: location })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.storage_location === location
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* 有効期限確認 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📅 有効期限確認
        </label>
        <input
          type="date"
          value={formData.expiry_check}
          onChange={(e) => setFormData({ ...formData, expiry_check: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 副作用監視項目 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ⚠️ 副作用監視項目（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {sideEffectsMonitored.map((effect) => (
            <button
              key={effect}
              type="button"
              onClick={() => toggleArrayItem(
                formData.side_effects_monitored, 
                effect, 
                (newArray) => setFormData({ ...formData, side_effects_monitored: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.side_effects_monitored.includes(effect)
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {effect}
            </button>
          ))}
        </div>
      </div>

      {/* 投与方法 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🩺 投与方法（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {administrationMethods.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => toggleArrayItem(
                formData.administration_method, 
                method, 
                (newArray) => setFormData({ ...formData, administration_method: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.administration_method.includes(method)
                  ? 'bg-lime-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* 投与前患者状態 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📋 投与前患者状態（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {patientConditionBefore.map((condition) => (
            <button
              key={condition}
              type="button"
              onClick={() => toggleArrayItem(
                formData.patient_condition_before, 
                condition, 
                (newArray) => setFormData({ ...formData, patient_condition_before: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.patient_condition_before.includes(condition)
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {condition}
            </button>
          ))}
        </div>
      </div>

      {/* 投与困難要因 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ⚡ 投与困難要因（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {administrationDifficulties.map((difficulty) => (
            <button
              key={difficulty}
              type="button"
              onClick={() => toggleArrayItem(
                formData.administration_difficulties, 
                difficulty, 
                (newArray) => setFormData({ ...formData, administration_difficulties: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.administration_difficulties.includes(difficulty)
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {difficulty}
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
          {patientResponseOptions.map((response) => (
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
                  ? 'bg-violet-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {response}
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
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {monitoring}
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

      {/* 薬効評価 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📈 薬効評価
        </label>
        <div className="grid grid-cols-4 gap-2">
          {medicationEffectiveness.map((effectiveness) => (
            <button
              key={effectiveness}
              type="button"
              onClick={() => setFormData({ ...formData, medication_effectiveness: effectiveness })}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.medication_effectiveness === effectiveness
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {effectiveness}
            </button>
          ))}
        </div>
      </div>

      {/* 次回投与予定時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏳ 次回投与予定時刻
        </label>
        <input
          type="datetime-local"
          value={formData.next_dose_timing}
          onChange={(e) => setFormData({ ...formData, next_dose_timing: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 特別指示 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📋 特別指示（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {specialInstructions.map((instruction) => (
            <button
              key={instruction}
              type="button"
              onClick={() => toggleArrayItem(
                formData.special_instructions, 
                instruction, 
                (newArray) => setFormData({ ...formData, special_instructions: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.special_instructions.includes(instruction)
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {instruction}
            </button>
          ))}
        </div>
      </div>

      {/* 家族への連絡 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📞 家族への連絡
        </label>
        <select
          value={formData.family_notification}
          onChange={(e) => setFormData({ ...formData, family_notification: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">選択</option>
          <option value="連絡済み">連絡済み</option>
          <option value="連絡予定">連絡予定</option>
          <option value="連絡不要">連絡不要</option>
          <option value="緊急連絡済み">緊急連絡済み</option>
        </select>
      </div>

      {/* フォローアップ必要性 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔄 フォローアップ必要性（複数選択可）
        </label>
        <div className="grid grid-cols-2 gap-2">
          {followUpRequired.map((followUp) => (
            <button
              key={followUp}
              type="button"
              onClick={() => toggleArrayItem(
                formData.follow_up_required, 
                followUp, 
                (newArray) => setFormData({ ...formData, follow_up_required: newArray })
              )}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                formData.follow_up_required.includes(followUp)
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="薬剤投与時の特記事項、副作用の詳細、投与困難の理由、家族への説明内容、医師への報告事項など..."
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
            '💊 薬剤投与記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};

export default MedicationInput;
