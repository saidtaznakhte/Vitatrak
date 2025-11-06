import React from 'react';
import { XMarkIcon } from './icons/XMarkIcon';

interface QuickLogSuggestionProps {
  onClose: () => void;
  onLogOther: (mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => void;
}

const QuickLogSuggestion: React.FC<QuickLogSuggestionProps> = ({ onClose, onLogOther }) => {
  const getMealSuggestion = (): 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' => {
    const hour = new Date().getHours();
    if (hour < 11) return "Breakfast";
    if (hour < 16) return "Lunch";
    if (hour < 22) return "Dinner";
    return "Snack";
  };

  const mealType = getMealSuggestion();

  const handleLogUsual = () => {
    // In a real app, this would log a pre-defined "usual" meal.
    // For now, we can just show an alert and close.
    alert(`Logged your usual ${mealType}!`);
    onClose();
  };
  
  const handleLogOther = () => {
    onLogOther(mealType);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end justify-center" aria-modal="true" role="dialog">
      <div 
        className="bg-background-light dark:bg-background-dark w-full max-w-lg rounded-t-3xl shadow-2xl pt-6 px-6 pb-24 flex flex-col"
        style={{ animation: 'slideInUp 0.3s ease-out' }}
      >
        <header className="flex items-center justify-between pb-4 mb-4">
          <div className="w-6" />
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Quick Log</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <XMarkIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
        </header>

        <div className="text-center space-y-4">
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">It's time for {mealType}.</p>
            <button 
                onClick={handleLogUsual}
                className="w-full bg-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-accent/90 transition-colors"
            >
                Log Usual {mealType}
            </button>
             <button 
                onClick={handleLogOther}
                className="w-full bg-accent/20 text-accent font-bold py-3 px-4 rounded-lg hover:bg-accent/30 transition-colors"
            >
                Log Something Else
            </button>
        </div>
      </div>
      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default QuickLogSuggestion;