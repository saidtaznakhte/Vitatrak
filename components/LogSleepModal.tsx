import React, { useState } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';
import { triggerHapticFeedback } from './utils/haptics';

interface LogSleepModalProps {
  currentHours: number;
  onClose: () => void;
  onSave: (newHours: number) => void;
}

const LogSleepModal: React.FC<LogSleepModalProps> = ({ currentHours, onClose, onSave }) => {
  const [hours, setHours] = useState(currentHours.toString());

  const handleSave = () => {
    const newHours = parseFloat(hours);
    if (!isNaN(newHours) && newHours >= 0) {
      onSave(newHours);
    }
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty, numbers, and a single decimal point
    if (value === '' || /^[0-9]*\.?[0-9]?$/.test(value)) {
      setHours(value);
    }
  };
  
  const incrementHours = (amount: number) => {
    setHours(prev => {
        const current = parseFloat(prev) || 0;
        const newValue = (current + amount);
        return newValue >= 0 ? newValue.toFixed(1) : "0";
    });
    triggerHapticFeedback(30);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div 
        className="bg-background-light dark:bg-card-dark w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between mb-6">
          <div className="w-6" />
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Log Sleep</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <XMarkIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
        </header>

        <div className="text-center mb-6">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Last Night's Sleep</p>
        </div>

        <div className="flex items-center justify-center space-x-2 my-4">
             <button onClick={() => incrementHours(-0.5)} className="w-12 h-12 text-2xl font-light rounded-full bg-gray-200 dark:bg-card-dark/80 text-text-secondary-dark hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">-</button>
             <div className="relative text-center w-40">
                <input
                    type="text"
                    inputMode="decimal"
                    value={hours}
                    onChange={handleHoursChange}
                    autoFocus
                    className="w-full bg-transparent text-center text-6xl font-extrabold text-text-primary-light dark:text-text-primary-dark focus:outline-none"
                />
                <span className="absolute -bottom-5 left-0 right-0 text-lg font-medium text-text-secondary-light dark:text-text-secondary-dark">hours</span>
            </div>
             <button onClick={() => incrementHours(0.5)} className="w-12 h-12 text-2xl font-light rounded-full bg-gray-200 dark:bg-card-dark/80 text-text-secondary-dark hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">+</button>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={!hours || parseFloat(hours) < 0}
          className="w-full mt-10 bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-accent/90 transition-colors disabled:bg-accent/50 disabled:cursor-not-allowed"
        >
          Save Sleep
        </button>
      </div>
    </div>
  );
};

export default LogSleepModal;
