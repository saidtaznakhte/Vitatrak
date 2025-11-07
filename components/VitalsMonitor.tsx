
import React from 'react';
import { HeartIcon } from './icons/HeartIcon';
import { BloodPressureIcon } from './icons/BloodPressureIcon';
import { BloodDropIcon } from './icons/BloodDropIcon';
import type { Vitals } from '../types';
import { ScanVitalsIcon } from './icons/ScanVitalsIcon';

interface VitalsMonitorProps {
  onScan: () => void;
  vitals: Vitals;
}

const VitalStat: React.FC<{ icon: React.ReactNode; label: string; value: string | null; unit: string; }> = ({ icon, label, value, unit }) => (
    <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full flex-shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{label}</p>
            <p className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">
                {value ?? '--'} <span className="font-medium">{unit}</span>
            </p>
        </div>
    </div>
);

const VitalsMonitor: React.FC<VitalsMonitorProps> = ({ onScan, vitals }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg">
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4">
            <VitalStat
                icon={<div className="bg-red-100 dark:bg-red-500/20 p-2 rounded-full"><HeartIcon className="w-6 h-6 text-red-500" /></div>}
                label="Heart Rate"
                value={vitals.heartRate?.toString() || null}
                unit="bpm"
            />
            <VitalStat
                icon={<div className="bg-pink-100 dark:bg-pink-500/20 p-2 rounded-full"><BloodPressureIcon className="w-6 h-6 text-pink-500" /></div>}
                label="Blood Pressure"
                value={vitals.bloodPressure}
                unit="mmHg"
            />
             <VitalStat
                icon={<div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-full"><BloodDropIcon className="w-6 h-6 text-blue-500" /></div>}
                label="SpO2"
                value={vitals.spO2?.toString() || null}
                unit="%"
            />
        </div>
        <button 
            onClick={onScan}
            className="w-full mt-4 bg-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center"
            >
            <ScanVitalsIcon className="w-5 h-5 mr-2" />
            Scan Vitals
        </button>
    </div>
  );
};

export default VitalsMonitor;
