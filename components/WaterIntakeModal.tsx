import React from 'react';
import { GlassIcon } from './icons/GlassIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { triggerHapticFeedback } from './utils/haptics';

interface WaterIntakeModalProps {
  currentIntake: number;
  goal: number;
  onClose: () => void;
  onIntakeChange: (newIntake: number) => void;
}

const WaterIntakeModal: React.FC<WaterIntakeModalProps> = ({ currentIntake, goal, onClose, onIntakeChange }) => {
  const glasses = Array.from({ length: goal }, (_, i) => i);

  const handleGlassClick = (index: number) => {
    const newIntake = currentIntake === index + 1 ? index : index + 1;
    onIntakeChange(newIntake);
    triggerHapticFeedback();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div 
        className="bg-background-light dark:bg-card-dark w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-scale-in"
      >
        <header className="flex items-center justify-between mb-6">
          <div/>
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Log Water</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <XMarkIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
        </header>

        <div className="grid grid-cols-4 gap-4 justify-items-center">
          {glasses.map(index => (
            <GlassIcon
              key={index}
              isFilled={index < currentIntake}
              onClick={() => handleGlassClick(index)}
            />
          ))}
        </div>
        
        <p className="text-center text-text-secondary-light dark:text-text-secondary-dark mt-6">
          Tap a glass to log your intake.
        </p>

      </div>
    </div>
  );
};

export default WaterIntakeModal;
