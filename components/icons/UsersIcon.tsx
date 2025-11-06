import React from 'react';

export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.037 1.253-2.013 2.008-2.915a9.094 9.094 0 014.282 2.285 3 3 0 01-4.242 4.242M12 18.75c-2.06 0-3.95-1.002-5.183-2.625a3.375 3.375 0 01-1.018-2.327c0-1.84 1.492-3.323 3.323-3.323s3.323 1.483 3.323 3.323c0 .82-.295 1.583-.787 2.18M12.75 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" 
    />
  </svg>
);
