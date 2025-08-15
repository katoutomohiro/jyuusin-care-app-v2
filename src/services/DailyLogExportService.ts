
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";

// 必要に応じて型を厳密化
export type DailyLogPayload = {
  user?: {
    id?: string;
    name?: string;
    [key: string]: any;
  };
  date?: string;
  entries?: any[];
  notes?: string;
  [key: string]: any;
};

/**
 * 日誌データをPDFとして保存する（jsPDF + html2canvas）
 * Vite devで500を出さない純粋なサービスモジュール
 */
export async function exportDailyLogPdf(payload: DailyLogPayload): Promise<void> {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`User: ${payload.user?.name ?? ""}`, 10, 20);
  doc.setFontSize(12);
  doc.text(`Date: ${payload.date ?? ""}`, 10, 30);
  if (payload.entries && Array.isArray(payload.entries)) {
    let y = 40;
    payload.entries.forEach((entry, idx) => {
      doc.text(`Entry ${idx + 1}: ${JSON.stringify(entry)}`, 10, y);
      y += 10;
    });
  }
  if (payload.notes) {
    doc.text(`Notes: ${payload.notes}`, 10, 100);
  }
  doc.save(`daily-log-${payload.date ?? "unknown"}.pdf`);
}


