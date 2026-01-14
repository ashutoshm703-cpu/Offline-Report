import React from 'react';
import { Lightbulb } from 'lucide-react';

interface InsightTextProps {
  text: string;
  className?: string;
  icon?: boolean;
}

export const InsightText: React.FC<InsightTextProps> = ({ text, className = "", icon = true }) => {
  return (
    <div className={`mt-3 flex items-start gap-2 text-sm text-gray-500 font-medium ${className}`}>
      {icon && <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />}
      <p className="leading-snug">{text}</p>
    </div>
  );
};
