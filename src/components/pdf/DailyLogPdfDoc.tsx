import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { DailyLog, User } from '../../types';

// 日本語フォントの登録（フォールバック対応）
let fontRegistered = false;
try {
  Font.register({
    family: 'NotoSansJP',
    fonts: [
      {
        src: 'https://fonts.gstatic.com/s/notosansjp/v53/8gB7iThKqH2Wvl0wZwqPQwOv_DdjSBGnfLGCAVBq.woff2',
        fontWeight: 400,
      },
    ]
  });
  fontRegistered = true;
  console.log('✅ NotoSansJP font registered successfully');
} catch (error) {
  console.warn('⚠️ Using Helvetica fallback due to font registration error:', error);
}

const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    fontFamily: fontRegistered ? 'NotoSansJP' : 'Helvetica',
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
  log: DailyLog;
  user: User;
}

const DailyLogPdfDoc: React.FC<DailyLogPdfDocProps> = ({ log, user }) => (
  <Document>
    <Page size="A4" style={styles.body}>
      {/* Header */}
      <Text style={styles.header}>{`${user.name}　${log.date || '日付不明'}`}</Text>

      {/* Vitals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>■ バイタル / Vitals</Text>
        {log.vitals ? (
          <Text style={styles.dataColumn}>{`体温 ${log.vitals.temperature ?? 'N/A'}℃　脈拍 ${log.vitals.pulse ?? 'N/A'}　SpO2 ${log.vitals.spo2 ?? 'N/A'}%`}</Text>
        ) : <Text style={styles.emptyData}>※ 記録なし</Text>}
      </View>

      {/* Columns for Hydration and Excretion */}
      <View style={styles.gridContainer}>
        <View style={styles.leftColumn}>
          <Text style={styles.sectionTitle}>■ 水分・食事 / Hydration</Text>
          {log.hydration && log.hydration.length > 0 ? log.hydration.map((h, i) => (
            <Text key={i} style={styles.dataColumn}>{`${h.time}　${h.content} ${h.amount}ml`}</Text>
          )) : <Text style={styles.emptyData}>※ 記録なし</Text>}
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.sectionTitle}>■ 排泄 / Excretion</Text>
          {log.excretion && log.excretion.length > 0 ? log.excretion.map((e, i) => (
            <Text key={i} style={styles.dataColumn}>{`${e.time}　${e.type} (${e.amount})`}</Text>
          )) : <Text style={styles.emptyData}>※ 記録なし</Text>}
        </View>
      </View>
      
      {/* Seizure */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>■ 発作 / Seizure</Text>
        <Text style={styles.dataColumn}>{log.seizure ? `${log.seizure.length} 件` : '0 件'}</Text>
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>■ 特記事項・担当職員 / Notes</Text>
        {log.notes ? (
          <Text style={styles.dataColumn}>{log.notes}</Text>
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

