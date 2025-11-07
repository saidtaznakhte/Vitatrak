import React from 'react';

interface ProfileHeaderProps {
  name: string;
  age: number;
  avatarUrl: string;
  onClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, age, avatarUrl, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center space-x-4 p-4 bg-card-light dark:bg-card-dark rounded-2xl shadow-lg text-left transition-transform active:scale-[0.98]"
      aria-label="Edit Profile"
    >
      <img src={avatarUrl} alt="User Avatar" className="w-12 h-12 rounded-full object-cover" />
      <div>
        <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">{name}</h2>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{age} years old</p>
      </div>
    </button>
  );
};

export default ProfileHeader;