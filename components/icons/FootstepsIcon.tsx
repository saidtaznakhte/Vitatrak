import React from 'react';

export const FootstepsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M12.75 8.25L9 12l3.75 3.75M3 15.75h13.5" 
    />
     <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M11.25 8.25h10.5" 
    />
  </svg>
);