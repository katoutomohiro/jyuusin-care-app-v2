import React from 'react';

const StaffSchedulePage: React.FC = () => (
  <div className="min-h-screen bg-[#FAFAF5] p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        職員スケジュール
        <span className="text-sm text-gray-400 font-normal">(今日のチーム体制)</span>
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
        <div className="text-gray-500">ここに職員スケジュール（ダミー）が表示されます</div>
      </div>
    </div>
  </div>
);

export default StaffSchedulePage;