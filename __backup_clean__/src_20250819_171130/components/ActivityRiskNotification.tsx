import React from 'react';

interface ActivityRiskNotificationProps {
  riskLevel: string;
  message: string;
}

export const ActivityRiskNotification: React.FC<ActivityRiskNotificationProps> = ({ riskLevel, message }) => {
  if (riskLevel === 'low') return null;
  return (
    <div className={`p-4 rounded-lg mb-4 ${riskLevel === 'high' ? 'bg-red-500 text-white' : 'bg-yellow-200 text-yellow-900'}`}>
      <span className="font-bold">{riskLevel === 'high' ? '⚠️ 高リスク' : '注意'}</span>
      <span className="ml-2">{message}</span>
    </div>
  );
};
