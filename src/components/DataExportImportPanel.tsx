import React, { useRef } from 'react';
import { LocalStorageService } from '../hooks/useLocalStorage';
import { exportToExcel } from './ExcelExportUtil';
  // 日誌データのエクスポート（Excel）
  const handleExportExcel = () => {
    const logs = LocalStorageService.get('daily_logs') || [];
    exportToExcel(logs, `jyushin_care_daily_logs_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // 利用者データのエクスポート（Excel）
  const handleExportUsersExcel = () => {
    const users = LocalStorageService.get('users') || [];
    exportToExcel(users, `jyushin_care_users_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

// CSV変換ユーティリティ
function toCSV(data: any[]): string {
  if (!data.length) return '';
  const keys = Object.keys(data[0]);
  const csvRows = [keys.join(',')];
  for (const row of data) {
    csvRows.push(keys.map(k => JSON.stringify(row[k] ?? '')).join(','));
  }
  return csvRows.join('\r\n');
}

const DataExportImportPanel: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 日誌データのエクスポート（CSV）
  const handleExportCSV = () => {
    const logs = LocalStorageService.get('daily_logs') || [];
    const csv = toCSV(logs);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jyushin_care_daily_logs_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 利用者データのエクスポート（CSV）
  const handleExportUsersCSV = () => {
    const users = LocalStorageService.get('users') || [];
    const csv = toCSV(users);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jyushin_care_users_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 全データのエクスポート（JSON）
  const handleExportJSON = () => {
    const allData = LocalStorageService.getAll();
    const json = JSON.stringify(allData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jyushin_care_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // インポート（JSON）
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (typeof data === 'object') {
          Object.entries(data).forEach(([k, v]) => {
            LocalStorageService.set(k, v);
          });
          alert('データをインポートしました。ページを再読み込みしてください。');
        }
      } catch {
        alert('インポート失敗: ファイル形式が不正です');
      }
    };
    reader.readAsText(file);
  };

  return (
    <section className="bg-gray-50 p-4 rounded-lg shadow max-w-xl mx-auto my-8">
      <h2 className="text-lg font-bold mb-2 text-blue-700">データエクスポート・インポート</h2>
      <div className="flex flex-col gap-2">
        <button className="bg-blue-500 text-white rounded px-4 py-2" onClick={handleExportCSV}>日誌データCSV出力</button>
        <button className="bg-blue-500 text-white rounded px-4 py-2" onClick={handleExportExcel}>日誌データExcel出力</button>
        <button className="bg-blue-500 text-white rounded px-4 py-2" onClick={handleExportUsersCSV}>利用者データCSV出力</button>
        <button className="bg-blue-500 text-white rounded px-4 py-2" onClick={handleExportUsersExcel}>利用者データExcel出力</button>
        <button className="bg-green-500 text-white rounded px-4 py-2" onClick={handleExportJSON}>全データJSONバックアップ</button>
        <label className="block mt-4">
          <span className="text-gray-700">全データJSONインポート</span>
          <input type="file" accept="application/json" ref={fileInputRef} onChange={handleImportJSON} className="block mt-1" />
        </label>
      </div>
      <div className="text-xs text-gray-500 mt-2">※インポート後はページを再読み込みしてください</div>
    </section>
  );
};

export default DataExportImportPanel;
