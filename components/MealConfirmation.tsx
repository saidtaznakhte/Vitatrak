

import React, { useState, useMemo } from 'react';
import type { MealNutritionInfo } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { EllipsisIcon } from './icons/EllipsisIcon';
import { FlameIcon } from './icons/FlameIcon';
import { CarbsIcon } from './icons/CarbsIcon';
import { ProteinIcon } from './icons/ProteinIcon';
import { FatsIcon } from './icons/FatsIcon';
import { HealthScoreIcon } from './icons/HealthScoreIcon';
import { SparkleIcon } from './icons/SparkleIcon';
import { triggerHapticFeedback } from './utils/haptics';
import Sources from './Sources';

interface MealConfirmationProps {
  initialMeals: MealNutritionInfo[];
  imagePreviewUrl: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  onConfirm: (confirmedMeals: MealNutritionInfo[]) => void;
  onBack: () => void;
  sources: any[];
}

const NutritionInfoCard: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3">
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-card-dark/80">
            {icon}
        </div>
        <div>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{label}</p>
            <p className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">{value}</p>
        </div>
    </div>
);

const MealConfirmation: React.FC<MealConfirmationProps> = ({ initialMeals, imagePreviewUrl, mealType, onConfirm, onBack, sources }) => {
    const [servings, setServings] = useState(1);

    const aggregatedMeal = useMemo(() => {
        if (!initialMeals || initialMeals.length === 0) {
            return { name: 'Unknown Meal', calories: 0, protein: 0, carbs: 0, fats: 0 };
        }
        return initialMeals.reduce((acc, meal) => ({
            name: initialMeals.length > 1 ? 'Combined Meal' : meal.name,
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.protein,
            carbs: acc.carbs + meal.carbs,
            fats: acc.fats + meal.fats,
        }), { name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
    }, [initialMeals]);

    const displayedMeal = useMemo(() => ({
        name: aggregatedMeal.name,
        calories: Math.round(aggregatedMeal.calories * servings),
        protein: Math.round(aggregatedMeal.protein * servings),
        carbs: Math.round(aggregatedMeal.carbs * servings),
        fats: Math.round(aggregatedMeal.fats * servings),
    }), [aggregatedMeal, servings]);

    const healthScore = useMemo(() => {
        const { calories, protein, carbs, fats } = displayedMeal;
        if (calories === 0) return 0;
        const proteinRatio = (protein * 4) / calories;
        const carbsRatio = (carbs * 4) / calories;
        const fatsRatio = (fats * 9) / calories;
        
        let score = 5;
        score += proteinRatio * 10; // Bonus for protein
        if (carbsRatio > 0.6) score -= (carbsRatio - 0.6) * 10; // Penalty for very high carbs
        if (fatsRatio > 0.4) score -= (fatsRatio - 0.4) * 10; // Penalty for very high fats
        
        return parseFloat(Math.max(1, Math.min(10, score)).toFixed(1));
    }, [displayedMeal]);

    const handleServingsChange = (delta: number) => {
        setServings(prev => Math.max(1, prev + delta));
        triggerHapticFeedback(40);
    };

    const handleDone = () => {
        onConfirm([displayedMeal]);
    };

    const handleFixResults = () => {
        alert("AI-powered result fixing coming soon!");
    }

    return (
        <div className="fixed inset-0 bg-background-dark font-sans z-50 animate-fade-in flex flex-col">
            {/* Background Image */}
            <div className="absolute inset-x-0 top-0 h-1/2">
                <img src={imagePreviewUrl} alt="Meal" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent"></div>
            </div>

            {/* Header */}
            <header className="absolute inset-x-0 top-0 p-4 flex justify-between items-center text-white z-10 pt-safe">
                <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-black/30 rounded-full transition-opacity hover:opacity-80 active:scale-95">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Nutrition</h1>
                <button className="w-10 h-10 flex items-center justify-center bg-black/30 rounded-full transition-opacity hover:opacity-80 active:scale-95">
                    <EllipsisIcon className="w-6 h-6" />
                </button>
            </header>

            {/* Content Sheet */}
            <div className="absolute bottom-0 inset-x-0 max-h-[65%] h-auto bg-card-light dark:bg-card-dark rounded-t-3xl p-6 flex flex-col shadow-2xl">
                {/* Scrollable content */}
                <div className="flex-grow overflow-y-auto space-y-5 pr-2 -mr-2">
                    {/* Meal Title & Counter */}
                    <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                            <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">{mealType}</p>
                            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1 capitalize">{displayedMeal.name}</h2>
                        </div>
                        <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-full">
                            <button onClick={() => handleServingsChange(-1)} className="w-9 h-9 flex items-center justify-center text-2xl text-text-secondary-light dark:text-text-secondary-dark active:scale-90">-</button>
                            <span className="font-bold text-lg w-6 text-center text-text-primary-light dark:text-text-primary-dark">{servings}</span>
                            <button onClick={() => handleServingsChange(1)} className="w-9 h-9 flex items-center justify-center text-2xl text-text-secondary-light dark:text-text-secondary-dark active:scale-90">+</button>
                        </div>
                    </div>

                    {/* Nutrition Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                        <NutritionInfoCard icon={<FlameIcon className="w-5 h-5 text-red-500" />} label="Calories" value={`${displayedMeal.calories}`} />
                        <NutritionInfoCard icon={<CarbsIcon className="w-5 h-5 text-orange-500" />} label="Carbs" value={`${displayedMeal.carbs}g`} />
                        <NutritionInfoCard icon={<ProteinIcon className="w-5 h-5 text-blue-500" />} label="Protein" value={`${displayedMeal.protein}g`} />
                        <NutritionInfoCard icon={<FatsIcon className="w-5 h-5 text-green-500" />} label="Fats" value={`${displayedMeal.fats}g`} />
                    </div>
                    
                    {/* Health Score */}
                    <div className="flex items-center space-x-3">
                        <HealthScoreIcon className="w-6 h-6 text-pink-500 flex-shrink-0" />
                        <div className="flex-grow">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Health score</p>
                                <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">{healthScore}/10</p>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-card-dark/80 rounded-full h-2">
                                <div className="bg-gradient-to-r from-green-400 to-teal-500 h-2 rounded-full" style={{ width: `${healthScore * 10}%` }}></div>
                            </div>
                        </div>
                    </div>
                    <Sources sources={sources} />
                </div>
                
                {/* Buttons */}
                <div className="flex-shrink-0 pt-5">
                    <div className="flex space-x-4 pb-safe">
                        <button onClick={handleFixResults} className="w-1/2 bg-transparent border-2 border-text-secondary-dark text-text-primary-light dark:text-text-primary-dark font-bold py-3 px-4 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors active:scale-95">
                            <SparkleIcon className="w-5 h-5 mr-2" />
                            Fix Results
                        </button>
                        <button onClick={handleDone} className="w-1/2 bg-text-primary-light dark:bg-text-primary-dark text-white dark:text-black font-bold py-3 px-4 rounded-full hover:opacity-90 transition-opacity active:scale-95">
                            Done
                        </button>
                    </div>
                </div>
            </div>
             <style>{`
                .pt-safe {
                    padding-top: env(safe-area-inset-top);
                }
                .pb-safe {
                    padding-bottom: env(safe-area-inset-bottom);
                }
            `}</style>
        </div>
    );
};

export default MealConfirmation;
