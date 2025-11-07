
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { FlameIcon } from './icons/FlameIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import Achievements from './Achievements';
import { Streak7Icon } from './icons/Streak7Icon';
import { WeightLossIcon } from './icons/WeightLossIcon';
import { PerfectDayIcon } from './icons/PerfectDayIcon';
import type { Achievement, WeightEntry, UserProfile, ChartDataPoint, UnitSystem } from '../types';
import { CelebrationContext } from '../contexts/CelebrationContext';
import { ShareIcon } from './icons/ShareIcon';
import ShareModal from './ShareModal';
import LogWeightModal from './LogWeightModal';
import { useFeedback } from '../contexts/FeedbackContext';
import { triggerHapticFeedback } from './utils/haptics';
import { convertWeightForDisplay, getWeightUnit } from '../utils/units';

const periods = ['90 Days', '6 Months', '1 Year', 'All Time'];
const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const processDataForChart = (data: WeightEntry[], unitSystem: UnitSystem): ChartDataPoint[] => {
  if (!data || data.length === 0) return [];
  
  const monthlyData: { [key: string]: { weights: number[], lastDate: Date } } = {};
  
  data.forEach(entry => {
    const date = new Date(entry.date);
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { weights: [], lastDate: date };
    }
    monthlyData[monthYear].weights.push(entry.weight);
    if(date > monthlyData[monthYear].lastDate) {
        monthlyData[monthYear].lastDate = date;
    }
  });

  const sortedKeys = Object.keys(monthlyData).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
  });

  return sortedKeys.map(key => {
    const monthEntries = monthlyData[key];
    // Stored weight is in kg
    const lastWeightKg = data.find(d => new Date(d.date).getTime() === monthEntries.lastDate.getTime())?.weight || monthEntries.weights[monthEntries.weights.length-1];
    return { name: key.split(' ')[0], weight: convertWeightForDisplay(lastWeightKg, unitSystem) };
  });
};

