import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';
import { CameraSlashIcon } from './icons/CameraSlashIcon';
import { SparkleIcon } from './icons/SparkleIcon';

interface VitalsScanModalProps {
  onClose: () => void;
}

const VitalsScanModal: React.FC<VitalsScanModalProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'complete' | 'permissionDenied' | 'error'>('idle');
  const [vitals, setVitals] = useState<{ heartRate: number; spO2: number } | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let stream: MediaStream | null = null;
    // Fix: Use ReturnType<typeof setTimeout> for browser compatibility instead of NodeJS.Timeout.
    let scanTimer: ReturnType<typeof setTimeout>;
    
    const startCamera = async () => {
      setScanState('idle'); // Reset on each attempt
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setScanState('scanning');

        scanTimer = setTimeout(() => {
          // Simulate vitals reading
          const heartRate = Math.floor(Math.random() * (85 - 65 + 1)) + 65; // 65-85 bpm
          const spO2 = Math.floor(Math.random() * (99 - 96 + 1)) + 96; // 96-99%
          setVitals({ heartRate, spO2 });
          setScanState('complete');
        }, 5000); // 5-second scan

      } catch (err) {
        console.error("Error accessing camera:", err);
        if (err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
          setScanState('permissionDenied');
        } else {
          setScanState('error');
        }
      }
    };

    startCamera();

    return () => {
      clearTimeout(scanTimer);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onClose, retry]);

  const handleRetry = () => {
    setRetry(r => r + 1);
  };

  const renderContent = () => {
    switch (scanState) {
      case 'permissionDenied':
        return (
          <div className="animate-fade-in w-full flex flex-col items-center">
            <CameraSlashIcon className="w-16 h-16 text-accent-red mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Camera Access Denied</h2>
            <p className="text-gray-300 mb-6">VitaTrack needs camera access to scan your vitals. Please enable it in your browser settings.</p>
            <button onClick={handleRetry} className="w-full bg-accent text-white font-bold py-3 px-4 rounded-lg">
              Try Again
            </button>
          </div>
        );
      case 'error':
        return (
          <div className="animate-fade-in w-full flex flex-col items-center">
            <h2 className="text-xl font-bold text-white mb-2">Camera Error</h2>
            <p className="text-gray-300 mb-6">Could not access the camera. Please ensure it's not in use by another app and try again.</p>
            <button onClick={onClose} className="w-full bg-accent/50 text-white font-bold py-3 px-4 rounded-lg">
              Close
            </button>
          </div>
        );
      case 'complete':
        return vitals && (
          <div className="animate-fade-in w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Scan Complete!</h2>
            <div className="grid grid-cols-2 gap-4 text-white">
                <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-xs text-gray-300">Heart Rate</p>
                    <p className="text-2xl font-bold">{vitals.heartRate} <span className="text-base font-normal">bpm</span></p>
                </div>
                 <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-xs text-gray-300">SpO2</p>
                    <p className="text-2xl font-bold">{vitals.spO2}<span className="text-base font-normal">%</span></p>
                </div>
            </div>
            <button onClick={onClose} className="w-full mt-6 bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center">
              <SparkleIcon className="w-5 h-5 mr-2" />
              Update Vitals
            </button>
          </div>
        );
      case 'scanning':
        return <h2 className="text-xl font-bold text-white">Scanning Vitals...</h2>;
      case 'idle':
      default:
        return <h2 className="text-xl font-bold text-white">Initializing Camera...</h2>;
    }
  };


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-card-dark w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-scale-in flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 z-10">
          <XMarkIcon className="w-5 h-5 text-white" />
        </button>
        
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-black">
          <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover transition-opacity ${scanState === 'scanning' ? 'opacity-100' : 'opacity-0'}`} />
          {scanState === 'scanning' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/50">
              <p className="font-semibold text-white mb-2">Place your finger over the camera</p>
              <div className="w-full h-1 bg-accent/50 rounded-full overflow-hidden">
                <div className="h-full bg-accent animate-scan-progress"></div>
              </div>
              <p className="text-sm text-gray-300 mt-2">Analyzing...</p>
            </div>
          )}
        </div>

        {renderContent()}

      </div>
       <style>{`
        @keyframes scanProgress {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .animate-scan-progress {
          animation: scanProgress 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default VitalsScanModal;