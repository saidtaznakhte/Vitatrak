import React from 'react';
import type { LeaderboardUser } from '../types';
import { TrophyIcon } from './icons/TrophyIcon';

const challenge = {
  title: 'Walk 50,000 Steps',
  userProgress: 34567,
  goal: 50000,
};

const leaderboardData: LeaderboardUser[] = [
  { id: 1, name: 'Olivia R.', avatarUrl: 'https://picsum.photos/id/1027/40/40', progress: 48912, isCurrentUser: false },
  { id: 2, name: 'Liam C.', avatarUrl: 'https://picsum.photos/id/1011/40/40', progress: 45123, isCurrentUser: false },
  { id: 3, name: 'Sophia L.', avatarUrl: 'https://picsum.photos/id/1012/40/40', progress: 41789, isCurrentUser: false },
  { id: 4, name: 'Mahdi Alt (You)', avatarUrl: 'https://picsum.photos/40/40', progress: 34567, isCurrentUser: true },
  { id: 5, name: 'Noah B.', avatarUrl: 'https://picsum.photos/id/1005/40/40', progress: 31234, isCurrentUser: false },
  { id: 6, name: 'Emma G.', avatarUrl: 'https://picsum.photos/id/1013/40/40', progress: 28910, isCurrentUser: false },
];

const WeeklyChallengeCard: React.FC = () => {
  const progressPercentage = (challenge.userProgress / challenge.goal) * 100;
  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg animate-fade-in">
      <h2 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">This Week's Challenge</h2>
      <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">{challenge.title}</p>
      <div className="w-full bg-gray-200 dark:bg-background-dark rounded-full h-2.5 my-4">
        <div className="bg-accent h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">{challenge.userProgress.toLocaleString()}</span>
        <span className="text-text-secondary-light dark:text-text-secondary-dark">{challenge.goal.toLocaleString()} steps</span>
      </div>
    </div>
  );
};

const LeaderboardItem: React.FC<{ user: LeaderboardUser; rank: number }> = ({ user, rank }) => (
  <div className={`flex items-center space-x-4 p-3 rounded-lg ${user.isCurrentUser ? 'bg-accent/10' : ''}`}>
    <span className="font-bold text-lg w-6 text-center text-text-secondary-light dark:text-text-secondary-dark">{rank}</span>
    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
    <div className="flex-grow">
      <p className={`font-semibold ${user.isCurrentUser ? 'text-accent' : 'text-text-primary-light dark:text-text-primary-dark'}`}>{user.name}</p>
    </div>
    <span className="font-bold text-text-primary-light dark:text-text-primary-dark">{user.progress.toLocaleString()}</span>
  </div>
);

const Leaderboard: React.FC = () => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg animate-fade-in" style={{ animationDelay: '150ms' }}>
      <div className="flex items-center mb-4">
        <TrophyIcon className="w-6 h-6 text-accent-yellow mr-2" />
        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Leaderboard</h2>
      </div>
      <div className="space-y-2">
        {leaderboardData.map((user, index) => (
          <LeaderboardItem key={user.id} user={user} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}

const Community: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">Community</h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">Join challenges and climb the ranks!</p>
      </header>

      <WeeklyChallengeCard />
      <Leaderboard />
    </div>
  );
};

export default Community;