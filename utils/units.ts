import type { UnitSystem } from '../types';

const KG_TO_LBS = 2.20462;
const CM_TO_INCHES = 0.393701;

export const convertWeightForDisplay = (kg: number, unitSystem: UnitSystem): number => {
  if (unitSystem === 'imperial') {
    return parseFloat((kg * KG_TO_LBS).toFixed(1));
  }
  return parseFloat(kg.toFixed(1));
};

export const convertWeightToKg = (weight: number, unitSystem: UnitSystem): number => {
  if (unitSystem === 'imperial') {
    return weight / KG_TO_LBS;
  }
  return weight;
};

// returns { feet: 5, inches: 10 } or { meters: 1.78 }
export const convertHeightForDisplay = (cm: number, unitSystem: UnitSystem): { feet?: number; inches?: number; meters?: number } => {
  if (unitSystem === 'imperial') {
    if (!cm || cm === 0) return { feet: 0, inches: 0 };
    const totalInches = cm * CM_TO_INCHES;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  }
  if (!cm || cm === 0) return { meters: 0 };
  return { meters: parseFloat((cm / 100).toFixed(2)) };
};

export const convertHeightToCm = (height: { feet?: number; inches?: number; meters?: number }, unitSystem: UnitSystem): number => {
  if (unitSystem === 'imperial') {
    const feet = height.feet || 0;
    const inches = height.inches || 0;
    const totalInches = (feet * 12) + inches;
    return totalInches / CM_TO_INCHES;
  }
  const meters = height.meters || 0;
  return meters * 100;
};

export const getWeightUnit = (unitSystem: UnitSystem): string => (unitSystem === 'imperial' ? 'lbs' : 'kg');

export const getHeightUnit = (unitSystem: UnitSystem): string => (unitSystem === 'imperial' ? 'ft/in' : 'm');
