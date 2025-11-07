
import React from 'react';

export const Streak7Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="currentColor" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}>
    <path 
      fill="none"
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" 
    />
    <circle cx="8.5" cy="12.5" r="1.2" stroke="none" />
    <circle cx="12" cy="12.5" r="1.2" stroke="none" />
    <circle cx="15.5" cy="12.5" r="1.2" stroke="none" />
    <circle cx="8.5" cy="16.5" r="1.2" stroke="none" />
    <circle cx="12" cy="16.5" r="1.2" stroke="none" />
    <circle cx="15.5" cy="16.5" r="1.2" stroke="none" />
  </svg>
);
