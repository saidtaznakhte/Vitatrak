
import React, { useState } from 'react';
import type { Theme, MacroGoals, WeightEntry, UserProfile } from '../types';
import ProfileHeader from './settings/ProfileHeader';
import InviteCard from './settings/InviteCard';
import SettingsSection from './settings/SettingsSection';
import SettingsLink from './settings/SettingsLink';
import SettingsToggle from './settings/SettingsToggle';
import AdjustMacrosModal from './settings/AdjustMacrosModal';
import { useFeedback } from '../contexts/FeedbackContext';
import GoalWeightModal from './settings/GoalWeightModal';
import WeightHistoryModal from './settings/WeightHistoryModal';
import EditProfileModal from './settings/EditProfileModal';
import UnitsModal from './settings/UnitsModal';

interface SettingsProps {
  currentTheme: Theme;
  toggleTheme: () => void;
  macroGoals: MacroGoals;
  setMacroGoals: (newGoals: MacroGoals) => void;
  currentWeight: number;
  goalWeight: number;
  onUpdateWeightAndGoal: (newCurrent: number, newGoal: number) => void;
  weightData: WeightEntry[];
  onDeleteWeightEntry: (id: number) => void;
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  currentTheme, toggleTheme, macroGoals, setMacroGoals, currentWeight, goalWeight, onUpdateWeightAndGoal, weightData, onDeleteWeightEntry, profile, onUpdateProfile 
}) => {
  const [isMacrosModalOpen, setIsMacrosModalOpen] = useState(false);
  const [isGoalWeightModalOpen, setIsGoalWeightModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isUnitsModalOpen, setIsUnitsModalOpen] = useState(false);
  const { showSuccess } = useFeedback();

  const handleSaveMacros = (newGoals: MacroGoals) => {
    setMacroGoals(newGoals);
    setIsMacrosModalOpen(false);
    showSuccess();
  };
  
  const handleSaveWeightAndGoal = (newCurrent: number, newGoal: number) => {
    onUpdateWeightAndGoal(newCurrent, newGoal);
    setIsGoalWeightModalOpen(false);
    showSuccess();
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    onUpdateProfile(newProfile);
    setIsEditProfileModalOpen(false);
    showSuccess();
  };
  
  const handleDeleteWeight = (id: number) => {
    onDeleteWeightEntry(id);
    // Potentially show feedback
  };

  return (
    <>
      <div className="p-4 sm:p-6 pb-28 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">Settings</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Customize your app experience.</p>
        </header>

        <ProfileHeader 
          name={profile.name} 
          age={profile.age} 
          height={profile.height}
          unitSystem={profile.unitSystem}
          avatarUrl={profile.avatarUrl}
          onClick={() => setIsEditProfileModalOpen(true)}
        />
        
        <InviteCard />

        <SettingsSection title="Personal Details">
          <SettingsLink href="#" title="Adjust macronutrients" onClick={() => setIsMacrosModalOpen(true)} />
          <SettingsLink href="#" title="Goal & current weight" onClick={() => setIsGoalWeightModalOpen(true)}/>
          <SettingsLink href="#" title="Weight history" onClick={() => setIsHistoryModalOpen(true)} />
        </SettingsSection>
        
         <SettingsSection title="Integrations">
          <SettingsToggle title="Connect to Apple Health" initialValue={true} />
          <SettingsToggle title="Connect to Google Fit" initialValue={false} />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingsLink href="#" title="Units" onClick={() => setIsUnitsModalOpen(true)} />
          <SettingsLink href="#" title="Appearance" subtitle={`Choose light, dark, or system appearance.`} trailingText={currentTheme === 'light' ? 'Light' : 'Dark'} onClick={toggleTheme}/>
          <SettingsToggle title="Add Burned Calories" initialValue={true} />
          <SettingsToggle title="Rollover Calories" initialValue={true} />
        </SettingsSection>

        <SettingsSection title="Home Screen Widgets">
          <div className="p-4">
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Your macronutrient breakdown is now shown in a combined chart on the home screen for a comprehensive, at-a-glance view.
              </p>
          </div>
        </SettingsSection>
        
        <SettingsSection title="Legal">
          <SettingsLink href="#" title="Terms and Conditions" />
          <SettingsLink href="#" title="Privacy Policy" />
          <SettingsLink href="#" title="Support Email" />
          <SettingsLink href="#" title="Feature Request" />
          <SettingsLink href="#" title="Delete Account?" isDestructive={true} />
        </SettingsSection>
        
        <div className="pt-4">
          <button className="w-full text-center py-3 text-red-500 font-semibold bg-card-light dark:bg-card-dark hover:bg-red-500/10 rounded-lg transition-colors">
            Logout
          </button>
        </div>
        
        <p className="text-center text-xs text-text-secondary-light dark:text-text-secondary-dark pt-4">
          VERSION 1.0.100
        </p>
      </div>

      {isMacrosModalOpen && (
        <AdjustMacrosModal
          currentGoals={macroGoals}
          onClose={() => setIsMacrosModalOpen(false)}
          onSave={handleSaveMacros}
        />
      )}

      {isGoalWeightModalOpen && (
        <GoalWeightModal
          currentWeight={currentWeight}
          goalWeight={goalWeight}
          onClose={() => setIsGoalWeightModalOpen(false)}
          onSave={handleSaveWeightAndGoal}
          profile={profile}
        />
      )}

      {isHistoryModalOpen && (
        <WeightHistoryModal
          history={weightData}
          onClose={() => setIsHistoryModalOpen(false)}
          onDelete={handleDeleteWeight}
          profile={profile}
        />
      )}

      {isEditProfileModalOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditProfileModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
      {isUnitsModalOpen && (
        <UnitsModal
          profile={profile}
          onClose={() => setIsUnitsModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </>
  );
};

export default Settings;