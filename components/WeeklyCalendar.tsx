import React from 'react';

interface WeeklyCalendarProps {
  selectedDate: Date;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ selectedDate }) => {
  const getWeekDays = (baseDate: Date) => {
    const start = new Date(baseDate);
    // Adjust to Saturday as the start of the week
    const dayOfWeek = start.getDay(); // Sunday = 0, Saturday = 6
    const offset = (dayOfWeek + 1) % 7;
    start.setDate(start.getDate() - offset);
    
    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  const weekDays = getWeekDays(selectedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="flex justify-around items-center p-2 bg-gray-100 dark:bg-card-dark/50 rounded-2xl">
      {weekDays.map((day) => {
        // Normalize day for comparison to avoid time-of-day issues
        const normalizedDay = new Date(day);
        normalizedDay.setHours(0, 0, 0, 0);
        
        const isSelected = normalizedDay.toDateString() === new Date(selectedDate).toDateString();
        const isFuture = normalizedDay > today;

        const dayClasses = `
          flex flex-col items-center justify-center text-center py-2 px-1.5 rounded-xl transition-all duration-300
          ${isSelected ? 'bg-white dark:bg-background-dark shadow-md' : ''}
        `;

        const dayNameColor = isSelected 
          ? 'text-text-primary-light dark:text-text-primary-dark' 
          : 'text-text-secondary-light dark:text-text-secondary-dark';
          
        const circleClasses = `
          w-11 h-11 rounded-full border-2 flex items-center justify-center
          ${isFuture && !isSelected 
            ? 'border-gray-300 dark:border-gray-700' 
            : 'border-dashed border-gray-400 dark:border-gray-600'}
        `;
        
        const numberColor = isFuture && !isSelected
          ? 'text-gray-400 dark:text-gray-500'
          : 'text-text-primary-light dark:text-text-primary-dark';

        return (
          <div 
            key={day.toISOString()} 
            className={dayClasses}
            aria-label={day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            aria-current={isSelected ? 'date' : undefined}
          >
            <span className={`text-sm font-semibold mb-2 ${dayNameColor}`}>
              {day.toLocaleString('en-US', { weekday: 'short' })}
            </span>
            <div className={circleClasses}>
              <span className={`font-bold text-lg ${numberColor}`}>
                {String(day.getDate()).padStart(2, '0')}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyCalendar;
