import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className="progressbar-container">
      <div
        className="progressbar-complete"
        style={{ width: `${clampedProgress}%` }}
      />
      <span className="progress">{Math.round(clampedProgress)}%</span>
    </div>
  );
}
