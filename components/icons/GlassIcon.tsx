import React from 'react';

interface GlassIconProps {
  isFilled: boolean;
  onClick: () => void;
}

export const GlassIcon: React.FC<GlassIconProps> = ({ isFilled, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="relative w-14 h-20 group transition-transform duration-200 active:scale-90"
      aria-pressed={isFilled}
      aria-label={isFilled ? "Unlog one glass of water" : "Log one glass of water"}
    >
      {/* Liquid Fill Effect */}
      <div 
        className="absolute bottom-[10%] left-[10%] right-[10%] bg-blue-400 rounded-b-md transition-all duration-500 ease-in-out"
        style={{ height: isFilled ? '75%' : '0%' }}
      />
      
      {/* Glass Outline SVG */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
        className={`w-full h-full absolute inset-0 transition-colors duration-300 ${isFilled ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500'}`}
      >
        <path d="M5 3L6.46 18.23a2 2 0 002 1.77h7.08a2 2 0 002-1.77L19 3" />
      </svg>
    </button>
  );
};