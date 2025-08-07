import React, { FC } from 'react';

interface ButtonsRowProps {
  disabled?: boolean;
  onPdf: () => void;
  onExcel: () => void;
  dailyLog?: any;
  logsReady?: boolean;
}

export const ButtonsRow: FC<ButtonsRowProps> = ({ 
  disabled, 
  onPdf, 
  onExcel, 
  dailyLog, 
  logsReady = true 
}) => {
  const isDisabled = disabled || !logsReady || !dailyLog || (dailyLog.items && dailyLog.items.length === 0);
  
  return (
    <div className="flex gap-2 my-4 w-full">
      <button 
        onClick={onPdf} 
        disabled={isDisabled}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-40 hover:bg-green-700 disabled:hover:bg-green-600 transition-colors min-w-[200px]"
      >
        📄 A4印刷日誌プレビュー
      </button>
      <button 
        onClick={onExcel} 
        disabled={isDisabled}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-40 hover:bg-blue-700 disabled:hover:bg-blue-600 transition-colors min-w-[150px]"
      >
        📊 Excel ダウンロード
      </button>
    </div>
  );
};

export default ButtonsRow;
