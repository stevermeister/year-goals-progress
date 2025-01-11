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
  return Math.min(100, Math.max(0, ((current - start) / (goal - start)) * 100));
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
        <div className="progress-percentage">
          {current} / {goal}
        </div>
        <div 
          className="year-progress-line"
          style={{ left: `${yearProgressPercentage}%` }}
        />
      </div>
    </div>
  );
}

export default memo(ProgressBar);
