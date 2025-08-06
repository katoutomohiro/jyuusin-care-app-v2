import React, { FC, ReactNode } from 'react';

interface RecordTileProps {
  icon: ReactNode | string;
  label: string;
  onClick: () => void;
  className?: string;
}

export const RecordTile: FC<RecordTileProps> = ({ 
  icon, 
  label, 
  onClick, 
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center
        bg-white border-2 border-gray-200 hover:border-blue-300
        rounded-lg p-4 min-h-[120px] w-full
        transition-all duration-200
        hover:shadow-md hover:bg-blue-50
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        ${className}
      `}
    >
      <div className="text-3xl mb-2 text-gray-600">
        {typeof icon === 'string' ? <span>{icon}</span> : icon}
      </div>
      <span className="text-sm font-medium text-gray-800 text-center">
        {label}
      </span>
    </button>
  );
};

export default RecordTile;
