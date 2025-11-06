import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Progress from './components/Progress';
import Settings from './components/Settings';
import Community from './components/Community';
import Plan from './components/Plan';
import BottomNav from './components/BottomNav';
import type { ActiveView, Theme, MacroGoals, WeightEntry, LoggedMeal, MealNutritionInfo } from './types';
import OnboardingModal from './components/onboarding/OnboardingModal';
import { CelebrationProvider } from './contexts/CelebrationContext';
import Confetti from './components/celebrations/Confetti';
import { FeedbackProvider } from './contexts/FeedbackContext';
import SuccessOverlay from './components/SuccessOverlay';

const initialMacroGoals: MacroGoals = {
  'Calories': { goal: 2000, unit: '' },
  'Protein': { goal: 150, unit: 'g' },
  'Carbs': { goal: 200, unit: 'g' },
  'Fats': { goal: 70, unit: 'g' },
};

const initialWeightData: WeightEntry[] = [
  { id: 1, date: new Date('2024-01-15').toISOString(), weight: 120 },
  { id: 2, date: new Date('2024-02-15').toISOString(), weight: 118 },
  { id: 3, date: new Date('2024-03-15').toISOString(), weight: 119 },
  { id: 4, date: new Date('2024-04-15').toISOString(), weight: 117 },
  { id: 5, date: new Date('2024-05-15').toISOString(), weight: 116 },
  { id: 6, date: new Date('2024-06-15').toISOString(), weight: 115 },
  { id: 7, date: new Date('2024-07-15').toISOString(), weight: 114 },
];

const initialLoggedMeals: LoggedMeal[] = [
    { id: 1, name: 'Avocado Toast & Eggs', calories: 400, mealType: 'Breakfast', protein: 20, carbs: 50, fats: 15 },
    { id: 2, name: 'Grilled Salmon Bowl', calories: 620, mealType: 'Lunch', protein: 40, carbs: 70, fats: 25 },
    { id: 3, name: 'Yogurt & Granola', calories: 500, mealType: 'Snack', protein: 20, carbs: 30, fats: 10 },
];


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [theme, setTheme] = useState<Theme>('light');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [macroGoals, setMacroGoals] = useState<MacroGoals>(initialMacroGoals);
  const [weightData, setWeightData] = useState<WeightEntry[]>(initialWeightData);
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>(initialLoggedMeals);
  const [goalWeight, setGoalWeight] = useState(114);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);

    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (hasCompletedOnboarding !== 'true') {
      setShowOnboarding(true);
    }
    
    const savedMacros = localStorage.getItem('macroGoals');
    if (savedMacros) {
      setMacroGoals(JSON.parse(savedMacros));
    }

    const savedWeightData = localStorage.getItem('weightData');
    if (savedWeightData) {
        setWeightData(JSON.parse(savedWeightData));
    }
    
    const savedMeals = localStorage.getItem('loggedMeals');
    if (savedMeals) {
      setLoggedMeals(JSON.parse(savedMeals));
    }

    const savedGoalWeight = localStorage.getItem('goalWeight');
    if (savedGoalWeight) {
        setGoalWeight(JSON.parse(savedGoalWeight));
    }

  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('loggedMeals', JSON.stringify(loggedMeals));
  }, [loggedMeals]);
  
  const handleSetMacroGoals = (newGoals: MacroGoals) => {
    setMacroGoals(newGoals);
    localStorage.setItem('macroGoals', JSON.stringify(newGoals));
  };
  
    const handleLogMeal = (newMeals: MealNutritionInfo[], mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
    const mealsToAdd: LoggedMeal[] = newMeals.map((meal, index) => ({
      id: Date.now() + index,
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      mealType: mealType,
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

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const handleOnboardingComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
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
                />;
      case 'progress':
        return <Progress weightData={weightData} goalWeight={goalWeight} onLogWeight={handleLogWeight} />;
      case 'plan':
        return <Plan />;
       case 'community':
        return <Community />;
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
                />;
      default:
        return <Dashboard 
                  macroGoals={macroGoals}
                  loggedMeals={loggedMeals}
                  onLogMeal={handleLogMeal}
                  onDeleteMeal={handleDeleteMeal}
                  onUpdateMealType={handleUpdateMealType}
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