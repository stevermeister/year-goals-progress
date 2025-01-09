function dayOfYear() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
  return dayOfYear;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ProgressBar({ start, current, goal }) {
  const yearProgress = dayOfYear() / 365;
  const currentMonth = new Date().getMonth();
  
  return (
    <div 
      className="progressbar-container"
    >
      <div 
        className="progressbar-complete" 
        style={{ width: `${Math.floor((current-start)/(goal-start)*100)}%` }}
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
          ({Math.floor((current-start)/(goal-start)*100)}%)
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

export default ProgressBar
