
import React from 'react';

const RecentlyUploaded: React.FC = () => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-lg text-center">
      <div className="relative h-24 flex items-center justify-center">
        {/* Background cards for stacked effect */}
        <div className="absolute w-[90%] h-full bg-white/80 dark:bg-card-dark/60 rounded-xl shadow-md transform translate-y-4" />
        <div className="absolute w-[95%] h-full bg-white/90 dark:bg-card-dark/80 rounded-xl shadow-md transform translate-y-2" />
        
        {/* Main placeholder card */}
        <div className="relative w-full h-20 bg-white dark:bg-card-dark p-4 rounded-xl shadow-lg flex items-center space-x-4 z-10">
          <span className="text-4xl bg-gray-100 dark:bg-background-dark p-2 rounded-full">🥗</span>
          <div className="flex-grow space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <p className="mt-6 text-text-secondary-light dark:text-text-secondary-dark text-sm">
        Tap + to add your first meal of the day
      </p>
    </div>
  );
};

export default RecentlyUploaded;
