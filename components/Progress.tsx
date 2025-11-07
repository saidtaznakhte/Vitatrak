
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { FlameIcon } from './icons/FlameIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { PerfectDayIcon } from './icons/PerfectDayIcon';
import type { WeightEntry, UserProfile, ChartDataPoint, UnitSystem } from '../types';
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
  
  const { showSuccess } = useFeedback();
  
  const unitSystem = profile.unitSystem || 'metric';
  const weightUnit = getWeightUnit(unitSystem);
  const chartData = useMemo(() => processDataForChart(weightData, unitSystem), [weightData, unitSystem]);
  const dataWithTrend = useMemo(() => calculateTrendLine(chartData), [chartData]);
  
  const currentWeightKg = weightData.length > 0 ? weightData[weightData.length - 1].weight : 0;
  const initialWeightKg = weightData.length > 0 ? weightData[0].weight : 0;
  const isGoalReached = currentWeightKg > 0 && goalWeight > 0 && currentWeightKg <= goalWeight;
  
  const currentWeightDisplay = convertWeightForDisplay(currentWeightKg, unitSystem);
  const goalWeightDisplay = convertWeightForDisplay(goalWeight, unitSystem);
  const initialWeightDisplay = convertWeightForDisplay(initialWeightKg, unitSystem);
  const weightChangeDisplay = currentWeightDisplay - initialWeightDisplay;


  const handleLogWeight = (newWeight: number) => {
    onLogWeight(newWeight);
    setIsLogWeightModalOpen(false);
    showSuccess();
    triggerHapticFeedback();
  };

  const GoalReachedView = () => (
    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center space-y-4 h-[330px] animate-fade-in">
      <div className="text-accent bg-accent/10 p-5 rounded-full">
        <PerfectDayIcon className="w-16 h-16" style={{ strokeWidth: 1.5 }} />
      </div>
      <p className="text-xl font-semibold text-accent">100% of goal</p>
      <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-xs">
        You've reached your goal! Amazing work.
      </p>
    </div>
  );

  const ChartView = () => (
    <div className={`bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg h-[330px]`}>
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer>
          <LineChart data={dataWithTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis dataKey="name" stroke="var(--color-text-secondary-dark)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--color-text-secondary-dark)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip content={<CustomTooltip unit={weightUnit} />} cursor={{ stroke: 'rgba(0, 169, 157, 0.2)', strokeWidth: 2 }} />
            <Line type="monotone" dataKey="weight" stroke="#00A99D" strokeWidth={3} dot={false} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#00A99D' }} />
            <Line type="linear" dataKey="trend" strokeOpacity={0.7} stroke="#8A8A8E" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <>
      <div className="p-4 sm:p-6 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark">Progress</h1>
          <button onClick={() => setIsShareModalOpen(true)} className="p-2 text-text-primary-light dark:text-text-primary-dark">
            <ShareIcon className="w-6 h-6" />
          </button>
        </header>

        {/* Main Metrics Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* My Weight Card */}
          <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="font-medium text-text-secondary-light dark:text-text-secondary-dark text-sm">My Weight</h2>
              <div className="flex items-baseline space-x-1 mt-2">
                <span className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">{currentWeightDisplay}</span>
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">{weightUnit}</span>
              </div>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Goal: {goalWeightDisplay} {weightUnit}</p>
            </div>
            <button onClick={() => setIsLogWeightModalOpen(true)} className="flex items-center space-x-1 mt-4 text-sm font-semibold text-accent hover:text-accent/80 transition-colors">
              <span>Log Weight</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Day Streak Card */}
          <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-lg">
            <h2 className="font-medium text-text-secondary-light dark:text-text-secondary-dark text-sm">Day Streak</h2>
            <div className="flex items-center space-x-2 mt-2">
              <FlameIcon className="w-6 h-6 text-accent-yellow" />
              <span className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">{streak}</span>
            </div>
            <div className="flex justify-between mt-4">
              {weekDays.map((day, index) => (
                <div key={index} className="flex-1 text-center">
                  <span className={`text-sm font-semibold ${index < streak ? 'bg-accent text-white rounded-full w-7 h-7 inline-flex items-center justify-center' : 'text-text-secondary-dark'}`}>
                    {day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-gray-100 dark:bg-card-dark rounded-full p-1 flex justify-between space-x-1">
          {periods.map(period => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`w-full py-2 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out ${
                activePeriod === period
                  ? 'bg-accent text-white shadow'
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-background-dark'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Goal Progress Chart or Goal Reached View */}
        {isGoalReached ? <GoalReachedView /> : <ChartView />}

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
