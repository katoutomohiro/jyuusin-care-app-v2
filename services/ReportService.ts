import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { DailyLog, User, Staff, safeParseFloat } from '../types';
import { format } from 'date-fns';

// 拡張した autoTable 型定義
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ReportOptions {
  title: string;
  includeVitals?: boolean;
  includeIntake?: boolean;
  includeExcretion?: boolean;
  includeSleep?: boolean;
  includeSeizures?: boolean;
  includeActivity?: boolean;
  includeCare?: boolean;
  includeSpecialNotes?: boolean;
}

export interface ReportData {
  userId: string;
  userName: string;
  period: {
    start: string;
    end: string;
  };
  vitals: {
    averageTemperature: number;
    averagePulse: number;
    averageSpO2: number;
    abnormalCount: number;
  };
  intake: {
    averageMealAmount: string;
    averageWaterAmount: number;
    appetiteTrend: string;
  };
  excretion: {
    averageUrinationCount: number;
    averageDefecationCount: number;
    incontinenceRate: number;
  };
  sleep: {
    averageHours: number;
    averageQuality: string;
    wakeCount: number;
  };
  seizures: {
    totalCount: number;
    averageDuration: string;
    types: string[];
  };
  activity: {
    rehabilitationSessions: number;
    playSessions: number;
    outingCount: number;
    socialInteractions: number;
  };
  care: {
    positioningFrequency: string;
    hygieneSessions: number;
    medicationCompliance: string;
    safetyIncidents: number;
  };
  specialNotes: {
    totalCount: number;
    urgentCount: number;
    categories: string[];
  };
}

export class ReportService {
  private static FONT_NAME = 'ipag';

