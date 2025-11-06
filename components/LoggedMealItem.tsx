import React, { useState, useRef } from 'react';
import { LoggedMeal } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { CopyIcon } from './icons/CopyIcon';

interface LoggedMealItemProps {
  meal: LoggedMeal;
  onDelete: (id: number) => void;
  onCopy: (id: number) => void;
  onClick: (meal: LoggedMeal) => void;
}

const ACTION_THRESHOLD = 60; // How many pixels to swipe to trigger action

const LoggedMealItem: React.FC<LoggedMealItemProps> = ({ meal, onDelete, onCopy, onClick }) => {
  const [translateX, setTranslateX] = useState(0);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const isActionTriggered = useRef(false);

  const onDragStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    isDragging.current = true;
    isActionTriggered.current = false;
    if (itemRef.current) {
      itemRef.current.style.transition = 'none';
    }
  };

  const onDragMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - dragStartX.current;
    
    // Clamp the translation to prevent swiping too far
    const newTranslateX = Math.max(-ACTION_THRESHOLD - 20, Math.min(ACTION_THRESHOLD + 20, deltaX));
    setTranslateX(newTranslateX);
  };

  const onDragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (itemRef.current) {
        itemRef.current.style.transition = 'transform 0.3s ease';
    }

    if (Math.abs(translateX) < 10) {
      // It's a tap
      onClick(meal);
      setTranslateX(0);
      return;
    }

    if (translateX < -ACTION_THRESHOLD / 2) {
      setTranslateX(-ACTION_THRESHOLD); // Snap to delete
      isActionTriggered.current = true;
    } else if (translateX > ACTION_THRESHOLD / 2) {
      setTranslateX(ACTION_THRESHOLD); // Snap to copy
      isActionTriggered.current = true;
    } else {
      setTranslateX(0); // Snap back to center
    }
  };

  const handleActionClick = (action: 'copy' | 'delete') => {
    if (action === 'copy') {
      onCopy(meal.id);
    } else {
      onDelete(meal.id);
    }
    setTranslateX(0);
  };
  
  const mealTypeColors = {
      Breakfast: 'bg-accent-yellow/20 text-accent-yellow',
      Lunch: 'bg-accent/20 text-accent',
      Dinner: 'bg-blue-500/20 text-blue-500',
      Snack: 'bg-purple-500/20 text-purple-500',
  }

  return (
    <div className="relative bg-card-light dark:bg-card-dark rounded-xl shadow-md overflow-hidden">
      {/* Background Actions */}
      <div className="absolute inset-y-0 left-0 w-full flex justify-between">
        <button 
            onClick={() => handleActionClick('copy')}
            className="w-1/2 h-full flex items-center justify-start pl-5 bg-accent text-white"
            style={{ transform: `translateX(${Math.max(0, translateX - ACTION_THRESHOLD)}px)`, transition: 'transform 0.3s ease'}}
            aria-label={`Copy ${meal.name}`}
        >
            <CopyIcon className="w-5 h-5"/>
        </button>
        <button 
            onClick={() => handleActionClick('delete')}
            className="w-1/2 h-full flex items-center justify-end pr-5 bg-accent-red text-white"
            style={{ transform: `translateX(${Math.min(0, translateX + ACTION_THRESHOLD)}px)`, transition: 'transform 0.3s ease'}}
            aria-label={`Delete ${meal.name}`}
        >
            <TrashIcon className="w-5 h-5"/>
        </button>
      </div>

      <div
        ref={itemRef}
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
        style={{ transform: `translateX(${translateX}px)` }}
        className="relative p-4 bg-card-light dark:bg-card-dark flex justify-between items-center cursor-grab active:cursor-grabbing z-10"
      >
        <div>
            <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{meal.name}</h4>
            <span className={`text-xs font-bold px-2 py-1 rounded-full mt-1 inline-block ${mealTypeColors[meal.mealType]}`}>
                {meal.mealType}
            </span>
        </div>
        <div className="text-right">
            <p className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">{meal.calories}</p>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">kcal</p>
        </div>
      </div>
    </div>
  );
};

export default LoggedMealItem;