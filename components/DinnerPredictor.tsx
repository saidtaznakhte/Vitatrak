import React from 'react';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface DinnerPredictorProps {
  calories: number;
  protein: number;
}

const DinnerPredictor: React.FC<DinnerPredictorProps> = ({ calories, protein }) => {
  const proteinSuggestion = Math.max(0, Math.round(protein / 5) * 5); // Round to nearest 5
  const calorieSuggestion = Math.max(0, Math.round(calories / 50) * 50); // Round to nearest 50
    
  if (calories <= 100) return null; // Don't show if macros are mostly met

  return (
    <div className="bg-accent/10 dark:bg-accent/20 p-4 rounded-2xl shadow-lg flex items-start space-x-4 animate-fade-in">
      <div className="bg-accent/20 p-2 rounded-full">
        <LightbulbIcon className="w-6 h-6 text-accent" />
      </div>
      <div>
        <h3 className="font-bold text-accent">Dinner Idea</h3>
        <p className="text-sm text-text-primary-light dark:text-text-primary-dark mt-1">
          To hit your goals, aim for a dinner with around
          <span className="font-bold"> {proteinSuggestion}g of protein</span> and under
          <span className="font-bold"> {calorieSuggestion} calories</span>.
        </p>
      </div>
    </div>
  );
};

export default DinnerPredictor;
