import React from 'react';
import { Calendar, Clock, User, Edit, Trash2, Eye } from 'lucide-react';
import { DailyLog, User, MedicalCare } from '../../types';

interface LogItemProps {
  log: DailyLog;
  user: UserType;
  onEdit?: (log: DailyLog) => void;
  onDelete?: (logId: string) => void;
  onView?: (log: DailyLog) => void;
}

const LogItem: React.FC<LogItemProps> = ({ log, user, onEdit, onDelete, onView }) => {
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    return time;
  };

  const getStatusColor = (log: DailyLog) => {
    // 発作がある場合は赤
    if (log.seizures && log.seizures.length > 0) return 'border-l-red-500';
    // 緊急対応がある場合はオレンジ
    if (log.care_provided?.provided_care?.includes(MedicalCare.EMERGENCY)) return 'border-l-orange-500';
    // 特記事項が重要の場合は黄色
    if (log.special_notes && log.special_notes.length > 0) return 'border-l-yellow-500';
    // 通常は青
    return 'border-l-blue-500';
  };

  const getStatusText = (log: DailyLog) => {
    if (log.seizures && log.seizures.length > 0) return '発作あり';
    if (log.care_provided?.provided_care?.includes(MedicalCare.EMERGENCY)) return '緊急対応';
    if (log.special_notes && log.special_notes.length > 0) return '重要事項';
    return '通常';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 border-l-4 ${getStatusColor(log)}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-900">{formatDate(log.date)}</span>
          <Clock className="w-4 h-4 text-gray-500 ml-2" />
          <span className="text-sm text-gray-600">{formatTime(log.record_date)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`px-2 py-1 text-xs rounded-full ${
            log.seizures && log.seizures.length > 0 
              ? 'bg-red-100 text-red-800' 
              : log.care_provided?.provided_care?.includes(MedicalCare.EMERGENCY)
                ? 'bg-orange-100 text-orange-800'
                : log.special_notes && log.special_notes.length > 0
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
          }`}>
            {getStatusText(log)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <User className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">{user.name || '-'}</span>
      </div>

      {/* サマリー情報 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {log.vitals && (
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">血圧</div>
            <div className="font-medium">{log.vitals.bloodPressure ? `${log.vitals.bloodPressure.systolic}/${log.vitals.bloodPressure.diastolic}` : '-'}</div>
          </div>
        )}
        {log.vitals && (
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">脈拍</div>
            <div className="font-medium">{log.vitals.pulse || '-'}</div>
          </div>
        )}
        {log.intake && (
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">食事</div>
            <div className="font-medium">{log.intake.meal_amount || '-'}</div>
          </div>
        )}
        {log.excretion && (
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">排便</div>
            <div className="font-medium">{log.excretion.bristol_scale || '-'}</div>
          </div>
        )}
      </div>

      {/* 特記事項のプレビュー */}
      {log.special_notes && log.special_notes.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600 line-clamp-2">
            {log.special_notes[0]?.details || ''}
          </div>
        </div>
      )}

      {/* アクションボタン */}
      <div className="flex items-center justify-end gap-2">
        {onView && (
          <button
            onClick={() => onView(log)}
            className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Eye className="w-4 h-4" />
            詳細
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(log)}
            className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
          >
            <Edit className="w-4 h-4" />
            編集
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(log.id)}
            className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            削除
          </button>
        )}
      </div>
    </div>
  );
};

export default LogItem; 