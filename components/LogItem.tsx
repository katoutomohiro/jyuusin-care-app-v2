import React from 'react';
import { DailyLog, User } from '../types';
import { Calendar, Clock, User as UserIcon, Edit, Trash2, Eye } from 'lucide-react';

interface LogItemProps {
  log: DailyLog;
  user: User;
  onEdit: (log: DailyLog) => void;
  onDelete: (logId: string) => void;
  onView: (log: DailyLog) => void;
}

const LogItem: React.FC<LogItemProps> = ({ log, user, onEdit, onDelete, onView }) => {
  const getVitalSummary = () => {
    const vitals = log.vitals;
    if (!vitals) return '記録なし';
    
    const temp = vitals.temperature ? `${vitals.temperature}°C` : '';
    const pulse = vitals.pulse ? `${vitals.pulse}回/分` : '';
    const spO2 = vitals.spO2 ? `${vitals.spO2}%` : '';
    
    return [temp, pulse, spO2].filter(Boolean).join(' / ') || '記録なし';
  };

  const getIntakeSummary = () => {
    const intake = log.intake;
    if (!intake) return '記録なし';

    const mealAmount = intake.meal_amount || '';
    const waterAmount = intake.amount_ml ? `${intake.amount_ml}ml` : '';

    return [mealAmount, waterAmount].filter(Boolean).join(' / ') || '記録なし';
  };

  const getExcretionSummary = () => {
    const excretion = log.excretion;
    if (!excretion) return '記録なし';

    const bristolScale = excretion.bristol_scale ? `スケール: ${excretion.bristol_scale}` : '';
    const notes = excretion.notes || '';

    return [bristolScale, notes].filter(Boolean).join(' / ') || '記録なし';
  };

  const getSleepSummary = () => {
    const sleep = log.sleep;
    if (!sleep) return '記録なし';

    const duration = sleep.duration_minutes ? `${sleep.duration_minutes}分` : '';
    const notes = sleep.notes || '';

    return [duration, notes].filter(Boolean).join(' / ') || '記録なし';
  };

  const getSeizureSummary = () => {
    const seizures = log.seizures;
    if (!seizures || seizures.length === 0) return '発作なし';

    const types = seizures.map(s => s.type).join(', ');
    const durations = seizures.map(s => `${s.duration_sec}秒`).join(', ');

    return [`タイプ: ${types}`, `時間: ${durations}`].filter(Boolean).join(' / ') || '発作あり';
  };

  const getActivitySummary = () => {
    const activity = log.activity;
    if (!activity) return '記録なし';

    const participation = activity.participation?.join(', ') || '';
    const mood = activity.mood || '';

    return [participation, mood].filter(Boolean).join(' / ') || '記録なし';
  };

  const getCareSummary = () => {
    const care = log.care_provided;
    if (!care || !Array.isArray(care)) return '記録なし';

    return care.join(' / ') || '記録なし';
  };

  const getSpecialNotesSummary = () => {
    const notes = log.special_notes;
    if (!notes || notes.length === 0) return '特記事項なし';

    const details = notes.map(note => note.details).join(', ');

    return details || '特記事項なし';
  };

  const hasAbnormalVitals = () => {
    const vitals = log.vitals;
    if (!vitals) return false;

    const temp = vitals.temperature || 0;
    const pulse = vitals.pulse || 0;
    const spO2 = vitals.spO2 || 0;

    return (temp > 0 && (temp < 35 || temp > 42)) ||
           (pulse > 0 && (pulse < 50 || pulse > 150)) ||
           (spO2 > 0 && spO2 < 90);
  };

  const hasSeizures = () => {
    const seizures = log.seizures;
    if (!seizures || seizures.length === 0) return false;

    return seizures.some(s => s.type === 'seizure');
  };

  const hasUrgentNotes = () => {
    const notes = log.special_notes;
    if (!notes || notes.length === 0) return false;

    return notes.some(note => note.details.includes('urgent') || note.details.includes('high'));
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '日付不明';

    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">{formatDate(log.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <UserIcon className="w-4 h-4" />
            <span className="font-medium">{user.name}</span>
          </div>
        </div>
        
        {/* 警告アイコン */}
        <div className="flex items-center gap-2">
          {hasAbnormalVitals() && (
            <div className="flex items-center gap-1 text-red-600">
              <span className="text-sm">⚠️ 異常値</span>
            </div>
          )}
          {hasSeizures() && (
            <div className="flex items-center gap-1 text-orange-600">
              <span className="text-sm">⚡ 発作</span>
            </div>
          )}
          {hasUrgentNotes() && (
            <div className="flex items-center gap-1 text-red-600">
              <span className="text-sm">🔴 重要</span>
            </div>
          )}
        </div>
      </div>

      {/* 記録内容 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-700">バイタル</h4>
          <p className="text-sm text-gray-600">{getVitalSummary()}</p>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-700">食事・水分</h4>
          <p className="text-sm text-gray-600">{getIntakeSummary()}</p>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-700">排泄</h4>
          <p className="text-sm text-gray-600">{getExcretionSummary()}</p>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-700">睡眠</h4>
          <p className="text-sm text-gray-600">{getSleepSummary()}</p>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-700">発作</h4>
          <p className="text-sm text-gray-600">{getSeizureSummary()}</p>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-700">活動</h4>
          <p className="text-sm text-gray-600">{getActivitySummary()}</p>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-700">ケア</h4>
          <p className="text-sm text-gray-600">{getCareSummary()}</p>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-700">特記事項</h4>
          <p className="text-sm text-gray-600">{getSpecialNotesSummary()}</p>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onView(log)}
          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
        >
          <Eye className="w-4 h-4" />
          詳細
        </button>
        
        <button
          onClick={() => onEdit(log)}
          className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
        >
          <Edit className="w-4 h-4" />
          編集
        </button>
        
        <button
          onClick={() => onDelete(log.id)}
          className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          削除
        </button>
      </div>
    </div>
  );
};

export default LogItem;