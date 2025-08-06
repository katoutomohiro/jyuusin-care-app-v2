import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { DailyLog, User } from '../../types';

// TODO: フォントファイル（NotoSansJP-Regular.otf）を public/fonts などに配置する必要がある
// Font.register({
//   family: 'Noto Sans JP',
//   src: '/fonts/NotoSansJP-Regular.otf'
// });

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: 'Noto Sans JP',
    fontSize: 9,
  },
  header: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#888',
    paddingBottom: 10,
  },
  section: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle:{ 
    fontSize: 11, 
    fontWeight: 'bold', // 700 is equivalent to 'bold'
    marginTop: 14, 
    marginBottom: 4,
  },
  row: {
    fontSize: 9,
    lineHeight: 1.2,
  },
  none: {
    fontSize: 8,
    color: '#999',
  },
  columns: { 
    flexDirection: 'row', 
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 8,
  },
  colLeft:     { flex: 1 },
  colRight:    { flex: 1 },
  signatureBox:{ 
    marginTop: 25, 
    borderTopWidth: 1, 
    borderTopColor: '#888',
    paddingTop: 6, 
    fontSize: 10 
  },
});

interface DailyLogPdfDocProps {
  log: DailyLog;
  user: User;
  recordDate: string; // "YYYY-MM-DD"
}

const DailyLogPdfDoc: React.FC<DailyLogPdfDocProps> = ({ log, user, recordDate }) => (
  <Document>
    <Page size="A4" style={styles.body}>
      {/* Header */}
      <Text style={styles.header}>{`${user.name}　${recordDate}`}</Text>

      {/* Vitals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>■ バイタル / Vitals</Text>
        {log.vitals ? (
          <Text style={styles.row}>{`体温 ${log.vitals.temperature ?? 'N/A'}℃　脈拍 ${log.vitals.pulse ?? 'N/A'}　SpO2 ${log.vitals.spo2 ?? 'N/A'}%`}</Text>
        ) : <Text style={styles.none}>※ 記録なし</Text>}
      </View>

      {/* Columns for Hydration and Excretion */}
      <View style={styles.columns}>
        <View style={styles.colLeft}>
          <Text style={styles.sectionTitle}>■ 水分・食事 / Hydration</Text>
          {log.hydration && log.hydration.length > 0 ? log.hydration.map((h, i) => (
            <Text key={i} style={styles.row}>{`${h.time}　${h.content} ${h.amount}ml`}</Text>
          )) : <Text style={styles.none}>※ 記録なし</Text>}
        </View>
        <View style={styles.colRight}>
          <Text style={styles.sectionTitle}>■ 排泄 / Excretion</Text>
          {log.excretion && log.excretion.length > 0 ? log.excretion.map((e, i) => (
            <Text key={i} style={styles.row}>{`${e.time}　${e.type} (${e.amount})`}</Text>
          )) : <Text style={styles.none}>※ 記録なし</Text>}
        </View>
      </View>
      
      {/* Seizure */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>■ 発作 / Seizure</Text>
        <Text style={styles.row}>{log.seizure ? `${log.seizure.length} 件` : '0 件'}</Text>
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>■ 特記事項・担当職員 / Notes</Text>
        {log.notes ? (
          <Text style={styles.row}>{log.notes}</Text>
        ) : (
          <Text style={styles.none}>※ 記録なし</Text>
        )}
      </View>

      {/* Signature Box */}
      <View style={styles.signatureBox}>
        <Text>保護者署名 : ______________________</Text>
      </View>

    </Page>
  </Document>
);

export default DailyLogPdfDoc;

