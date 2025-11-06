import React, { useState } from 'react';
import type { MacroGoals } from '../../types';
import { XMarkIcon } from '../icons/XMarkIcon';

interface AdjustMacrosModalProps {
  currentGoals: MacroGoals;
  onClose: () => void;
  onSave: (newGoals: MacroGoals) => void;
}

const AdjustMacrosModal: React.FC<AdjustMacrosModalProps> = ({ currentGoals, onClose, onSave }) => {
  const [goals, setGoals] = useState({
    Calories: currentGoals.Calories.goal,
    Protein: currentGoals.Protein.goal,
    Carbs: currentGoals.Carbs.goal,
    Fats: currentGoals.Fats.goal,
  });

  const handleSave = () => {
    const newGoals: MacroGoals = {
      Calories: { goal: goals.Calories, unit: '' },
      Protein: { goal: goals.Protein, unit: 'g' },
      Carbs: { goal: goals.Carbs, unit: 'g' },
      Fats: { goal: goals.Fats, unit: 'g' },
    };
    onSave(newGoals);
  };

  const handleInputChange = (macro: keyof typeof goals, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setGoals(prev => ({ ...prev, [macro]: numValue }));
    } else if (value === '') {
      setGoals(prev => ({ ...prev, [macro]: 0 }));
    }
  };
  
  const MacroInput: React.FC<{ label: keyof typeof goals, unit: string }> = ({ label, unit }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">{label}</label>
        <div className="relative">
            <input
                type="number"
                value={goals[label]}
                onChange={(e) => handleInputChange(label, e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-100 dark:bg-card-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">{unit}</span>}
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
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Adjust Macros</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <XMarkIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
        </header>

        <div className="space-y-4">
            <MacroInput label="Calories" unit="kcal" />
            <MacroInput label="Protein" unit="g" />
            <MacroInput label="Carbs" unit="g" />
            <MacroInput label="Fats" unit="g" />
        </div>
        
        <button 
          onClick={handleSave}
          className="w-full mt-8 bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-accent/90 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AdjustMacrosModal;