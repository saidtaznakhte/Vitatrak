import React, { useState } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';
import { triggerHapticFeedback } from './utils/haptics';

interface LogStepsModalProps {
  currentSteps: number;
  onClose: () => void;
  onSave: (newSteps: number) => void;
}

const LogStepsModal: React.FC<LogStepsModalProps> = ({ currentSteps, onClose, onSave }) => {
  const [steps, setSteps] = useState(currentSteps.toString());

  const handleSave = () => {
    const newSteps = parseInt(steps, 10);
    if (!isNaN(newSteps) && newSteps >= 0) {
      onSave(newSteps);
    }
  };

  const handleStepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty or whole numbers
    if (value === '' || /^[0-9]*$/.test(value)) {
      setSteps(value);
    }
  };
  
  const incrementSteps = (amount: number) => {
    setSteps(prev => {
        const current = parseInt(prev, 10) || 0;
        const newValue = current + amount;
        return newValue >= 0 ? newValue.toString() : "0";
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
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Log Steps</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <XMarkIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
        </header>

        <div className="text-center mb-6">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Today, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="flex items-center justify-center space-x-2 my-4">
             <button onClick={() => incrementSteps(-100)} className="w-12 h-12 text-2xl font-light rounded-full bg-gray-200 dark:bg-card-dark/80 text-text-secondary-dark hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">-</button>
             <div className="relative text-center w-40">
                <input
                    type="text"
                    inputMode="numeric"
                    value={steps}
                    onChange={handleStepsChange}
                    autoFocus
                    className="w-full bg-transparent text-center text-5xl font-extrabold text-text-primary-light dark:text-text-primary-dark focus:outline-none"
                />
                <span className="absolute -bottom-5 left-0 right-0 text-lg font-medium text-text-secondary-light dark:text-text-secondary-dark">steps</span>
            </div>
             <button onClick={() => incrementSteps(100)} className="w-12 h-12 text-2xl font-light rounded-full bg-gray-200 dark:bg-card-dark/80 text-text-secondary-dark hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">+</button>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={!steps || parseInt(steps, 10) < 0}
          className="w-full mt-10 bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-accent/90 transition-colors disabled:bg-accent/50 disabled:cursor-not-allowed"
        >
          Save Steps
        </button>
      </div>
    </div>
  );
};

export default LogStepsModal;