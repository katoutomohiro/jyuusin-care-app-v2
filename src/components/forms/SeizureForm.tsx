import { useState, useEffect, FC } from 'react';

type SeizureFormProps = {
  onSave: (data: any) => void;
  isSubmitting: boolean;
  draftData?: any;
  handleDraftChange?: (data: any) => void;
  suggestedTags?: string[];
};

// 発作の種類（重症心身障害児者に特化・説明付き）
const seizureTypes = [
  '選択してください',
  '強直間代発作（全身が硬直しガクガクと激しく身体が動く）',
  '強直発作（全身または体幹・四肢が急に硬直する）',
  '間代発作（全身または一部がリズミカルにガクガクと動く）',
  'ミオクロニー発作（体や手足がピクッと一瞬だけ動く）',
  '脱力発作（急に力が抜けて倒れる・頭がカクンと下がる）',
  '欠神発作（数秒間ぼーっとして反応がなくなる）',
  '点頭てんかん（首や体がカクンと前に倒れる、乳児に多い）',
  '部分発作（体の一部だけがピクピク動く・意識は保たれることも）',
  '自動症発作（口をもぐもぐ・手をもぞもぞ動かすなど無意識動作）',
  '焦点発作（特定の部位から始まる発作）',
  '連続発作（発作が繰り返し続く・間に意識が戻らない）',
  '発作重積（5分以上続く、または短時間に何度も発作が起こる）',
  '発作後麻痺（発作後に一時的に手足が動かしにくくなる）',
  '発作後眠気（発作後に強い眠気が出る）',
  '発作後混乱（発作後に意識がもうろうとする・混乱する）',
  '発作時呼吸障害（発作中に呼吸が止まる・苦しそうになる）',
  '発作時チアノーゼ（発作中に顔色や唇が紫色になる）',
  'その他（自由記述欄に詳細を記入）'
];

const seizureTriggers = [
  '選択してください',
  '食事中・食後', '水分摂取中', '排痰補助後', '睡眠中', '覚醒時・入眠時',
  '体位変換時', '吸引実施時', '投薬後', '環境の変化（場所・人など）',
  '発熱時', '大きな音・光の刺激', '感情の変化（興奮、痛みなど）',
  '発作誘因なし', 'その他'
];

const seizureExpressions = [
  '選択してください',
  '顔色が悪くなる・蒼白', 'ぼーっとする・一点を見つめる', '目つきが鋭くなる・険しくなる',
  '目が泳ぐ・焦点が合わない', 'まばたきが増える', '目を閉じる', '視線が上転する',
  '口が開く', '口を強く閉じる', '舌が出る', '歯ぎしり', 'よだれが増える',
  '顔がひきつる', '顔が赤くなる', '顔が青くなる', 'その他'
];

const specialNotes = [
  '選択してください',
  '発作時の対応を実施', '吸引実施', '酸素投与', '救急要請', '医師へ連絡',
  '家族へ連絡', 'バイタル測定', '経管栄養中の発作', '服薬後の発作', '発作後の眠気',
  '発作後の嘔吐', '発作後の排泄', '発作後の呼吸状態', '発作後の意識状態', '発作後の体温変化',
  '発作後のけいれん再発', '発作後の皮膚色変化', '発作後の発汗', '発作後の不穏', 'その他'
];

