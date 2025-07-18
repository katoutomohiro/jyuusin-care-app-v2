import React, { useState } from 'react';

interface SkinOralCareFormProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

export const SkinOralCareForm: React.FC<SkinOralCareFormProps> = ({ onSave, isSubmitting }) => {
  // 正確な現在時刻を取得する関数（統一仕様）
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    // 1. 記録時刻
    event_timestamp: getCurrentDateTime(),
    
    // 2. ケアの種類
    care_type: '', // 'skin_observation' | 'oral_care' | 'both'
    
    // 皮膚観察・ケア
    skin_care: {
      observation_areas: [] as string[], // 観察した部位
      skin_conditions: [] as string[], // 皮膚の状態
      care_provided: [] as string[], // 実施したケア
      location_details: '', // 発赤・問題のある部位の詳細
      notes: ''
    },
    
    // 口腔ケア
    oral_care: {
      oral_conditions: [] as string[], // 口腔内の状態
      care_provided: [] as string[], // 実施したケア
      tools_used: [] as string[], // 使用した用具
      response: '', // 本人の反応
      notes: ''
    },
    
    // 特記事項
    notes: '',
    
    // テンプレート文章
    template_text: ''
  });

  const setCurrentTime = () => {
    const exactNow = getCurrentDateTime();
    setFormData({ ...formData, event_timestamp: exactNow });
    console.log('現在時刻を設定:', new Date().toLocaleString('ja-JP'));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  // 選択肢定義
  const careTypes = [
    { key: 'skin_observation', label: '皮膚の観察', icon: '🔍', color: 'border-pink-400 bg-pink-50' },
    { key: 'oral_care', label: '口腔ケア', icon: '🦷', color: 'border-blue-400 bg-blue-50' },
    { key: 'both', label: '両方', icon: '✨', color: 'border-purple-400 bg-purple-50' }
  ];

  const observationAreas = [
    '頭部・顔面', '首・肩', '胸部・腹部', '背部', '上肢', '下肢', 
    '臀部', '仙骨部', '踵部', '肘部', '膝部', '全身'
  ];

  const skinConditions = [
    '変化なし・良好', '乾燥', '軽度発赤', '中等度発赤', '重度発赤',
    '湿疹・かぶれ', '褥瘡の兆候', '小さな傷', '浮腫', '色素沈着',
    '爪の状態異常', 'その他'
  ];

  const skinCareProvided = [
    '保湿剤塗布', '軟膏塗布', 'ドレッシング材交換', '清拭', '洗浄',
    'マッサージ', '体位変換', '除圧', '爪切り', 'その他'
  ];

  const oralConditions = [
    '清潔・良好', '乾燥', '軽度汚れ', '中等度汚れ', '重度汚れ',
    '舌苔あり', '出血', '口臭', '口内炎の兆候', '義歯の問題',
    'その他'
  ];

  const oralCareProvided = [
    '歯ブラシでブラッシング', 'スポンジブラシ', 'ガーゼ清拭', 'うがい',
    '義歯洗浄', '舌清拭', '口唇保湿', '口腔用保湿剤使用', 'その他'
  ];

  const toolsUsed = [
    '歯ブラシ', 'スポンジブラシ', 'ガーゼ', 'マウスウォッシュ',
    '歯磨き粉', '口腔用保湿剤', '舌ブラシ', 'リップクリーム', 'その他'
  ];

  const responseOptions = [
    'リラックスして受け入れ', '少し緊張気味', '嫌がる様子', 
    '協力的', '眠ってしまった', '気持ちよさそう', 'その他'
  ];

  const templateTexts = [
    '仙骨部に軽度の発赤あり。体位交換の頻度を見直します',
    '口腔ケア後、とても、さっぱりとした表情をされていました',
    '皮膚の状態は良好で、特に問題ありません',
    '保湿ケア後、肌がしっとりとして快適そうでした',
    '歯磨き中、口を大きく開けて協力的でした',
    '舌苔が見られたため、舌清拭を丁寧に行いました',
    '義歯の汚れを除去し、清潔を保持しました',
    '口腔ケア中、安心した表情を見せてくれました'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. 記録時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏰ 記録時刻 *
        </label>
        <div className="flex space-x-2">
          <input
            type="datetime-local"
            value={formData.event_timestamp}
            onChange={(e) => setFormData({ ...formData, event_timestamp: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-lg"
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

      {/* 2. ケアの種類選択 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ✨ ケアの種類 *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {careTypes.map((type) => (
            <button
              key={type.key}
              type="button"
              onClick={() => setFormData({ ...formData, care_type: type.key })}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.care_type === type.key
                  ? `${type.color} border-current`
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="text-xl mb-1">{type.icon}</div>
              <div className="text-sm font-semibold">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. 皮膚観察・ケア */}
      {(formData.care_type === 'skin_observation' || formData.care_type === 'both') && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-pink-700 mb-4 border-b border-pink-200 pb-2">
            🔍 皮膚の観察・ケア
          </h3>
          
          {/* 観察した部位 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">観察した部位（複数選択可）</label>
            <div className="grid grid-cols-4 gap-2">
              {observationAreas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    skin_care: { 
                      ...formData.skin_care, 
                      observation_areas: toggleArrayItem(formData.skin_care.observation_areas, area)
                    } 
                  })}
                  className={`p-2 text-sm rounded border transition-colors ${
                    formData.skin_care.observation_areas.includes(area)
                      ? 'border-pink-500 bg-pink-50 text-pink-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* 皮膚の状態 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">皮膚の状態（複数選択可）</label>
            <div className="grid grid-cols-3 gap-2">
              {skinConditions.map((condition) => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    skin_care: { 
                      ...formData.skin_care, 
                      skin_conditions: toggleArrayItem(formData.skin_care.skin_conditions, condition)
                    } 
                  })}
                  className={`p-2 text-sm rounded border transition-colors ${
                    formData.skin_care.skin_conditions.includes(condition)
                      ? 'border-pink-500 bg-pink-50 text-pink-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {/* 実施したケア */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">実施したケア（複数選択可）</label>
            <div className="grid grid-cols-3 gap-2">
              {skinCareProvided.map((care) => (
                <button
                  key={care}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    skin_care: { 
                      ...formData.skin_care, 
                      care_provided: toggleArrayItem(formData.skin_care.care_provided, care)
                    } 
                  })}
                  className={`p-2 text-sm rounded border transition-colors ${
                    formData.skin_care.care_provided.includes(care)
                      ? 'border-pink-500 bg-pink-50 text-pink-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {care}
                </button>
              ))}
            </div>
          </div>

          {/* 部位の詳細 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              発赤・問題のある部位の詳細
            </label>
            <input
              type="text"
              value={formData.skin_care.location_details}
              onChange={(e) => setFormData({ 
                ...formData, 
                skin_care: { ...formData.skin_care, location_details: e.target.value } 
              })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="例：右臀部に2cm大の発赤、仙骨部に軽度の圧痕など"
            />
          </div>
        </div>
      )}

      {/* 4. 口腔ケア */}
      {(formData.care_type === 'oral_care' || formData.care_type === 'both') && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b border-blue-200 pb-2">
            🦷 口腔ケア
          </h3>
          
          {/* 口腔内の状態 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">口腔内の状態（複数選択可）</label>
            <div className="grid grid-cols-3 gap-2">
              {oralConditions.map((condition) => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    oral_care: { 
                      ...formData.oral_care, 
                      oral_conditions: toggleArrayItem(formData.oral_care.oral_conditions, condition)
                    } 
                  })}
                  className={`p-2 text-sm rounded border transition-colors ${
                    formData.oral_care.oral_conditions.includes(condition)
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {/* 実施したケア */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">実施したケア（複数選択可）</label>
            <div className="grid grid-cols-3 gap-2">
              {oralCareProvided.map((care) => (
                <button
                  key={care}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    oral_care: { 
                      ...formData.oral_care, 
                      care_provided: toggleArrayItem(formData.oral_care.care_provided, care)
                    } 
                  })}
                  className={`p-2 text-sm rounded border transition-colors ${
                    formData.oral_care.care_provided.includes(care)
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {care}
                </button>
              ))}
            </div>
          </div>

          {/* 使用した用具 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">使用した用具（複数選択可）</label>
            <div className="grid grid-cols-4 gap-2">
              {toolsUsed.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    oral_care: { 
                      ...formData.oral_care, 
                      tools_used: toggleArrayItem(formData.oral_care.tools_used, tool)
                    } 
                  })}
                  className={`p-2 text-sm rounded border transition-colors ${
                    formData.oral_care.tools_used.includes(tool)
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {tool}
                </button>
              ))}
            </div>
          </div>

          {/* 本人の反応 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">本人の反応</label>
            <div className="grid grid-cols-3 gap-2">
              {responseOptions.map((response) => (
                <button
                  key={response}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    oral_care: { ...formData.oral_care, response } 
                  })}
                  className={`p-2 text-sm rounded border transition-colors ${
                    formData.oral_care.response === response
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {response}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. テンプレート文章 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📝 よく使う文章テンプレート
        </label>
        <div className="grid grid-cols-1 gap-2">
          {templateTexts.map((template, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setFormData({ ...formData, template_text: template })}
              className={`p-2 text-sm rounded border transition-colors text-left ${
                formData.template_text === template
                  ? 'border-purple-500 bg-purple-50 text-purple-800'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      {/* 6. 特記事項 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📋 特記事項・詳細メモ
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          rows={4}
          placeholder="皮膚・口腔ケアに関する詳細な情報、気づいたこと、申し送り事項など..."
        />
      </div>

      {/* 保存ボタン */}
      <div className="sticky bottom-0 bg-gray-50 p-4 -mx-4">
        <button
          type="submit"
          disabled={isSubmitting || !formData.care_type}
          className="w-full bg-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            '✨ 皮膚・口腔ケア記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};
