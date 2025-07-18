import { DailyLog, User } from '../types';

export interface ReportData {
  user: User;
  logs: DailyLog[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface ReportOptions {
  includeVitalSigns?: boolean;
  includeIntake?: boolean;
  includeExcretion?: boolean;
  includeSleep?: boolean;
  includeSeizures?: boolean;
  includeActivities?: boolean;
  includeCare?: boolean;
  includeNotes?: boolean;
}

export class ReportService {
  /**
   * 日誌データをCSV形式でエクスポート
   */
  static async exportToCSV(data: ReportData, options: ReportOptions = {}): Promise<string> {
    const headers = ['日付', '利用者名'];
    
    if (options.includeVitalSigns) {
      headers.push('血圧', '脈拍', '体温', '酸素飽和度');
    }
    if (options.includeIntake) {
      headers.push('水分摂取', '食事摂取', 'サプリメント');
    }
    if (options.includeExcretion) {
      headers.push('排尿', '排便', '排泄回数');
    }
    if (options.includeSleep) {
      headers.push('就寝時間', '起床時間', '睡眠の質');
    }
    if (options.includeSeizures) {
      headers.push('発作の有無', '発作時間', '持続時間', '種類', '重症度');
    }
    if (options.includeActivities) {
      headers.push('活動内容', '気分', '社会的交流');
    }
    if (options.includeCare) {
      headers.push('ケア内容', '投薬', '緊急対応');
    }
    if (options.includeNotes) {
      headers.push('特記事項');
    }

    const csvContent = [
      headers.join(','),
      ...data.logs.map(log => {
        const row = [
          new Date(log.date).toLocaleDateString('ja-JP'),
          data.user.name
        ];

        if (options.includeVitalSigns) {
          row.push(
            log.vitalSigns?.bloodPressure || '',
            log.vitalSigns?.pulse || '',
            log.vitalSigns?.temperature || '',
            log.vitalSigns?.oxygenSaturation || ''
          );
        }
        if (options.includeIntake) {
          row.push(
            log.intake?.water || '',
            log.intake?.food || '',
            log.intake?.supplements || ''
          );
        }
        if (options.includeExcretion) {
          row.push(
            log.excretion?.urine || '',
            log.excretion?.stool || '',
            log.excretion?.frequency || ''
          );
        }
        if (options.includeSleep) {
          row.push(
            log.sleep?.sleepTime || '',
            log.sleep?.wakeTime || '',
            log.sleep?.quality || ''
          );
        }
        if (options.includeSeizures) {
          row.push(
            log.seizure?.occurred ? 'あり' : 'なし',
            log.seizure?.time || '',
            log.seizure?.duration || '',
            log.seizure?.type || '',
            log.seizure?.severity || ''
          );
        }
        if (options.includeActivities) {
          row.push(
            (log.activities?.activities || []).join(';'),
            log.activities?.mood || '',
            log.activities?.socialInteraction || ''
          );
        }
        if (options.includeCare) {
          row.push(
            (log.care?.careType || []).join(';'),
            log.care?.medication || '',
            log.care?.emergency ? 'あり' : 'なし'
          );
        }
        if (options.includeNotes) {
          row.push(log.specialNotes?.notes || '');
        }

        return row.map(cell => `"${cell}"`).join(',');
      })
    ].join('\n');

    return csvContent;
  }

  /**
   * 日誌データをPDF形式でエクスポート
   */
  static async exportToPDF(data: ReportData, options: ReportOptions = {}): Promise<Blob> {
    // 簡易的なPDF生成（実際の実装ではjsPDFなどのライブラリを使用）
    const content = this.generatePDFContent(data, options);
    
    // 実際のPDF生成は別途実装が必要
    // ここではダミーのBlobを返す
    return new Blob([content], { type: 'application/pdf' });
  }

  /**
   * サマリーレポートを生成
   */
  static generateSummary(data: ReportData): any {
    const summary = {
      totalDays: data.logs.length,
      vitalSigns: {
        averagePulse: 0,
        averageTemperature: 0,
        bloodPressureRange: { min: '', max: '' }
      },
      seizures: {
        total: 0,
        types: {} as Record<string, number>
      },
      activities: {
        mostCommon: [] as string[],
        moodTrend: {} as Record<string, number>
      }
    };

    // 統計計算
    let totalPulse = 0;
    let totalTemperature = 0;
    let pulseCount = 0;
    let tempCount = 0;

    data.logs.forEach(log => {
      // バイタルサイン統計
      if (log.vitalSigns?.pulse) {
        const pulse = parseFloat(log.vitalSigns.pulse);
        if (!isNaN(pulse)) {
          totalPulse += pulse;
          pulseCount++;
        }
      }
      if (log.vitalSigns?.temperature) {
        const temp = parseFloat(log.vitalSigns.temperature);
        if (!isNaN(temp)) {
          totalTemperature += temp;
          tempCount++;
        }
      }

      // 発作統計
      if (log.seizure?.occurred) {
        summary.seizures.total++;
        const type = log.seizure.type || '不明';
        summary.seizures.types[type] = (summary.seizures.types[type] || 0) + 1;
      }

      // 活動統計
      if (log.activities?.activities) {
        log.activities.activities.forEach(activity => {
          // 活動頻度の計算（簡易版）
        });
      }
      if (log.activities?.mood) {
        summary.activities.moodTrend[log.activities.mood] = 
          (summary.activities.moodTrend[log.activities.mood] || 0) + 1;
      }
    });

    if (pulseCount > 0) {
      summary.vitalSigns.averagePulse = Math.round(totalPulse / pulseCount);
    }
    if (tempCount > 0) {
      summary.vitalSigns.averageTemperature = Math.round((totalTemperature / tempCount) * 10) / 10;
    }

    return summary;
  }

  private static generatePDFContent(data: ReportData, options: ReportOptions): string {
    // PDFコンテンツ生成のロジック
    return `PDF content for ${data.user.name}`;
  }
} 