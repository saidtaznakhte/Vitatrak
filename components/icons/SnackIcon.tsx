import React from 'react';

export const SnackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M19.5 12.75c0 1.243-1.007 2.25-2.25 2.25h-10.5c-1.243 0-2.25-1.007-2.25-2.25S5.507 10.5 6.75 10.5h10.5c1.243 0 2.25 1.007 2.25 2.25z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M15 10.5V9c0-1.657-1.343-3-3-3s-3 1.343-3 3v1.5" 
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V5.25" />
  </svg>
);