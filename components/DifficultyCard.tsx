import React from 'react';
import { Card } from './Card';
import { InsightText } from './InsightText';
import { DifficultyLevel } from '../types';

interface DifficultyCardProps {
  data: {
    breakdown: DifficultyLevel[];
    insight: string;
  };
}

export const DifficultyCard: React.FC<DifficultyCardProps> = ({ data }) => {
  const getColor = (level: string) => {
    switch(level) {
      case 'Easy': return 'bg-emerald-500';
      case 'Medium': return 'bg-amber-500';
      case 'Hard': return 'bg-rose-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card title="Paper Difficulty Analysis">
      <div className="space-y-4 mb-2">
        {data.breakdown.map((item) => (
          <div key={item.level}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-gray-700">{item.level}</span>
              <span className="text-gray-500">
                {item.correct}/{item.total} Correct <span className="mx-1">•</span> 
                <span className={item.accuracy < 70 ? 'text-rose-600 font-bold' : 'text-gray-900'}>
                  {item.accuracy}% Acc
                </span>
              </span>
            </div>
            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getColor(item.level)}`} 
                style={{ width: `${item.accuracy}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <InsightText text={data.insight} />
    </Card>
  );
};