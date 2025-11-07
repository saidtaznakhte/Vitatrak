
import React from 'react';
import { WaterDropIcon } from './icons/WaterDropIcon';

interface WaterIntakeCardProps {
  intake: number;
  goal: number;
  onClick: () => void;
}

const WaterIntakeCard: React.FC<WaterIntakeCardProps> = ({ intake, goal, onClick }) => {
  const glasses = Array.from({ length: goal }, (_, i) => i < intake);

  return (
    <button
      onClick={onClick}
      className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg w-full text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      aria-label={`Log water intake, currently ${intake} out of ${goal} glasses.`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <WaterDropIcon className="w-6 h-6 text-blue-500" />
          <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">Water Intake</h3>
        </div>
        <p className="font-semibold text-sm text-text-secondary-light dark:text-text-secondary-dark">
          {intake} / {goal} glasses
        </p>
      </div>
      <div className="grid grid-cols-8 gap-2">
        {glasses.map((filled, index) => (
          <div key={index} className="w-full h-2 rounded-full bg-gray-200 dark:bg-background-dark">
             <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: filled ? '100%' : '0%' }}
            ></div>
          </div>
        ))}
      </div>
    </button>
  );
};

export default WaterIntakeCard;
