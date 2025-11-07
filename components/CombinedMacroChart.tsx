

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

  const macros = [
    { data: fats,     color: '#16A34A', lightColor: isDarkMode ? 'rgba(22, 163, 74, 0.2)' : '#f0fdf4', radius: [95, 110] }, // Fat: Green
    { data: protein,  color: '#2563EB', lightColor: isDarkMode ? 'rgba(37, 99, 235, 0.2)' : '#eff6ff', radius: [78, 93] },  // Protein: Blue
    { data: carbs,    color: '#EA580C', lightColor: isDarkMode ? 'rgba(234, 88, 12, 0.2)' : '#fff7ed', radius: [61, 76] },  // Carbs: Orange
    { data: calories, color: '#7C3AED', lightColor: isDarkMode ? 'rgba(124, 58, 237, 0.2)' : '#f5f3ff', radius: [44, 59] },  // Calories: Purple
  ];

  const MacroCard: React.FC<{label: string, color: string, consumed: number, goal: number, unit: string}> = ({label, color, consumed, goal, unit}) => (
      <div className="bg-gray-100 dark:bg-background-dark p-3 rounded-xl w-full text-center shadow-sm">
          <p className="font-semibold text-sm capitalize" style={{ color }}>{label}</p>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
              <span className="font-bold text-text-primary-light dark:text-text-primary-dark">{Math.round(consumed).toLocaleString()}</span> / {goal.toLocaleString()}{unit}
          </p>
      </div>
  );

  return (
    <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col items-center">
        {/* Calorie Text */}
        <div className="text-center">
            <h2 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {Math.round(calories.consumed).toLocaleString()} / {calories.goal.toLocaleString()} kcal
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Remaining: {Math.max(0, calories.goal - calories.consumed).toLocaleString()} kcal
            </p>
        </div>

        {/* Chart */}
        <div className="relative w-64 h-64 my-4">
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
                                cornerRadius={10}
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
                <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark -mb-1">Calories</span>
                <span className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{Math.round(calories.consumed).toLocaleString()}</span>
            </div>
        </div>
        
        {/* Macro Cards */}
        <div className="flex flex-row gap-4 w-full max-w-md">
            <MacroCard label="Protein" color="#2563EB" consumed={protein.consumed} goal={protein.goal} unit="g"/>
            <MacroCard label="Carbs" color="#EA580C" consumed={carbs.consumed} goal={carbs.goal} unit="g"/>
            <MacroCard label="Fat" color="#16A34A" consumed={fats.consumed} goal={fats.goal} unit="g"/>
        </div>
    </div>
  );
};

export default CombinedMacroChart;
