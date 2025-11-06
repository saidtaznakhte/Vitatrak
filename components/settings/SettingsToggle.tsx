import React, { useState } from 'react';

interface SettingsToggleProps {
  title: string;
  initialValue: boolean;
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({ title, initialValue }) => {
  const [isOn, setIsOn] = useState(initialValue);

  return (
    <div className="flex justify-between items-center p-4 first:rounded-t-2xl last:rounded-b-2xl">
      <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">{title}</span>
      <button
        onClick={() => setIsOn(!isOn)}
        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none ${
          isOn ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        aria-checked={isOn}
        role="switch"
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default SettingsToggle;