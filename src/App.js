import './App.scss';

function App() {  
    return (
      <div className="container">
        <h1>Year progress</h1>
        <div className="progressbar-container">
          <div className="progressbar-complete" style={{width: `${getProgress()}%`}}>
            <div className="progressbar-liquid"></div>
          </div>
          <span className="progress">{dayOfYear()}/365</span>
        </div>
      </div>
    )
}

function getProgress() {
  const now = new Date().getTime()
  const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1).getTime()
  const firstDayOfNextYear = new Date(new Date().getFullYear() + 1, 0, 1).getTime()
  return  Math.round((now - firstDayOfYear) / (firstDayOfNextYear - firstDayOfYear) * 100);
}

function dayOfYear() {
  const today = new Date();
  const year = today.getFullYear();

  // Create a new date object for the start of the year
  const startOfYear = new Date(year, 0, 1);

  // Calculate the number of milliseconds between the start of the year and the current date
  const millisecondsSinceStartOfYear = today - startOfYear;

  // Convert the number of milliseconds to the number of days
  const dayOfYear = Math.floor(millisecondsSinceStartOfYear / (1000 * 60 * 60 * 24));

  return dayOfYear;
}

export default App;