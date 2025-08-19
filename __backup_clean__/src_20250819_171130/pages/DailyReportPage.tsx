import React, { useState, useEffect } from 'react';
import { USERS } from '../../constants';
import {
  generateDailyReportForUser,
  saveDailyReport,
  getDailyReports,
  generateIndividualSupportPlan
} from '../services/DailyReportService';

const DailyReportPage: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [reports, setReports] = useState<any[]>([]);
  const [planPreview, setPlanPreview] = useState<any | null>(null);

  const load = () => {
    setReports(getDailyReports(date));
  };

  useEffect(load, [date]);

  const handleGenerateAll = () => {
    USERS.forEach(u => {
      const rep = generateDailyReportForUser(date, u.id);
      saveDailyReport(rep);
    });
    load();
    alert('日次レポートを生成・保存しました。');
  };

  const handleGeneratePlan = (userId: string) => {
    const plan = generateIndividualSupportPlan(userId, date);
    setPlanPreview(plan);
  };

  const printPage = () => window.print();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">日次レポート（サービス提供実績表）</h1>

      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-semibold">
          日付：
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="ml-2 border p-1 rounded"
          />
        </label>
        <button
          onClick={handleGenerateAll}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          全利用者レポート生成
        </button>
        <button
          onClick={printPage}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          印刷
        </button>
      </div>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">利用者</th>
            <th className="p-2">総件数</th>
            <th className="p-2">発作</th>
            <th className="p-2">表情</th>
            <th className="p-2">バイタル</th>
            <th className="p-2">食事</th>
            <th className="p-2">排泄</th>
            <th className="p-2">睡眠</th>
            <th className="p-2">活動</th>
            <th className="p-2">ケア</th>
            <th className="p-2">6か月計画</th>
          </tr>
        </thead>
        <tbody>
          {USERS.map(u => {
            const rep = reports.find(r => r.userId === u.id);
            return (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2 text-center">{rep?.summary.total || 0}</td>
                {['seizure','expression','vital','meal','excretion','sleep','activity','care'].map(t => (
                  <td key={t} className="p-2 text-center">
                    {rep?.summary.counts?.[t] || 0}
                  </td>
                ))}
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleGeneratePlan(u.id)}
                    className="text-blue-600 underline"
                  >
                    生成
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {planPreview && (
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h2 className="font-bold mb-2">個別支援計画（簡易案）</h2>
          <p>対象期間：{planPreview.periodStart} ～ {planPreview.periodEnd}</p>
          <p>集計対象日数：{planPreview.totalDays}日</p>
          <ul className="list-disc ml-6 mt-2">
            {planPreview.draftGoals.map((g: string, i: number) => <li key={i}>{g}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DailyReportPage;
