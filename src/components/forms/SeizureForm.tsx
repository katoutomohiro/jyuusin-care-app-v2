import React, { useState } from 'react';

type SeizureFormProps = {
  onSave: (data: any) => void;
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

// 表情・反応（重症心身障害児者に特化・最新知見を反映）
const seizureExpressions = [
  '選択してください',
  '顔色が悪くなる・蒼白',
  '顔が赤くなる・紅潮',
  '顔が青くなる・チアノーゼ',
  '表情がなくなる・無表情',
  '苦悶様表情（痛み・苦しみの表情）',
  '笑顔・微笑み',
  '泣き顔・涙が出る',
  '驚いた表情・目を見開く',
  '目を閉じる・まぶたが下がる',
  '視線が合わない・焦点が合わない',
  '視線が上転・横転・一点凝視',
  'まばたきが増える・減る',
  '目が泳ぐ・眼振',
  '口が開く・閉じる',
  '口角が下がる・上がる',
  '舌が出る・舌の動きが増える',
  '歯ぎしり・歯を食いしばる',
  'よだれが増える・減る',
  '顔がひきつる・けいれん',
  '体がピクッと動く（ミオクロニー）',
  '手足が突っ張る・硬直',
  '手足がガクガク動く（間代）',
  '体が脱力する・ぐったりする',
  '呼吸が止まる・浅くなる',
  '声が出る・うめき声・叫び声',
  '発汗（顔・全身）',
  '皮膚が冷たくなる・温かくなる',
  'その他（自由記述欄に詳細を記入）'
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

const SeizureForm: React.FC<SeizureFormProps> = ({ onSave }) => {
  const [seizureTime, setSeizureTime] = useState(getNowString());
  const [selectedType, setSelectedType] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [selectedExpression, setSelectedExpression] = useState('');
  const [selectedNote, setSelectedNote] = useState('');
  const [freeNote, setFreeNote] = useState('');

  // 発作時間計測用
  const [isTiming, setIsTiming] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

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
    onSave({
      seizureTime,
      seizureDuration: elapsed > 0 ? elapsed : undefined,
      type: selectedType,
      trigger: selectedTrigger,
      expression: selectedExpression,
      note: selectedNote,
      freeNote
    });
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

      {/* 表情・反応 */}
      <div>
        <label className="block font-semibold mb-2">発作時の表情・反応</label>
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

      {/* 特記事項・詳細メモ */}
      <div>
        <label className="block font-semibold mb-2">特記事項・詳細メモ</label>
        <select
          className="w-full border rounded-lg p-2 mb-2"
          value={selectedNote}
          onChange={e => setSelectedNote(e.target.value)}
        >
          {specialNotes.map(item => (
            <option key={item} value={item === '選択してください' ? '' : item}>
              {item}
            </option>
          ))}
        </select>
        <textarea
          className="w-full border rounded-lg p-2"
          rows={3}
          placeholder="自由記述欄（例：発作時の詳細な状況や対応内容など）"
          value={freeNote}
          onChange={e => setFreeNote(e.target.value)}
        />
      </div>

      {/* 保存ボタン */}
      <button
        className="bg-red-500 text-white px-8 py-3 rounded-lg text-lg font-bold w-full"
        type="submit"
      >
        発作記録を保存
      </button>
    </form>
  );
};

export default SeizureForm;