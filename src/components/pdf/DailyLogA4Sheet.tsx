import React, { FC } from 'react';
import { Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';
import { DailyLogDto } from '../../types'; // DTOのパスは適宜修正してください

// 日本語フォントの登録
Font.register({
  family: 'NotoSansJP',
  src: 'https://fonts.gstatic.com/s/notosansjp/v28/-F62fjtqLzI2JPCgQBnw7HFyzrs.ttf', // 仮のURL、ローカルフォントパスを推奨
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

export const DailyLogA4Sheet: FC<{ dto: DailyLogDto }> = ({ dto }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.table}>
      <Row label="発作" value={dto.seizure?.note} />
      <Row label="表情・反応" value={dto.expression?.note} />
      <Row label="バイタル" value={`体温:${dto.vitals?.temp}℃ SpO2:${dto.vitals?.spo2}% 脈拍:${dto.vitals?.pulse}回/分 血圧:${dto.vitals?.bp}`} />
      <Row label="水分" value={dto.intake?.water ? `${dto.intake.water} ml` : ''} />
      <Row label="食事" value={dto.intake?.meal} />
      <Row label="排泄" value={dto.excretion} />
      <Row label="睡眠" value={dto.sleep} />
      <Row label="活動" value={dto.activity} />
      <Row label="ケア" value={dto.care} />
      <Row label="服薬" value={dto.medication} />
      <Row label="その他" value={dto.other} />
      <Row label="特記事項" value={dto.notes} />
    </View>
    <Text style={styles.signature}>保護者署名：____________________</Text>
  </Page>
);
