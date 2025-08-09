import React, { useState } from 'react';

export const FeedbackButton: React.FC<{ onSend: (msg: string) => void }> = ({ onSend }) => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="bg-yellow-500 text-white rounded-full w-16 h-16 text-3xl shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="現場の声を送信"
      >
        💬
      </button>
      {open && (
        <div className="bg-white border rounded shadow-lg p-4 mt-2 w-80">
          <h2 className="font-bold mb-2">現場の声・ご意見</h2>
          <textarea
            className="w-full border rounded p-2 mb-2"
            rows={3}
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder="改善点・要望・気づきなど..."
          />
          <div className="flex gap-2 justify-end">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setOpen(false)}>
              キャンセル
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => { if (msg.trim()) { onSend(msg); setMsg(''); setOpen(false); } }}
            >
              送信
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
