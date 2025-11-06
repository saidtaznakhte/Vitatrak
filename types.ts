import React from 'react';

export type ActiveView = 'dashboard' | 'progress' | 'plan' | 'community' | 'settings';
export type Theme = 'light' | 'dark';
export type Macro = 'Calories' | 'Protein' | 'Carbs' | 'Fats';

// Fix: Add Language type definition.
export type Language = 'en' | 'es' | 'fr' | 'de' | 'ar';

export interface Achievement {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
  icon: React.ReactNode;
}

export interface FrequentMeal {
  id: number;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface LoggedMeal {
  id: number;
  name: string;
  calories: number;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealNutritionInfo {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface LeaderboardUser {
  id: number;
  name: string;
  avatarUrl: string;
  progress: number;
  isCurrentUser: boolean;
}

export interface MacroGoals {
  Calories: { goal: number; unit: string };
  Protein: { goal: number; unit: string };
  Carbs: { goal: number; unit: string };
  Fats: { goal: number; unit: string };
}

export interface WeightEntry {
  id: number;
  date: string; // ISO string
  weight: number;
}