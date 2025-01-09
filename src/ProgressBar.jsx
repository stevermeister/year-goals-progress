function dayOfYear() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
  return dayOfYear;
}

function ProgressBar({ start, current, goal }) {
  return (
    <div className="progressbar-container">
      <div 
        className="progressbar-complete" 
        style={{ width: `${Math.floor((current-start)/(goal-start)*100)}%` }}
      >
        <div className="progressbar-liquid"></div>
      </div>
      <span className="progress">{current}/{goal}</span>
      <div 
        className="progressbar-complete-year" 
        style={{ width: `${Math.floor(dayOfYear()/365*100)}%` }}
      >
        <div className="progressbar-liquid-year"></div>
      </div>
    </div>
  );
}

export default ProgressBar
