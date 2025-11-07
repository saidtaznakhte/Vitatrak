import React, { useState, useRef } from 'react';
import type { UserProfile } from '../../types';
import { XMarkIcon } from '../icons/XMarkIcon';
import { CameraIcon } from '../icons/CameraIcon';
import { blobToBase64 } from '../utils/imageUtils';

interface EditProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (newProfile: UserProfile) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onClose, onSave }) => {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age.toString());
  const [avatar, setAvatar] = useState(profile.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await blobToBase64(file);
      setAvatar(base64);
    }
  };

  const handleSave = () => {
    const newAge = parseInt(age, 10);
    if (name.trim() && !isNaN(newAge) && newAge > 0) {
      onSave({
        name: name.trim(),
        age: newAge,
        avatarUrl: avatar,
      });
    }
  };
  
  const isSaveDisabled = !name.trim() || !age.trim() || parseInt(age, 10) <= 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div 
        className="bg-background-light dark:bg-card-dark w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between mb-6">
          <div className="w-6" />
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Edit Profile</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <XMarkIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
        </header>

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
                <img src={avatar} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover" />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-accent rounded-full text-white shadow-md hover:bg-accent/90 transition-colors"
                    aria-label="Change profile picture"
                >
                    <CameraIcon className="w-4 h-4" />
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden"
                />
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Name</label>
            <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-100 dark:bg-card-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Age</label>
            <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-100 dark:bg-card-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaveDisabled}
          className="w-full mt-8 bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-accent/90 transition-colors disabled:bg-accent/50 disabled:cursor-not-allowed"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfileModal;