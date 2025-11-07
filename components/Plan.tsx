import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { LoggedMeal, Macro } from '../types';
import MacroCard from './MacroCard';
import { SpinnerIcon } from './icons/SpinnerIcon';
import WeeklyCalendar from './WeeklyCalendar';
import CalendarModal from './CalendarModal';

const macroGoals = {
  'Calories': 2000,
  'Protein': 150,
  'Carbs': 250,
  'Fats': 60,
};

const Plan: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [plannedMeals, setPlannedMeals] = useState<LoggedMeal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  useEffect(() => {
    const fetchMealPlan = async (locationPrompt: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [{
                    text: `Generate a culturally relevant one-day meal plan (Breakfast, Lunch, Dinner, Snack) for ${locationPrompt} on a ${currentDate.toLocaleDateString('en-US', { weekday: 'long' })}. The total calories should be around 2000. For each meal, provide the name, estimated calories, protein, carbs, and fats. Return the response as a JSON array of objects, where each object has 'name', 'calories', 'mealType', 'protein', 'carbs', and 'fats'.`
                }]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            calories: { type: Type.NUMBER },
                            mealType: { type: Type.STRING },
                            protein: { type: Type.NUMBER },
                            carbs: { type: Type.NUMBER },
                            fats: { type: Type.NUMBER },
                        },
                        required: ['name', 'calories', 'mealType', 'protein', 'carbs', 'fats'],
                    },
                },
            },
        });

        const results: Omit<LoggedMeal, 'id'>[] = JSON.parse(response.text);
        const mealsWithIds: LoggedMeal[] = results.map((meal, index) => ({
            ...meal,
            id: Date.now() + index,
            // Ensure mealType is one of the allowed values
            mealType: ['Breakfast', 'Lunch', 'Dinner', 'Snack'].includes(meal.mealType) 
                ? meal.mealType as 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
                : 'Snack',
        }));
        setPlannedMeals(mealsWithIds);

      } catch (e) {
        console.error(e);
        setError('Could not generate a meal plan. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    const getLocationAndFetch = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchMealPlan(`the location around latitude ${latitude} and longitude ${longitude}`);
          },
          (err) => {
            console.warn("Geolocation denied:", err.message);
            fetchMealPlan("a standard healthy diet"); // Fallback
          }
        );
      } else {
        console.warn("Geolocation not supported.");
        fetchMealPlan("a standard healthy diet"); // Fallback
      }
    };

    getLocationAndFetch();
  }, [currentDate]);

  
  const projectedMacros = plannedMeals.reduce((acc, meal) => {
      acc.Calories += meal.calories;
      acc.Protein += meal.protein;
      acc.Carbs += meal.carbs;
      acc.Fats += meal.fats;
      return acc;
  }, { Calories: 0, Protein: 0, Carbs: 0, Fats: 0 });

  const handleDateSelect = (date: Date) => {
      setCurrentDate(date);
      setIsCalendarModalOpen(false);
  };

  const MealItem: React.FC<{meal: LoggedMeal}> = ({ meal }) => (
    <div className="bg-card-light dark:bg-card-dark p-3 rounded-lg flex justify-between items-center animate-fade-in">
        <p className="font-semibold">{meal.name}</p>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{meal.calories} kcal</p>
    </div>
  );

  const renderMealContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-8">
            <SpinnerIcon className="w-8 h-8 text-accent mx-auto" />
            <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">Generating your personalized meal plan...</p>
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-500 py-8">{error}</p>;
    }
    if (plannedMeals.length === 0) {
      return <p className="text-center text-text-secondary-light dark:text-text-secondary-dark py-8">No meal suggestions for this day.</p>;
    }

    return (['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map(mealType => {
      const meals = plannedMeals.filter(m => m.mealType === mealType);
      if (meals.length === 0) return null;
      return (
        <div key={mealType}>
          <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-2">{mealType}</h3>
          <div className="space-y-2">
            {meals.map(meal => <MealItem key={meal.id} meal={meal} />)}
          </div>
        </div>
      );
    });
  };


  return (
    <div className="p-4 sm:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">Meal Plan</h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">Plan your week for success.</p>
      </header>

      {/* Date Selector */}
      <button onClick={() => setIsCalendarModalOpen(true)} className="w-full text-left active:scale-[0.98] transition-transform duration-200">
        <WeeklyCalendar selectedDate={currentDate} />
      </button>
      
      {/* Projected Macros */}
      <div>
        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Projected Macros</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(['Calories', 'Protein', 'Carbs', 'Fats'] as Macro[]).map(macro => (
                 <MacroCard 
                    key={macro}
                    label={macro}
                    remaining={macroGoals[macro] - projectedMacros[macro]}
                    goal={macroGoals[macro]}
                    unit={macro === 'Calories' ? '' : 'g'}
                />
            ))}
        </div>
      </div>

      {/* Meal List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Meals for the Day</h2>
        {renderMealContent()}
      </div>

      <button className="w-full bg-accent text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-accent/90 transition-colors">
        Add Meal to Plan
      </button>
      
      {isCalendarModalOpen && (
        <CalendarModal
            selectedDate={currentDate}
            onClose={() => setIsCalendarModalOpen(false)}
            onDateSelect={handleDateSelect}
        />
      )}
    </div>
  );
};

export default Plan;
