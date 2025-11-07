import React from 'react';
import type { UserProfile, WeightEntry } from '../../types';
import { XMarkIcon } from '../icons/XMarkIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { convertWeightForDisplay, getWeightUnit } from '../../utils/units';

interface WeightHistoryModalProps {
  history: WeightEntry[];
  onClose: () => void;
  onDelete: (id: number) => void;
  profile: UserProfile;
}

const WeightHistoryModal: React.FC<WeightHistoryModalProps> = ({ history, onClose, onDelete, profile }) => {
  const unitSystem = profile.unitSystem || 'metric';
  const weightUnit = getWeightUnit(unitSystem);
  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div 
        className="bg-background-light dark:bg-card-dark w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between mb-6">
          <div className="w-6" />
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Weight History</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <XMarkIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
        </header>

        {sortedHistory.length > 0 ? (
          <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {sortedHistory.map((entry) => (
              <li key={entry.id} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-card-dark/50 rounded-lg">
                <span className="font-semibold text-sm text-text-primary-light dark:text-text-primary-dark">
                  {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-text-primary-light dark:text-text-primary-dark">{convertWeightForDisplay(entry.weight, unitSystem)} {weightUnit}</span>
                  <button onClick={() => onDelete(entry.id)} className="p-1 text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 dark:hover:text-red-500 transition-colors" aria-label="Delete weight entry">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-text-secondary-light dark:text-text-secondary-dark py-8">No weight history found.</p>
        )}
      </div>
    </div>
  );
};

export default WeightHistoryModal;