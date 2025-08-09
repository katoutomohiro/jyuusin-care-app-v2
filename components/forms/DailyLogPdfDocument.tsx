import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { DailyLog, User } from '../../types';

// 帳票レイアウト用スタイル（現場要望・視認性重視）
const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 11,
    fontFamily: 'Noto Sans JP',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 12,
    borderBottom: '2px solid #bdbdbd',
    paddingBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a237e',
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginRight: 6,
    color: '#263238',
    fontSize: 12,
    minWidth: 60,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  value: {
    color: '#111',
    marginRight: 16,
    marginBottom: 2,
    fontSize: 11,
    flexShrink: 1,
    maxWidth: 180,
    wordBreak: 'break-all',
  },
  multiLine: {
    color: '#111',
    marginTop: 2,
    marginBottom: 2,
    fontSize: 11,
    lineHeight: 1.4,
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#0d47a1',
    marginBottom: 4,
    borderLeft: '4px solid #1976d2',
    paddingLeft: 6,
  },
  signature: {
    marginTop: 24,
    fontSize: 12,
    textAlign: 'right',
    color: '#263238',
  },
});

// A4帳票PDFドキュメント

export const DailyLogPdfDocument: React.FC<{ user: User; log: DailyLog }> = ({ user, log }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* タイトル */}
      <Text style={styles.title}>{user.name} さん 日誌記録（{log.date}）</Text>

      {/* 基本情報 */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>氏名</Text>
          <Text style={styles.value}>{user.name}</Text>
          <Text style={styles.label}>日付</Text>
          <Text style={styles.value}>{log.date}</Text>
          <Text style={styles.label}>担当</Text>
          <Text style={styles.value}>{log.recorder_name || '-'}</Text>
        </View>
      </View>

      {/* バイタルサイン */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>バイタルサイン</Text>
        <View style={styles.row}>
          <Text style={styles.label}>体温</Text>
          <Text style={styles.value}>{log.vitals?.temperature ?? '-'} ℃</Text>
          <Text style={styles.label}>脈拍</Text>
          <Text style={styles.value}>{log.vitals?.pulse ?? '-'}</Text>
          <Text style={styles.label}>SpO2</Text>
          <Text style={styles.value}>{log.vitals?.spO2 ?? '-'}</Text>
          <Text style={styles.label}>血圧</Text>
          <Text style={styles.value}>{log.vitals?.bloodPressure?.systolic ?? '-'} / {log.vitals?.bloodPressure?.diastolic ?? '-'}</Text>
        </View>
      </View>

      {/* 食事・水分 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>食事・水分</Text>
        <View style={styles.row}>
          <Text style={styles.label}>朝</Text>
          <Text style={styles.value}>{log.meal_intake?.breakfast ?? '-'}</Text>
          <Text style={styles.label}>昼</Text>
          <Text style={styles.value}>{log.meal_intake?.lunch ?? '-'}</Text>
          <Text style={styles.label}>おやつ</Text>
          <Text style={styles.value}>{log.meal_intake?.snack ?? '-'}</Text>
          <Text style={styles.label}>夕</Text>
          <Text style={styles.value}>{log.meal_intake?.dinner ?? '-'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>水分</Text>
          <Text style={styles.value}>{log.hydration ?? '-'} ml</Text>
          <Text style={styles.label}>摂取方法</Text>
          <Text style={styles.value}>{log.intake?.methods?.join(', ') ?? '-'}</Text>
          <Text style={styles.label}>食事形態</Text>
          <Text style={styles.value}>{log.intake?.meal_form ?? '-'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>食事量</Text>
          <Text style={styles.value}>{log.intake?.meal_amount ?? '-'}</Text>
          <Text style={styles.label}>食事状況</Text>
          <Text style={styles.value}>{log.intake?.status?.join(', ') ?? '-'}</Text>
        </View>
        <Text style={styles.multiLine}>備考: {log.intake?.notes ?? '-'}</Text>
      </View>

      {/* 排泄 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>排泄</Text>
        <View style={styles.row}>
          <Text style={styles.label}>便形状</Text>
          <Text style={styles.value}>{log.excretion?.bristol_scale ?? '-'}</Text>
          <Text style={styles.label}>備考タグ</Text>
          <Text style={styles.value}>{log.excretion?.status?.join(', ') ?? '-'}</Text>
        </View>
        <Text style={styles.multiLine}>備考: {log.excretion?.notes ?? '-'}</Text>
      </View>

      {/* 睡眠 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>睡眠</Text>
        <View style={styles.row}>
          <Text style={styles.label}>時間</Text>
          <Text style={styles.value}>{log.sleep?.duration_minutes ?? '-'} 分</Text>
          <Text style={styles.label}>様子</Text>
          <Text style={styles.value}>{log.sleep?.status ?? '-'}</Text>
        </View>
        <Text style={styles.multiLine}>備考: {log.sleep?.notes ?? '-'}</Text>
      </View>

      {/* 発作 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>発作</Text>
        {log.seizures && log.seizures.length > 0 ? (
          log.seizures.map((sz, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.label}>種類</Text>
              <Text style={styles.value}>{sz.type}</Text>
              <Text style={styles.label}>持続</Text>
              <Text style={styles.value}>{sz.duration_sec} 秒</Text>
              <Text style={styles.label}>詳細</Text>
              <Text style={styles.value}>{sz.details?.join(', ')}</Text>
              <Text style={styles.label}>備考</Text>
              <Text style={styles.value}>{sz.notes}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.value}>なし</Text>
        )}
      </View>

      {/* 活動・表情 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>活動・表情</Text>
        <View style={styles.row}>
          <Text style={styles.label}>参加様子</Text>
          <Text style={styles.value}>{log.activity?.participation?.join(', ') ?? '-'}</Text>
          <Text style={styles.label}>気分</Text>
          <Text style={styles.value}>{log.activity?.mood ?? '-'}</Text>
        </View>
        <Text style={styles.multiLine}>備考: {log.activity?.notes ?? '-'}</Text>
      </View>

      {/* 医療的ケア・特記事項 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>医療的ケア・特記事項</Text>
        <View style={styles.row}>
          <Text style={styles.label}>実施ケア</Text>
          <Text style={styles.value}>{log.care_provided?.provided_care?.join(', ') ?? '-'}</Text>
        </View>
        {/* CareRecord型にnotesが無いため、特記事項はspecial_notes_detailsやspecial_notesでカバー */}
      </View>

      {/* テンプレ文・特記事項 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>特記事項・テンプレ文</Text>
        {/* PROJECT_SOUL.md 9.テンプレ文を初期表示 */}
        <Text style={styles.multiLine}>
          {log.special_notes_details ||
            `【特記事項】呼吸状態落ち着いており、喀痰量少。\n【活動の様子】スヌーズレンで光を追視し笑顔。\n【発作】強直 20 秒・眼球上転・チアノーゼ(−)・介入不要。\n【食事備考】経口とろみ 150 ml、むせ込み(−)。`}
        </Text>
        {log.special_notes && log.special_notes.length > 0 && (
          <View>
            {log.special_notes.map((note, i) => (
              <Text key={i} style={styles.multiLine}>[{note.category}] {note.details}</Text>
            ))}
          </View>
        )}
      </View>

      {/* 天気・気分 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>天気・気分</Text>
        <View style={styles.row}>
          <Text style={styles.label}>天気</Text>
          <Text style={styles.value}>{log.weather ?? '-'}</Text>
          <Text style={styles.label}>気分</Text>
          <Text style={styles.value}>{log.mood?.join(', ') ?? '-'}</Text>
        </View>
      </View>

      {/* トイレ記録 */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>排泄記録</Text>
        {log.toileting && log.toileting.length > 0 ? (
          log.toileting.map((t, i) => (
            <Text key={i} style={styles.value}>{t.time} {t.type} {t.amount}</Text>
          ))
        ) : (
          <Text style={styles.value}>なし</Text>
        )}
      </View>

      {/* 署名欄 */}
      <Text style={styles.signature}>職員署名: {log.recorder_name || '＿＿＿＿＿＿＿＿'}</Text>
    </Page>
  </Document>
);

export default DailyLogPdfDocument;
