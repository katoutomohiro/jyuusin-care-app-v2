import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PDFViewer } from '@react-pdf/renderer';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DailyLogPdfDoc from './DailyLogPdfDoc';
import { DailyLog, User } from '../../types';

interface PdfPreviewModalProps {
  open: boolean;
  onClose: () => void;
  dailyLog: DailyLog;
  user: User;
}

const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({ 
  open, 
  onClose, 
  dailyLog, 
  user
}) => {
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @react-pdf/renderer用の設定
      if ((window as any).pdfjsLib?.GlobalWorkerOptions) {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf/pdf.worker.min.js';
      }
      
      // react-pdf用の設定
      if ((window as any).pdfjs?.GlobalWorkerOptions) {
        (window as any).pdfjs.GlobalWorkerOptions.workerSrc = '/pdf/pdf.worker.min.js';
      }
      
      // 直接設定
      (window as any).pdfjsWorker = '/pdf/pdf.worker.min.js';
    }
    setReady(true);
  }, []);

  if (!ready) return null;
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        {/* Modal Content */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    <span className="font-semibold text-lg">📄 A4印刷用日誌プレビュー - {user.name} ({dailyLog.date || '日付不明'})</span>
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                    autoFocus
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* PDF Viewer */}
                <div className="h-[70vh] w-full border border-gray-200 rounded-lg overflow-hidden">
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

                {/* Footer */}
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    閉じる
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PdfPreviewModal;
