import React from 'react';
import type { ActiveView } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { ChartIcon } from './icons/ChartIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { UsersIcon } from './icons/UsersIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface BottomNavProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const NavItem: React.FC<{
  label: string;
  view: ActiveView;
  activeView: ActiveView;
  onClick: (view: ActiveView) => void;
  children: React.ReactNode;
}> = ({ label, view, activeView, onClick, children }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => onClick(view)}
      className={`flex flex-col items-center justify-center w-full transition-all duration-300 ease-in-out transform active:scale-90 ${
        isActive ? 'text-accent' : 'text-text-secondary-dark hover:text-accent'
      }`}
      aria-label={`Go to ${label}`}
    >
      {children}
      <span className={`text-xs font-medium mt-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="fixed bottom-4 inset-x-4 max-w-sm mx-auto bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-2xl shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        <NavItem label="Home" view="dashboard" activeView={activeView} onClick={setActiveView}>
          <HomeIcon className="w-6 h-6" />
        </NavItem>
        <NavItem label="Progress" view="progress" activeView={activeView} onClick={setActiveView}>
          <ChartIcon className="w-6 h-6" />
        </NavItem>
        <NavItem label="Plan" view="plan" activeView={activeView} onClick={setActiveView}>
          <CalendarIcon className="w-6 h-6" />
        </NavItem>
        <NavItem label="Community" view="community" activeView={activeView} onClick={setActiveView}>
          <UsersIcon className="w-6 h-6" />
        </NavItem>
        <NavItem label="Settings" view="settings" activeView={activeView} onClick={setActiveView}>
          <SettingsIcon className="w-6 h-6" />
        </NavItem>
      </div>
    </nav>
  );
};

export default BottomNav;