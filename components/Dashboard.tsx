
import React, { useState, useEffect, useMemo } from 'react';
// FIX: Import missing components from recharts to render the meal detail chart.
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import WeeklyCalendar from './WeeklyCalendar';
import HealthScore from './HealthScore';
import LogMealModal from './LogMealModal';
import WaterIntakeCard from './WaterIntakeCard';
import SleepAndMoodCard from './SleepAndMoodCard';
import ActivityCard from './ActivityCard';
import LoggedMealItem from './LoggedMealItem';
import type { MealNutritionInfo, LoggedMeal, MacroGoals, UserProfile, DailySteps, Vitals } from '../types';
import WaterIntakeModal from './WaterIntakeModal';
import { AddIcon } from './icons/AddIcon';
import QuickLogSuggestion from './QuickLogSuggestion';
import DinnerPredictor from './DinnerPredictor';
import { XMarkIcon } from './icons/XMarkIcon';
import CalendarModal from './CalendarModal';
import CombinedMacroChart from './CombinedMacroChart';
import VitalsMonitor from './VitalsMonitor';
import VitalsScanModal from './VitalsScanModal';
import RecentlyUploaded from './RecentlyUploaded';
import LogStepsModal from './LogStepsModal';
import LogSleepModal from './LogSleepModal';
import SyncDataModal from './SyncDataModal';
import { useFeedback } from '../contexts/FeedbackContext';
import MealConfirmation from './MealConfirmation';

