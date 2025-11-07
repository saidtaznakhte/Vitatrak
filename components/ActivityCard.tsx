import React from 'react';
import { FlameIcon } from './icons/FlameIcon';
import { StepsIcon } from './icons/StepsIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';

interface ActivityCardProps {
  steps: number;
  activeCalories: number;
  onStepsClick: () => void;
}

const ActivityMetricCard: React.FC<{
  icon: React.ReactNode;
  value: string;
  label: string;
  onClick?: () => void;
}> = ({ icon, value, label, onClick }) => {
    const cardClasses = "bg-gray-50 dark:bg-background-dark p-4 rounded-2xl w-full flex flex-col items-center justify-center space-y-2 h-full text-center";
    
    const content = (
        <>
            <div className="w-10 h-10 text-accent">
                {icon}
            </div>
            <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">{value}</p>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{label}</p>
        </>
    );

    if (onClick) {
        return (
            <button onClick={onClick} className={`${cardClasses} transition-transform active:scale-95`}>
                {content}
            </button>
        );
    }

    return <div className={cardClasses}>{content}</div>;
}


const ActivityCard: React.FC<ActivityCardProps> = ({ steps, activeCalories, onStepsClick }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Today's Activity</h2>
        <button className="p-1 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark">
          <ChevronUpIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ActivityMetricCard 
          icon={<StepsIcon />}
          value={steps.toLocaleString()}
          label="Steps"
          onClick={onStepsClick}
        />
        <ActivityMetricCard 
          icon={<FlameIcon />}
          value={activeCalories.toLocaleString()}
          label="Active kcal"
        />
      </div>
    </div>
  );
};

export default ActivityCard;