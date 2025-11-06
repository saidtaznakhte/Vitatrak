import React from 'react';
import type { MealNutritionInfo } from '../types';

interface SearchResultItemProps {
  meal: MealNutritionInfo;
  onAdd: (meal: MealNutritionInfo) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ meal, onAdd }) => (
  <button onClick={() => onAdd(meal)} className="w-full text-left p-4 bg-card-light dark:bg-card-dark rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors animate-fade-in">
    <div className="flex justify-between items-center">
      <div>
        <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark capitalize">{meal.name}</h4>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
          {`P: ${meal.protein}g, C: ${meal.carbs}g, F: ${meal.fats}g`}
        </p>
      </div>
      <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">{meal.calories} kcal</p>
    </div>
  </button>
);

export default SearchResultItem;
