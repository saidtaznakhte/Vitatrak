import React from 'react';

export const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311V21m-3.75 0V21" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M9.75 15.75c0-1.894 1.29-3.512 3-4.142m0 0a5.996 5.996 0 013.75 0m-3.75 0a5.996 5.996 0 00-3.75 0m3.75 4.142V15.75m0-3.375c.621 0 1.125-.504 1.125-1.125s-.504-1.125-1.125-1.125-1.125.504-1.125 1.125.504 1.125 1.125 1.125z" 
    />
  </svg>
);