  private static async loadFont(pdf: jsPDF) {
    // ここではフォントの読み込みを簡略化。実際にはフォントファイルをプロジェクトに含める
    // この例では 'ipag.ttf' が public/fonts にあると仮定
    try {
        const font = await fetch('/fonts/ipag.ttf').then(res => res.arrayBuffer());
        const fontB64 = btoa(new Uint8Array(font).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        pdf.addFileToVFS('ipag.ttf', fontB64);
        pdf.addFont('ipag.ttf', this.FONT_NAME, 'normal');
        pdf.setFont(this.FONT_NAME);
    } catch(e) {
        console.error("Font loading failed. Japanese characters may not be displayed.", e);
    }
  }

  private static generateHeaders(options: ReportOptions): string[] {
    const headers = ['日付', '記録者', '利用者'];
    if (options.includeVitals) headers.push('体温', '脈拍', 'SpO2', '血圧');
    if (options.includeIntake) headers.push('食事/水分');
    if (options.includeExcretion) headers.push('排泄');
    if (options.includeSleep) headers.push('睡眠');
    if (options.includeSeizures) headers.push('発作');
    if (options.includeActivity) headers.push('活動');
    if (options.includeCare) headers.push('医療ケア');
    if (options.includeSpecialNotes) headers.push('特記事項');
    return headers;
  }

  private static generateRowData(log: DailyLog, options: ReportOptions, users: User[], staff: Staff[]): any[] {
    const user = users.find(u => u.id === log.userId || u.id === log.user_id);
    const staffMember = staff.find(s => s.id === log.staff_id);

    const row: any[] = [
      log.record_date,
      staffMember?.name || '不明',
      user?.name || '不明',
    ];

    if (options.includeVitals) {
        row.push(log.vitals?.temperature || '', log.vitals?.pulse || '', log.vitals?.spO2 || '', `${log.vitals?.bloodPressure?.systolic || ''}/${log.vitals?.bloodPressure?.diastolic || ''}`);
    }
    if (options.includeIntake) {
        row.push(`食事: ${log.intake?.meal_amount}, 水分: ${log.intake?.amount_ml}ml`);
    }
    if (options.includeExcretion) {
        row.push(`形状: ${log.excretion?.bristol_scale}, 様子: ${log.excretion?.status?.join(', ')}`);
    }
    if (options.includeSleep) {
        row.push(`${(log.sleep?.duration_minutes || 0) / 60}時間`);
    }
    if (options.includeSeizures) {
        row.push(log.seizures?.map(s => s.type).join(', ') || 'なし');
    }
    if (options.includeActivity) {
        row.push(log.activity?.mood || '');
    }
    if (options.includeCare) {
        row.push(log.care_provided?.provided_care.join(', ') || 'なし');
    }
    if (options.includeSpecialNotes) {
        row.push(log.special_notes?.map(n => `${n.category}: ${n.details}`).join('\n') || '');
    }
    return row;
  }
  
  public static async generatePDFReport(logs: DailyLog[], users: User[], staff: Staff[], options: ReportOptions) {
    const doc = new jsPDF();
    await this.loadFont(doc);

    doc.text(options.title, 14, 15);
    doc.setFontSize(10);
    doc.text(`出力日: ${format(new Date(), 'yyyy/MM/dd')}`, 14, 22);

    const headers = this.generateHeaders(options);
    const body = logs.map(log => this.generateRowData(log, options, users, staff));
    
    doc.autoTable({
      startY: 30,
      head: [headers],
      body: body,
      styles: { font: this.FONT_NAME, fontSize: 8 },
      headStyles: { fontStyle: 'bold' }
    });

    doc.save(`${options.title}_${format(new Date(), 'yyyyMMdd')}.pdf`);
  }

  public static async generateCSVReport(logs: DailyLog[], users: User[], staff: Staff[], options: ReportOptions) {
    const headers = this.generateHeaders(options);
    const body = logs.map(log => this.generateRowData(log, options, users, staff).map(cell => `"${String(cell || '').replace(/"/g, '""')}"`));

    const csvContent = [headers.join(','), ...body.map(row => row.join(','))].join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${options.title}_${format(new Date(), 'yyyyMMdd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  public static async generateExcelReport(logs: DailyLog[], users: User[], staff: Staff[], options: ReportOptions) {
      const headers = this.generateHeaders(options);
      const body = logs.map(log => this.generateRowData(log, options, users, staff));

      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...body]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '日誌レポート');

      XLSX.writeFile(workbook, `${options.title}_${format(new Date(), 'yyyyMMdd')}.xlsx`);
  }

  /**
   * 指定期間の日誌データを集計してレポートを生成
   */
  static async generateReport(
    userId: string,
    startDate: string,
    endDate: string,
    logs: DailyLog[]
  ): Promise<ReportData> {
    const userLogs = logs.filter(log => log.userId === userId);
    const periodLogs = userLogs.filter(log => 
      log.date >= startDate && log.date <= endDate
    );

    if (periodLogs.length === 0) {
      throw new Error('指定期間のデータが見つかりません');
    }

    // バイタルサイン集計
    const vitals = this.aggregateVitals(periodLogs);
    
    // 食事・水分摂取集計
    const intake = this.aggregateIntake(periodLogs);
    
    // 排泄記録集計
    const excretion = this.aggregateExcretion(periodLogs);
    
    // 睡眠記録集計
    const sleep = this.aggregateSleep(periodLogs);
    
    // 発作記録集計
    const seizures = this.aggregateSeizures(periodLogs);
    
    // 活動記録集計
    const activity = this.aggregateActivity(periodLogs);
    
    // ケア記録集計
    const care = this.aggregateCare(periodLogs);
    
    // 特記事項集計
    const specialNotes = this.aggregateSpecialNotes(periodLogs);

    return {
      userId,
      userName: periodLogs[0]?.userName || '不明',
      period: { start: startDate, end: endDate },
      vitals,
      intake,
      excretion,
      sleep,
      seizures,
      activity,
      care,
      specialNotes
    };
  }

  /**
   * バイタルサイン集計
   */
  private static aggregateVitals(logs: DailyLog[]) {
    const temperatures = logs
      .map(log => safeParseFloat(log.vitals?.temperature))
      .filter(temp => temp > 0);
    
    const pulses = logs
      .map(log => safeParseFloat(log.vitals?.pulse))
      .filter(pulse => pulse > 0);
    
    const spO2s = logs
      .map(log => safeParseFloat(log.vitals?.spO2))
      .filter(spO2 => spO2 > 0);

    const abnormalCount = logs.filter(log => {
      const temp = safeParseFloat(log.vitals?.temperature);
      const pulse = safeParseFloat(log.vitals?.pulse);
      const spO2 = safeParseFloat(log.vitals?.spO2);
      
      return (temp > 0 && (temp < 35 || temp > 42)) ||
             (pulse > 0 && (pulse < 50 || pulse > 150)) ||
             (spO2 > 0 && spO2 < 90);
    }).length;

    return {
      averageTemperature: temperatures.length > 0 ? 
        temperatures.reduce((a, b) => a + b, 0) / temperatures.length : 0,
      averagePulse: pulses.length > 0 ? 
        pulses.reduce((a, b) => a + b, 0) / pulses.length : 0,
      averageSpO2: spO2s.length > 0 ? 
        spO2s.reduce((a, b) => a + b, 0) / spO2s.length : 0,
      abnormalCount
    };
  }

  /**
   * 食事・水分摂取集計
   */
  private static aggregateIntake(logs: DailyLog[]) {
    const mealAmounts = logs
      .map(log => log.intake?.mealAmount)
      .filter(amount => amount && amount !== 'none');
    
    const waterAmounts = logs
      .map(log => safeParseFloat(log.intake?.waterAmount))
      .filter(amount => amount > 0);

    const appetiteLevels = logs
      .map(log => log.intake?.appetite)
      .filter(appetite => appetite && appetite !== 'none');

    const appetiteTrend = appetiteLevels.length > 0 ? 
      this.calculateAppetiteTrend(appetiteLevels) : 'データ不足';

    return {
      averageMealAmount: mealAmounts.length > 0 ? 
        this.getMostFrequent(mealAmounts) : 'データなし',
      averageWaterAmount: waterAmounts.length > 0 ? 
        waterAmounts.reduce((a, b) => a + b, 0) / waterAmounts.length : 0,
      appetiteTrend
    };
  }

  /**
   * 排泄記録集計
   */
  private static aggregateExcretion(logs: DailyLog[]) {
    const urinationCounts = logs
      .map(log => safeParseFloat(log.excretion?.urination?.count))
      .filter(count => count >= 0);

    const defecationCounts = logs
      .map(log => safeParseFloat(log.excretion?.defecation?.count))
      .filter(count => count >= 0);

    const incontinenceCount = logs
      .filter(log => log.excretion?.incontinence && log.excretion.incontinence !== 'none')
      .length;

    return {
      averageUrinationCount: urinationCounts.length > 0 ? 
        urinationCounts.reduce((a, b) => a + b, 0) / urinationCounts.length : 0,
      averageDefecationCount: defecationCounts.length > 0 ? 
        defecationCounts.reduce((a, b) => a + b, 0) / defecationCounts.length : 0,
      incontinenceRate: logs.length > 0 ? (incontinenceCount / logs.length) * 100 : 0
    };
  }

  /**
   * 睡眠記録集計
   */
  private static aggregateSleep(logs: DailyLog[]) {
    const sleepHours = logs
      .map(log => safeParseFloat(log.sleep?.totalHours))
      .filter(hours => hours > 0);

    const qualities = logs
      .map(log => log.sleep?.quality)
      .filter(quality => quality && quality !== 'none');

    const wakeCounts = logs
      .map(log => safeParseFloat(log.sleep?.wakeCount))
      .filter(count => count >= 0);

    return {
      averageHours: sleepHours.length > 0 ? 
        sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length : 0,
      averageQuality: qualities.length > 0 ? 
        this.getMostFrequent(qualities) : 'データなし',
      wakeCount: wakeCounts.length > 0 ? 
        wakeCounts.reduce((a, b) => a + b, 0) / wakeCounts.length : 0
    };
  }

  /**
   * 発作記録集計
   */
  private static aggregateSeizures(logs: DailyLog[]) {
    const seizureLogs = logs.filter(log => 
      log.seizures && Array.isArray(log.seizures) && log.seizures.length > 0 && log.seizures[0]?.hasSeizure === 'yes'
    );

    const durations = seizureLogs
      .map(log => log.seizures && Array.isArray(log.seizures) && log.seizures[0]?.duration)
      .filter(duration => duration !== undefined && duration !== null);

    const types = seizureLogs
      .map(log => log.seizures && Array.isArray(log.seizures) && log.seizures[0]?.seizureType)
      .filter(type => type && type !== 'none');

    return {
      totalCount: seizureLogs.length,
      averageDuration: durations.length > 0 ? '平均時間データあり' : 'データなし',
      types: [...new Set(types)]
    };
  }

  /**
   * 活動記録集計
   */
  private static aggregateActivity(logs: DailyLog[]) {
    const rehabilitationSessions = logs.filter(log => 
      log.activity?.rehabilitation?.type && log.activity.rehabilitation.type !== 'none'
    ).length;

    const playSessions = logs.filter(log => 
      log.activity?.play?.type && log.activity.play.type !== 'none'
    ).length;

    const outingCount = logs.filter(log => 
      log.activity?.outing?.destination && log.activity.outing.destination !== 'none'
    ).length;

    const socialInteractions = logs.filter(log => 
      log.activity?.social?.type && log.activity.social.type !== 'none'
    ).length;

    return {
      rehabilitationSessions,
      playSessions,
      outingCount,
      socialInteractions
    };
  }

  /**
   * ケア記録集計
   */
  private static aggregateCare(logs: DailyLog[]) {
    const positioningFrequency = logs
      .map(log => log.care?.positioning?.frequency)
      .filter(freq => freq && freq !== 'none');

    const hygieneSessions = logs.filter(log => 
      log.care?.hygiene?.type && log.care.hygiene.type !== 'none'
    ).length;

    const medicationCompliance = logs
      .map(log => log.care?.medication?.compliance)
      .filter(compliance => compliance && compliance !== 'none');

    const safetyIncidents = logs.filter(log => 
      log.care?.safety?.incidents && log.care.safety.incidents.trim() !== ''
    ).length;

    return {
      positioningFrequency: positioningFrequency.length > 0 ? 
        this.getMostFrequent(positioningFrequency) : 'データなし',
      hygieneSessions,
      medicationCompliance: medicationCompliance.length > 0 ? 
        this.getMostFrequent(medicationCompliance) : 'データなし',
      safetyIncidents
    };
  }

  /**
   * 特記事項集計
   */
  private static aggregateSpecialNotes(logs: DailyLog[]) {
    const notes = logs.filter(log => 
      log.special_notes && Array.isArray(log.special_notes) && log.special_notes.length > 0 && 
      log.special_notes[0]?.content && log.special_notes[0].content.trim() !== ''
    );

    const urgentNotes = notes.filter(note => 
      note.special_notes && Array.isArray(note.special_notes) && note.special_notes.length > 0 &&
      (note.special_notes[0]?.importance === 'urgent' || note.special_notes[0]?.importance === 'high')
    );

    const categories = notes
      .map(note => note.special_notes && Array.isArray(note.special_notes) && note.special_notes[0]?.category)
      .filter(category => category && category !== '');

    return {
      totalCount: notes.length,
      urgentCount: urgentNotes.length,
      categories: [...new Set(categories)]
    };
  }

  /**
   * 食欲傾向を計算
   */
  private static calculateAppetiteTrend(levels: string[]): string {
    const levelScores = {
      'none': 0,
      'poor': 1,
      'normal': 2,
      'good': 3,
      'excellent': 4
    };

    const scores = levels.map(level => levelScores[level as keyof typeof levelScores] || 0);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;

    if (average >= 3) return '良好';
    if (average >= 2) return '普通';
    if (average >= 1) return '不振';
    return 'なし';
  }

  /**
   * 最頻値を取得
   */
  private static getMostFrequent(items: string[]): string {
    const frequency: { [key: string]: number } = {};
    items.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1;
    });

