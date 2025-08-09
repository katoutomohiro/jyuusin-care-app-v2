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
    // 新たなイベントフィールドもカラム追加
    headers.push('表情・反応', '体位', '皮膚・口腔ケア', '体調・疾患', '咳・誤嚥', '経管栄養', '服薬', '行動', 'コミュニケーション', 'その他');
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
            log.vitals?.bloodPressure ? `${log.vitals.bloodPressure.systolic}/${log.vitals.bloodPressure.diastolic}` : '',
            (log.vitals?.pulse || '').toString(),
            (log.vitals?.temperature || '').toString(),
            (log.vitals?.spO2 || '').toString()
          );
        }
        if (options.includeIntake) {
          row.push(
            (log.intake?.amount_ml || '').toString(),
            log.intake?.meal_form || '',
            log.intake?.methods?.join(';') || ''
          );
        }
        if (options.includeExcretion) {
          row.push(
            log.excretion?.bristol_scale?.toString() || '',
            log.excretion?.status?.join(';') || '',
            log.excretion?.notes || ''
          );
        }
        if (options.includeSleep) {
          row.push(
            (log.sleep?.duration_minutes || '').toString(),
            log.sleep?.status || '',
            log.sleep?.notes || ''
          );
        }
        if (options.includeSeizures) {
          const seizure = log.seizures && log.seizures.length > 0 ? log.seizures[0] : null;
          row.push(
            seizure ? 'あり' : 'なし',
            '', // time情報なし
            seizure?.duration_sec?.toString() || '',
            seizure?.type || '',
            '' // severity情報なし
          );
        }
        // 新たなイベントフィールドも出力
        row.push(
          log.expression ? JSON.stringify(log.expression) : '',
          log.positioning ? JSON.stringify(log.positioning) : '',
          log.skin_oral_care ? JSON.stringify(log.skin_oral_care) : '',
          log.illness ? JSON.stringify(log.illness) : '',
          log.cough_choke ? JSON.stringify(log.cough_choke) : '',
          log.tube_feeding ? JSON.stringify(log.tube_feeding) : '',
          log.medication ? JSON.stringify(log.medication) : '',
          log.behavioral ? JSON.stringify(log.behavioral) : '',
          log.communication ? JSON.stringify(log.communication) : '',
          log.other ? JSON.stringify(log.other) : ''
        );
        if (options.includeActivities) {
          row.push(
            log.activity?.participation?.join(';') || '',
            log.activity?.mood || '',
            log.activity?.notes || ''
          );
        }
        if (options.includeCare) {
          row.push(
            (log.care_provided?.provided_care || []).join(';'),
            '', // medication情報なし
            log.care_provided?.provided_care?.includes('緊急対応' as any) ? 'あり' : 'なし'
          );
        }
        if (options.includeNotes) {
          const firstNote = log.special_notes && log.special_notes.length > 0 ? log.special_notes[0] : null;
          row.push(firstNote?.details || '');
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
      if (log.vitals?.pulse) {
        const pulse = log.vitals.pulse;
        if (pulse && !isNaN(pulse)) {
          totalPulse += pulse;
          pulseCount++;
        }
      }
      if (log.vitals?.temperature) {
        const temp = log.vitals.temperature;
        if (temp && !isNaN(temp)) {
          totalTemperature += temp;
          tempCount++;
        }
      }

      // 発作統計
      if (log.seizures && log.seizures.length > 0) {
        summary.seizures.total++;
        const type = log.seizures[0].type || '不明';
        summary.seizures.types[type] = (summary.seizures.types[type] || 0) + 1;
      }

      // 活動統計
      if (log.activity) {
        // 活動頻度の計算（簡易版）
        if (log.activity.mood) {
          summary.activities.moodTrend[log.activity.mood] = 
            (summary.activities.moodTrend[log.activity.mood] || 0) + 1;
        }
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