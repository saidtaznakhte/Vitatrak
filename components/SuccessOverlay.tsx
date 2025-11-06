import React from 'react';
import { useSuccessState } from '../contexts/FeedbackContext';

const SuccessOverlay: React.FC = () => {
  const { isSuccessVisible } = useSuccessState();

  if (!isSuccessVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center animate-fade-in" style={{ animationDuration: '0.2s' }}>
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-lg w-40 h-40 rounded-3xl flex items-center justify-center animate-scale-in" style={{ animationDuration: '0.3s' }}>
        <svg className="w-20 h-20 text-accent" viewBox="0 0 52 52">
          <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
          <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>
      <style>{`
        .checkmark__circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 3;
          stroke-miterlimit: 10;
          stroke: #00A99D;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.1s forwards;
        }
        .checkmark__check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          stroke-width: 4;
          stroke: #00A99D;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
        }
        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessOverlay;
