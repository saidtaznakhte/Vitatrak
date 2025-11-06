import React from 'react';

export const BarcodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M4.5 12.75l6 6 9-13.5" />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M9 4.5v15m6-15v15" 
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 17.25h16.5" />
  </svg>
);