
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { User } from '../../types';

// 日誌イベント型（柔軟対応）
type AnyEvent = { event_type: string; data: any };

// 日誌データを現場Excelテンプレート形式で出力するエクスポーター
// props: user:User, dailyLogs:DailyLogEvent[]
export function exportUserCareExcelTemplate(user: User, dailyLogs: AnyEvent[], date: string) {
  // 1. テンプレートに合わせた2次元配列を作成
  // 例: [['日付', '担当', ...], [...], ...]
  const sheet: any[][] = [];


  // 1行目: タイトル
  sheet.push([`${user.name} 様 ケース記録`]);
  // 2行目: ヘッダー
  sheet.push(['日付', date, '', '担当:', '', '', '記録者:']);

  // 3行目: テンプレートに合わせた各項目
  // バイタル
  const vital = dailyLogs.find(e => e.event_type === 'vitals');
  sheet.push(['バイタル',
    vital?.data?.temperature ?? '',
    vital?.data?.pulse ?? '',
    vital?.data?.bloodPressure ? `${vital.data.bloodPressure.systolic}/${vital.data.bloodPressure.diastolic}` : '',
    vital?.data?.spO2 ?? '',
    vital?.data?.respiration ?? '',
    '',
    ''
  ]);

  // 発作（全項目を網羅的に出力）
  const seizure = dailyLogs.find(e => e.event_type === 'seizure');
  sheet.push([
    '発作',
    seizure?.data?.seizure_type ?? '記録なし', // 発作の種類
    seizure?.data?.trigger ?? '',              // きっかけ・状況
    seizure?.data?.expression ?? '',           // 発作時の表情
    seizure?.data?.gaze ?? '',                 // 発作時の視線
    seizure?.data?.duration_seconds ? `${seizure.data.duration_seconds}秒` : '', // 継続時間
    seizure?.data?.severity ? `重症度:${seizure.data.severity}` : '',           // 重症度
    seizure?.data?.pre_seizure_signs?.join(',') ?? '',                          // 前兆
    seizure?.data?.post_seizure_condition ?? '',                                // 発作後の状態
    seizure?.data?.emergency_level ?? '',                                        // 緊急度
    seizure?.data?.medical_action ?? '',                                         // 医療対応
    seizure?.data?.notes ?? '',                                                  // 詳細メモ
    seizure?.data?.timestamp ?? '',                                              // 発作発生日時
    seizure?.data?.staff ?? '',                                                  // 記録担当
    seizure?.data?.recorder ?? ''                                                // 記録者
  ]);

  // 表情・反応（全項目を網羅的に出力）
  const expression = dailyLogs.find(e => e.event_type === 'expression');
  sheet.push([
    '表情・反応',
    expression?.data?.specific_expression ?? '', // 具体的な表情
    expression?.data?.expression_score ? `スコア:${expression.data.expression_score}` : '', // スコア
    expression?.data?.context ?? '', // 状況
    expression?.data?.trigger ?? '', // きっかけ
    expression?.data?.gaze ?? '', // 視線
    expression?.data?.emotion ?? '', // 感情
    expression?.data?.notes ?? '', // メモ
    expression?.data?.timestamp ?? '', // 記録日時
    expression?.data?.staff ?? '', // 記録担当
    expression?.data?.recorder ?? '' // 記録者
  ]);

  // 水分（全項目を網羅的に出力）
  const hydration = dailyLogs.find(e => e.event_type === 'hydration');
  sheet.push([
    '水分',
    hydration?.data?.volume_ml ? `${hydration.data.volume_ml}ml` : '',
    hydration?.data?.fluid_type ?? '',
    hydration?.data?.method ?? '',
    hydration?.data?.temperature ?? '',
    hydration?.data?.time ?? '',
    hydration?.data?.notes ?? '',
    hydration?.data?.timestamp ?? '',
    hydration?.data?.staff ?? '',
    hydration?.data?.recorder ?? ''
  ]);

  // 排泄（全項目を網羅的に出力）
  const excretion = dailyLogs.find(e => e.event_type === 'excretion');
  sheet.push([
    '排泄',
    excretion?.data?.type ?? '',
    excretion?.data?.amount ?? '',
    excretion?.data?.appearance ?? '',
    excretion?.data?.time ?? '',
    excretion?.data?.notes ?? '',
    excretion?.data?.timestamp ?? '',
    excretion?.data?.staff ?? '',
    excretion?.data?.recorder ?? ''
  ]);

  // 睡眠（全項目を網羅的に出力）
  const sleep = dailyLogs.find(e => e.event_type === 'sleep');
  sheet.push([
    '睡眠',
    sleep?.data?.sleep_start_time ?? '',
    sleep?.data?.sleep_end_time ?? '',
    sleep?.data?.quality_score ? `スコア:${sleep.data.quality_score}` : '',
    sleep?.data?.night_wakings ? `夜間覚醒:${sleep.data.night_wakings}` : '',
    sleep?.data?.notes ?? '',
    sleep?.data?.timestamp ?? '',
    sleep?.data?.staff ?? '',
    sleep?.data?.recorder ?? ''
  ]);

  // 活動（全項目を網羅的に出力）
  const activity = dailyLogs.find(e => e.event_type === 'activity');
  sheet.push([
    '活動',
    activity?.data?.activity_type ?? '',
    activity?.data?.participation_level ? `参加度:${activity.data.participation_level}` : '',
    activity?.data?.mood_during_activity ?? '',
    activity?.data?.achievements?.join(',') ?? '',
    activity?.data?.time ?? '',
    activity?.data?.notes ?? '',
    activity?.data?.timestamp ?? '',
    activity?.data?.staff ?? '',
    activity?.data?.recorder ?? ''
  ]);

  // ケア（全項目を網羅的に出力）
  const care = dailyLogs.find(e => e.event_type === 'care');
  sheet.push([
    'ケア',
    care?.data?.provided_care?.join(',') ?? '',
    care?.data?.time ?? '',
    care?.data?.notes ?? '',
    care?.data?.timestamp ?? '',
    care?.data?.staff ?? '',
    care?.data?.recorder ?? ''
  ]);

  // 服薬（全項目を網羅的に出力）
  const medication = dailyLogs.find(e => e.event_type === 'medication');
  sheet.push([
    '服薬',
    medication?.data?.medication_name ?? '',
    medication?.data?.dose ?? '',
    medication?.data?.time ?? '',
    medication?.data?.route ?? '',
    medication?.data?.notes ?? '',
    medication?.data?.timestamp ?? '',
    medication?.data?.staff ?? '',
    medication?.data?.recorder ?? ''
  ]);

  // ポジショニング（全項目を網羅的に出力）
  const positioning = dailyLogs.find(e => e.event_type === 'positioning');
  sheet.push([
    'ポジショニング',
    positioning?.data?.position_type ?? '',
    positioning?.data?.duration_minutes ? `${positioning.data.duration_minutes}分` : '',
    positioning?.data?.support_equipment?.join(',') ?? '',
    positioning?.data?.skin_condition ?? '',
    positioning?.data?.time ?? '',
    positioning?.data?.notes ?? '',
    positioning?.data?.timestamp ?? '',
    positioning?.data?.staff ?? '',
    positioning?.data?.recorder ?? ''
  ]);

  // 注入（経管栄養）（全項目を網羅的に出力）
  const tubeFeeding = dailyLogs.find(e => e.event_type === 'tube_feeding');
  sheet.push([
    '経管栄養',
    tubeFeeding?.data?.formula_type ?? '',
    tubeFeeding?.data?.volume_ml ? `${tubeFeeding.data.volume_ml}ml` : '',
    tubeFeeding?.data?.infusion_start_time ?? '',
    tubeFeeding?.data?.infusion_end_time ?? '',
    tubeFeeding?.data?.complications?.join(',') ?? '',
    tubeFeeding?.data?.notes ?? '',
    tubeFeeding?.data?.timestamp ?? '',
    tubeFeeding?.data?.staff ?? '',
    tubeFeeding?.data?.recorder ?? ''
  ]);

  // 咳・ムセ（全項目を網羅的に出力）
  const coughChoke = dailyLogs.find(e => e.event_type === 'cough_choke');
  sheet.push([
    '咳・ムセ',
    coughChoke?.data?.event_type ?? '',
    coughChoke?.data?.severity ?? '',
    coughChoke?.data?.context ?? '',
    coughChoke?.data?.interventions?.join(',') ?? '',
    coughChoke?.data?.time ?? '',
    coughChoke?.data?.notes ?? '',
    coughChoke?.data?.timestamp ?? '',
    coughChoke?.data?.staff ?? '',
    coughChoke?.data?.recorder ?? ''
  ]);

  // 皮膚・口腔ケア（全項目を網羅的に出力）
  const skinOralCare = dailyLogs.find(e => e.event_type === 'skin_oral_care');
  sheet.push([
    '皮膚・口腔ケア',
    skinOralCare?.data?.care_type ?? '',
    skinOralCare?.data?.area ?? '',
    skinOralCare?.data?.time ?? '',
    skinOralCare?.data?.notes ?? '',
    skinOralCare?.data?.timestamp ?? '',
    skinOralCare?.data?.staff ?? '',
    skinOralCare?.data?.recorder ?? ''
  ]);

  // その他（全項目を網羅的に出力）
  const other = dailyLogs.find(e => e.event_type === 'other');
  sheet.push([
    'その他',
    other?.data?.content ?? '',
    other?.data?.category ?? '',
    other?.data?.time ?? '',
    other?.data?.notes ?? '',
    other?.data?.timestamp ?? '',
    other?.data?.staff ?? '',
    other?.data?.recorder ?? ''
  ]);

  // 特記事項（全イベントの詳細JSON）
  sheet.push(['特記事項', JSON.stringify(dailyLogs)]);

  // 2. ワークブック作成
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(sheet);
  XLSX.utils.book_append_sheet(wb, ws, 'ケース記録');

  // 3. ファイル保存
  const fileName = `${user.name}_case_record_${date}.xlsx`;
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
}


// React用: userIdを受けてボタンを表示し、クリックでエクスポート実行
import React from 'react';
import { useData } from '../contexts/DataContext';

type Props = { userId: string | null };


const UserCareExcelTemplateExporter: React.FC<Props> = ({ userId }) => {
  const { users } = useData();
  if (!userId) return null;
  const user = users.find((u: User) => u.id === userId);
  if (!user) return null;
  // 日誌データ取得（localStorageから）
  const today = new Date().toISOString().split('T')[0];
  const dailyLogs = JSON.parse(localStorage.getItem(`dailyLogs_${userId}`) || '[]');

  const handleExport = () => {
    exportUserCareExcelTemplate(user, dailyLogs, today);
  };

  return (
    React.createElement(
      'button',
      {
        onClick: handleExport,
        className: 'bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow font-bold',
        'aria-label': 'Excelエクスポート'
      },
      '📤 Excelエクスポート'
    )
  );
};

export default UserCareExcelTemplateExporter;
