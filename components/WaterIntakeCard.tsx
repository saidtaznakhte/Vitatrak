
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
      className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg flex flex-col justify-between h-full text-left w-full hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
    >
      <div>
        <div className="flex items-center space-x-2">
          <WaterDropIcon className="w-6 h-6 text-accent" />
          <h3 className="font-semibold text-text-secondary-light dark:text-text-secondary-dark">Water Intake</h3>
        </div>
        <div className="mt-3">
          <span className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{intake}</span>
          <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"> / {goal} glasses</span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-1">
          {glasses.map((filled, index) => (
            <div key={index} className={`w-4 h-4 rounded-full transition-colors ${filled ? 'bg-accent' : 'bg-gray-200 dark:bg-background-dark'}`}></div>
          ))}
        </div>
      </div>
    </button>
  );
};

export default WaterIntakeCard;
