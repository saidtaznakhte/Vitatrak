
import React from 'react';
import type { Achievement } from '../types';
import { StarIcon } from './icons/StarIcon';

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const isUnlocked = achievement.unlocked;

  const borderClasses = isUnlocked && achievement.highlightColor === 'gold' ? 'border-2 border-amber-400'
    : isUnlocked && achievement.highlightColor === 'green' ? 'border-2 border-accent'
    : '';

  const iconColor = isUnlocked && achievement.highlightColor === 'gold' ? 'text-amber-500'
    : isUnlocked && achievement.highlightColor === 'green' ? 'text-accent'
    : 'text-gray-400 dark:text-gray-500';

  return (
    <div className={`relative flex-shrink-0 w-40 h-40 flex flex-col items-center justify-center text-center p-4 rounded-2xl transition-all duration-300 ${isUnlocked ? 'bg-card-light dark:bg-card-dark shadow-md' : 'bg-gray-100 dark:bg-card-dark/50'} ${borderClasses}`}>
      {isUnlocked && achievement.isNew && <StarIcon className="absolute top-3 right-3 w-4 h-4 text-amber-400" />}

      <div className={`w-12 h-12 mb-2 transition-colors duration-300 ${iconColor}`}>
        {achievement.icon}
      </div>
      
      <h4 className={`font-bold text-sm ${isUnlocked ? 'text-text-primary-light dark:text-text-primary-dark' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>{achievement.title}</h4>
      
      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
        {isUnlocked ? achievement.description : 'Locked'}
      </p>
    </div>
  );
};

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Your Achievements</h2>
        <a href="#" className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors">View All</a>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
        {achievements.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} />
        ))}
        <style>{`
            .overflow-x-auto::-webkit-scrollbar {
              display: none;
            }
            .overflow-x-auto {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
        `}</style>
      </div>
    </div>
  );
};

export default Achievements;
