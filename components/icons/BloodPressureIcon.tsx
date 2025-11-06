
import React from 'react';

export const BloodPressureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12.75h7.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 10-12 0v1.5a6 6 0 006 6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75v3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21.75h3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25V6" />
  </svg>
);
