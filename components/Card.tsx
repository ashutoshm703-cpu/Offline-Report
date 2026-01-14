import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = "", title, action }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-3">
          {title && <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
