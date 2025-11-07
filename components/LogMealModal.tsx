
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import PhotoLogger from './PhotoLogger';
import { CameraIcon } from './icons/CameraIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import type { FrequentMeal, MealNutritionInfo } from '../types';
import SearchResultItem from './SearchResultItem';
import { SpinnerIcon } from './icons/SpinnerIcon';
import Sources from './Sources';

interface LogMealModalProps {
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  onClose: () => void;
  onAddMeal: (newMeals: MealNutritionInfo[]) => void;
  onAnalysisComplete: (result: MealNutritionInfo[], imageFile: File, sources: any[]) => void;
}

type ModalView = 'main' | 'photo';

const frequentMeals: FrequentMeal[] = [
  { id: 1, name: 'My Usual Breakfast', description: 'Oatmeal with berries and nuts', calories: 350, protein: 10, carbs: 60, fats: 8 },
  { id: 2, name: 'Quick Lunch Salad', description: 'Chicken, spinach, and vinaigrette', calories: 420, protein: 40, carbs: 10, fats: 24 },
  { id: 3, name: 'Protein Shake', description: 'Whey protein with almond milk', calories: 220, protein: 25, carbs: 5, fats: 11 },
];

const FrequentMealCard: React.FC<{ meal: FrequentMeal, onClick: () => void }> = ({ meal, onClick }) => (
  <button onClick={onClick} className="w-full text-left p-4 bg-card-light dark:bg-card-dark rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
    <div className="flex justify-between items-center">
      <div>
        <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{meal.name}</h4>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{meal.description}</p>
      </div>
      <p className="font-semibold text-text-secondary-light dark:text-text-secondary-dark">{meal.calories} kcal</p>
    </div>
  </button>
);

const LogMealModal: React.FC<LogMealModalProps> = ({ mealType, onClose, onAddMeal, onAnalysisComplete }) => {
  const [view, setView] = useState<ModalView>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MealNutritionInfo[]>([]);
  const [searchSources, setSearchSources] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lastSearchedQuery, setLastSearchedQuery] = useState('');

  const performSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);
    setSearchSources([]);
    setLastSearchedQuery(query);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Use Google Search to find accurate nutritional information for the food query in English or Arabic: '${query}'. Provide a list of common variations and serving sizes with their nutritional information (calories, protein, carbs, fats). Return a JSON array of objects, where each object has 'name', 'calories', 'protein', 'carbs', and 'fats'. The 'name' should be in the same language as the query. If the query is a number (like a barcode), try to find the product. Provide up to 5 results. If you can't find the food, return an empty array. IMPORTANT: Your entire response must be ONLY the JSON array, with no other text, markdown, or explanations.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{googleSearch: {}}],
        },
      });
      
      setSearchSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
      
      const responseText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const results = JSON.parse(responseText);

      setSearchResults(results);
      if (results.length === 0) {
        setSearchError("No results found. Try being more specific.");
      }
    } catch (e) {
      console.error(e);
      setSearchError('Sorry, something went wrong. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setSearchError(null);
        setSearchSources([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [searchQuery, performSearch]);

  const handleFrequentMealClick = (meal: FrequentMeal) => {
    onAddMeal([{ 
      name: meal.name, 
      calories: meal.calories, 
      protein: meal.protein, 
      carbs: meal.carbs, 
      fats: meal.fats 
    }]);
  };

  const handleSearchResultClick = (meal: MealNutritionInfo) => {
    onAddMeal([meal]);
  };

  const renderMainView = () => (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button 
          onClick={() => setView('photo')}
          className="col-span-2 flex flex-col items-center justify-center p-4 bg-card-light dark:bg-card-dark rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <CameraIcon className="w-10 h-10 text-accent mb-2" />
          <span className="font-semibold text-sm text-center text-text-primary-light dark:text-text-primary-dark">Log with Photo</span>
        </button>
      </div>

      <div className="mb-6">
        <input 
          type="search" 
          placeholder="Search for a food..." 
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-card-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="min-h-[200px]">
        {isSearching && (
          <div className="flex justify-center items-center py-8">
            <SpinnerIcon className="w-8 h-8 text-accent" />
          </div>
        )}
        {searchError && !isSearching && (
          <div className="text-center py-8">
            <p className="text-text-secondary-light dark:text-text-secondary-dark">{searchError}</p>
            {searchError.includes('something went wrong') && (
              <button onClick={() => performSearch(lastSearchedQuery)} className="mt-2 text-accent font-semibold text-sm">
                Try Again
              </button>
            )}
          </div>
        )}
        {searchResults.length > 0 && !isSearching && (
          <div>
            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-3">Search Results</h3>
            <div className="space-y-3">
              {searchResults.map((meal, index) => (
                <SearchResultItem key={index} meal={meal} onAdd={handleSearchResultClick} />
              ))}
            </div>
            <Sources sources={searchSources} />
          </div>
        )}

        {!searchQuery.trim() && !isSearching && (
          <div>
            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-3">Frequent Meals</h3>
            <div className="space-y-3">
              {frequentMeals.map(meal => (
                <FrequentMealCard key={meal.id} meal={meal} onClick={() => handleFrequentMealClick(meal)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );

  const getTitle = () => {
    if (view === 'photo') return 'Log Meal with Photo';
    return `Log ${mealType}`;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end justify-center" aria-modal="true" role="dialog">
      <div 
        className="bg-background-light dark:bg-background-dark w-full max-w-lg max-h-[90vh] rounded-t-3xl shadow-2xl pt-6 px-6 pb-24 animate-fade-in flex flex-col"
        style={{ animation: 'slideInUp 0.3s ease-out' }}
      >
        <header className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
          {view === 'photo' && (
            <button onClick={() => setView('main')} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
              <ChevronLeftIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
            </button>
          )}
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark text-center flex-grow">{getTitle()}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <XMarkIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
        </header>

        <div className="overflow-y-auto flex-grow">
          {view === 'main' && renderMainView()}
          {view === 'photo' && <PhotoLogger onAnalysisComplete={onAnalysisComplete} />}
        </div>
      </div>
       <style>{`
        @keyframes slideInUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LogMealModal;
