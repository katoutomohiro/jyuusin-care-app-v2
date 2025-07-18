import React, { useState, useEffect } from 'react';

interface SeizureFormProps {
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

export const SeizureForm: React.FC<SeizureFormProps> = ({ onSave, isSubmitting }) => {
  // 正確な現在時刻を取得する関数
  const getCurrentDateTime = () => {
    const now = new Date();
    // タイムゾーンを考慮した正確な現在時刻
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [formData, setFormData] = useState({
    // 1. 発生時刻 - ページ読み込み時に正確な現在時刻を設定
    event_timestamp: getCurrentDateTime(),
    
    // 2. 発作の誘因（複数選択可）
    triggers: [] as string[],
    trigger_other: '',
    
    // 3. 発作の前兆（複数選択可）
    precursor_signs: [] as string[],
    precursor_other: '',
    
    // 4. 発作の様相（複数選択可）
    seizure_manifestations: [] as string[],
    
    // 5. 持続時間
    duration_seconds: 0,
    is_timing: false,
    start_time: null as Date | null,
    
    // 6. 発作後の状態（複数選択可）
    post_seizure_state: [] as string[],
    post_seizure_other: '',
    
    // 7. 対応（複数選択可）
    interventions: [] as string[],
    intervention_other: '',
    oxygen_flow_rate: '',
    
    // 8. 特記事項
    notes: ''
  });

  // タイマー機能の状態
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // タイマー効果
  useEffect(() => {
    let interval: number;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(seconds => seconds + 1);
      }, 1000) as any;
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // データ定義
  const triggerOptions = [
    '食事中・食後', '水分摂取中', '入浴前後', '排泄前後', '覚醒時・入眠時', '睡眠中',
    '体位交換時', '喀痰吸引時', '投薬前後', '大きな音・光の刺激', '環境の変化（場所、人など）',
    '感情の起伏（興奮、啼泣など）', '発熱時', '明らかな誘因なし', 'その他'
  ];

  const precursorOptions = [
    // 表情・視線
    { category: '表情・視線', options: [
      '表情がなくなる・乏しくなる', 'ぼーっとする・一点を見つめる', '目つきが鋭くなる・険しくなる', '眼球が上転する・左右に寄る'
    ]},
    // 身体の様子
    { category: '身体の様子', options: [
      '顔色不良（蒼白、土色、チアノーゼ）', '筋緊張の亢進（手足のつっぱり、硬直）', '筋緊張の低下（ぐったりする）',
      '特定の動き（口をもぐもぐ、舌なめずり、手を握りしめる）', 'よだれが増える'
    ]},
    // 呼吸・声
    { category: '呼吸・声', options: [
      '呼吸が速くなる・浅くなる', '特有の声・うなり声が出る'
    ]},
    // 精神状態
    { category: '精神状態', options: [
      '不機嫌になる・ぐずる', 'そわそわと落ち着きがなくなる'
    ]},
    // その他
    { category: 'その他', options: [
      '特になし', 'その他'
    ]}
  ];

  const seizureManifestations = [
    // 発作の分類
    { category: '発作の分類', options: [
      '強直間代発作（全身の硬直とガクガクする痙攣）', '強直発作（全身または一部が硬直する）', '間代発作（手足がガクガクする）',
      'ミオクロニー発作（ピクッとする短い痙攣）', '脱力発作（急に力が抜ける）', '焦点発作（意識あり / 体の一部から始まる）',
      '焦点発作（意識減損あり / 意識が朦朧とする）', 'シリーズ（短い発作を繰り返す）', '発作とは断定できないが、気になる動き'
    ]},
    // 体の動き・部位
    { category: '体の動き・部位', options: [
      '全身', '顔面（ひきつり、口角のゆがみ）', '眼球（上転、左右への偏位、凝視）', '右半身 / 左半身',
      '右上肢 / 左上肢', '右下肢 / 左下肢', '体幹（のけぞる、前屈する）'
    ]},
    // 意識レベル
    { category: '意識レベル', options: [
      '呼びかけに反応なし', '呼びかけに少し反応あり', '意識ははっきりしている'
    ]},
    // 呼吸・顔色
    { category: '呼吸・顔色', options: [
      '呼吸停止 / 無呼吸', '不規則な呼吸 / 努力呼吸', 'チアノーゼ（顔色、唇、爪が紫色）', '顔面蒼白', '発汗'
    ]}
  ];

  const postSeizureOptions = [
    'すぐに回復し、発作前と変わらない', '傾眠傾向（ウトウトしている）', '深い睡眠に入る（〇〇分程度）',
    'ぼんやりしている・意識が朦朧としている', '疲労感が強い・ぐったりしている', '不機嫌・興奮状態',
    '嘔吐', '頭痛や不快の訴え（表情や仕草から）', 'その他'
  ];

  const interventionOptions = [
    '安全な場所への移動、危険物の除去', '衣服をゆるめる', '体位の工夫（側臥位など）', '喀痰吸引の実施',
    '酸素投与', 'バイタルサイン測定（SpO2、HR、BP、BT）', '薬剤の使用（坐薬、経口薬など）',
    '主治医・家族へ連絡', '救急要請', 'その他'
  ];

  // ヘルパー関数
  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const startTimer = () => {
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setFormData({ ...formData, start_time: new Date() });
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setFormData({ ...formData, duration_seconds: timerSeconds, is_timing: false });
  };

  const setCurrentTime = () => {
    const exactNow = getCurrentDateTime();
    setFormData({ ...formData, event_timestamp: exactNow });
    // ユーザーフィードバック用のアラート（オプション）
    console.log('現在時刻を設定:', new Date().toLocaleString('ja-JP'));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs.toString().padStart(2, '0')}秒`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. 発生時刻 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ⏰ 発作発生時刻 *
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
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 whitespace-nowrap font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            🕐 今すぐ
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          💡 「今すぐ」ボタンで正確な現在時刻を自動入力
        </p>
      </div>

      {/* 2. 発作の誘因 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🎯 発作の誘因（考えられるきっかけ）※複数選択可
        </label>
        <div className="grid grid-cols-2 gap-2">
          {triggerOptions.map(trigger => (
            <button
              key={trigger}
              type="button"
              onClick={() => setFormData({ 
                ...formData, 
                triggers: toggleArrayItem(formData.triggers, trigger) 
              })}
              className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                formData.triggers.includes(trigger)
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {trigger}
            </button>
          ))}
        </div>
        {formData.triggers.includes('その他') && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="その他の誘因を入力..."
              value={formData.trigger_other}
              onChange={(e) => setFormData({ ...formData, trigger_other: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
        )}
      </div>

      {/* 3. 発作の前兆 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🔍 発作の前兆（いつもと違う様子）※複数選択可
        </label>
        {precursorOptions.map(categoryGroup => (
          <div key={categoryGroup.category} className="mb-4">
            <div className="text-sm font-semibold text-blue-700 mb-2 border-b border-blue-200 pb-1">
              【{categoryGroup.category}】
            </div>
            <div className="grid grid-cols-1 gap-2">
              {categoryGroup.options.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    precursor_signs: toggleArrayItem(formData.precursor_signs, option)
                  })}
                  className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                    formData.precursor_signs.includes(option)
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
        {formData.precursor_signs.includes('その他') && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="その他の前兆を詳しく入力..."
              value={formData.precursor_other}
              onChange={(e) => setFormData({ ...formData, precursor_other: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* 4. 発作の様相 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ⚡ 発作の様相（どのような発作か）※複数選択可
        </label>
        {seizureManifestations.map(categoryGroup => (
          <div key={categoryGroup.category} className="mb-4">
            <div className="text-sm font-semibold text-red-700 mb-2 border-b border-red-200 pb-1">
              【{categoryGroup.category}】
            </div>
            <div className="grid grid-cols-1 gap-2">
              {categoryGroup.options.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    seizure_manifestations: toggleArrayItem(formData.seizure_manifestations, option)
                  })}
                  className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                    formData.seizure_manifestations.includes(option)
                      ? 'border-red-500 bg-red-50 text-red-800'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 5. 持続時間（ストップウォッチ機能） */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ⏱️ 持続時間
        </label>
        
        {/* ストップウォッチ機能 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-center mb-3">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {formatTime(timerSeconds)}
            </div>
            {isTimerRunning && (
              <div className="text-sm text-red-600 font-semibold animate-pulse">
                ⏰ 計測中...
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            {!isTimerRunning ? (
              <button
                type="button"
                onClick={startTimer}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-semibold"
              >
                📝 計測開始
              </button>
            ) : (
              <button
                type="button"
                onClick={stopTimer}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 font-semibold"
              >
                ⏹️ 計測終了
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setTimerSeconds(0);
                setIsTimerRunning(false);
                setFormData({ ...formData, duration_seconds: 0 });
              }}
              className="px-4 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              リセット
            </button>
          </div>
        </div>

        {/* 手動入力 */}
        <div className="border-t pt-4">
          <label className="block text-sm text-gray-600 mb-2">または手動で入力:</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              value={formData.duration_seconds || ''}
              onChange={(e) => setFormData({ ...formData, duration_seconds: parseInt(e.target.value) || 0 })}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="秒数"
            />
            <span className="text-sm text-gray-600">秒</span>
          </div>
          <div className="mt-2 flex space-x-2 flex-wrap">
            {[15, 30, 60, 120, 300, 600].map(seconds => (
              <button
                key={seconds}
                type="button"
                onClick={() => setFormData({ ...formData, duration_seconds: seconds })}
                className={`px-3 py-1 rounded text-sm ${
                  formData.duration_seconds === seconds 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {formatTime(seconds)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6. 発作後の状態 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          � 発作後の状態 ※複数選択可
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            '意識清明', '意識朦朧', '見当識障害',
            '記憶障害', '混乱状態', '疲労感',
            '頭痛', '筋肉痛', '嗜眠状態',
            'いつも通り', 'その他'
          ].map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setFormData({
                ...formData,
                post_seizure_state: toggleArrayItem(formData.post_seizure_state, option)
              })}
              className={`p-2 text-sm rounded-lg border transition-colors ${
                formData.post_seizure_state.includes(option)
                  ? 'border-purple-500 bg-purple-50 text-purple-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {formData.post_seizure_state.includes('その他') && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="その他の状態を詳しく入力..."
              value={formData.post_seizure_other}
              onChange={(e) => setFormData({ ...formData, post_seizure_other: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}
      </div>

      {/* 7. 介入・対応内容 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          🏥 介入・対応内容 ※複数選択可
        </label>
        <div className="grid grid-cols-1 gap-2">
          {[
            '安全確保（側臥位）', '気道確保', '酸素投与',
            '座薬挿入', '点滴確保', '救急車要請',
            '医師連絡', '家族連絡', '観察のみ',
            'バイタル測定', 'その他'
          ].map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setFormData({
                ...formData,
                interventions: toggleArrayItem(formData.interventions, option)
              })}
              className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                formData.interventions.includes(option)
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {formData.interventions.includes('その他') && (
          <div className="mt-3">
            <textarea
              placeholder="その他の介入内容を詳しく入力..."
              value={formData.intervention_other}
              onChange={(e) => setFormData({ ...formData, intervention_other: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows={3}
            />
          </div>
        )}
      </div>

      {/* 8. 特記事項・詳細メモ */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📝 特記事項・詳細メモ
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="発作に関する詳細な情報、医師への申し送り事項、家族への連絡内容など..."
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
            '📋 発作記録を保存'
          )}
        </button>
      </div>
    </form>
  );
};
