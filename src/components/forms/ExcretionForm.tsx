import React, { useState } from 'react';

interface ExcretionFormProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

export const ExcretionForm: React.FC<ExcretionFormProps> = ({ onSave, isSubmitting }) => {
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
    
    // 2. 記録の種類
    record_type: '', // 'urination' | 'defecation' | 'enema_extraction'
    
    // 排尿関連
    urination: {
      amount: '', // 少量 | 中等量 | 多量 | 測定不能
      color: '', // 淡黄色 | 濃黄色 | 混濁 | 血尿
      properties: [] as string[], // 浮遊物あり | 強い臭気
      notes: ''
    },
    
    // 排便関連
    defecation: {
      bristol_scale: '', // 1-7型
      amount: '', // 少量 | 中等量 | 多量
      color: '', // 黄褐色 | 黒色便 | 白色便 | 血便
      properties: [] as string[], // 不消化物あり | 粘液混入
      notes: ''
    },
    
    // 浣腸・摘便
    enema_extraction: {
      procedure_type: '', // 浣腸 | 摘便 | グリセリン浣腸
      result: '', // 効果あり | 効果なし | 少量排出
      notes: ''
    },
    
    // 皮膚状態・ケア
    skin_condition: '', // 良好 | 軽度発赤 | 中等度発赤 | 重度発赤 | びらん
    care_provided: [] as string[], // 清拭 | 軟膏塗布 | 保護材使用
    
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
  const recordTypes = [
    { key: 'urination', label: '排尿', icon: '💛', color: 'border-yellow-400 bg-yellow-50' },
    { key: 'defecation', label: '排便', icon: '🤎', color: 'border-yellow-400 bg-yellow-50' },
    { key: 'enema_extraction', label: '浣腸・摘便', icon: '🏥', color: 'border-blue-400 bg-blue-50' }
  ];

  const urinationOptions = {
    amount: ['少量', '中等量', '多量', '測定不能'],
    color: ['淡黄色', '濃黄色', '混濁', '血尿'],
    properties: ['浮遊物あり', '強い臭気', '特になし']
  };

  const defecationOptions = {
    bristol_scale: [
      { key: '1', label: '1型（コロコロ便）', description: '硬くて小さな塊' },
      { key: '2', label: '2型（硬い便）', description: 'ソーセージ状だが硬い' },
      { key: '3', label: '3型（やや硬い便）', description: 'ソーセージ状でひび割れあり' },
      { key: '4', label: '4型（普通便）', description: 'ソーセージ状で滑らか' },
      { key: '5', label: '5型（やや軟便）', description: '軟らかい塊' },
      { key: '6', label: '6型（軟便）', description: 'ふわふわで不定形' },
      { key: '7', label: '7型（水様便）', description: '完全に液状' }
    ],
    amount: ['少量', '中等量', '多量'],
    color: ['黄褐色', '黒色便', '白色便', '血便'],
    properties: ['不消化物あり', '粘液混入', '特になし']
  };

  const enemaOptions = {
    procedure_type: ['浣腸', '摘便', 'グリセリン浣腸', '微温湯浣腸'],
    result: ['効果あり', '効果なし', '少量排出', '大量排出']
  };

  const skinConditionOptions = ['良好', '軽度発赤', '中等度発赤', '重度発赤', 'びらん', 'その他'];
  const careProvidedOptions = ['清拭', '軟膏塗布', '保護材使用', '体位変換', 'その他'];

  const templateTexts = [
    '腹部膨満なく、スムーズな排便でした',
    '臀部に軽度の発赤が見られたため、軟膏を塗布しました',
    '排尿量は普段と変わりなく、色調も正常でした',
    '便秘気味でしたが、浣腸により効果的に排便がありました',
    '皮膚トラブルなく、清潔を保持できています',
    '排泄後、とても安心されたご様子でした',
    '時間をかけてゆっくりと排便されました',
    '排泄前後の表情に変化があり、快適さが伝わってきました'
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
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-lg"
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

      {/* 2. 記録の種類選択 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🚻 記録の種類 *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {recordTypes.map((type) => (
            <button
              key={type.key}
              type="button"
              onClick={() => setFormData({ ...formData, record_type: type.key })}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.record_type === type.key
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

      {/* 3. 排尿記録 */}
      {formData.record_type === 'urination' && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-yellow-700 mb-4 border-b border-yellow-200 pb-2">
            💛 排尿の記録
          </h3>
          
          {/* 量 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">量</label>
            <div className="grid grid-cols-4 gap-2">
              {urinationOptions.amount.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    urination: { ...formData.urination, amount } 
                  })}
                  className={`p-2 text-sm rounded border transition-colors ${
                    formData.urination.amount === amount
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          {/* 色 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">色</label>
            <div className="grid grid-cols-4 gap-2">
              {urinationOptions.color.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    urination: { ...formData.urination, color } 
                  })}
                  className={`p-2 text-sm rounded border transition-colors ${
                    formData.urination.color === color
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* 性状 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">性状</label>
            <div className="grid grid-cols-3 gap-2">
              {urinationOptions.properties.map((property) => (
                <button
                  key={property}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    urination: { 
                      ...formData.urination, 
                      properties: toggleArrayItem(formData.urination.properties, property)
                    } 
                  })}
                  className={`p-2 text-sm rounded border transition-colors ${
                    formData.urination.properties.includes(property)
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {property}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. 排便記録 */}
      {formData.record_type === 'defecation' && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-yellow-700 mb-4 border-b border-yellow-200 pb-2">
            🤎 排便の記録
          </h3>
          
          {/* ブリストルスケール */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">便の性状（ブリストルスケール）</label>
            <div className="space-y-2">
              {defecationOptions.bristol_scale.map((scale) => (
                <button
                  key={scale.key}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    defecation: { ...formData.defecation, bristol_scale: scale.key } 
                  })}
                  className={`w-full p-3 text-left rounded border transition-colors ${
                    formData.defecation.bristol_scale === scale.key
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold">{scale.label}</div>
                  <div className="text-xs text-gray-600">{scale.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 量 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">量</label>
            <div className="grid grid-cols-3 gap-2">
              {defecationOptions.amount.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    defecation: { ...formData.defecation, amount } 
                  })}
                  className={`p-2 text-sm rounded border transition-colors ${
                    formData.defecation.amount === amount
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          {/* 色 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">色</label>
            <div className="grid grid-cols-4 gap-2">
              {defecationOptions.color.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    defecation: { ...formData.defecation, color } 
                  })}
                  className={`p-2 text-sm rounded border transition-colors ${
                    formData.defecation.color === color
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* 性状 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">特記事項</label>
            <div className="grid grid-cols-3 gap-2">
              {defecationOptions.properties.map((property) => (
                <button
                  key={property}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    defecation: { 
                      ...formData.defecation, 
                      properties: toggleArrayItem(formData.defecation.properties, property)
                    } 
                  })}
                  className={`p-2 text-sm rounded border transition-colors ${
                    formData.defecation.properties.includes(property)
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {property}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. 浣腸・摘便記録 */}
      {formData.record_type === 'enema_extraction' && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b border-blue-200 pb-2">
            🏥 浣腸・摘便の記録
          </h3>
          
          {/* 処置の種類 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">処置の種類</label>
            <div className="grid grid-cols-2 gap-2">
              {enemaOptions.procedure_type.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    enema_extraction: { ...formData.enema_extraction, procedure_type: type } 
                  })}
                  className={`p-2 text-sm rounded border transition-colors ${
                    formData.enema_extraction.procedure_type === type
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 結果 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">結果</label>
            <div className="grid grid-cols-4 gap-2">
              {enemaOptions.result.map((result) => (
                <button
                  key={result}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    enema_extraction: { ...formData.enema_extraction, result } 
                  })}
                  className={`p-2 text-sm rounded border transition-colors ${
                    formData.enema_extraction.result === result
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {result}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. 皮膚状態・ケア */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">
          ✨ 皮膚状態・実施したケア
        </h3>
        
        {/* 皮膚状態 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">皮膚状態</label>
          <div className="grid grid-cols-3 gap-2">
            {skinConditionOptions.map((condition) => (
              <button
                key={condition}
                type="button"
                onClick={() => setFormData({ ...formData, skin_condition: condition })}
                className={`p-2 text-sm rounded border transition-colors ${
                  formData.skin_condition === condition
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
            {careProvidedOptions.map((care) => (
              <button
                key={care}
                type="button"
                onClick={() => setFormData({ 
                  ...formData, 
                  care_provided: toggleArrayItem(formData.care_provided, care) 
                })}
                className={`p-2 text-sm rounded border transition-colors ${
                  formData.care_provided.includes(care)
                    ? 'border-pink-500 bg-pink-50 text-pink-800'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                {care}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 7. テンプレート文章 */}
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
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      {/* 8. 特記事項 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📋 特記事項・詳細メモ
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
          rows={4}
          placeholder="排泄に関する詳細な情報、気づいたこと、申し送り事項など..."
        />
      </div>

      {/* 保存ボタン */}
      <div className="sticky bottom-0 bg-gray-50 p-4 -mx-4">
        <button
          type="submit"
          disabled={isSubmitting || !formData.record_type}
          className="w-full bg-yellow-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            '🚻 排泄記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};
