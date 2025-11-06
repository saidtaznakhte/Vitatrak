import React from 'react';

export const CameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M6.827 6.175A2.211 2.211 0 016.743 7.82l-2.066 4.96a.5.5 0 00.103.585l3.12 3.12a.5.5 0 00.586.103l4.96-2.065a2.211 2.211 0 011.646-.082l5.09 2.545a2.5 2.5 0 002.398-4.22l-1.55-3.1a2.25 2.25 0 00-1.632-1.22l-4.24-1.413a2.25 2.25 0 00-2.322 1.082l-1.927 3.854-1.927-3.854a2.25 2.25 0 00-2.322-1.082L6.827 6.175z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" 
    />
  </svg>
);