import React from 'react';
import { BedIcon } from './icons/BedIcon';

interface SleepAndMoodCardProps {
  sleepHours: number;
  mood: 'Happy' | 'Neutral' | 'Sad';
  setSleepHours: (hours: number) => void;
  setMood: (mood: 'Happy' | 'Neutral' | 'Sad') => void;
}

const moodEmojis = {
  Happy: '😊',
  Neutral: '😐',
  Sad: '😔',
};

const SleepAndMoodCard: React.FC<SleepAndMoodCardProps> = ({ sleepHours, mood, setSleepHours, setMood }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2">
          <BedIcon className="w-6 h-6 text-accent" />
          <h3 className="font-semibold text-text-secondary-light dark:text-text-secondary-dark">Sleep & Mood</h3>
        </div>
        <div className="mt-3">
          <span className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{sleepHours}</span>
          <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"> hours</span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">How are you feeling?</p>
        <div className="flex justify-between bg-gray-100 dark:bg-card-dark/80 p-1 rounded-lg">
          {(['Happy', 'Neutral', 'Sad'] as const).map(m => (
            <button 
              key={m}
              onClick={() => setMood(m)}
              className={`w-full py-1 text-xl rounded-md transition-colors ${mood === m ? 'bg-accent/20' : 'hover:bg-accent/10'}`}
              aria-label={`Set mood to ${m}`}
            >
              {moodEmojis[m]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SleepAndMoodCard;