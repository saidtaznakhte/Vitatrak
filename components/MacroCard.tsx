import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface MacroCardProps {
  label: string;
  remaining: number;
  goal: number;
  unit: string;
}

const MacroCard: React.FC<MacroCardProps> = ({ label, remaining, goal, unit }) => {
  const consumed = goal - remaining;
  const percentage = goal > 0 ? Math.max(0, Math.round((consumed / goal) * 100)) : 0;
  
  const data = [{ name: 'value', value: percentage > 100 ? 100 : percentage }];

  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  let color = 'var(--color-accent)';
  if (percentage > 70 && percentage <= 90) {
    color = 'var(--color-accent-yellow)';
  } else if (percentage > 90) {
    color = 'var(--color-accent-red)';
  }

  return (
    <div className="bg-card-light dark:bg-card-dark p-2 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center h-full relative aspect-square">
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="90%"
            barSize={10}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }}
              dataKey="value"
              cornerRadius={10}
              fill={color}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
        <span className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-text-primary-dark leading-tight">{remaining}{unit}</span>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">{label}</p>
      </div>
    </div>
  );
};

export default MacroCard;