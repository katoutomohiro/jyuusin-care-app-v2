import React from 'react';

const KaizenPage: React.FC = () => (
  <div className="min-h-screen bg-[#FAFAF5] p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        改善提案{' '}
        <span className="text-sm text-gray-400 font-normal">
          (ヒヤリハット・学びの種)
        </span>
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
        <div className="text-gray-500">
          ここにヒヤリハット・改善提案フォームと投稿一覧（ダミー）が表示されます
        </div>
      </div>
    </div>
  </div>
);

export default KaizenPage;