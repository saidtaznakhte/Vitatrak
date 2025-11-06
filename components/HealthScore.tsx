import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface HealthScoreProps {
  score: number;
  feedback: string;
}

const HealthScore: React.FC<HealthScoreProps> = ({ score, feedback }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const data = [{ name: 'Health Score', value: score }];
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  useEffect(() => {
    let start = 0;
    const end = score;
    if (start === end) {
      setDisplayScore(end);
      return;
    };

    const duration = 1200; // ms
    const incrementTime = 15; // ms
    const range = end - start;
    let current = start;
    const increment = (range / duration) * incrementTime;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            setDisplayScore(parseFloat(end.toFixed(1)));
            clearInterval(timer);
        } else {
            setDisplayScore(parseFloat(current.toFixed(1)));
        }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [score]);


  const getScoreColor = (value: number) => {
    if (value < 4) return '#F87171'; // accent-red
    if (value < 7) return '#FBBF24'; // accent-yellow
    return '#00A99D'; // accent
  };

  const getScoreEmoji = (value: number) => {
    if (value < 4) return '🤔'; // Thinking face for lower scores
    if (value < 7) return '🙂'; // Slightly smiling face for medium scores
    return '🎉'; // Party popper for high scores
  };

  return (
    <div className="relative flex flex-col items-center">
      <h3 className="font-bold text-lg mb-2 text-text-primary-light dark:text-text-primary-dark">Holistic Health Score</h3>
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="85%"
            barSize={20}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 10]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
              dataKey="value"
              cornerRadius={10}
              fill={getScoreColor(score)}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-4 text-center flex flex-col items-center">
        <span className="text-3xl mb-1" aria-hidden="true">{getScoreEmoji(score)}</span>
        <span className="text-5xl font-extrabold text-text-primary-light dark:text-text-primary-dark leading-none" style={{ color: getScoreColor(score) }}>
          {displayScore}
        </span>
        <span className="text-sm font-medium block text-text-secondary-light dark:text-text-secondary-dark">/ 10</span>
      </div>
       <p className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2 px-4">
         {feedback}
       </p>
    </div>
  );
};

export default HealthScore;