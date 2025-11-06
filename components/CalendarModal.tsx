import React, { useState } from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface CalendarModalProps {
  selectedDate: Date;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ selectedDate, onClose, onDateSelect }) => {
  const [displayDate, setDisplayDate] = useState(new Date(selectedDate));
  const today = new Date();

  const changeMonth = (offset: number) => {
    setDisplayDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(1); // Avoid issues with months having different numbers of days
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  const generateCalendarDays = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days = [];
    
    // Days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, isCurrentMonth: false, date: new Date(year, month - 1, prevMonthLastDay - i) });
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }

    // Days from next month
    const grid_size = 42; // 6 rows * 7 columns
    const nextMonthDays = grid_size - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handleDayClick = (date: Date) => {
    onDateSelect(date);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div 
        className="bg-background-light dark:bg-card-dark w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10" aria-label="Previous month">
            <ChevronLeftIcon className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
          <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
            {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10" aria-label="Next month">
            <ChevronRightIcon className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
        </header>

        <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
          {weekDayHeaders.map(day => <div key={day}>{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {calendarDays.map(({ day, isCurrentMonth, date }, index) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === today.toDateString();
            
            return (
              <div key={index} className="flex justify-center items-center h-10">
                <button
                  onClick={() => handleDayClick(date)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-colors
                    ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-text-primary-light dark:text-text-primary-dark'}
                    ${isCurrentMonth && !isSelected ? 'hover:bg-gray-100 dark:hover:bg-white/10' : ''}
                    ${isSelected ? 'bg-accent text-white shadow' : ''}
                    ${isToday && !isSelected ? 'border-2 border-accent' : ''}
                  `}
                >
                  {day}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
