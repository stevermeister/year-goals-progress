import React from 'react';
import { useYearProgress } from './hooks/useYearProgress';
import './ProgressBar.css';

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const yearProgress = useYearProgress();
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className="progressbar-container">
      <div
        className="progressbar-complete"
        style={{ width: `${clampedProgress}%` }}
      />
      <div 
        className="year-progress-marker"
        style={{ left: `${yearProgress}%` }}
      />
      <span className="progress">{Math.round(clampedProgress)}%</span>
    </div>
  );
}
