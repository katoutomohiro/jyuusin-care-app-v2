import React from 'react';
import { DailyLog, User } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import DailyLogPdfDoc from '../components/pdf/DailyLogPdfDoc';


/**
 * A4 Excel エクスポート - PDF と同じ見た目で出力
 */
export async function exportDailyLogExcel(
  log: DailyLog,
  user: User,
  date: string
): Promise<void> {
  try {
    /* 2-A. シート用 2D 配列を用意 */
    const sheetData = [
      ['氏名', user.name, '', '', '記録日', date],
      [],
      ['■ バイタル / Vitals'],
      ['体温', log.vitals?.temperature ?? '', '脈拍', log.vitals?.pulse ?? '', 'SpO2', log.vitals?.spo2 ?? ''],
      [],
      ['■ Hydration', '', '■ Excretion'],
      ...mergeHydrationExcretion(log),
      [],
      ['■ Seizure 件数', log.seizure?.length ?? 0],
      [],
      ['■ Notes'],
      [log.notes ?? ''],
      [],
      ['保護者署名：', '____________________________']
    ];

    /* 2-B. ワークブック生成 */
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    /* 2-C. A4 印刷フォーマット設定 */
    ws['!margins'] = {
      left: 0.7,
      right: 0.7,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    };

    /* 2-D. ファイル出力 */
    XLSX.utils.book_append_sheet(wb, ws, 'DailyLog');
    const fileName = `dailylog_${user.id}_${date}.xlsx`;
    XLSX.writeFile(wb, fileName);

    console.log(`Excel ファイル "${fileName}" を保存しました`);
  } catch (error) {
    console.error('Excel エクスポートエラー:', error);
    throw error;
  }
}

/**
 * Hydration と Excretion データを A4 レイアウト用に結合
 */
function mergeHydrationExcretion(log: DailyLog): (string | number)[][] {
  const hydrationRows = [];
  const excretionRows = [];

  /* Hydration 行構築 */
  if (log.hydration && log.hydration.length > 0) {
    log.hydration.forEach((h) => {
      hydrationRows.push([
        h.time || '',
        `${h.amount || 0}ml`,
        h.content || '',
      ]);
    });
  } else {
    hydrationRows.push(['時間', '摂取量', '種類']);
  }

  /* Excretion 行構築 */
  if (log.excretion && log.excretion.length > 0) {
    log.excretion.forEach((e) => {
      excretionRows.push([
        e.time || '',
        e.amount || '',
        e.properties || '',
      ]);
    });
  } else {
    excretionRows.push(['時間', '量', '便の性状']);
  }

  /* 左右に並べて 2D 配列合成 */
  const maxRows = Math.max(hydrationRows.length, excretionRows.length);
  const merged = [];

  for (let i = 0; i < maxRows; i++) {
    const leftRow = hydrationRows[i] || ['', '', ''];
    const rightRow = excretionRows[i] || ['', '', ''];
    merged.push([...leftRow, ...rightRow]);
  }

  return merged;
}

/**
 * @react-pdf/renderer を使ってPDFを生成し、ダウンロードさせる
 */
export async function exportDailyLog(log: DailyLog, user: User, date: string): Promise<void> {
  try {
    const element = React.createElement(DailyLogPdfDoc, { log, user, recordDate: date });
    const blob = await pdf(element).toBlob();
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
