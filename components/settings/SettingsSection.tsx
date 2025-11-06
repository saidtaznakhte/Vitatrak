import React from 'react';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  return (
    <div>
      <h3 className="px-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">{title.toUpperCase()}</h3>
      <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-lg divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </div>
    </div>
  );
};

export default SettingsSection;