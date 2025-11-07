import React from 'react';
import ShareableReport from './ShareableReport';
import { XMarkIcon } from './icons/XMarkIcon';
import { ShareIcon } from './icons/ShareIcon';
import type { ChartDataPoint } from '../types';

interface ShareModalProps {
  onClose: () => void;
  userName: string;
  avatarUrl: string;
  streak: number;
  currentWeight: number;
  weightChange: number;
  weightData: ChartDataPoint[];
}

const ShareModal: React.FC<ShareModalProps> = ({
  onClose,
  userName,
  avatarUrl,
  streak,
  currentWeight,
  weightChange,
  weightData,
}) => {
  const handleShare = async () => {
    const shareText = `I'm on a ${streak}-day streak with VitaTrack! Feeling great and making progress. Current weight: ${currentWeight} lbs. #VitaTrack #HealthJourney`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My VitaTrack Progress',
          text: shareText,
          url: window.location.href, // Or a link to the app
        });
        console.log('Successfully shared');
      } catch (error) {
        console.error('Error sharing:', error);
        alert("Sharing failed. You can still take a screenshot!");
      }
    } else {
      alert("Sharing isn't supported on this browser. Try taking a screenshot!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" style={{ animationDuration: '0.3s' }}>
      <div className="bg-background-light dark:bg-background-dark w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-scale-in flex flex-col space-y-4">
        <header className="flex items-center justify-between">
            <div className="w-6"/>
            <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Share Your Progress</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                <XMarkIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
            </button>
        </header>
        
        <ShareableReport
          userName={userName}
          avatarUrl={avatarUrl}
          streak={streak}
          currentWeight={currentWeight}
          weightChange={weightChange}
          weightData={weightData}
        />

        <button 
          onClick={handleShare}
          className="w-full bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-accent/90 transition-colors"
        >
          <ShareIcon className="w-5 h-5 mr-2" />
          Share Now
        </button>
      </div>
    </div>
  );
};

export default ShareModal;