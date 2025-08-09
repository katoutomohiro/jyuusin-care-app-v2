import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { DailyLog, User } from '../../types';
import { registerPdfFonts, pdfFamily, fauxItalic } from './registerFonts';
import { localDateKey } from '../../utils/dateKey';

// フォントを登録
registerPdfFonts();

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 25,
    fontFamily: pdfFamily,
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    fontSize: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  recordTable: {
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    minHeight: 30,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  itemColumn: {
    width: '25%',
    paddingHorizontal: 4,
    fontSize: 9,
  },
  recordColumn: {
    width: '75%',
    paddingHorizontal: 6,
    fontSize: 9,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  signatureSection: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  signatureLabel: {
    fontSize: 10,
    marginRight: 10,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: 100,
    height: 15,
  },
  emptyRecord: {
    color: '#999',
    ...fauxItalic,
  },
});

interface EnhancedDailyLogPdfDocProps {
  allLogs?: any[];
  users: User[];
  selectedDate?: string;
  dailyLogsByUser?: Record<string, any[]>;
  date?: string;
  facilityName?: string;
}

const EnhancedDailyLogPdfDoc: React.FC<EnhancedDailyLogPdfDocProps> = ({ 
  allLogs, 
  users, 
  selectedDate, 
  dailyLogsByUser, 
  date, 
  facilityName = '重心ケア施設' 
}) => {
  const targetDateKey = localDateKey(new Date(date || selectedDate || new Date()));
  
  // 各利用者の記録をフィルタリング
  const getUserDailyRecords = (userId: string) => {
    if (dailyLogsByUser) {
      const userLogs = dailyLogsByUser[userId] || [];
      return userLogs.filter(log => 
        localDateKey(log.created_at || new Date()) === targetDateKey
      );
    }
    return (allLogs || []).filter(log => 
      log.user_id === userId && 
      localDateKey(log.created_at || new Date()) === targetDateKey
    );
  };

  const formatRecordData = (records: any[], eventType: string) => {
    const filtered = records.filter(r => r.event_type === eventType);
    if (filtered.length === 0) return '記録なし';
    
    return filtered.map(r => {
      const time = new Date(r.created_at).toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      switch (eventType) {
        case 'seizure':
          return `${time} 発作: ${r.duration || ''}分 ${r.severity || ''} ${r.notes || ''}`;
        case 'expression':
          return `${time} 表情: ${r.mood || ''} ${r.notes || ''}`;
        case 'vitals':
          return `${time} 体温:${r.temperature || ''}°C 血圧:${r.systolic || ''}/${r.diastolic || ''} 脈拍:${r.pulse || ''}`;
        case 'hydration':
          return `${time} 水分: ${r.type || ''} ${r.amount || ''}ml`;
        case 'excretion':
          return `${time} 排泄: ${r.type || ''} ${r.notes || ''}`;
        case 'activity':
          return `${time} 活動: ${r.activity_type || ''} ${r.notes || ''}`;
        case 'tube_feeding':
          return `${time} 経管栄養: ${r.amount || ''}ml ${r.notes || ''}`;
        case 'medication':
          return `${time} 薬剤: ${r.medication_name || ''} ${r.dosage || ''}`;
        default:
          return `${time} ${r.notes || '記録'}`;
      }
    }).join('\n');
  };

  const recordItems = [
    { label: '発作', eventType: 'seizure' },
    { label: '表情・様子', eventType: 'expression' },
    { label: 'バイタル', eventType: 'vitals' },
    { label: '水分補給', eventType: 'hydration' },
    { label: '排泄', eventType: 'excretion' },
    { label: '活動', eventType: 'activity' },
    { label: '経管栄養', eventType: 'tube_feeding' },
    { label: '薬剤管理', eventType: 'medication' },
    { label: 'その他', eventType: 'other' },
  ];

  return (
    <Document>
      {users.map((user) => {
        const userRecords = getUserDailyRecords(user.id);
        
        return (
          <Page key={user.id} style={styles.page}>
            <Text style={styles.header}>{facilityName} 日中活動記録</Text>
            
            <View style={styles.userInfo}>
              <Text>利用者名: {user.name} 様</Text>
              <Text>日付: {new Date(date || selectedDate || new Date()).toLocaleDateString('ja-JP')}</Text>
              <Text>記録者: ________________</Text>
            </View>

            <View style={styles.recordTable}>
              <View style={styles.tableHeaderRow}>
                <Text style={styles.itemColumn}>項目</Text>
                <Text style={styles.recordColumn}>記録内容</Text>
              </View>
              
              {recordItems.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.itemColumn}>{item.label}</Text>
                  <Text style={styles.recordColumn}>
                    {formatRecordData(userRecords, item.eventType)}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>特記事項・申し送り</Text>
            <View style={[styles.tableRow, { minHeight: 50 }]}>
              <Text style={styles.recordColumn}>
                {userRecords.filter(r => r.notes).map(r => r.notes).join('\n') || '特記事項なし'}
              </Text>
            </View>

            <View style={styles.signatureSection}>
              <Text style={styles.signatureLabel}>保護者署名:</Text>
              <View style={styles.signatureLine} />
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default EnhancedDailyLogPdfDoc;
