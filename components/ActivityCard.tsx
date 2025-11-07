import React from 'react';
import { FootstepsIcon } from './icons/FootstepsIcon';
import { FlameIcon } from './icons/FlameIcon';
import { PlayCircleIcon } from './icons/PlayCircleIcon';
import { StopCircleIcon } from './icons/StopCircleIcon';

interface ActivityCardProps {
  steps: number;
  activeCalories: number;
  onStepsClick: () => void;
  isTracking: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ steps, activeCalories, onStepsClick, isTracking, onStartTracking, onStopTracking }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg col-span-2 flex flex-col">
      <div className="flex justify-around items-center">
        <button onClick={onStepsClick} className="text-center rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors w-full">
          <FootstepsIcon className="w-8 h-8 text-accent mx-auto mb-2" />
          <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">{steps.toLocaleString()}</p>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Steps</p>
        </button>
        <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
        <div className="text-center w-full">
          <FlameIcon className="w-8 h-8 text-accent mx-auto mb-2" />
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