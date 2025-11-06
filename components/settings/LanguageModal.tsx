import React, { useState } from 'react';
import type { Language } from '../../types';
import { XMarkIcon } from '../icons/XMarkIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { useTranslation } from '../../contexts/LanguageContext';

interface LanguageModalProps {
  onClose: () => void;
}

const languages: { code: Language, nameKey: any, nativeName: string }[] = [
  { code: 'en', nameKey: 'english', nativeName: 'English' },
  { code: 'es', nameKey: 'spanish', nativeName: 'Español' },
  { code: 'fr', nameKey: 'french', nativeName: 'Français' },
  { code: 'de', nameKey: 'german', nativeName: 'Deutsch' },
  { code: 'ar', nameKey: 'arabic', nativeName: 'العربية' },
];

const LanguageModal: React.FC<LanguageModalProps> = ({ onClose }) => {
  const { language, setLanguage, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);

  const handleSave = () => {
    setLanguage(selectedLanguage);
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
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">{t('select_language')}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <XMarkIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
        </header>

        <div className="space-y-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`w-full flex justify-between items-center text-left p-4 rounded-lg transition-colors ${
                selectedLanguage === lang.code 
                  ? 'bg-accent/10 text-accent' 
                  : 'text-text-primary-light dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-white/10'
              }`}
            >
              <span className="font-semibold">{lang.nativeName}</span>
              {selectedLanguage === lang.code && <CheckIcon className="w-5 h-5" />}
            </button>
          ))}
        </div>
        
        <button 
          onClick={handleSave}
          className="w-full mt-8 bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-accent/90 transition-colors"
        >
          {t('save_changes')}
        </button>
      </div>
    </div>
  );
};

export default LanguageModal;
