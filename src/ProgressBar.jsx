import { memo } from 'react';
import PropTypes from 'prop-types';
import { useYearProgress } from './hooks/useYearProgress';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function calculateProgress(current, start, goal) {
  if (goal === start) return 0;
  const progress = Math.floor((current - start) / (goal - start) * 100);
  return Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
}

function ProgressBar({ start, current, goal }) {
  const { yearProgress, currentMonth } = useYearProgress();
  const progress = calculateProgress(current, start, goal);
  
  return (
    <div className="progressbar-container">
      <div 
        className="progressbar-complete" 
        style={{ width: `${progress}%` }}
      >
        <div className="progressbar-liquid"></div>
      </div>
      <div 
        className="year-progress-line"
        style={{ left: `${yearProgress * 100}%` }}
      />
      <span className="progress">
        {current}/{goal}
        <span style={{ opacity: 0.7, fontSize: '0.9em' }}>
          ({progress}%)
        </span>
      </span>
      {months.map((month, index) => (
        <div
          key={month}
          className="month-marker"
          style={{
            left: `${(index + 0.5) * (100/12)}%`,
            opacity: index === currentMonth ? 1 : 0.5,
            fontWeight: index === currentMonth ? 500 : 'normal'
          }}
        >
          {month}
        </div>
      ))}
    </div>
  );
}

ProgressBar.propTypes = {
  start: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ProgressBar);
