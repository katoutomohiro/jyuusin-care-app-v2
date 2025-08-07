import React, { FC } from 'react';

interface ButtonsRowProps {
  disabled?: boolean;
  onPdf: () => void;
  onExcel?: () => void; // オプショナルに変更
  dailyLog?: any;
  logsReady?: boolean;
  showExcel?: boolean; // Excel表示制御用プロパティ
  todayLogsCount?: number; // 今日のログ数
}

export const ButtonsRow: FC<ButtonsRowProps> = ({ 
  disabled, 
  onPdf, 
  onExcel, 
  dailyLog, 
  logsReady = true,
  showExcel = false, // デフォルトでExcelボタンを非表示
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
