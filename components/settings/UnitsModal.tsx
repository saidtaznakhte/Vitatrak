import React, { useState } from 'react';
import type { UserProfile, UnitSystem } from '../../types';
import { XMarkIcon } from '../icons/XMarkIcon';
import { CheckIcon } from '../icons/CheckIcon';

interface UnitsModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (newProfile: UserProfile) => void;
}

const unitOptions: { code: UnitSystem, name: string, description: string }[] = [
  { code: 'metric', name: 'Metric', description: 'kg, meters' },
  { code: 'imperial', name: 'Imperial', description: 'lbs, feet' },
];

const UnitsModal: React.FC<UnitsModalProps> = ({ profile, onClose, onSave }) => {
  const [selectedSystem, setSelectedSystem] = useState<UnitSystem>(profile.unitSystem || 'metric');

  const handleSave = () => {
    onSave({ ...profile, unitSystem: selectedSystem });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div 
        className="bg-background-light dark:bg-card-dark w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between mb-6">
          <div className="w-6" />
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Select Units</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <XMarkIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
        </header>

        <div className="space-y-2">
          {unitOptions.map(opt => (
            <button
              key={opt.code}
              onClick={() => setSelectedSystem(opt.code)}
              className={`w-full flex justify-between items-center text-left p-4 rounded-lg transition-colors ${
                selectedSystem === opt.code 
                  ? 'bg-accent/10 text-accent' 
                  : 'text-text-primary-light dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-white/10'
              }`}
            >
              <div>
                  <span className="font-semibold">{opt.name}</span>
                  <p className="text-xs">{opt.description}</p>
              </div>
              {selectedSystem === opt.code && <CheckIcon className="w-5 h-5" />}
            </button>
          ))}
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

export default UnitsModal;
