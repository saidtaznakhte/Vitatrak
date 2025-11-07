import React, { useState } from 'react';
import { XMarkIcon } from '../icons/XMarkIcon';
import type { UserProfile } from '../../types';
import { convertWeightForDisplay, getWeightUnit } from '../../utils/units';

interface GoalWeightModalProps {
  currentWeight: number; // in kg
  goalWeight: number; // in kg
  onClose: () => void;
  onSave: (newCurrentWeight: number, newGoalWeight: number) => void;
  profile: UserProfile;
}

const GoalWeightModal: React.FC<GoalWeightModalProps> = ({ currentWeight, goalWeight, onClose, onSave, profile }) => {
  const unitSystem = profile.unitSystem || 'metric';
  const weightUnit = getWeightUnit(unitSystem);
  const [current, setCurrent] = useState(convertWeightForDisplay(currentWeight, unitSystem).toString());
  const [goal, setGoal] = useState(convertWeightForDisplay(goalWeight, unitSystem).toString());

  const handleSave = () => {
    const newCurrent = parseFloat(current);
    const newGoal = parseFloat(goal);
    if (!isNaN(newCurrent) && newCurrent > 0 && !isNaN(newGoal) && newGoal > 0) {
      onSave(newCurrent, newGoal);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setter(value);
    }
  };
  
  const WeightInput: React.FC<{ label: string, value: string, onChange: (val: string) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">{label}</label>
        <div className="relative">
            <input
                type="text"
                inputMode="decimal"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-100 dark:bg-card-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">{weightUnit}</span>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div 
        className="bg-background-light dark:bg-card-dark w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between mb-6">
          <div className="w-6" />
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Weight & Goal</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <XMarkIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
        </header>

        <div className="space-y-4">
            <WeightInput label="Current Weight" value={current} onChange={(val) => handleInputChange(setCurrent, val)} />
            <WeightInput label="Goal Weight" value={goal} onChange={(val) => handleInputChange(setGoal, val)} />
        </div>
        
        <button 
          onClick={handleSave}
          disabled={!current || !goal || parseFloat(current) <= 0 || parseFloat(goal) <= 0}
          className="w-full mt-8 bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-accent/90 transition-colors disabled:bg-accent/50 disabled:cursor-not-allowed"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default GoalWeightModal;