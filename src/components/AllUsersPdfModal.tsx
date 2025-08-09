import React, { FC } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import EnhancedDailyLogPdfDoc from './pdf/EnhancedDailyLogPdfDoc';
import { useData } from '../contexts/DataContext';

interface AllUsersPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
}

export const AllUsersPdfModal: FC<AllUsersPdfModalProps> = ({ 
  isOpen, 
  onClose, 
  date 
}) => {
  const { users, dailyLogsByUser } = useData();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl">
        {/* ヘッダー */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            全利用者 日中活動記録 - {new Date(date).toLocaleDateString('ja-JP')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="モーダルを閉じる"
          >
            ×
          </button>
        </div>

        {/* PDF プレビュー */}
        <div className="p-4 h-full">
          <PDFViewer 
            className="w-full h-full border rounded"
            showToolbar={true}
          >
            <EnhancedDailyLogPdfDoc 
              users={users}
              date={date}
              dailyLogsByUser={dailyLogsByUser}
              facilityName="重心ケア施設"
            />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};