function getNowString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${yyyy}/${MM}/${dd} ${hh}:${mm}`;
}

const SeizureForm: React.FC<SeizureFormProps> = ({ onSave, isSubmitting, draftData, handleDraftChange, suggestedTags }) => {
  const [seizureTime, setSeizureTime] = useState(draftData?.seizureTime || getNowString());
  const [selectedType, setSelectedType] = useState(draftData?.selectedType || '');
  const [selectedTrigger, setSelectedTrigger] = useState(draftData?.selectedTrigger || '');
  const [selectedExpression, setSelectedExpression] = useState(draftData?.selectedExpression || '');
  const [selectedNote, setSelectedNote] = useState(draftData?.selectedNote || '');
  const [freeNote, setFreeNote] = useState(draftData?.freeNote || '');
  const [elapsed, setElapsed] = useState(draftData?.elapsed || 0);
  // 追加: 視線・重症度・前兆・発作後の状態・緊急度
  const [gaze, setGaze] = useState(draftData?.gaze || '');
  const [severity, setSeverity] = useState(draftData?.severity || '');
  const [preSeizureSigns, setPreSeizureSigns] = useState<string[]>(draftData?.pre_seizure_signs || []);
  const [postSeizureCondition, setPostSeizureCondition] = useState(draftData?.post_seizure_condition || '');
  const [emergencyLevel, setEmergencyLevel] = useState(draftData?.emergency_level || '');

  // 発作時間計測用
  const [isTiming, setIsTiming] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  // 各入力変更時に下書き自動保存
  React.useEffect(() => {
    if (handleDraftChange) {
      handleDraftChange({
        seizureTime,
        selectedType,
        selectedTrigger,
        selectedExpression,
        selectedNote,
        freeNote,
        elapsed
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seizureTime, selectedType, selectedTrigger, selectedExpression, selectedNote, freeNote, elapsed]);

  // 計測開始・停止
  const handleTimerClick = () => {
    if (!isTiming) {
      setIsTiming(true);
      setElapsed(0);
      const id = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
      setTimerId(id);
    } else {
      setIsTiming(false);
      if (timerId) clearInterval(timerId);
      setTimerId(null);
    }
  };

  // フォーム送信時にタイマーもリセット
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timerId) clearInterval(timerId);
    setIsTiming(false);
    setTimerId(null);
    // Excel出力仕様に合わせてキー名を揃える
    onSave({
      seizure_type: selectedType, // 発作の種類
      trigger: selectedTrigger,   // きっかけ・状況
      expression: selectedExpression, // 発作時の表情
      gaze, // 視線
      duration_seconds: elapsed > 0 ? elapsed : undefined, // 継続時間
      severity, // 重症度
      pre_seizure_signs: preSeizureSigns, // 前兆
      post_seizure_condition: postSeizureCondition, // 発作後の状態
      emergency_level: emergencyLevel, // 緊急度
      medical_action: selectedNote, // 医療対応・特記事項
      notes: freeNote, // 詳細メモ
      timestamp: seizureTime, // 発作発生時刻
      staff: '', // 記録担当（必要なら追加UI/状態を用意）
      recorder: '' // 記録者（必要なら追加UI/状態を用意）
    });
      {/* 視線 */}
      <div>
        <label className="block font-semibold mb-2">発作時の視線</label>
        <select className="w-full border rounded-lg p-2" value={gaze} onChange={e => setGaze(e.target.value)}>
          <option value="">選択してください</option>
          <option value="正面">正面</option>
          <option value="上転">上転</option>
          <option value="下転">下転</option>
          <option value="右偏位">右偏位</option>
          <option value="左偏位">左偏位</option>
          <option value="その他">その他</option>
        </select>
      </div>

      {/* 重症度 */}
      <div>
        <label className="block font-semibold mb-2">重症度</label>
        <select className="w-full border rounded-lg p-2" value={severity} onChange={e => setSeverity(e.target.value)}>
          <option value="">選択してください</option>
          <option value="軽度">軽度</option>
          <option value="中等度">中等度</option>
          <option value="重度">重度</option>
        </select>
      </div>

      {/* 前兆（複数選択可） */}
      <div>
        <label className="block font-semibold mb-2">発作前の前兆（複数選択可）</label>
        <div className="flex flex-wrap gap-2">
          {['あくび','不機嫌','笑う','泣く','顔色変化','手足の動き','呼吸変化','その他'].map(sign => (
            <label key={sign} className="flex items-center gap-1">
              <input type="checkbox" checked={preSeizureSigns.includes(sign)} onChange={() => setPreSeizureSigns(preSeizureSigns.includes(sign) ? preSeizureSigns.filter(s => s !== sign) : [...preSeizureSigns, sign])} />
              <span>{sign}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 発作後の状態 */}
      <div>
        <label className="block font-semibold mb-2">発作後の状態</label>
        <select className="w-full border rounded-lg p-2" value={postSeizureCondition} onChange={e => setPostSeizureCondition(e.target.value)}>
          <option value="">選択してください</option>
          <option value="眠気">眠気</option>
          <option value="混乱">混乱</option>
          <option value="脱力">脱力</option>
          <option value="正常">正常</option>
          <option value="その他">その他</option>
        </select>
      </div>

      {/* 緊急度 */}
      <div>
        <label className="block font-semibold mb-2">緊急度</label>
        <select className="w-full border rounded-lg p-2" value={emergencyLevel} onChange={e => setEmergencyLevel(e.target.value)}>
          <option value="">選択してください</option>
          <option value="通常">通常</option>
          <option value="要注意">要注意</option>
          <option value="緊急">緊急</option>
        </select>
      </div>
    setElapsed(0);
  };

  // 秒数を「mm分ss秒」形式で表示
  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m > 0 ? `${m}分` : ''}${s}秒`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 発作発生時刻 */}
      <div>
        <label className="block font-semibold mb-2">発作発生時刻</label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="border rounded-lg p-2 w-full max-w-xs"
            value={seizureTime}
            onChange={e => setSeizureTime(e.target.value)}
            placeholder="YYYY/MM/DD HH:mm"
          />
          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
            onClick={() => setSeizureTime(getNowString())}
          >
            今すぐ
          </button>
        </div>
      </div>

      {/* 発作時間計測 */}
      <div>
        <label className="block font-semibold mb-2">発作時間計測</label>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className={`px-6 py-2 rounded-lg font-bold text-lg ${isTiming ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white'}`}
            onClick={handleTimerClick}
            aria-label="発作時間計測ボタン"
          >
            {isTiming ? '計測停止' : '計測開始'}
          </button>
          <span className="text-xl font-mono">{formatElapsed(elapsed)}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          ※発作が始まったら「計測開始」、終わったら「計測停止」を押してください
        </div>
      </div>

      {/* 発作の種類 */}
      <div>
        <label className="block font-semibold mb-2">発作の種類</label>
        <select
          className="w-full border rounded-lg p-2"
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
        >
          {seizureTypes.map(item => (
            <option key={item} value={item === '選択してください' ? '' : item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* きっかけ・状況 */}
      <div>
        <label className="block font-semibold mb-2">発作のきっかけ・状況</label>
        <select
          className="w-full border rounded-lg p-2"
          value={selectedTrigger}
          onChange={e => setSelectedTrigger(e.target.value)}
        >
          {seizureTriggers.map(item => (
            <option key={item} value={item === '選択してください' ? '' : item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* 表情・視線 */}
      <div>
        <label className="block font-semibold mb-2">発作時の表情・視線</label>
        <select
          className="w-full border rounded-lg p-2"
          value={selectedExpression}
          onChange={e => setSelectedExpression(e.target.value)}
        >
          {seizureExpressions.map(item => (
            <option key={item} value={item === '選択してください' ? '' : item}>
              {item}
            </option>
          ))}
        </select>
      </div>


      {/* 特記事項・詳細メモ + 備考タグ自動提案 */}
      <div>
        <label className="block font-semibold mb-2 text-red-700">特記事項・詳細メモ <span className="ml-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">緊急・医療</span></label>
        <select
          className="w-full border-2 border-red-500 bg-red-50 rounded-lg p-2 mb-2 focus:ring-2 focus:ring-red-400"
          value={selectedNote}
          onChange={e => setSelectedNote(e.target.value)}
          aria-label="緊急・特記事項選択"
        >
          {specialNotes.map(item => (
            <option key={item} value={item === '選択してください' ? '' : item}>
              {item}
            </option>
          ))}
        </select>

        {/* 備考タグ自動提案 */}
        {Array.isArray(suggestedTags) && suggestedTags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 mr-2">よく使うタグ:</span>
            {suggestedTags.map(tag => (
              <button
                key={tag}
                type="button"
                className="bg-blue-100 hover:bg-blue-300 text-blue-800 rounded-full px-3 py-1 text-xs font-semibold border border-blue-200 transition-all"
                onClick={() => {
                  // freeNoteに重複なく追記
                  if (!freeNote.includes(tag)) setFreeNote(freeNote ? freeNote + ' ' + tag : tag);
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <textarea
          className="w-full border-2 border-red-500 bg-red-50 rounded-lg p-2 focus:ring-2 focus:ring-red-400"
          rows={3}
          placeholder="緊急・医療特記事項（例：発作時の詳細な状況や対応内容など）"
          value={freeNote}
          onChange={e => setFreeNote(e.target.value)}
          aria-label="緊急・医療特記事項入力"
        />
      </div>

      {/* 保存ボタン */}
      <button
        className="bg-red-500 text-white px-8 py-3 rounded-lg text-lg font-bold w-full"
        type="submit"
        data-save-btn
        disabled={isSubmitting}
        aria-label="発作記録を保存"
      >
        {isSubmitting ? '保存中...' : '発作記録を保存'}
      </button>
    </form>
  );
};

export default SeizureForm;