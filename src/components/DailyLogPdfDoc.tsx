import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { formatReiwaWithWeekday } from "../utils/dateJp";

export type VitalRow = {
  time: string;
  tempC?: number;
  bpSys?: number;
  bpDia?: number;
  spo2?: number;
  hr?: number;
  rr?: number; // 追加
};
export type DailyLogPdfProps = {
  userName: string;
  date?: string | number | Date;
  staffName?: string;
  logData?: Record<string, any>;
  vitals?: VitalRow[];
};

const styles = StyleSheet.create({
  page: { fontFamily: "Shippori Mincho", fontSize: 11, padding: 20, lineHeight: 1.4, flexDirection: "column" },
  header: { marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #000" },
  title: { fontSize: 14, textAlign: "center", fontWeight: 700 },
  infoRow: { marginTop: 6, flexDirection: "row", justifyContent: "space-between" },
  sectionTitle: { marginTop: 10, marginBottom: 4, fontSize: 12, fontWeight: 700 },
  table: { width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tr: { flexDirection: "row" },
  th: { backgroundColor: "#f2f2f2", fontWeight: 700 },
  cell: { borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 4, fontSize: 10.5 },
  cTime: { width: "16%" },
  cTemp: { width: "14%" },
  cBP:   { width: "18%" },
  cSpO2: { width: "14%" },
  cHR:   { width: "14%" },
  cRR:   { width: "12%" }, // 追加
  cNote: { width: "12%" },
  footer: { marginTop: 20, flexDirection: "row", justifyContent: "flex-end" },
  signature: { borderTop: "1px solid #000", width: 150, textAlign: "center", paddingTop: 3 },
});

export const DailyLogPdfDoc: React.FC<DailyLogPdfProps> = ({
  userName,
  date = new Date(),
  staffName = "",
  logData = {},
  vitals = [],
}) => {
  const dateLabel = formatReiwaWithWeekday(date);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ヘッダ：タイトル＋日付＋担当 */}
        <View style={styles.header}>
          <Text style={styles.title}>サービス提供記録用紙・ケース記録</Text>
          <View style={styles.infoRow}>
            <Text>利用者名：{userName}</Text>
            <Text>日付：{dateLabel}</Text>
            <Text>担当：{staffName}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>バイタル</Text>
        <View style={styles.table}>
          <View style={[styles.tr, styles.th]}>
            <Text style={[styles.cell, styles.cTime]}>時間</Text>
            <Text style={[styles.cell, styles.cTemp]}>体温（℃）</Text>
            <Text style={[styles.cell, styles.cBP]}>血圧（mmHg）上/下</Text>
            <Text style={[styles.cell, styles.cSpO2]}>SpO₂（%）</Text>
            <Text style={[styles.cell, styles.cHR]}>HR（bpm）</Text>
            <Text style={[styles.cell, styles.cRR]}>RR（/min）</Text>
            <Text style={[styles.cell, styles.cNote]}>備考</Text>
          </View>
          {(vitals.length ? vitals : [{ time: "", tempC: undefined, bpSys: undefined, bpDia: undefined, spo2: undefined, hr: undefined, rr: undefined }]).map((v, i) => (
            <View style={styles.tr} key={i}>
              <Text style={[styles.cell, styles.cTime]}>{v.time ?? ""}</Text>
              <Text style={[styles.cell, styles.cTemp]}>{v.tempC ?? ""}</Text>
              <Text style={[styles.cell, styles.cBP]}>
                {(v.bpSys ?? "")}{v.bpSys!==undefined||v.bpDia!==undefined ? " / " : ""}{(v.bpDia ?? "")}
              </Text>
              <Text style={[styles.cell, styles.cSpO2]}>{v.spo2 ?? ""}</Text>
              <Text style={[styles.cell, styles.cHR]}>{v.hr ?? ""}</Text>
              <Text style={[styles.cell, styles.cRR]}>{v.rr ?? ""}</Text>
              <Text style={[styles.cell, styles.cNote]} />
            </View>
          ))}
        </View>

        {/* 既存の「発作～その他」テーブルは従来通り下部に描画してOK（必要に応じて別セクションで出力） */}
        {/* 署名欄 */}
        <View style={styles.footer}>
          <View style={styles.signature}>
            <Text>保護者署名</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

