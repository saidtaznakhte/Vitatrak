import React from 'react';
import { HeartIcon } from './icons/HeartIcon';
import { BloodPressureIcon } from './icons/BloodPressureIcon';
import { BloodDropIcon } from './icons/BloodDropIcon';
import { CameraIcon } from './icons/CameraIcon';
import type { Vitals } from '../types';

interface VitalsMonitorProps {
  onScan: () => void;
  vitals: Vitals;
}

const VitalsMonitor: React.FC<VitalsMonitorProps> = ({ onScan, vitals }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg">
      <div className="space-y-4">
        {/* Heart Rate */}
        <div className="flex items-center">
          <div className="p-2 bg-red-500/10 rounded-full">
            <HeartIcon className="w-6 h-6 text-red-500" />
          </div>
          <div className="ml-4 flex-grow">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Heart Rate</p>
            <p className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">{vitals.heartRate ?? '--'} bpm</p>
          </div>
          {vitals.heartRate && <span className="text-sm font-semibold text-accent py-1 px-3 bg-accent/10 rounded-full">Resting</span>}
        </div>
        
        {/* Blood Pressure */}
        <div className="flex items-center">
          <div className="p-2 bg-purple-500/10 rounded-full">
            <BloodPressureIcon className="w-6 h-6 text-purple-500" />
          </div>
          <div className="ml-4 flex-grow">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Blood Pressure</p>
            <p className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">{vitals.bloodPressure ?? '--'} mmHg</p>
          </div>
          {vitals.bloodPressure && <span className="text-sm font-semibold text-accent py-1 px-3 bg-accent/10 rounded-full">Normal</span>}
        </div>
        
        {/* SpO2 */}
        <div className="flex items-center">
          <div className="p-2 bg-blue-500/10 rounded-full">
            <BloodDropIcon className="w-6 h-6 text-blue-500" />
          </div>
          <div className="ml-4 flex-grow">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">SpO2</p>
            <p className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">{vitals.spO2 ?? '--'}%</p>
          </div>
          {vitals.spO2 && <span className="text-sm font-semibold text-accent py-1 px-3 bg-accent/10 rounded-full">Normal</span>}
        </div>
      </div>
      <button 
        onClick={onScan}
        className="w-full mt-6 bg-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center"
      >
        <CameraIcon className="w-5 h-5 mr-2" />
        Scan Vitals
      </button>
    </div>
  );
};

export default VitalsMonitor;
