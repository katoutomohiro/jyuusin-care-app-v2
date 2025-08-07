import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { PDFViewer } from '@react-pdf/renderer';
import DailyLogPdfDoc from './DailyLogPdfDoc';
import { DailyLog, User } from '../../types';

type Props = {
  open: boolean;
  onClose: () => void;
  /* 日誌１日分のデータ構造（呼び出し側で既に validate 済み） */
  dailyLog: DailyLog | null;
  user: User;
};

const PdfPreviewModal: React.FC<Props> = ({ open, onClose, dailyLog, user }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (open) setReady(true);
    else      setReady(false);
  }, [open]);

  if (!open || !dailyLog || !ready) return null;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-6xl bg-white rounded-lg shadow-xl w-full h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-lg font-semibold">
              📄 PDF プレビュー - {user.name} ({dailyLog.date || '日付不明'})
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* PDF Viewer */}
          <div className="h-full p-4">
            <PDFViewer 
              style={{ 
                width: '100%', 
                height: '100%',
                border: 'none'
              }}
              showToolbar={true}
            >
              <DailyLogPdfDoc 
                dailyLogItems={dailyLog} 
                user={user}
              />
            </PDFViewer>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PdfPreviewModal;
