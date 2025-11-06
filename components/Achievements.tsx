
import React from 'react';
import type { Achievement } from '../types';
import { TrophyIcon } from './icons/TrophyIcon';

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const isUnlocked = achievement.unlocked;
  return (
    <div className={`flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 ${isUnlocked ? 'bg-card-light dark:bg-card-dark shadow-lg' : 'bg-gray-100 dark:bg-card-dark/50'}`}>
      <div className={`w-12 h-12 mb-3 transition-colors duration-300 ${isUnlocked ? 'text-accent' : 'text-gray-400 dark:text-gray-500'}`}>
        {achievement.icon}
      </div>
      <h4 className={`font-bold text-sm ${isUnlocked ? 'text-text-primary-light dark:text-text-primary-dark' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>{achievement.title}</h4>
      {isUnlocked && <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">{achievement.description}</p>}
    </div>
  );
};

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-4">
        <TrophyIcon className="w-6 h-6 text-accent mr-3" />
        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Your Achievements</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