interface DashboardProps {
  macroGoals: MacroGoals;
  loggedMeals: LoggedMeal[];
  onLogMeal: (newMeals: MealNutritionInfo[], mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack', forDate: Date) => void;
  onDeleteMeal: (id: number) => void;
  onUpdateMealType: (id: number, newMealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => void;
  profile: UserProfile;
  dailySteps: DailySteps;
  onLogSteps: (steps: number) => void;
  waterIntake: number;
  onWaterIntakeChange: (intake: number) => void;
  sleepHours: number;
  onSleepHoursChange: (hours: number) => void;
  mood: 'Happy' | 'Neutral' | 'Sad';
  onMoodChange: (mood: 'Happy' | 'Neutral' | 'Sad') => void;
  activeCalories: number;
  vitals: Vitals;
  onUpdateVitals: (newVitals: Partial<Vitals>) => void;
  lastSynced: string | null;
  onSyncData: (data: { steps: number; sleep: number }) => void;
  isTracking: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
  currentWeight: number;
  goalWeight: number;
  setIsModalOpen: (isOpen: boolean) => void;
}

const MealDetailModal: React.FC<{ meal: LoggedMeal; onClose: () => void; onUpdateMealType: (id: number, newMealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => void; }> = ({ meal, onClose, onUpdateMealType }) => {
    const { name, calories, protein, carbs, fats } = meal;

    const proteinCals = protein * 4;
    const carbsCals = carbs * 4;
    const fatsCals = fats * 9;
    
    const data = [
        { name: 'Protein', value: proteinCals },
        { name: 'Carbs', value: carbsCals },
        { name: 'Fats', value: fatsCals },
    ].filter(item => item.value > 0);
    
    const COLORS = ['#FBBF24', '#00A99D', '#F87171'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        if (percent === 0) return null;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-sm font-bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    
    const mealTypes: ('Breakfast' | 'Lunch' | 'Dinner' | 'Snack')[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

    const handleMealTypeChange = (newType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
      onUpdateMealType(meal.id, newType);
      onClose();
    };
    
    return (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
            <div 
                className="bg-background-light dark:bg-card-dark w-full max-w-md rounded-3xl shadow-2xl p-6 animate-scale-in flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark capitalize">{name}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                        <XMarkIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
                    </button>
                </header>
                
                <div className="text-center mb-4">
                    <span className="text-6xl font-extrabold text-text-primary-light dark:text-text-primary-dark">{calories}</span>
                    <span className="text-lg font-medium block text-text-secondary-light dark:text-text-secondary-dark -mt-2">kcal</span>
                </div>

                <div style={{ width: '100%', height: 200 }}>
                     <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={document.documentElement.classList.contains('dark') ? '#1E1E1E' : '#FFFFFF'} strokeWidth={2} />
                                ))}
                            </Pie>
                            <Legend iconSize={10} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                    <div>
                        <p className="font-bold text-lg text-yellow-500">{protein}g</p>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Protein</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg text-accent">{carbs}g</p>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Carbs</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg text-red-500">{fats}g</p>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Fats</p>
                    </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark text-center mb-3">Change Meal Type</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {mealTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => handleMealTypeChange(type)}
                                className={`py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                                    meal.mealType === type
                                        ? 'bg-accent text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-background-dark hover:bg-gray-200 dark:hover:bg-white/10 text-text-primary-light dark:text-text-primary-dark'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = (props) => {
  const { 
    macroGoals, loggedMeals, onLogMeal, onDeleteMeal, onUpdateMealType, profile, dailySteps, onLogSteps,
    waterIntake, onWaterIntakeChange, sleepHours, onSleepHoursChange, mood, onMoodChange, activeCalories, vitals, onUpdateVitals,
    lastSynced, onSyncData, isTracking, onStartTracking, onStopTracking,
    currentWeight, goalWeight, setIsModalOpen
  } = props;
  
  const { showSuccess } = useFeedback();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [selectedMealDetails, setSelectedMealDetails] = useState<LoggedMeal | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isLogStepsModalOpen, setIsLogStepsModalOpen] = useState(false);
  const [isLogSleepModalOpen, setIsLogSleepModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    result: MealNutritionInfo[];
    imagePreviewUrl: string;
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    date: Date;
    sources: any[];
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000 * 30); // Update every 30 seconds
    return () => clearInterval(timerId);
  }, []);

  const formattedDateAndTime = useMemo(() => {
    return currentTime.toLocaleString(undefined, {
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric'
    });
  }, [currentTime]);

  useEffect(() => {
    if (confirmationData) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
    // Cleanup function
    return () => {
      setIsModalOpen(false);
    };
  }, [confirmationData, setIsModalOpen]);

  const isToday = currentDate.toDateString() === new Date().toDateString();
  const selectedDateString = currentDate.toISOString().split('T')[0];
  const mealsForSelectedDate = loggedMeals.filter(meal => meal.date === selectedDateString);

  const consumed = mealsForSelectedDate.reduce((acc, meal) => {
    acc.Calories += meal.calories;
    acc.Protein += meal.protein;
    acc.Carbs += meal.carbs;
    acc.Fats += meal.fats;
    return acc;
  }, { Calories: 0, Protein: 0, Carbs: 0, Fats: 0 });

  const remaining = {
    Calories: Math.max(0, macroGoals.Calories.goal - consumed.Calories),
    Protein: Math.max(0, macroGoals.Protein.goal - consumed.Protein),
    Carbs: Math.max(0, macroGoals.Carbs.goal - consumed.Carbs),
    Fats: Math.max(0, macroGoals.Fats.goal - consumed.Fats),
  };

  const { healthScore, healthFeedback } = useMemo(() => {
    const STEPS_GOAL = 10000;
    const WATER_GOAL = 8;
    const SLEEP_GOAL = 8;

    const scores = {
      calories: macroGoals.Calories.goal > 0 ? Math.max(0, 2.5 * (1 - Math.abs(consumed.Calories - macroGoals.Calories.goal) / macroGoals.Calories.goal)) : 0,
      protein: macroGoals.Protein.goal > 0 ? Math.min(1.5, (consumed.Protein / macroGoals.Protein.goal) * 1.5) : 0,
      steps: Math.min(2, (dailySteps.steps / STEPS_GOAL) * 2),
      water: Math.min(2, (waterIntake / WATER_GOAL) * 2),
      sleep: Math.min(2, (sleepHours / SLEEP_GOAL) * 2),
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    let feedback = "You're doing great! Keep up the balanced effort.";
    if (totalScore < 8) {
        const lowestMetric = (Object.keys(scores) as Array<keyof typeof scores>).reduce((a, b) => scores[a] < scores[b] ? a : b);
        switch (lowestMetric) {
            case 'calories': feedback = "Focus on your calorie goal to improve your score."; break;
            case 'protein': feedback = "A bit more protein could boost your results."; break;
            case 'steps': feedback = "A short walk could make a big difference today!"; break;
            case 'water': feedback = "Stay hydrated to elevate your health score."; break;
            case 'sleep': feedback = "A good night's rest is key to a better score."; break;
        }
    }
    
    return {
      healthScore: parseFloat(Math.min(10, totalScore).toFixed(1)),
      healthFeedback: feedback
    };
  }, [macroGoals, consumed, dailySteps, waterIntake, sleepHours]);


  const handleCopyMeal = (id: number) => {
    const mealToCopy = loggedMeals.find(m => m.id === id);
    if (mealToCopy) {
      const newMeal: MealNutritionInfo = {
        name: mealToCopy.name,
        calories: mealToCopy.calories,
        protein: mealToCopy.protein,
        carbs: mealToCopy.carbs,
        fats: mealToCopy.fats
      };
      onLogMeal([newMeal], mealToCopy.mealType, new Date(currentDate));
      showSuccess();
    }
  };

  const handleOpenLogMealModal = (mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
    setSelectedMealType(mealType);
    setIsLogModalOpen(true);
  };
  
  const handleLogOtherFromQuickLog = (mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
    setIsQuickLogOpen(false);
    handleOpenLogMealModal(mealType);
  };

  const handleAnalysisComplete = (result: MealNutritionInfo[], imageFile: File, sources: any[]) => {
    setIsLogModalOpen(false); // Close the log modal
    setConfirmationData({
      result,
      imagePreviewUrl: URL.createObjectURL(imageFile),
      mealType: selectedMealType,
      date: currentDate,
      sources,
    });
  };
  
  const handleConfirmAndLogMeal = (meals: MealNutritionInfo[]) => {
    if (confirmationData) {
      onLogMeal(meals, confirmationData.mealType, confirmationData.date);
      setConfirmationData(null);
      showSuccess();
    }
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Hello, {profile.name}
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">{formattedDateAndTime}</p>
        </div>
        <img src={profile.avatarUrl} alt={profile.name} className="w-12 h-12 rounded-full" />
      </header>

      <button onClick={() => setIsCalendarModalOpen(true)} className="w-full">
        <WeeklyCalendar selectedDate={currentDate} />
      </button>

      <div className="space-y-6">
        <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-2xl shadow-lg">
          <HealthScore score={healthScore} feedback={healthFeedback} />
        </div>
        
        <CombinedMacroChart
          calories={{ consumed: consumed.Calories, goal: macroGoals.Calories.goal }}
          protein={{ consumed: consumed.Protein, goal: macroGoals.Protein.goal }}
          carbs={{ consumed: consumed.Carbs, goal: macroGoals.Carbs.goal }}
          fats={{ consumed: consumed.Fats, goal: macroGoals.Fats.goal }}
        />

        <ActivityCard 
          steps={dailySteps.steps}
          activeCalories={activeCalories}
          onStepsClick={() => setIsLogStepsModalOpen(true)}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <WaterIntakeCard intake={waterIntake} goal={8} onClick={() => setIsWaterModalOpen(true)} />
          <SleepAndMoodCard sleepHours={sleepHours} mood={mood} setMood={onMoodChange} onSleepClick={() => setIsLogSleepModalOpen(true)} />
          <VitalsMonitor onScan={() => setIsVitalsModalOpen(true)} vitals={vitals} />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Today's Log</h2>
          <button onClick={() => setIsQuickLogOpen(true)} className="p-2 bg-accent rounded-full text-white shadow-lg">
            <AddIcon className="w-6 h-6" />
          </button>
        </div>
        {mealsForSelectedDate.length > 0 ? (
          <div className="space-y-3">
            {mealsForSelectedDate.map(meal => (
              <LoggedMealItem key={meal.id} meal={meal} onDelete={onDeleteMeal} onCopy={handleCopyMeal} onClick={setSelectedMealDetails} />
            ))}
          </div>
        ) : (
          <RecentlyUploaded />
        )}
      </div>

      <DinnerPredictor calories={remaining.Calories} protein={remaining.Protein} />

      {isLogModalOpen && <LogMealModal mealType={selectedMealType} onClose={() => setIsLogModalOpen(false)} onAddMeal={(meals) => { onLogMeal(meals, selectedMealType, currentDate); setIsLogModalOpen(false); showSuccess(); }} onAnalysisComplete={handleAnalysisComplete} />}
      {isWaterModalOpen && <WaterIntakeModal currentIntake={waterIntake} goal={8} onClose={() => setIsWaterModalOpen(false)} onIntakeChange={onWaterIntakeChange} />}
      {isVitalsModalOpen && <VitalsScanModal onClose={() => setIsVitalsModalOpen(false)} onSave={(v) => { onUpdateVitals(v); showSuccess(); }} />}
      {isQuickLogOpen && <QuickLogSuggestion onClose={() => setIsQuickLogOpen(false)} onLogOther={handleLogOtherFromQuickLog} />}
      {selectedMealDetails && <MealDetailModal meal={selectedMealDetails} onClose={() => setSelectedMealDetails(null)} onUpdateMealType={onUpdateMealType} />}
      {isCalendarModalOpen && <CalendarModal selectedDate={currentDate} onClose={() => setIsCalendarModalOpen(false)} onDateSelect={setCurrentDate} />}
      {isLogStepsModalOpen && <LogStepsModal currentSteps={dailySteps.steps} onClose={() => setIsLogStepsModalOpen(false)} onSave={(steps) => { onLogSteps(steps); showSuccess(); }} />}
      {isLogSleepModalOpen && <LogSleepModal currentHours={sleepHours} onClose={() => setIsLogSleepModalOpen(false)} onSave={(hours) => { onSleepHoursChange(hours); showSuccess(); }} />}
      {isSyncModalOpen && <SyncDataModal currentSteps={dailySteps.steps} currentSleep={sleepHours} onClose={() => setIsSyncModalOpen(false)} onSave={(data) => { onSyncData(data); showSuccess(); }} />}
      {confirmationData && (
        <MealConfirmation
          initialMeals={confirmationData.result}
          imagePreviewUrl={confirmationData.imagePreviewUrl}
          mealType={confirmationData.mealType}
          onConfirm={handleConfirmAndLogMeal}
          onBack={() => setConfirmationData(null)}
          sources={confirmationData.sources}
        />
      )}
    </div>
  );
};

export default Dashboard;
