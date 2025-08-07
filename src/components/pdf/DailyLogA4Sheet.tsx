import React, { FC } from 'react';
import { Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';
import { DailyLog } from '../../types';

// 完全ローカルフォント登録
Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: '/pdf/fonts/NotoSansJP-Regular.otf', fontWeight: 400, fontStyle: 'normal' },
    { src: '/pdf/fonts/NotoSansJP-Regular.otf', fontWeight: 400, fontStyle: 'italic' },
    { src: '/pdf/fonts/NotoSansJP-Bold.otf',    fontWeight: 700, fontStyle: 'normal' },
  ]
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansJP',
    padding: '1cm',
    fontSize: 10,
    backgroundColor: '#fff',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#bfbfbf',
    borderBottomWidth: 1,
    alignItems: 'stretch',
  },
  tableColHeader: {
    width: '25%',
    borderRightColor: '#bfbfbf',
    borderRightWidth: 1,
    backgroundColor: '#f2f2f2',
    padding: 5,
    fontWeight: 'bold',
  },
  tableCol: {
    width: '75%',
    borderRightColor: '#bfbfbf',
    borderRightWidth: 1,
    padding: 5,
    whiteSpace: 'pre-wrap',
  },
  signature: {
    marginTop: '2cm',
    textAlign: 'right',
    fontSize: 12,
  },
});

const Row: FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
  <View style={styles.tableRow}>
    <View style={styles.tableColHeader}>
      <Text>{label}</Text>
    </View>
    <View style={styles.tableCol}>
      <Text>{value || 'N/A'}</Text>
    </View>
  </View>
);

export const DailyLogA4Sheet: FC<{ dto: DailyLog }> = ({ dto }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.table}>
      <Row label="発作" value={dto.seizure?.length ? `${dto.seizure.length} 件` : 'なし'} />
      <Row label="表情・反応" value="記録なし" />
      <Row label="バイタル" value={dto.vitals ? `体温:${dto.vitals.temperature}℃ SpO2:${dto.vitals.spo2}% 脈拍:${dto.vitals.pulse}回/分` : 'N/A'} />
      <Row label="水分" value={dto.hydration?.length ? dto.hydration.map(h => `${h.time} ${h.content} ${h.amount}ml`).join(', ') : ''} />
      <Row label="食事" value="記録なし" />
      <Row label="排泄" value={dto.excretion?.length ? dto.excretion.map(e => `${e.time} ${e.type} (${e.amount})`).join(', ') : ''} />
      <Row label="睡眠" value={dto.sleep ? `${dto.sleep.bedTime} - ${dto.sleep.wakeTime}` : ''} />
      <Row label="活動" value={dto.activity?.length ? dto.activity.map(a => `${a.time} ${a.content}`).join(', ') : ''} />
      <Row label="ケア" value={dto.care?.length ? dto.care.map(c => `${c.time} ${c.type} ${c.details}`).join(', ') : ''} />
      <Row label="服薬" value="記録なし" />
      <Row label="その他" value="記録なし" />
      <Row label="特記事項" value={dto.notes || ''} />
    </View>
    <Text style={styles.signature}>保護者署名：____________________</Text>
  </Page>
);
