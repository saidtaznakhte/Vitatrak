
import React from 'react';
import { FlameIcon } from './icons/FlameIcon';
import { PlayCircleIcon } from './icons/PlayCircleIcon';
import { StopCircleIcon } from './icons/StopCircleIcon';

interface ActivityCardProps {
  steps: number;
  stepsGoal: number;
  activeCalories: number;
  onStepsClick: () => void;
  isTracking: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ steps, stepsGoal, activeCalories, onStepsClick, isTracking, onStartTracking, onStopTracking }) => {
  const progress = stepsGoal > 0 ? Math.min(1, steps / stepsGoal) : 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  return (
    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg flex flex-col justify-between h-full">
      <div className="flex justify-around items-center flex-grow">
        <button onClick={onStepsClick} className="flex flex-col items-center justify-center text-center rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors w-full">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 80 80" transform="rotate(-90)">
              <circle
                className="text-gray-200 dark:text-card-dark"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="40"
                cy="40"
              />
              <circle
                className="text-accent"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="40"
                cy="40"
                style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">{steps.toLocaleString()}</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Steps</p>
            </div>
          </div>
        </button>
        <div className="w-px h-16 bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex flex-col items-center justify-center text-center w-full">
          <FlameIcon className="w-10 h-10 text-accent-red mb-2" />
          <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">{activeCalories}</p>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Active kcal</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={isTracking ? onStopTracking : onStartTracking}
          className={`w-full font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-300
            ${isTracking 
              ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
              : 'bg-accent/10 text-accent hover:bg-accent/20'}`
          }
        >
          {isTracking ? (
            <>
              <div className="relative flex items-center justify-center mr-2">
                <StopCircleIcon className="w-5 h-5" />
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              </div>
              Stop Tracking
            </>
          ) : (
            <>
              <PlayCircleIcon className="w-5 h-5 mr-2" />
              Start Live Tracking
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
