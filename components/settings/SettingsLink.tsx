import React from 'react';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';

interface SettingsLinkProps {
  href: string;
  title: string;
  subtitle?: string;
  trailingText?: string;
  isDestructive?: boolean;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const SettingsLink: React.FC<SettingsLinkProps> = ({ href, title, subtitle, trailingText, isDestructive = false, onClick }) => {
  const textColor = isDestructive ? 'text-red-500 dark:text-red-500' : 'text-text-primary-light dark:text-text-primary-dark';
  const hoverColor = isDestructive ? 'hover:bg-red-50 dark:hover:bg-red-900/20' : 'hover:bg-gray-100 dark:hover:bg-white/10';
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`flex justify-between items-center p-4 first:rounded-t-2xl last:rounded-b-2xl transition-colors ${hoverColor}`}
    >
      <div className="flex flex-col">
        <span className={`font-semibold ${textColor}`}>{title}</span>
        {subtitle && <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center space-x-2">
        {trailingText && <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{trailingText}</span>}
        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
      </div>
    </a>
  );
};

export default SettingsLink;