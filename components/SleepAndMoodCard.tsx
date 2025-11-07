
import React from 'react';
import { MoonIcon } from './icons/MoonIcon';

interface SleepAndMoodCardProps {
  sleepHours: number;
  mood: 'Happy' | 'Neutral' | 'Sad';
  setMood: (mood: 'Happy' | 'Neutral' | 'Sad') => void;
  onSleepClick: () => void;
}

const moodEmojis = {
  Sad: '😔',
  Neutral: '😐',
  Happy: '😊',
};

const SleepAndMoodCard: React.FC<SleepAndMoodCardProps> = ({ sleepHours, mood, setMood, onSleepClick }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2">
          <MoonIcon className="w-6 h-6 text-purple-500" />
          <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">Sleep & Mood</h3>
        </div>
        <button onClick={onSleepClick} className="w-full text-left mt-3">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <span className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{sleepHours}</span> hours
          </p>
        </button>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-3">How are you feeling?</p>
        <div className="flex justify-around items-center">
          {(['Sad', 'Neutral', 'Happy'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-200 ${mood === m ? 'bg-accent/20 scale-110' : 'bg-gray-100 dark:bg-background-dark hover:bg-gray-200 dark:hover:bg-white/10'}`}
              aria-label={`Set mood to ${m}`}
              aria-pressed={mood === m}
            >
              <span className="text-3xl">{moodEmojis[m]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SleepAndMoodCard;
