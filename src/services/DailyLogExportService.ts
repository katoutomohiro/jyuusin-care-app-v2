import { DailyLog, User } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import DailyLogPdfDoc from '../components/pdf/DailyLogPdfDoc';


/**
 * Excelエクスポート（現在はダミー）
 */
export async function exportDailyLogExcel(): Promise<void> {
  /* eslint-disable-next-line no-console */
  console.warn('exportDailyLogExcel stub');
}

/**
 * @react-pdf/renderer を使ってPDFを生成し、ダウンロードさせる
 */
export async function exportDailyLog(log: DailyLog, user: User, date: string): Promise<void> {
  try {
    const blob = await pdf(<DailyLogPdfDoc log={log} user={user} recordDate={date} />).toBlob();
    saveAs(blob, `dailylog_${user.id}_${date}.pdf`);
  } catch (error) {
    console.error("PDFの生成または保存に失敗しました。", error);
  }
}

/**
 * 実利用者1名ぶんの日誌を PDF(A4 縦) で保存
 * @param log - 出力対象の日誌データ
 */
export async function exportDailyLogPdf(log: DailyLog): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // TODO: フォント設定 (Noto Sans JPなど)

  // ヘッダー（氏名・日付・署名欄）
  doc.setFontSize(16);
  doc.text(`${log.userName} 様 日次記録`, 14, 20);
  doc.setFontSize(10);
  doc.text(`日付: ${log.date}`, 14, 28);
  doc.text('署名欄: ______________________', 150, 28);


  // 各セクションをテーブル描画
  let currentY = 40;

  // バイタル
  if (log.vitals) {
    autoTable(doc, {
      startY: currentY,
      head: [['バイタルサイン']],
      body: [
        [`測定時間: ${log.vitals.measurement_time}`],
        [`体温: ${log.vitals.temperature ?? 'N/A'} °C`],
        [`脈拍: ${log.vitals.pulse ?? 'N/A'} bpm`],
        [`血圧: ${log.vitals.blood_pressure_systolic ?? 'N/A'}/${log.vitals.blood_pressure_diastolic ?? 'N/A'} mmHg`],
        [`SpO2: ${log.vitals.spo2 ?? 'N/A'} %`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] },
    });
    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // TODO: 他のセクション（水分、排泄、発作など）も同様に autoTable で描画


  // フッター（事業所ロゴ・ページ番号）
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text('重心ケアアプリ', 14, 287);
    doc.text(`ページ ${i} / ${pageCount}`, 180, 287);
  }


  doc.save(`${log.userName}_${log.date}.pdf`);
}
