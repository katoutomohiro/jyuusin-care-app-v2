import React from 'react';

const SettingsPage: React.FC = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-1">設定・システム管理</h1>
    <div className="text-sm text-gray-400 mb-6">作業場の調律</div>
    <ul className="space-y-4">
      <li className="font-semibold">テーマカラーの変更（ダミー）</li>
      <li className="font-semibold">通知設定（ダミー）</li>
      <li className="font-semibold">その他の設定（ダミー）</li>
    </ul>
  </div>
);

export default SettingsPage; 