    const maxFreq = Math.max(...Object.values(frequency));
    const mostFrequent = Object.keys(frequency).find(key => frequency[key] === maxFreq);
    
    return mostFrequent || 'データなし';
  }

  /**
   * レポートをCSV形式で出力
   */
  static async exportToCSV(reportData: ReportData): Promise<string> {
    const csvRows = [
      ['利用者名', reportData.userName],
      ['期間', `${reportData.period.start} ～ ${reportData.period.end}`],
      [''],
      ['バイタルサイン'],
      ['平均体温', `${reportData.vitals.averageTemperature.toFixed(1)}°C`],
      ['平均脈拍', `${reportData.vitals.averagePulse.toFixed(0)}回/分`],
      ['平均SpO2', `${reportData.vitals.averageSpO2.toFixed(0)}%`],
      ['異常値回数', `${reportData.vitals.abnormalCount}回`],
      [''],
      ['食事・水分摂取'],
      ['平均食事量', reportData.intake.averageMealAmount],
      ['平均水分量', `${reportData.intake.averageWaterAmount.toFixed(0)}ml`],
      ['食欲傾向', reportData.intake.appetiteTrend],
      [''],
      ['排泄記録'],
      ['平均排尿回数', `${reportData.excretion.averageUrinationCount.toFixed(1)}回`],
      ['平均排便回数', `${reportData.excretion.averageDefecationCount.toFixed(1)}回`],
      ['失禁率', `${reportData.excretion.incontinenceRate.toFixed(1)}%`],
      [''],
      ['睡眠記録'],
      ['平均睡眠時間', `${reportData.sleep.averageHours.toFixed(1)}時間`],
      ['平均睡眠の質', reportData.sleep.averageQuality],
      ['平均覚醒回数', `${reportData.sleep.wakeCount.toFixed(1)}回`],
      [''],
      ['発作記録'],
      ['発作回数', `${reportData.seizures.totalCount}回`],
      ['平均持続時間', reportData.seizures.averageDuration],
      ['発作タイプ', reportData.seizures.types.join(', ')],
      [''],
      ['活動記録'],
      ['リハビリセッション', `${reportData.activity.rehabilitationSessions}回`],
      ['遊びセッション', `${reportData.activity.playSessions}回`],
      ['外出回数', `${reportData.activity.outingCount}回`],
      ['交流回数', `${reportData.activity.socialInteractions}回`],
      [''],
      ['ケア記録'],
      ['体位変換頻度', reportData.care.positioningFrequency],
      ['清潔ケア回数', `${reportData.care.hygieneSessions}回`],
      ['服薬状況', reportData.care.medicationCompliance],
      ['安全インシデント', `${reportData.care.safetyIncidents}回`],
      [''],
      ['特記事項'],
      ['総件数', `${reportData.specialNotes.totalCount}件`],
      ['緊急・重要件数', `${reportData.specialNotes.urgentCount}件`],
      ['カテゴリ', reportData.specialNotes.categories.join(', ')]
    ];

    return csvRows.map(row => row.join(',')).join('\n');
  }

  /**
   * レポートをPDF形式で出力（簡易版）
   */
  static async exportToPDF(reportData: ReportData): Promise<Blob> {
    // 簡易的なPDF生成（実際の実装ではjsPDFなどのライブラリを使用）
    const content = `
      重心ケアアプリ - 利用者レポート
      
      利用者名: ${reportData.userName}
      期間: ${reportData.period.start} ～ ${reportData.period.end}
      
      バイタルサイン
      - 平均体温: ${reportData.vitals.averageTemperature.toFixed(1)}°C
      - 平均脈拍: ${reportData.vitals.averagePulse.toFixed(0)}回/分
      - 平均SpO2: ${reportData.vitals.averageSpO2.toFixed(0)}%
      - 異常値回数: ${reportData.vitals.abnormalCount}回
      
      食事・水分摂取
      - 平均食事量: ${reportData.intake.averageMealAmount}
      - 平均水分量: ${reportData.intake.averageWaterAmount.toFixed(0)}ml
      - 食欲傾向: ${reportData.intake.appetiteTrend}
      
      排泄記録
      - 平均排尿回数: ${reportData.excretion.averageUrinationCount.toFixed(1)}回
      - 平均排便回数: ${reportData.excretion.averageDefecationCount.toFixed(1)}回
      - 失禁率: ${reportData.excretion.incontinenceRate.toFixed(1)}%
      
      睡眠記録
      - 平均睡眠時間: ${reportData.sleep.averageHours.toFixed(1)}時間
      - 平均睡眠の質: ${reportData.sleep.averageQuality}
      - 平均覚醒回数: ${reportData.sleep.wakeCount.toFixed(1)}回
      
      発作記録
      - 発作回数: ${reportData.seizures.totalCount}回
      - 平均持続時間: ${reportData.seizures.averageDuration}
      - 発作タイプ: ${reportData.seizures.types.join(', ')}
      
      活動記録
      - リハビリセッション: ${reportData.activity.rehabilitationSessions}回
      - 遊びセッション: ${reportData.activity.playSessions}回
      - 外出回数: ${reportData.activity.outingCount}回
      - 交流回数: ${reportData.activity.socialInteractions}回
      
      ケア記録
      - 体位変換頻度: ${reportData.care.positioningFrequency}
      - 清潔ケア回数: ${reportData.care.hygieneSessions}回
      - 服薬状況: ${reportData.care.medicationCompliance}
      - 安全インシデント: ${reportData.care.safetyIncidents}回
      
      特記事項
      - 総件数: ${reportData.specialNotes.totalCount}件
      - 緊急・重要件数: ${reportData.specialNotes.urgentCount}件
      - カテゴリ: ${reportData.specialNotes.categories.join(', ')}
    `;

    return new Blob([content], { type: 'text/plain' });
  }
} 