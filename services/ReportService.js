import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
export class ReportService {
    /**
     * 日誌データをPDFレポートとして出力
     */
    static async generatePDFReport(logs, users, staff, options = {}) {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        let yPosition = 20;
        // ヘッダー
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(options.title || '日誌レポート', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;
        // 日付範囲
        if (options.dateRange) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            const dateText = `${format(new Date(options.dateRange.start), 'yyyy年MM月dd日', { locale: ja })} - ${format(new Date(options.dateRange.end), 'yyyy年MM月dd日', { locale: ja })}`;
            doc.text(dateText, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 10;
        }
        // 生成日時
        doc.setFontSize(10);
        doc.text(`生成日時: ${format(new Date(), 'yyyy年MM月dd日 HH:mm', { locale: ja })}`, margin, yPosition);
        yPosition += 15;
        // サマリー情報
        const summaryData = [
            ['総記録数', logs.length.toString()],
            ['対象利用者数', new Set(logs.map(log => log.user_id)).size.toString()],
            ['記録期間', options.dateRange ? `${options.dateRange.start} ～ ${options.dateRange.end}` : '全期間']
        ];
        autoTable(doc, {
            startY: yPosition,
            head: [['項目', '値']],
            body: summaryData,
            theme: 'grid',
            headStyles: { fillColor: [66, 139, 202] },
            margin: { left: margin, right: margin }
        });
        yPosition = doc.lastAutoTable.finalY + 10;
        // 各記録の詳細
        for (const log of logs) {
            const user = users.find(u => u.id === log.user_id);
            const staffMember = staff.find(s => s.id === log.staff_id);
            // ページチェック
            if (yPosition > doc.internal.pageSize.height - 50) {
                doc.addPage();
                yPosition = 20;
            }
            // 記録ヘッダー
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            const recordTitle = `${format(new Date(log.record_date), 'yyyy年MM月dd日 (E)', { locale: ja })} - ${user?.name || '不明'} (${user?.initials || 'N/A'})`;
            doc.text(recordTitle, margin, yPosition);
            yPosition += 8;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`記録者: ${staffMember?.name || '不明'}`, margin, yPosition);
            yPosition += 10;
            // バイタルサイン
            if (options.includeVitals !== false && log.vitals) {
                const vitalsData = [
                    ['体温', `${log.vitals.temperature}℃`],
                    ['脈拍', `${log.vitals.pulse}回/分`],
                    ['SpO2', `${log.vitals.spO2}%`],
                    ['血圧', `${log.vitals.bloodPressure.systolic}/${log.vitals.bloodPressure.diastolic}mmHg`]
                ];
                autoTable(doc, {
                    startY: yPosition,
                    head: [['バイタルサイン', '']],
                    body: vitalsData,
                    theme: 'striped',
                    headStyles: { fillColor: [240, 240, 240] },
                    margin: { left: margin, right: margin }
                });
                yPosition = doc.lastAutoTable.finalY + 5;
            }
            // 食事・水分
            if (options.includeIntake !== false && log.intake) {
                const intakeData = [
                    ['食事形態', log.intake.meal_form || ''],
                    ['食事量', log.intake.meal_amount || ''],
                    ['水分量', `${log.intake.amount_ml}ml`],
                    ['備考', log.intake.notes || '']
                ].filter(row => row[1]);
                if (intakeData.length > 0) {
                    autoTable(doc, {
                        startY: yPosition,
                        head: [['食事・水分記録', '']],
                        body: intakeData,
                        theme: 'striped',
                        headStyles: { fillColor: [240, 240, 240] },
                        margin: { left: margin, right: margin }
                    });
                    yPosition = doc.lastAutoTable.finalY + 5;
                }
            }
            // 排泄
            if (options.includeExcretion !== false && log.excretion) {
                const excretionData = [
                    ['ブリストルスケール', log.excretion.bristol_scale.toString()],
                    ['備考', log.excretion.notes || '']
                ].filter(row => row[1]);
                if (excretionData.length > 0) {
                    autoTable(doc, {
                        startY: yPosition,
                        head: [['排泄記録', '']],
                        body: excretionData,
                        theme: 'striped',
                        headStyles: { fillColor: [240, 240, 240] },
                        margin: { left: margin, right: margin }
                    });
                    yPosition = doc.lastAutoTable.finalY + 5;
                }
            }
            // 睡眠
            if (options.includeSleep !== false && log.sleep) {
                const sleepData = [
                    ['睡眠時間', `${Math.floor(log.sleep.duration_minutes / 60)}時間${log.sleep.duration_minutes % 60}分`],
                    ['睡眠の様子', log.sleep.status || ''],
                    ['備考', log.sleep.notes || '']
                ].filter(row => row[1]);
                if (sleepData.length > 0) {
                    autoTable(doc, {
                        startY: yPosition,
                        head: [['睡眠記録', '']],
                        body: sleepData,
                        theme: 'striped',
                        headStyles: { fillColor: [240, 240, 240] },
                        margin: { left: margin, right: margin }
                    });
                    yPosition = doc.lastAutoTable.finalY + 5;
                }
            }
            // 発作
            if (options.includeSeizures !== false && log.seizures && log.seizures.length > 0) {
                const seizureData = log.seizures.map(seizure => [
                    seizure.type,
                    `${seizure.duration_sec}秒`,
                    seizure.notes || ''
                ]);
                autoTable(doc, {
                    startY: yPosition,
                    head: [['発作記録', '持続時間', '備考']],
                    body: seizureData,
                    theme: 'striped',
                    headStyles: { fillColor: [255, 200, 200] },
                    margin: { left: margin, right: margin }
                });
                yPosition = doc.lastAutoTable.finalY + 5;
            }
            // 活動
            if (options.includeActivity !== false && log.activity) {
                const activityData = [
                    ['参加状況', log.activity.participation.join(', ') || ''],
                    ['表情・気分', log.activity.mood || ''],
                    ['備考', log.activity.notes || '']
                ].filter(row => row[1]);
                if (activityData.length > 0) {
                    autoTable(doc, {
                        startY: yPosition,
                        head: [['活動記録', '']],
                        body: activityData,
                        theme: 'striped',
                        headStyles: { fillColor: [240, 240, 240] },
                        margin: { left: margin, right: margin }
                    });
                    yPosition = doc.lastAutoTable.finalY + 5;
                }
            }
            // 医療ケア
            if (options.includeCare !== false && log.care_provided) {
                const careData = [
                    ['提供したケア', log.care_provided.provided_care.join(', ') || '']
                ].filter(row => row[1]);
                if (careData.length > 0) {
                    autoTable(doc, {
                        startY: yPosition,
                        head: [['医療ケア記録', '']],
                        body: careData,
                        theme: 'striped',
                        headStyles: { fillColor: [200, 255, 200] },
                        margin: { left: margin, right: margin }
                    });
                    yPosition = doc.lastAutoTable.finalY + 5;
                }
            }
            // 特記事項
            if (options.includeSpecialNotes !== false && log.special_notes && log.special_notes.length > 0) {
                const notesData = log.special_notes.map(note => [
                    note.category,
                    note.details
                ]);
                autoTable(doc, {
                    startY: yPosition,
                    head: [['特記事項', '詳細']],
                    body: notesData,
                    theme: 'striped',
                    headStyles: { fillColor: [255, 255, 200] },
                    margin: { left: margin, right: margin }
                });
                yPosition = doc.lastAutoTable.finalY + 10;
            }
            // 区切り線
            doc.setDrawColor(200, 200, 200);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 10;
        }
        // PDFをダウンロード
        const filename = `日誌レポート_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`;
        doc.save(filename);
    }
    /**
     * 日誌データをCSVファイルとして出力
     */
    static async generateCSVReport(logs, users, staff, options = {}) {
        const csvData = [];
        // ヘッダー行
        const headers = [
            '記録日',
            '利用者名',
            '利用者イニシャル',
            '記録者',
            '体温',
            '脈拍',
            'SpO2',
            '血圧上',
            '血圧下',
            '食事形態',
            '食事量',
            '水分量',
            '食事備考',
            'ブリストルスケール',
            '排泄備考',
            '睡眠時間(分)',
            '睡眠の様子',
            '睡眠備考',
            '発作種類',
            '発作持続時間(秒)',
            '発作備考',
            '活動参加',
            '表情・気分',
            '活動備考',
            '医療ケア',
            '特記事項カテゴリー',
            '特記事項詳細'
        ];
        csvData.push(headers);
        // データ行
        for (const log of logs) {
            const user = users.find(u => u.id === log.user_id);
            const staffMember = staff.find(s => s.id === log.staff_id);
            const row = [
                log.record_date,
                user?.name || '',
                user?.initials || '',
                staffMember?.name || '',
                log.vitals?.temperature?.toString() || '',
                log.vitals?.pulse?.toString() || '',
                log.vitals?.spO2?.toString() || '',
                log.vitals?.bloodPressure.systolic?.toString() || '',
                log.vitals?.bloodPressure.diastolic?.toString() || '',
                log.intake?.meal_form || '',
                log.intake?.meal_amount || '',
                log.intake?.amount_ml?.toString() || '',
                log.intake?.notes || '',
                log.excretion?.bristol_scale?.toString() || '',
                log.excretion?.notes || '',
                log.sleep?.duration_minutes?.toString() || '',
                log.sleep?.status || '',
                log.sleep?.notes || '',
                log.seizures?.[0]?.type || '',
                log.seizures?.[0]?.duration_sec?.toString() || '',
                log.seizures?.[0]?.notes || '',
                log.activity?.participation?.join(', ') || '',
                log.activity?.mood || '',
                log.activity?.notes || '',
                log.care_provided?.provided_care?.join(', ') || '',
                log.special_notes?.[0]?.category || '',
                log.special_notes?.[0]?.details || ''
            ];
            csvData.push(row);
        }
        // CSV文字列を生成
        const csvContent = csvData.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
        // BOMを追加（Excel対応）
        const bom = '\uFEFF';
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
        const filename = `日誌レポート_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
        saveAs(blob, filename);
    }
    /**
     * 日誌データをExcelファイルとして出力
     */
    static async generateExcelReport(logs, users, staff, options = {}) {
        const workbook = XLSX.utils.book_new();
        // メインデータシート
        const mainData = logs.map(log => {
            const user = users.find(u => u.id === log.user_id);
            const staffMember = staff.find(s => s.id === log.staff_id);
            return {
                '記録日': log.record_date,
                '利用者名': user?.name || '',
                '利用者イニシャル': user?.initials || '',
                '記録者': staffMember?.name || '',
                '体温': log.vitals?.temperature || '',
                '脈拍': log.vitals?.pulse || '',
                'SpO2': log.vitals?.spO2 || '',
                '血圧上': log.vitals?.bloodPressure.systolic || '',
                '血圧下': log.vitals?.bloodPressure.diastolic || '',
                '食事形態': log.intake?.meal_form || '',
                '食事量': log.intake?.meal_amount || '',
                '水分量': log.intake?.amount_ml || '',
                '食事備考': log.intake?.notes || '',
                'ブリストルスケール': log.excretion?.bristol_scale || '',
                '排泄備考': log.excretion?.notes || '',
                '睡眠時間(分)': log.sleep?.duration_minutes || '',
                '睡眠の様子': log.sleep?.status || '',
                '睡眠備考': log.sleep?.notes || '',
                '発作種類': log.seizures?.[0]?.type || '',
                '発作持続時間(秒)': log.seizures?.[0]?.duration_sec || '',
                '発作備考': log.seizures?.[0]?.notes || '',
                '活動参加': log.activity?.participation?.join(', ') || '',
                '表情・気分': log.activity?.mood || '',
                '活動備考': log.activity?.notes || '',
                '医療ケア': log.care_provided?.provided_care?.join(', ') || '',
                '特記事項カテゴリー': log.special_notes?.[0]?.category || '',
                '特記事項詳細': log.special_notes?.[0]?.details || ''
            };
        });
        const mainSheet = XLSX.utils.json_to_sheet(mainData);
        XLSX.utils.book_append_sheet(workbook, mainSheet, '日誌データ');
        // サマリーシート
        const summaryData = [
            { '項目': '総記録数', '値': logs.length },
            { '項目': '対象利用者数', '値': new Set(logs.map(log => log.user_id)).size },
            { '項目': '記録期間', '値': options.dateRange ? `${options.dateRange.start} ～ ${options.dateRange.end}` : '全期間' },
            { '項目': '生成日時', '値': format(new Date(), 'yyyy年MM月dd日 HH:mm', { locale: ja }) }
        ];
        const summarySheet = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'サマリー');
        // Excelファイルをダウンロード
        const filename = `日誌レポート_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
        XLSX.writeFile(workbook, filename);
    }
}
