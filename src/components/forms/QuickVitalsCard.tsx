import React, { useState } from 'react';

interface QuickVitalsCardProps {
  onSave: (data: any) => void;
  isSubmitting?: boolean;
}

const QuickVitalsCard: React.FC<QuickVitalsCardProps> = ({ onSave, isSubmitting = false }) => {
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  };

  const [form, setForm] = useState({
    event_timestamp: getCurrentDateTime(),
    temperature: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    spo2: '',
    pulse: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      event_type: 'vitals',
      event_timestamp: form.event_timestamp,
      temperature: form.temperature,
      blood_pressure_systolic: form.blood_pressure_systolic,
      blood_pressure_diastolic: form.blood_pressure_diastolic,
      spo2: form.spo2,
      pulse: form.pulse,
      notes: form.notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">🩺 バイタル</h4>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          {isSubmitting ? '保存中...' : '保存'}
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-700">時間</label>
        <input
          type="datetime-local"
          name="event_timestamp"
          value={form.event_timestamp}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700">体温（℃）</label>
          <input
            type="number"
            step="0.1"
            name="temperature"
            value={form.temperature}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="36.5"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">SpO₂（%）</label>
          <input
            type="number"
            name="spo2"
            value={form.spo2}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="98"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-gray-700">血圧（mmHg） 上/下</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="blood_pressure_systolic"
              value={form.blood_pressure_systolic}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="上 120"
            />
            <span className="text-gray-500">/</span>
            <input
              type="number"
              name="blood_pressure_diastolic"
              value={form.blood_pressure_diastolic}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="下 80"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-700">HR（bpm）</label>
          <input
            type="number"
            name="pulse"
            value={form.pulse}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="72"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700">備考</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded resize-none"
          rows={2}
          placeholder="特記事項なし"
        />
      </div>
    </form>
  );
};

export default QuickVitalsCard;