import React from 'react';

export type AlertLevel = 'info' | 'warning' | 'critical';

export interface MedicalAlert {
  message: string;
  level: AlertLevel;
  timestamp?: string;
}

export const MedicalAlertBanner: React.FC<{ alerts: MedicalAlert[] }> = ({ alerts }) => {
  if (!alerts.length) return null;
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {alerts.map((alert, i) => (
        <div
          key={i}
          className={`p-4 text-white text-lg font-bold ${
            alert.level === 'critical'
              ? 'bg-red-600'
              : alert.level === 'warning'
              ? 'bg-yellow-500'
              : 'bg-blue-500'
          }`}
        >
          {alert.level === 'critical' && '⚠️ '}
          {alert.level === 'warning' && '⚠️ '}
          {alert.message}
          {alert.timestamp && (
            <span className="ml-4 text-sm font-normal">{alert.timestamp}</span>
          )}
        </div>
      ))}
    </div>
  );
};
