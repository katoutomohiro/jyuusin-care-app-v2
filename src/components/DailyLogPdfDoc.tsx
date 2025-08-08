import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { formatReiwaWithWeekday } from "../utils/dateJp";
import { registerPdfFonts, pdfFamily } from "./pdf/registerFonts";

// フォント登録（重複登録ガード内で動作）
registerPdfFonts();

// 期待するpropsの型
export type VitalRow = {
  time: string;       // "HH:mm"
  tempC?: number;     // 体温 ℃
  bpSys?: number;     // 収縮期（上）
  bpDia?: number;     // 拡張期（下）
  spo2?: number;      // SpO2 %
  hr?: number;        // 心拍数
};
export type DailyLogPdfProps = {
  userName: string;
  date?: string | number | Date;     // Date or ISO or epoch
  staffName?: string;
  // 既存の各項目（発作～その他）は logData 等に保持。必要に応じて追記可。
  logData?: Record<string, any>;
  vitals?: VitalRow[];
};

const styles = StyleSheet.create({
  page: {
    fontFamily: pdfFamily,
    fontSize: 11,
    padding: 20,
    lineHeight: 1.4,
    flexDirection: "column",
  },
  header: {
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: "1px solid #000",
  },
  title: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: 700,
  },
  infoRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 4,
    fontSize: 12,
    fontWeight: 700,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tr: { flexDirection: "row" },
  th: {
    backgroundColor: "#f2f2f2",
    fontWeight: 700,
  },
  cell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    fontSize: 10.5,
  },
  // バイタル列幅バランス
  cTime: { width: "16%" },
  cTemp: { width: "16%" },
  cBP:   { width: "20%" },
  cSpO2: { width: "16%" },
  cHR:   { width: "16%" },
  cNote: { width: "16%" }, // 予備（必要なら備考欄など）
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  signature: {
    borderTop: "1px solid #000",
    width: 150,
    textAlign: "center",
    paddingTop: 3,
  },
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

        {/* バイタル */}
        <Text style={styles.sectionTitle}>バイタル</Text>
        <View style={styles.table}>
          {/* ヘッダ行 */}
          <View style={[styles.tr, styles.th]}>
            <Text style={[styles.cell, styles.cTime]}>時間</Text>
            <Text style={[styles.cell, styles.cTemp]}>体温（℃）</Text>
            <Text style={[styles.cell, styles.cBP]}>血圧（mmHg）上/下</Text>
            <Text style={[styles.cell, styles.cSpO2]}>SpO₂（%）</Text>
            <Text style={[styles.cell, styles.cHR]}>HR（bpm）</Text>
            <Text style={[styles.cell, styles.cNote]}>備考</Text>
          </View>
          {/* データ行 */}
          {(vitals.length ? vitals : [{ time: "", tempC: undefined, bpSys: undefined, bpDia: undefined, spo2: undefined, hr: undefined }]).map((v, i) => (
            <View style={styles.tr} key={i}>
              <Text style={[styles.cell, styles.cTime]}>{v.time ?? ""}</Text>
              <Text style={[styles.cell, styles.cTemp]}>{v.tempC ?? ""}</Text>
              <Text style={[styles.cell, styles.cBP]}>
                {(v.bpSys ?? "")}{v.bpSys!==undefined||v.bpDia!==undefined ? " / " : ""}{(v.bpDia ?? "")}
              </Text>
              <Text style={[styles.cell, styles.cSpO2]}>{v.spo2 ?? ""}</Text>
              <Text style={[styles.cell, styles.cHR]}>{v.hr ?? ""}</Text>
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

