import { useMemo } from 'react';
import ProgressBar from './ProgressBar';
import { goals, statusNumber } from './data/goals';
import { Goal } from './types/goals';
import './App.css';

function getProgress(goal: Goal): number {
  const current = statusNumber[goal.title];
  return (current - goal.start) / (goal.goal - goal.start);
}

function App(): JSX.Element {
  // Sort goals by completion percentage
  const sortedGoals = useMemo(() => {
    return [...goals].sort((a, b) => getProgress(b) - getProgress(a));
  }, []);

  return (
    <div className="App">
      <h1>Year Goals Progress</h1>
      <div className="goals-container">
        {sortedGoals.map((goal) => {
          const current = statusNumber[goal.title];
          if (current === undefined) {
            console.warn(`No status found for goal: ${goal.title}`);
            return null;
          }

          return (
            <div key={goal.title} className="goal-item">
              <h3>{goal.title}</h3>
              <ProgressBar 
                start={goal.start}
                current={current}
                goal={goal.goal}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
