import React from 'react';

export const BedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 1.5L12 3l1.5-1.5" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M3.75 7.5h16.5v1.5H3.75v-1.5z" 
    />
  </svg>
);