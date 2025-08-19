import React from 'react';
export const ActivityRiskNotification = ({ riskLevel }: { riskLevel: string }) => (
  <div className={`p-4 rounded-lg text-white ${riskLevel === 'high' ? 'bg-red-500' : 'bg-yellow-400'}`}>
    {riskLevel === 'high' ? '⚠️ 活動リスクが高まっています' : '注意: 活動リスクあり'}
  </div>
);
