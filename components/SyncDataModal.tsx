import React, { useState } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';
import { triggerHapticFeedback } from './utils/haptics';

interface SyncDataModalProps {
  currentSteps: number;
  currentSleep: number;
  onClose: () => void;
  onSave: (data: { steps: number; sleep: number }) => void;
}

const SyncDataModal: React.FC<SyncDataModalProps> = ({ currentSteps, currentSleep, onClose, onSave }) => {
  const [steps, setSteps] = useState(currentSteps.toString());
  const [sleep, setSleep] = useState(currentSleep.toString());

  const handleSave = () => {
    const newSteps = parseInt(steps, 10);
    const newSleep = parseFloat(sleep);
    
    const validSteps = !isNaN(newSteps) && newSteps >= 0 ? newSteps : currentSteps;
    const validSleep = !isNaN(newSleep) && newSleep >= 0 ? newSleep : currentSleep;

    onSave({ steps: validSteps, sleep: validSleep });
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string, isFloat: boolean) => {
    const regex = isFloat ? /^[0-9]*\.?[0-9]?$/ : /^[0-9]*$/;
    if (value === '' || regex.test(value)) {
      setter(value);
    }
  };
  
  const incrementValue = (
    setter: React.Dispatch<React.SetStateAction<string>>, 
    amount: number, 
    isFloat: boolean
  ) => {
    setter(prev => {
      const current = (isFloat ? parseFloat(prev) : parseInt(prev, 10)) || 0;
      const newValue = current + amount;
      const finalValue = Math.max(0, newValue);
      return isFloat ? finalValue.toFixed(1) : finalValue.toString();
    });
    triggerHapticFeedback(30);
  };

  const isSaveDisabled = (!steps && !sleep) || (parseInt(steps, 10) < 0) || (parseFloat(sleep) < 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div 
        className="bg-background-light dark:bg-card-dark w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between mb-6">
          <div className="w-6" />
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Quick Sync</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <XMarkIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
        </header>

        <div className="space-y-8">
            {/* Steps Section */}
            <div>
                 <p className="text-center text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">Today's Steps</p>
                 <div className="flex items-center justify-center space-x-2 my-2">
                    <button onClick={() => incrementValue(setSteps, -100, false)} className="w-12 h-12 text-2xl font-light rounded-full bg-gray-200 dark:bg-card-dark/80 text-text-secondary-dark hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">-</button>
                    <div className="relative text-center w-40">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={steps}
                            onChange={(e) => handleInputChange(setSteps, e.target.value, false)}
                            autoFocus
                            className="w-full bg-transparent text-center text-5xl font-extrabold text-text-primary-light dark:text-text-primary-dark focus:outline-none"
                        />
                        <span className="absolute -bottom-5 left-0 right-0 text-lg font-medium text-text-secondary-light dark:text-text-secondary-dark">steps</span>
                    </div>
                    <button onClick={() => incrementValue(setSteps, 100, false)} className="w-12 h-12 text-2xl font-light rounded-full bg-gray-200 dark:bg-card-dark/80 text-text-secondary-dark hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">+</button>
                </div>
            </div>
            {/* Sleep Section */}
             <div>
                 <p className="text-center text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">Last Night's Sleep</p>
                 <div className="flex items-center justify-center space-x-2 my-2">
                    <button onClick={() => incrementValue(setSleep, -0.5, true)} className="w-12 h-12 text-2xl font-light rounded-full bg-gray-200 dark:bg-card-dark/80 text-text-secondary-dark hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">-</button>
                    <div className="relative text-center w-40">
                        <input
                            type="text"
                            inputMode="decimal"
                            value={sleep}
                            onChange={(e) => handleInputChange(setSleep, e.target.value, true)}
                            className="w-full bg-transparent text-center text-5xl font-extrabold text-text-primary-light dark:text-text-primary-dark focus:outline-none"
                        />
                        <span className="absolute -bottom-5 left-0 right-0 text-lg font-medium text-text-secondary-light dark:text-text-secondary-dark">hours</span>
                    </div>
                    <button onClick={() => incrementValue(setSleep, 0.5, true)} className="w-12 h-12 text-2xl font-light rounded-full bg-gray-200 dark:bg-card-dark/80 text-text-secondary-dark hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">+</button>
                </div>
            </div>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaveDisabled}
          className="w-full mt-10 bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-accent/90 transition-colors disabled:bg-accent/50 disabled:cursor-not-allowed"
        >
          Sync Data
        </button>
      </div>
    </div>
  );
};

export default SyncDataModal;