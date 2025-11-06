import React from 'react';
import { FootstepsIcon } from './icons/FootstepsIcon';
import { FlameIcon } from './icons/FlameIcon';

interface FitnessSummaryCardProps {
  steps: number;
  activeCalories: number;
}

const FitnessSummaryCard: React.FC<FitnessSummaryCardProps> = ({ steps, activeCalories }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg col-span-2 flex justify-around items-center">
      <div className="text-center">
        <FootstepsIcon className="w-8 h-8 text-accent mx-auto mb-2" />
        <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">{steps.toLocaleString()}</p>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Steps</p>
      </div>
      <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
      <div className="text-center">
        <FlameIcon className="w-8 h-8 text-accent mx-auto mb-2" />
        <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">{activeCalories}</p>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Active kcal</p>
      </div>
    </div>
  );
};

export default FitnessSummaryCard;