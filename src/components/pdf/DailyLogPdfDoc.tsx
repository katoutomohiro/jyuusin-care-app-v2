import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { DailyLog, User } from '../../types';

/**
 * 400 / 700 の normal だけ登録し、italic 要求は
 *   <Text style={{ fontStyle:'italic' }}>  →  renderer が自動で faux-italic
 * にフォールバックさせる。これで "Unknown font format" が消える。
 */
Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: '/fonts/NotoSansJP-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/NotoSansJP-Bold.ttf',    fontWeight: 700 }
  ]
});

if (import.meta.env.DEV) console.debug('✅ NotoSansJP ローカルフォント登録完了');

const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    fontFamily: 'NotoSansJP',
    fontSize: 9,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    fontSize: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  leftColumn: {
    flex: 1,
    marginRight: 10,
  },
  rightColumn: {
    flex: 1,
    marginLeft: 10,
  },
  section: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 2,
    fontSize: 8,
  },
  timeColumn: {
    width: 40,
    marginRight: 5,
  },
  dataColumn: {
    flex: 1,
  },
  emptyData: {
    color: '#999',
    fontStyle: 'italic',
  },
  signatureSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 15,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  signatureLabel: {
    fontSize: 10,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: 120,
    height: 15,
  },
});

interface DailyLogPdfDocProps {
  dailyLogItems: DailyLog;
  user: User;
}

const DailyLogPdfDoc: React.FC<DailyLogPdfDocProps> = ({ dailyLogItems, user }) => (
  <Document>
    <Page size="A4" style={styles.body}>
      {/* Header */}
      <Text style={styles.header}>{`${user.name}　${dailyLogItems.date || '日付不明'}`}</Text>

      {/* Vitals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>■ バイタル / Vitals</Text>
        {dailyLogItems.vitals ? (
          <Text style={styles.dataColumn}>{`体温 ${dailyLogItems.vitals.temperature ?? 'N/A'}℃　脈拍 ${dailyLogItems.vitals.pulse ?? 'N/A'}　SpO2 ${dailyLogItems.vitals.spo2 ?? 'N/A'}%`}</Text>
        ) : <Text style={styles.emptyData}>※ 記録なし</Text>}
      </View>

      {/* Columns for Hydration and Excretion */}
      <View style={styles.gridContainer}>
        <View style={styles.leftColumn}>
          <Text style={styles.sectionTitle}>■ 水分・食事 / Hydration</Text>
          {dailyLogItems.hydration && dailyLogItems.hydration.length > 0 ? dailyLogItems.hydration.map((h, i) => (
            <Text key={i} style={styles.dataColumn}>{`${h.time}　${h.content} ${h.amount}ml`}</Text>
          )) : <Text style={styles.emptyData}>※ 記録なし</Text>}
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.sectionTitle}>■ 排泄 / Excretion</Text>
          {dailyLogItems.excretion && dailyLogItems.excretion.length > 0 ? dailyLogItems.excretion.map((e, i) => (
            <Text key={i} style={styles.dataColumn}>{`${e.time}　${e.type} (${e.amount})`}</Text>
          )) : <Text style={styles.emptyData}>※ 記録なし</Text>}
        </View>
      </View>
      
      {/* Seizure */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>■ 発作 / Seizure</Text>
        <Text style={styles.dataColumn}>{dailyLogItems.seizure ? `${dailyLogItems.seizure.length} 件` : '0 件'}</Text>
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>■ 特記事項・担当職員 / Notes</Text>
        {dailyLogItems.notes ? (
          <Text style={styles.dataColumn}>{dailyLogItems.notes}</Text>
        ) : (
          <Text style={styles.emptyData}>※ 記録なし</Text>
        )}
      </View>

      {/* Signature Box */}
      <View style={styles.signatureSection}>
        <Text>保護者署名 : ______________________</Text>
      </View>

    </Page>
  </Document>
);

export default DailyLogPdfDoc;

