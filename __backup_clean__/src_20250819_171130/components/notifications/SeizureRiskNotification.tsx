import React from 'react';
export const SeizureRiskNotification = ({ riskLevel }: { riskLevel: string }) => (
  <div className={`p-4 rounded-lg text-white ${riskLevel === 'high' ? 'bg-red-500' : 'bg-yellow-400'}`}>
    {riskLevel === 'high' ? '⚠️ 発作リスクが高まっています' : '注意: 発作リスクあり'}
  </div>
);
