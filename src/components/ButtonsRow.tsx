import React, { FC } from 'react';

interface ButtonsRowProps {
  disabled?: boolean;
  onPdf: () => void;
  onExcel?: () => void; // オプショナルに変更
  onAllUsersPdf?: () => void; // 全員分PDF生成用
  dailyLog?: any;
  logsReady?: boolean;
  showExcel?: boolean; // Excel表示制御用プロパティ
  showAllUsers?: boolean; // 全員分PDF表示制御用
  todayLogsCount?: number; // 今日のログ数
}

export const ButtonsRow: FC<ButtonsRowProps> = ({ 
  disabled, 
  onPdf, 
  onExcel, 
  onAllUsersPdf,
  dailyLog, 
  logsReady = true,
  showExcel = false, // デフォルトでExcelボタンを非表示
  showAllUsers = false, // デフォルトで全員分PDFボタンを非表示
  todayLogsCount = 0
}) => {
  // シンプルな判定: ログが準備完了 && 1件以上のログが存在
  const isDisabled = disabled || !(logsReady && (todayLogsCount > 0 || (dailyLog && (
    dailyLog.vitals ||
    (dailyLog.hydration && dailyLog.hydration.length > 0) ||
    (dailyLog.excretion && dailyLog.excretion.length > 0) ||
    (dailyLog.seizure && dailyLog.seizure.length > 0) ||
    (dailyLog.activity && dailyLog.activity.length > 0) ||
    (dailyLog.care && dailyLog.care.length > 0)
  ))));
  
  return (
    <div className="flex gap-2 my-4 w-full">
      <button 
        onClick={onPdf} 
        disabled={isDisabled}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-40 hover:bg-green-700 disabled:hover:bg-green-600 transition-colors min-w-[200px]"
      >
        📄 A4印刷日誌プレビュー
      </button>
      
      {/* 全員分PDFボタンを条件付きで表示 */}
      {showAllUsers && onAllUsersPdf && (
        <button 
          onClick={onAllUsersPdf} 
          disabled={disabled || !logsReady}
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-40 hover:bg-purple-700 disabled:hover:bg-purple-600 transition-colors min-w-[180px]"
        >
          👥 全員分印刷
        </button>
      )}
      
      {/* Excelボタンを条件付きで表示 */}
      {showExcel && onExcel && (
        <button 
          onClick={onExcel} 
          disabled={isDisabled}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-40 hover:bg-blue-700 disabled:hover:bg-blue-600 transition-colors min-w-[150px]"
        >
          📊 Excel ダウンロード
        </button>
      )}
    </div>
  );
};

export default ButtonsRow;
