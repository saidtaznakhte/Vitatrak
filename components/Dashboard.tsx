import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import WeeklyCalendar from './WeeklyCalendar';
import HealthScore from './HealthScore';
import LogMealModal from './LogMealModal';
import WaterIntakeCard from './WaterIntakeCard';
import SleepAndMoodCard from './SleepAndMoodCard';
import ActivityCard from './ActivityCard';
import LoggedMealItem from './LoggedMealItem';
import { triggerHapticFeedback } from './utils/haptics';
import type { Macro, LoggedMeal, MealNutritionInfo, MacroGoals, UserProfile, DailySteps, Vitals } from '../types';
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
import { SyncIcon } from './icons/SyncIcon';
import SyncDataModal from './SyncDataModal';
import { useFeedback } from '../contexts/FeedbackContext';

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
    lastSynced, onSyncData, isTracking, onStartTracking, onStopTracking
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
    Calories: macroGoals.Calories.goal - consumed.Calories,
    Protein: macroGoals.Protein.goal - consumed.Protein,
    Carbs: macroGoals.Carbs.goal - consumed.Carbs,
    Fats: macroGoals.Fats.goal - consumed.Fats,
  };

  const handleMealCardClick = (mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
    setSelectedMealType(mealType);
    setIsLogModalOpen(true);
  };

  const calculateHealthScore = () => {
    const nutritionScore = consumed.Calories > 0 ? (consumed.Calories / macroGoals.Calories.goal) * 10 : 0;
    const hydrationScore = (waterIntake / 8) * 10;
    const sleepScore = (sleepHours / 8) * 10;
    const averageScore = (nutritionScore + hydrationScore + sleepScore) / 3;
    return parseFloat(averageScore.toFixed(1));
  };
  
  const healthScore = calculateHealthScore();
  
  const getHealthScoreFeedback = () => {
    if (healthScore < 5) return "Let's focus on the basics. Try adding a bit more water and aiming for an earlier bedtime.";
    if (sleepHours < 7) return "Overall good! Improving sleep could boost your energy and recovery.";
    if (waterIntake < 6) return "You're doing great! A couple more glasses of water will make a big difference.";
    return "Amazing consistency! Your nutrition, hydration, and sleep are all well-balanced. Keep it up!";
  };

  const handleDeleteMeal = (id: number) => {
    onDeleteMeal(id);
    triggerHapticFeedback();
  };
  
  const handleCopyMeal = (id: number) => {
    const mealToCopy = loggedMeals.find(meal => meal.id === id);
    if (mealToCopy) {
      const { id: mealId, mealType, date, ...mealNutrition } = mealToCopy;
      onLogMeal([mealNutrition], mealType, new Date()); // Copy to today
      alert(`Copied "${mealToCopy.name}" to today's log!`);
    }
  };

  const handleAddMeal = (newMeals: MealNutritionInfo[]) => {
    onLogMeal(newMeals, selectedMealType, currentDate);
    setIsLogModalOpen(false);
  };
  
  const handleViewMealDetails = (meal: LoggedMeal) => {
    setSelectedMealDetails(meal);
  };
  
  const handleDateSelect = (date: Date) => {
      setCurrentDate(date);
      setIsCalendarModalOpen(false);
  };
  
  const handleSaveSteps = (steps: number) => {
    onLogSteps(steps);
    setIsLogStepsModalOpen(false);
  };

  const handleSaveSleep = (hours: number) => {
    onSleepHoursChange(hours);
    setIsLogSleepModalOpen(false);
  };

  const handleSaveVitals = (newVitals: { heartRate: number; spO2: number }) => {
    onUpdateVitals({
      ...newVitals,
      bloodPressure: '120/80', // Simulated value
    });
    setIsVitalsModalOpen(false);
  };

  const handleSaveSyncData = (data: { steps: number, sleep: number }) => {
    onSyncData(data);
    setIsSyncModalOpen(false);
    showSuccess();
  };

  const formatTimeSince = (isoDate: string | null): string => {
    if (!isoDate) return "Never";
    const date = new Date(isoDate);
    const now = new Date();
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "Just now";
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  const hour = new Date().getHours();
  const showDinnerPredictor = hour >= 17 && hour < 22 && !mealsForSelectedDate.some(m => m.mealType === 'Dinner') && isToday;

  const MacroStatCard: React.FC<{ label: string; consumed: number; goal: number; colorClass: string }> = ({ label, consumed, goal, colorClass }) => (
    <div className="bg-background-light dark:bg-card-dark p-3 rounded-lg text-center shadow-inner">
      <p className={`font-semibold text-sm ${colorClass}`}>{label}</p>
      <p className="font-bold text-text-primary-light dark:text-text-primary-dark mt-1">
        {Math.round(consumed)} / {goal}g
      </p>
    </div>
  );

  return (
    <>
      <div className="p-4 sm:p-6 space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{isToday ? "Welcome Back!" : currentDate.toLocaleDateString('en-US', { weekday: 'long' })}</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">{isToday ? "Here's your health snapshot." : currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setIsSyncModalOpen(true)} className="flex items-center space-x-2 p-2 bg-card-light dark:bg-card-dark rounded-full shadow-md text-xs font-semibold text-accent transition-colors hover:bg-gray-100 dark:hover:bg-white/10">
              <SyncIcon className="w-5 h-5" />
              <span className="pr-2 whitespace-nowrap">
                Synced: {formatTimeSince(lastSynced)}
              </span>
            </button>
            <img src={profile.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full" />
          </div>
        </header>
        
        <button onClick={() => setIsCalendarModalOpen(true)} className="w-full text-left active:scale-[0.98] transition-transform duration-200">
          <WeeklyCalendar selectedDate={currentDate} />
        </button>
        
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg">
           <div className="text-center">
            <h2 className="text-4xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
                {Math.round(consumed.Calories).toLocaleString()} / {macroGoals.Calories.goal.toLocaleString()} kcal
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1 font-medium">
                Remaining: {remaining.Calories.toLocaleString()} kcal
            </p>
          </div>
          <div className="my-6 h-72 sm:h-80">
            <CombinedMacroChart
              calories={{ consumed: consumed.Calories, goal: macroGoals.Calories.goal }}
              protein={{ consumed: consumed.Protein, goal: macroGoals.Protein.goal }}
              carbs={{ consumed: consumed.Carbs, goal: macroGoals.Carbs.goal }}
              fats={{ consumed: consumed.Fats, goal: macroGoals.Fats.goal }}
            />
          </div>
           <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <MacroStatCard label="Protein" consumed={consumed.Protein} goal={macroGoals.Protein.goal} colorClass="text-blue-500" />
              <MacroStatCard label="Carbs" consumed={consumed.Carbs} goal={macroGoals.Carbs.goal} colorClass="text-orange-500" />
              <MacroStatCard label="Fat" consumed={consumed.Fats} goal={macroGoals.Fats.goal} colorClass="text-green-500" />
          </div>
        </div>


        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-lg">
          <HealthScore score={healthScore} feedback={getHealthScoreFeedback()} />
        </div>
        
        {showDinnerPredictor && (
          <DinnerPredictor
            calories={remaining.Calories}
            protein={remaining.Protein}
          />
        )}
        
        <div>
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Vitals Monitor</h2>
          <VitalsMonitor vitals={vitals} onScan={() => setIsVitalsModalOpen(true)} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Activity & Wellness</h2>
          <div className="grid grid-cols-2 gap-4 animate-scale-in">
            <button onClick={() => setIsWaterModalOpen(true)} className="transition-transform duration-200 active:scale-95">
              <WaterIntakeCard intake={waterIntake} goal={8} />
            </button>
            <SleepAndMoodCard sleepHours={sleepHours} mood={mood} onSleepHoursChange={onSleepHoursChange} setMood={onMoodChange} onSleepClick={() => setIsLogSleepModalOpen(true)} />
             <ActivityCard 
                steps={isToday ? dailySteps.steps : 0} 
                activeCalories={isToday ? activeCalories : 0} 
                onStepsClick={() => setIsLogStepsModalOpen(true)}
                isTracking={isTracking}
                onStartTracking={onStartTracking}
                onStopTracking={onStopTracking}
             />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Meals for {isToday ? 'Today' : currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </h2>
          {mealsForSelectedDate.length > 0 ? (
            <div className="space-y-3">
              {mealsForSelectedDate.map(meal => (
                <LoggedMealItem key={meal.id} meal={meal} onDelete={handleDeleteMeal} onCopy={handleCopyMeal} onClick={handleViewMealDetails} />
              ))}
            </div>
          ) : (
            <RecentlyUploaded />
          )}
        </div>
      </div>
      
      <button 
        onClick={() => setIsQuickLogOpen(true)}
        className="fixed bottom-28 right-5 sm:right-6 bg-accent text-white rounded-full p-4 shadow-lg z-40 transform transition-transform active:scale-90 hover:scale-105"
        aria-label="Quick Log Meal"
      >
        <AddIcon className="w-8 h-8" />
      </button>

      {isLogModalOpen && (
        <LogMealModal 
          mealType={selectedMealType} 
          onClose={() => setIsLogModalOpen(false)} 
          onAddMeal={handleAddMeal}
        />
      )}
      {isWaterModalOpen && (
        <WaterIntakeModal 
            currentIntake={waterIntake}
            goal={8}
            onClose={() => setIsWaterModalOpen(false)}
            onIntakeChange={onWaterIntakeChange}
        />
      )}
      {isQuickLogOpen && (
        <QuickLogSuggestion 
          onClose={() => setIsQuickLogOpen(false)} 
          onLogOther={(mealType) => {
            setIsQuickLogOpen(false);
            handleMealCardClick(mealType);
          }}
        />
      )}
      {selectedMealDetails && (
        <MealDetailModal
          meal={selectedMealDetails}
          onClose={() => setSelectedMealDetails(null)}
          onUpdateMealType={onUpdateMealType}
        />
      )}
      {isCalendarModalOpen && (
        <CalendarModal
            selectedDate={currentDate}
            onClose={() => setIsCalendarModalOpen(false)}
            onDateSelect={handleDateSelect}
        />
      )}
      {isVitalsModalOpen && (
        <VitalsScanModal onClose={() => setIsVitalsModalOpen(false)} onSave={handleSaveVitals} />
      )}
      {isLogStepsModalOpen && (
        <LogStepsModal
          currentSteps={dailySteps.steps}
          onClose={() => setIsLogStepsModalOpen(false)}
          onSave={handleSaveSteps}
        />
      )}
      {isLogSleepModalOpen && (
        <LogSleepModal
          currentHours={sleepHours}
          onClose={() => setIsLogSleepModalOpen(false)}
          onSave={handleSaveSleep}
        />
      )}
      {isSyncModalOpen && (
        <SyncDataModal
          currentSteps={dailySteps.steps}
          currentSleep={sleepHours}
          onClose={() => setIsSyncModalOpen(false)}
          onSave={handleSaveSyncData}
        />
      )}
    </>
  );
};

export default Dashboard;