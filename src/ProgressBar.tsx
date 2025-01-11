import { memo } from 'react';
import { useYearProgress } from './hooks/useYearProgress';
import './styles/ProgressBar.css';

interface ProgressBarProps {
  start: number;
  current: number;
  goal: number;
}

function calculateProgress(current: number, start: number, goal: number): number {
  if (goal === start) return 0;
  const progress = Math.floor((current - start) / (goal - start) * 100);
  return Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
}

function ProgressBar({ start, current, goal }: ProgressBarProps): JSX.Element {
  const { yearProgress } = useYearProgress();
  const progress = calculateProgress(current, start, goal);
  const yearProgressPercentage = yearProgress * 100;
  
  return (
    <div className="progressbar-wrapper">
      <div className="progressbar-container">
        <div 
          className="progressbar-complete" 
          style={{ width: `${progress}%` }}
        >
          <div className="progressbar-liquid"></div>
        </div>
        <div 
          className="year-progress-line"
          style={{ left: `${yearProgressPercentage}%` }}
        />
      </div>
      <div className="progress-labels">
        <span className="progress-value">{current}</span>
        <span className="progress-target">Target: {goal}</span>
      </div>
    </div>
  );
}

export default memo(ProgressBar);
