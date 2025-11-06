
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface MacroValues {
  consumed: number;
  goal: number;
}

interface CombinedMacroChartProps {
  calories: MacroValues;
  protein: MacroValues;
  carbs: MacroValues;
  fats: MacroValues;
}

const CombinedMacroChart: React.FC<CombinedMacroChartProps> = ({ calories, protein, carbs, fats }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  const consumedValue = Math.round(calories.consumed);
  const numDigits = consumedValue.toString().length;

  // Dynamically adjust chart size and text styles based on the calorie count's number of digits.
  // This ensures the number remains centered and legible within the chart as it grows.
  const scale = numDigits >= 4 ? 1.1 : 1.0;
  const numberFontSize = numDigits >= 4 ? 'text-4xl' : 'text-5xl';
  const labelFontSize = numDigits >= 4 ? 'text-sm' : 'text-base';
  const labelMargin = numDigits >= 4 ? '-mb-0.5' : '-mb-1';
  
  // Configuration with thicker rings for better visibility.
  const macros = [
    { data: fats,     color: '#22C55E', lightColor: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : '#f0fdf4', radius: [92 * scale, 110 * scale] }, // Fat: Green
    { data: protein,  color: '#3B82F6', lightColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff', radius: [71 * scale, 89 * scale] },  // Protein: Blue
    { data: carbs,    color: '#F97316', lightColor: isDarkMode ? 'rgba(249, 115, 22, 0.1)' : '#fff7ed', radius: [50 * scale, 68 * scale] },  // Carbs: Orange
    { data: calories, color: '#8B5CF6', lightColor: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : '#f5f3ff', radius: [29 * scale, 47 * scale] },  // Calories: Purple
  ];

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer>
        <PieChart>
          {macros.map((macro, index) => {
            const { consumed, goal } = macro.data;
            const percentage = goal > 0 ? Math.min(100, (consumed / goal) * 100) : 0;
            const progressData = [{ value: percentage }, { value: 100 - percentage }];

            return (
              <React.Fragment key={index}>
                {/* Background Track Ring */}
                <Pie
                  data={[{ value: 100 }]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={macro.radius[0]}
                  outerRadius={macro.radius[1]}
                  fill={macro.lightColor}
                  stroke="none"
                  isAnimationActive={false}
                />
                {/* Progress Ring */}
                {consumed > 0 && (
                  <Pie
                    data={progressData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={macro.radius[0]}
                    outerRadius={macro.radius[1]}
                    cornerRadius={8}
                    stroke="none"
                    isAnimationActive={true}
                    animationDuration={800}
                  >
                    <Cell fill={macro.color} />
                    <Cell fill="transparent" />
                  </Pie>
                )}
              </React.Fragment>
            );
          })}
        </PieChart>
      </ResponsiveContainer>
       <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className={`${labelFontSize} text-text-secondary-light dark:text-text-secondary-dark ${labelMargin}`}>Calories</span>
          <span className={`${numberFontSize} font-bold text-text-primary-light dark:text-text-primary-dark`}>{consumedValue}</span>
      </div>
    </div>
  );
};

export default CombinedMacroChart;
