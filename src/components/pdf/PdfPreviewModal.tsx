import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { PDFViewer } from '@react-pdf/renderer';
import { DailyLogPdfDoc, VitalRow } from '../DailyLogPdfDoc';
import { DailyLog, User } from '../../types';
import { useData } from '../../contexts/DataContext';
import { localDateKey } from '../../utils/dateKey';

type Props = {
  open: boolean;
  onClose: () => void;
  /* 日誌１日分のデータ構造（呼び出し側で既に validate 済み） */
  dailyLog: DailyLog | null;
  user: User;
};

const PdfPreviewModal: React.FC<Props> = ({ open, onClose, dailyLog, user }) => {
  const [ready, setReady] = useState(false);
  const { dailyLogsByUser } = useData();

  useEffect(() => {
    if (open) setReady(true);
    else      setReady(false);
  }, [open]);

  if (!open || !dailyLog || !ready) return null;

  // 当日分のバイタルを抽出してPDF用に整形
  const targetDateKey = localDateKey(dailyLog.date ? new Date(dailyLog.date) : new Date());
  const rawLogs: any[] = dailyLogsByUser[user.id] || [];
  const vitalsRows: VitalRow[] = rawLogs
    .filter(l => l.event_type === 'vitals' && localDateKey(l.created_at || new Date()) === targetDateKey)
    .map(l => ({
      time: l.event_timestamp ? String(l.event_timestamp).substring(11,16) : (l.created_at ? String(l.created_at).substring(11,16) : ''),
      tempC: l.temperature != null ? Number(l.temperature) : undefined,
      bpSys: l.blood_pressure_systolic != null ? Number(l.blood_pressure_systolic) : undefined,
      bpDia: l.blood_pressure_diastolic != null ? Number(l.blood_pressure_diastolic) : undefined,
      spo2: l.spo2 != null ? Number(l.spo2) : undefined,
      hr: l.pulse != null ? Number(l.pulse) : undefined,
    }));

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-5xl bg-white rounded shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <Dialog.Title className="text-lg font-bold">
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
          <div className="h-[80vh] p-4">
            <PDFViewer 
              style={{ 
                width: '100%', 
                height: '100%',
                border: 'none'
              }}
              showToolbar={true}
            >
              <DailyLogPdfDoc 
                userName={user.name}
                date={dailyLog.date || new Date()}
                staffName={''}
                logData={dailyLog}
                vitals={vitalsRows}
              />
            </PDFViewer>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PdfPreviewModal;
