import React from 'react';

export const WaterDropIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}>
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 21.75c-4.142 0-7.5-3.358-7.5-7.5S12 3 12 3s7.5 4.858 7.5 11.25c0 4.142-3.358 7.5-7.5 7.5z" 
    />
  </svg>
);