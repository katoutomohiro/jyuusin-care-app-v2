import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { DailyLog, Vitals, Hydration, Excretion, Seizure, Activity, Care } from '../../types';

// TODO: Noto Sans JPフォントを/public/fontsなどに配置し、パスを解決する
// Font.register({
//   family: 'Noto Sans JP',
//   fonts: [
//     { src: '/fonts/NotoSansJP-Regular.otf' },
//     { src: '/fonts/NotoSansJP-Bold.otf', fontWeight: 'bold' },
//   ]
// });

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Noto Sans JP',
    fontSize: 9,
    paddingTop: 30,
    paddingBottom: 50, // フッター用にスペース確保
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  signatureBox: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  signature: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    width: 120,
    height: 40,
    marginTop: 5,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginBottom: 8,
    borderRadius: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: 'grey',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row"
  },
  tableColHeader: {
    backgroundColor: '#f0f0f0',
    padding: 4,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontWeight: 'bold',
  },
  tableCol: {
    padding: 4,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flex3: { flex: 3 },
  flex4: { flex: 4 },
});

interface DailyLogPdfDocProps {
  log: DailyLog;
}

const renderVitals = (vitals: Vitals | null) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>バイタルサイン</Text>
    {vitals ? (
       <Text>測定時間: {vitals.measurement_time}, 体温: {vitals.temperature}°C, 脈拍: {vitals.pulse}, 血圧: {vitals.blood_pressure_systolic}/{vitals.blood_pressure_diastolic}, SpO2: {vitals.spo2}%</Text>
    ) : <Text>記録なし</Text>}
  </View>
);

const renderTable = <T extends object>(title: string, data: T[] | undefined, columns: { header: string; accessor: keyof T, flex?: number }[]) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text>記録なし</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          {columns.map(col => <Text key={String(col.accessor)} style={[styles.tableColHeader, { flex: col.flex || 1 }]}>{col.header}</Text>)}
        </View>
        {data.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.tableRow}>
            {columns.map(col => <Text key={String(col.accessor)} style={[styles.tableCol, { flex: col.flex || 1 }]}>{String(row[col.accessor] ?? '')}</Text>)}
          </View>
        ))}
      </View>
    </View>
  );
};


const DailyLogPdfDoc: React.FC<DailyLogPdfDocProps> = ({ log }) => (
  <Document>
    <Page size="A4" style={styles.page} wrap>
      {/* ヘッダー */}
      <View style={styles.header} fixed>
        <View style={styles.userInfo}>
          <Text style={styles.title}>{log.userName} 様 日次記録</Text>
          <Text>日付: {log.date}</Text>
        </View>
        <View style={styles.signatureBox}>
          <Text>確認者署名:</Text>
          <View style={styles.signature} />
        </View>
      </View>

      {/* 各記録セクション */}
      {renderVitals(log.vitals)}
      {renderTable<Hydration>('水分・食事', log.hydration, [
        { header: '時間', accessor: 'time', flex: 1 },
        { header: '種類', accessor: 'type', flex: 1 },
        { header: '内容', accessor: 'content', flex: 3 },
        { header: '量(ml)', accessor: 'amount', flex: 1 },
      ])}
      {renderTable<Excretion>('排泄', log.excretion, [
        { header: '時間', accessor: 'time', flex: 1 },
        { header: '種類', accessor: 'type', flex: 1 },
        { header: '量', accessor: 'amount', flex: 1 },
        { header: '性状', accessor: 'properties', flex: 2 },
        { header: '備考', accessor: 'notes', flex: 3 },
      ])}
      {renderTable<Seizure>('発作', log.seizure, [
        { header: '時間', accessor: 'time', flex: 1 },
        { header: '持続(秒)', accessor: 'duration', flex: 1 },
        { header: '種類', accessor: 'type', flex: 2 },
        { header: '事後状態', accessor: 'postIctalState', flex: 3 },
      ])}
      {renderTable<Activity>('活動', log.activity, [
        { header: '時間', accessor: 'time', flex: 1 },
        { header: '活動内容', accessor: 'title', flex: 3 },
        { header: '様子', accessor: 'mood', flex: 2 },
      ])}
      {renderTable<Care>('医療ケア', log.care, [
        { header: '時間', accessor: 'time', flex: 1 },
        { header: 'ケア内容', accessor: 'type', flex: 2 },
        { header: '詳細', accessor: 'details', flex: 4 },
      ])}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>特記事項</Text>
        <Text>{log.notes || '特記事項なし'}</Text>
      </View>

      {/* フッター */}
      <View style={styles.footer} fixed>
        <Text>重心ケアアプリ</Text>
        <Text render={({ pageNumber, totalPages }) => (
          `ページ ${pageNumber} / ${totalPages}`
        )} />
      </View>
    </Page>
  </Document>
);

export default DailyLogPdfDoc;

