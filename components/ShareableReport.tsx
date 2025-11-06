import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, AreaChart, Area } from 'recharts';
import { FlameIcon } from './icons/FlameIcon';
import type { WeightEntry } from '../types';

interface ShareableReportProps {
  userName: string;
  avatarUrl: string;
  streak: number;
  currentWeight: number;
  weightChange: number;
  weightData: WeightEntry[];
}

const ShareableReport: React.FC<ShareableReportProps> = ({
  userName,
  avatarUrl,
  streak,
  currentWeight,
  weightChange,
  weightData,
}) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const weightChangeText = weightChange < 0 ? `${weightChange.toFixed(1)} lbs` : `+${weightChange.toFixed(1)} lbs`;

  const chartData = weightData.slice(-30).map(entry => ({
    name: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: entry.weight
  }));

  return (
    <div className="bg-card-light dark:bg-card-dark p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-4">
        <img src={avatarUrl} alt={userName} className="w-12 h-12 rounded-full" />
        <div>
          <p className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">{userName}</p>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">is making progress!</p>
        </div>
      </div>

      <div className="h-28 w-full mb-4">
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00A99D" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#00A99D" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis hide={true} domain={['dataMin - 5', 'dataMax + 5']} />
            <Area type="monotone" dataKey="weight" stroke="#00A99D" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUv)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-background-light dark:bg-background-dark p-3 rounded-lg">
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Current Weight</p>
          <p className="font-bold text-xl text-text-primary-light dark:text-text-primary-dark">{currentWeight} <span className="text-sm font-normal">lbs</span></p>
          <p className={`text-xs font-semibold ${weightChange < 0 ? 'text-accent' : 'text-accent-red'}`}>{weightChangeText}</p>
        </div>
        <div className="bg-background-light dark:bg-background-dark p-3 rounded-lg">
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Day Streak</p>
          <div className="flex items-center justify-center space-x-1.5">
            <FlameIcon className="w-6 h-6 text-accent-yellow" />
            <p className="font-bold text-xl text-text-primary-light dark:text-text-primary-dark">{streak}</p>
          </div>
          <p className="text-xs font-semibold text-accent-yellow">Keep it up!</p>
        </div>
      </div>
      
      <div className="flex items-center justify-center mt-4 text-xs text-text-secondary-light dark:text-text-secondary-dark">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-accent" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>Shared from <span className="font-bold text-accent">VitaTrack</span></span>
      </div>
    </div>
  );
};

export default ShareableReport;