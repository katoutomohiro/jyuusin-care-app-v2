import React, { FC } from 'react';

interface ButtonsRowProps {
  disabled: boolean;
  onPdf: () => void;
  onExcel: () => void;
}

export const ButtonsRow: FC<ButtonsRowProps> = ({ disabled, onPdf, onExcel }) => (
  <div className="flex gap-2 my-4">
    <button 
      onClick={onPdf} 
      disabled={disabled}
      className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-40 hover:bg-green-700 disabled:hover:bg-green-600 transition-colors"
    >
      📄 A4印刷日誌プレビュー
    </button>
    <button 
      onClick={onExcel} 
      disabled={disabled}
      className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-40 hover:bg-blue-700 disabled:hover:bg-blue-600 transition-colors"
    >
      📊 Excel ダウンロード
    </button>
  </div>
);

export default ButtonsRow;
