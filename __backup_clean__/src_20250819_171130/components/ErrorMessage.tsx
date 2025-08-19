import React from 'react';
import { AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onClose?: () => void;
  className?: string;
}

const typeStyles = {
  error: {
    container: 'bg-red-50 border border-red-200 text-red-600',
    icon: 'h-6 w-6 text-red-600 mr-3',
    card: 'bg-red-50 border border-red-200 rounded-lg p-6 max-w-md',
    button: 'bg-red-600 text-white hover:bg-red-700',
  },
  warning: {
    container: 'bg-yellow-50 border border-yellow-200 text-yellow-600',
    icon: 'h-6 w-6 text-yellow-500 mr-3',
    card: 'bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md',
    button: 'bg-yellow-500 text-white hover:bg-yellow-600',
  },
  info: {
    container: 'bg-blue-50 border border-blue-200 text-blue-600',
    icon: 'h-6 w-6 text-blue-500 mr-3',
    card: 'bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md',
    button: 'bg-blue-600 text-white hover:bg-blue-700',
  },
};

const typeIcons = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, type = 'error', onClose, className }) => {
  const Icon = typeIcons[type] || typeIcons['error'];
  const styles = typeStyles[type] || typeStyles['error'];
  return (
    <div className={`flex items-center justify-center min-h-screen ${className || ''}`}>
      <div className={styles.card}>
        <div className="flex items-center">
          <Icon className={styles.icon} />
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-semibold mb-1">{type === 'error' ? 'エラー' : type === 'warning' ? '警告' : '情報'}</h3>
            <p className="text-sm">{message}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`mt-4 w-full ${styles.button} px-4 py-2 rounded-md transition-colors`}
          >
            閉じる
            <span className="sr-only">Dismiss</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 