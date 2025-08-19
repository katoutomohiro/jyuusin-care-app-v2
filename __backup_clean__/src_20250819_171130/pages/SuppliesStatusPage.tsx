import React from 'react';

const SuppliesStatusPage: React.FC = () => (
  <div className="min-h-screen bg-[#FAFAF5] p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        備品管理
        <span className="text-sm text-gray-400 font-normal">(備品チェックリスト)</span>
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
        <div className="text-gray-500">ここに備品チェックリスト（ダミー）が表示されます</div>
      </div>
    </div>
  </div>
);

export default SuppliesStatusPage;