const calculateTrendLine = (data: { name: string; weight: number }[]) => {
  const n = data.length;
  if (n < 2) return data.map(d => ({ ...d, trend: d.weight }));

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  data.forEach((point, index) => {
    const x = index;
    const y = point.weight;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return data.map((point, index) => ({
    ...point,
    trend: parseFloat((slope * index + intercept).toFixed(2)),
  }));
};

const CustomTooltip = ({ active, payload, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
        <p className="text-sm text-text-primary-light dark:text-text-primary-dark">{`${payload[0].value} ${unit}`}</p>
      </div>
    );
  }
  return null;
};

interface ProgressProps {
  streak: number;
  weightData: WeightEntry[];
  goalWeight: number;
  onLogWeight: (newWeight: number) => void;
  profile: UserProfile;
}

const Progress: React.FC<ProgressProps> = ({ streak, weightData, goalWeight, onLogWeight, profile }) => {
  const [activePeriod, setActivePeriod] = useState('1 Year');
  const [isLogWeightModalOpen, setIsLogWeightModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const { triggerCelebration } = useContext(CelebrationContext);
  const { showSuccess } = useFeedback();
  
  const unitSystem = profile.unitSystem || 'metric';
  const weightUnit = getWeightUnit(unitSystem);
  const chartData = useMemo(() => processDataForChart(weightData, unitSystem), [weightData, unitSystem]);
  const dataWithTrend = useMemo(() => calculateTrendLine(chartData), [chartData]);
  
  const achievementsData: Achievement[] = [
    { id: 1, title: '7-Day Streak', description: 'Log in for 7 days in a row.', unlocked: streak >= 7, icon: <Streak7Icon className="w-full h-full" /> },
    { id: 2, title: 'Goal Getter', description: 'Lose your first 5 lbs.', unlocked: true, icon: <WeightLossIcon className="w-full h-full" /> },
    { id: 3, title: 'Perfect Day', description: 'Hit all macro targets in a day.', unlocked: false, icon: <PerfectDayIcon className="w-full h-full" /> },
  ];

  const currentWeightKg = weightData.length > 0 ? weightData[weightData.length - 1].weight : 0;
  const initialWeightKg = weightData.length > 0 ? weightData[0].weight : 0;
  const isGoalReached = currentWeightKg > 0 && goalWeight > 0 && currentWeightKg <= goalWeight;

  const currentWeightDisplay = convertWeightForDisplay(currentWeightKg, unitSystem);
  const goalWeightDisplay = convertWeightForDisplay(goalWeight, unitSystem);
  const initialWeightDisplay = convertWeightForDisplay(initialWeightKg, unitSystem);
  const weightChangeDisplay = currentWeightDisplay - initialWeightDisplay;

  const GoalReachedDot: React.FC<any> = (props) => {
    const { cx, cy, index } = props;
    if (isGoalReached && index === dataWithTrend.length - 1) {
      return (
        <g transform={`translate(${cx},${cy})`}>
          <circle r="6" fill="#00A99D" />
          <circle r="6" fill="#00A99D" className="sparkle-animation" />
        </g>
      );
    }
    return null;
  };

  useEffect(() => {
    const hasCelebrated = sessionStorage.getItem('hasCelebratedStreak');
    if (!hasCelebrated && streak === 7) {
        setTimeout(() => {
          triggerCelebration();
          sessionStorage.setItem('hasCelebratedStreak', 'true');
        }, 500);
    }
  }, [streak, triggerCelebration]);

  const handleLogWeight = (newWeight: number) => {
    onLogWeight(newWeight);
    setIsLogWeightModalOpen(false);
    showSuccess();
    triggerHapticFeedback();
  };

  return (
    <>
      <div className="p-4 sm:p-6 space-y-6">
        {isGoalReached && (
          <style>{`
              @keyframes draw { to { stroke-dashoffset: 0; } }
              .goal-chart .recharts-line .recharts-line-curve {
                  stroke-dasharray: 1000; /* A large enough value */
                  stroke-dashoffset: 1000;
                  animation: draw 2s 0.5s ease-out forwards;
              }

              @keyframes sparkle {
                  0% { transform: scale(1); opacity: 0.8; }
                  50% { transform: scale(2.5); opacity: 0; }
                  100% { transform: scale(1); opacity: 0; }
              }
              .sparkle-animation {
                  animation: sparkle 1.5s 2s infinite ease-out;
              }
          `}</style>
        )}
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">Progress</h1>
          <button onClick={() => setIsShareModalOpen(true)} className="p-2 rounded-full bg-card-light dark:bg-card-dark shadow-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <ShareIcon className="w-5 h-5 text-accent" />
          </button>
        </header>

        {/* Main Metrics Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* My Weight Card */}
          <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="font-semibold text-text-secondary-light dark:text-text-secondary-dark text-sm">My Weight</h2>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{currentWeightDisplay}</span>
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">{weightUnit}</span>
              </div>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Goal: {goalWeightDisplay} {weightUnit}</p>
            </div>
            <button onClick={() => setIsLogWeightModalOpen(true)} className="flex items-center justify-between w-full text-left mt-4 text-sm font-semibold text-accent hover:text-accent/80 transition-colors">
              <span>Log Weight</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Day Streak Card */}
          <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg">
            <h2 className="font-semibold text-text-secondary-light dark:text-text-secondary-dark text-sm">Day Streak</h2>
            <div className="flex items-center space-x-2 mt-2">
              <FlameIcon className="w-8 h-8 text-accent-yellow" />
              <span className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{streak}</span>
            </div>
            <div className="flex justify-between mt-4">
              {weekDays.map((day, index) => (
                <span key={index} className={`flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full ${index < streak ? 'bg-accent text-white' : 'bg-gray-200 dark:bg-card-dark text-text-secondary-dark'}`}>
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-gray-200 dark:bg-card-dark rounded-lg p-1 flex justify-between space-x-1">
          {periods.map(period => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`w-full py-2 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out ${
                activePeriod === period
                  ? 'bg-card-light dark:bg-background-dark shadow text-text-primary-light dark:text-text-primary-dark'
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-white/50 dark:hover:bg-background-dark/50'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Goal Progress Chart */}
        <div className={`bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg ${isGoalReached ? 'goal-chart' : ''}`}>
          <p className="text-center font-semibold text-accent mb-2">100% of goal</p>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={dataWithTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="var(--color-text-secondary-dark)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-secondary-dark)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip content={<CustomTooltip unit={weightUnit} />} cursor={{ stroke: 'rgba(0, 169, 157, 0.2)', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="weight" stroke="#00A99D" strokeWidth={3} dot={false} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#00A99D' }} />
                <Line type="linear" dataKey="trend" strokeOpacity={0.7} stroke="#8A8A8E" strokeWidth={2} strokeDasharray="5 5" dot={<GoalReachedDot />} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className={`text-center text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2 px-4 ${isGoalReached ? 'animate-fade-in-bounce' : ''}`}>
              You've reached your goal! Amazing work.
          </p>
        </div>

        <Achievements achievements={achievementsData} />
      </div>
      {isShareModalOpen && (
          <ShareModal 
              onClose={() => setIsShareModalOpen(false)}
              userName={profile.name}
              avatarUrl={profile.avatarUrl}
              streak={streak}
              currentWeight={currentWeightDisplay}
              weightChange={weightChangeDisplay}
              weightData={chartData}
          />
      )}
      {isLogWeightModalOpen && (
        <LogWeightModal
            currentWeight={currentWeightKg}
            onClose={() => setIsLogWeightModalOpen(false)}
            onSave={handleLogWeight}
            unitSystem={unitSystem}
        />
      )}
    </>
  );
};

export default Progress;