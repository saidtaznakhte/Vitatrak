
import React, { useState, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
import Progress from './components/Progress';
import Settings from './components/Settings';
import Community from './components/Community';
import Plan from './components/Plan';
import BottomNav from './components/BottomNav';
import type { ActiveView, Theme, MacroGoals, WeightEntry, LoggedMeal, MealNutritionInfo, UserProfile, DailySteps, Vitals } from './types';
import OnboardingModal from './components/onboarding/OnboardingModal';
import { CelebrationProvider } from './contexts/CelebrationContext';
import Confetti from './components/celebrations/Confetti';
import { FeedbackProvider } from './contexts/FeedbackContext';
import SuccessOverlay from './components/SuccessOverlay';
import { haversineDistance } from './utils/geolocation';

const initialMacroGoals: MacroGoals = {
  'Calories': { goal: 2000, unit: '' },
  'Protein': { goal: 150, unit: 'g' },
  'Carbs': { goal: 200, unit: 'g' },
  'Fats': { goal: 70, unit: 'g' },
};

const initialWeightData: WeightEntry[] = [];

const initialLoggedMeals: LoggedMeal[] = [];

const initialProfile: UserProfile = {
  name: 'New User',
  age: 25,
  avatarUrl: `https://avatar.iran.liara.run/public/boy?username=newuser`,
};


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [theme, setTheme] = useState<Theme>('light');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [macroGoals, setMacroGoals] = useState<MacroGoals>(initialMacroGoals);
  const [weightData, setWeightData] = useState<WeightEntry[]>(initialWeightData);
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>(initialLoggedMeals);
  const [goalWeight, setGoalWeight] = useState(114);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [dailySteps, setDailySteps] = useState<DailySteps>({ date: new Date().toISOString().split('T')[0], steps: 0 });
  
  // New wellness states
  const [waterIntake, setWaterIntake] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);
  const [mood, setMood] = useState<'Happy' | 'Neutral' | 'Sad'>('Happy');
  const [activeCalories, setActiveCalories] = useState(0);
  const [vitals, setVitals] = useState<Vitals>({ heartRate: null, spO2: null, bloodPressure: null });
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  // Live tracking state
  const [isTracking, setIsTracking] = useState(false);
  const [locationWatchId, setLocationWatchId] = useState<number | null>(null);
  const lastPositionRef = useRef<GeolocationPosition | null>(null);


  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);

    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (hasCompletedOnboarding !== 'true') {
      setShowOnboarding(true);
    }
    
    const savedMacros = localStorage.getItem('macroGoals');
    if (savedMacros) setMacroGoals(JSON.parse(savedMacros));

    const savedWeightData = localStorage.getItem('weightData');
    if (savedWeightData) setWeightData(JSON.parse(savedWeightData));
    
    const savedMeals = localStorage.getItem('loggedMeals');
    if (savedMeals) setLoggedMeals(JSON.parse(savedMeals));

    const savedGoalWeight = localStorage.getItem('goalWeight');
    if (savedGoalWeight) setGoalWeight(JSON.parse(savedGoalWeight));
    
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    
    // Daily reset logic for steps, water, sleep
    const today = new Date().toISOString().split('T')[0];
    const lastLoginDate = localStorage.getItem('lastLoginDate');

    if (lastLoginDate === today) {
        const savedStepsJSON = localStorage.getItem('dailySteps');
        if (savedStepsJSON) setDailySteps(JSON.parse(savedStepsJSON));

        const savedWater = localStorage.getItem('waterIntake');
        if (savedWater) setWaterIntake(JSON.parse(savedWater));

        const savedSleep = localStorage.getItem('sleepHours');
        if (savedSleep) setSleepHours(JSON.parse(savedSleep));
        
        const savedActiveCalories = localStorage.getItem('activeCalories');
        if (savedActiveCalories) setActiveCalories(JSON.parse(savedActiveCalories));

    } else {
        localStorage.setItem('lastLoginDate', today);
        setDailySteps({ date: today, steps: 0 });
        setWaterIntake(0);
        setSleepHours(0);
        setActiveCalories(0);
    }
    
    const savedVitals = localStorage.getItem('vitals');
    if (savedVitals) setVitals(JSON.parse(savedVitals));
    
    const savedLastSynced = localStorage.getItem('lastSynced');
    if (savedLastSynced) setLastSynced(JSON.parse(savedLastSynced));

  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => { localStorage.setItem('loggedMeals', JSON.stringify(loggedMeals)); }, [loggedMeals]);
  useEffect(() => { localStorage.setItem('dailySteps', JSON.stringify(dailySteps)); }, [dailySteps]);
  useEffect(() => { localStorage.setItem('waterIntake', JSON.stringify(waterIntake)); }, [waterIntake]);
  useEffect(() => { localStorage.setItem('sleepHours', JSON.stringify(sleepHours)); }, [sleepHours]);
  useEffect(() => { localStorage.setItem('activeCalories', JSON.stringify(activeCalories)); }, [activeCalories]);
  useEffect(() => { localStorage.setItem('vitals', JSON.stringify(vitals)); }, [vitals]);
  useEffect(() => { localStorage.setItem('lastSynced', JSON.stringify(lastSynced)); }, [lastSynced]);

  
  const handleSetMacroGoals = (newGoals: MacroGoals) => {
    setMacroGoals(newGoals);
    localStorage.setItem('macroGoals', JSON.stringify(newGoals));
  };
  
    const handleLogMeal = (newMeals: MealNutritionInfo[], mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack', forDate: Date) => {
    const dateString = forDate.toISOString().split('T')[0];
    const mealsToAdd: LoggedMeal[] = newMeals.map((meal, index) => ({
      id: Date.now() + index,
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      mealType: mealType,
      date: dateString,
    }));
    setLoggedMeals(prev => [...prev, ...mealsToAdd]);
  };

  const handleDeleteMeal = (id: number) => {
    setLoggedMeals(prev => prev.filter(meal => meal.id !== id));
  };
  
  const handleUpdateMealType = (id: number, newMealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
    setLoggedMeals(prev => prev.map(meal => 
      meal.id === id ? { ...meal, mealType: newMealType } : meal
    ));
  };
  
  const handleLogWeight = (newWeight: number) => {
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];

    const existingEntryIndex = weightData.findIndex(entry => new Date(entry.date).toISOString().split('T')[0] === todayDateString);

    let updatedData;

    if (existingEntryIndex > -1) {
      updatedData = [...weightData];
      updatedData[existingEntryIndex] = { ...updatedData[existingEntryIndex], weight: newWeight };
    } else {
      updatedData = [...weightData, { id: Date.now(), date: today.toISOString(), weight: newWeight }];
    }

    updatedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setWeightData(updatedData);
    localStorage.setItem('weightData', JSON.stringify(updatedData));
  };

  const handleDeleteWeightEntry = (id: number) => {
    const updatedData = weightData.filter(entry => entry.id !== id);
    setWeightData(updatedData);
    localStorage.setItem('weightData', JSON.stringify(updatedData));
  };

  const handleUpdateWeightAndGoal = (newCurrentWeight: number, newGoalWeight: number) => {
    handleLogWeight(newCurrentWeight);
    setGoalWeight(newGoalWeight);
    localStorage.setItem('goalWeight', JSON.stringify(newGoalWeight));
  };
  
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const handleOnboardingComplete = (profileData: { name: string; age: number }) => {
    const newProfile: UserProfile = {
      name: profileData.name,
      age: profileData.age,
      avatarUrl: `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(profileData.name)}`,
    };
    handleUpdateProfile(newProfile);
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
  };
  
  const handleLogSteps = (steps: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newTotalSteps = Math.max(0, steps);
    setDailySteps({ date: today, steps: newTotalSteps });
    setActiveCalories(Math.round(newTotalSteps * 0.04));
  };

  const handleUpdateVitals = (newVitals: Partial<Vitals>) => {
    setVitals(prev => ({ ...prev, ...newVitals }));
  }

  const handleSyncData = (data: { steps: number; sleep: number }) => {
    handleLogSteps(data.steps);
    setSleepHours(data.sleep);
    setLastSynced(new Date().toISOString());
  };

  const handleStartTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsTracking(true);
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        // Filter out inaccurate GPS readings. Accuracy is in meters.
        if (position.coords.accuracy > 15) {
          console.warn(`Skipping position update due to low accuracy: ${position.coords.accuracy}m`);
          return;
        }

        if (lastPositionRef.current) {
          const distance = haversineDistance(
            lastPositionRef.current.coords,
            position.coords
          );
          
          // Distance threshold: only count movement over 1 meter to filter out GPS jitter.
          if (distance < 1) {
            return;
          }
          
          // 1 meter is roughly 1.3 steps for an average person
          const newSteps = Math.round(distance * 1.3);
          
          if (newSteps > 0) {
            setDailySteps(prev => {
              const totalSteps = prev.steps + newSteps;
              // Update active calories as well
              setActiveCalories(Math.round(totalSteps * 0.04));
              return { ...prev, steps: totalSteps };
            });
          }
        }
        lastPositionRef.current = position;
      },
      (error) => {
        console.error("Error watching position:", error);
        alert(`Error: ${error.message}. Please ensure location services are enabled.`);
        setIsTracking(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    setLocationWatchId(watchId);
  };

  const handleStopTracking = () => {
    if (locationWatchId !== null) {
      navigator.geolocation.clearWatch(locationWatchId);
    }
    setIsTracking(false);
    setLocationWatchId(null);
    lastPositionRef.current = null;
  };

  const currentWeight = weightData.length > 0 ? weightData[weightData.length - 1].weight : 0;

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard 
                  macroGoals={macroGoals}
                  loggedMeals={loggedMeals}
                  onLogMeal={handleLogMeal}
                  onDeleteMeal={handleDeleteMeal}
                  onUpdateMealType={handleUpdateMealType}
                  profile={profile}
                  dailySteps={dailySteps}
                  onLogSteps={handleLogSteps}
                  waterIntake={waterIntake}
                  onWaterIntakeChange={setWaterIntake}
                  sleepHours={sleepHours}
                  onSleepHoursChange={setSleepHours}
                  mood={mood}
                  onMoodChange={setMood}
                  activeCalories={activeCalories}
                  vitals={vitals}
                  onUpdateVitals={handleUpdateVitals}
                  lastSynced={lastSynced}
                  onSyncData={handleSyncData}
                  isTracking={isTracking}
                  onStartTracking={handleStartTracking}
                  onStopTracking={handleStopTracking}
                />;
      case 'progress':
        return <Progress 
                  weightData={weightData} 
                  goalWeight={goalWeight} 
                  onLogWeight={handleLogWeight} 
                  profile={profile}
                />;
      case 'plan':
        return <Plan />;
       case 'community':
        return <Community profile={profile} />;
      case 'settings':
        return <Settings 
                  currentTheme={theme} 
                  toggleTheme={toggleTheme} 
                  macroGoals={macroGoals} 
                  setMacroGoals={handleSetMacroGoals}
                  currentWeight={currentWeight}
                  goalWeight={goalWeight}
                  onUpdateWeightAndGoal={handleUpdateWeightAndGoal}
                  weightData={weightData}
                  onDeleteWeightEntry={handleDeleteWeightEntry}
                  profile={profile}
                  onUpdateProfile={handleUpdateProfile}
                />;
      default:
        return <Dashboard 
                  macroGoals={macroGoals}
                  loggedMeals={loggedMeals}
                  onLogMeal={handleLogMeal}
                  onDeleteMeal={handleDeleteMeal}
                  onUpdateMealType={handleUpdateMealType}
                  profile={profile}
                  dailySteps={dailySteps}
                  onLogSteps={handleLogSteps}
                  waterIntake={waterIntake}
                  onWaterIntakeChange={setWaterIntake}
                  sleepHours={sleepHours}
                  onSleepHoursChange={setSleepHours}
                  mood={mood}
                  onMoodChange={setMood}
                  activeCalories={activeCalories}
                  vitals={vitals}
                  onUpdateVitals={handleUpdateVitals}
                  lastSynced={lastSynced}
                  onSyncData={handleSyncData}
                  isTracking={isTracking}
                  onStartTracking={handleStartTracking}
                  onStopTracking={handleStopTracking}
                />;
    }
  };

  return (
    <CelebrationProvider>
      <FeedbackProvider>
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-sans transition-colors duration-300">
          <main className="pb-24 animate-fade-in">
            {renderView()}
          </main>
          <BottomNav activeView={activeView} setActiveView={setActiveView} />
          {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
          <Confetti />
          <SuccessOverlay />
        </div>
      </FeedbackProvider>
    </CelebrationProvider>
  );
};

export default App;
