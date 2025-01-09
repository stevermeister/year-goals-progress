import { useMemo } from 'react';
import { useGoals } from '../hooks/useGoals';
import { useAuth } from '../hooks/useAuth';
import ProgressBar from '../ProgressBar';
import { UserMenu } from '../components/UserMenu';
import { Goal } from '../types/goals';

function getProgress(goal: Goal, current: number): number {
  return (current - goal.start) / (goal.goal - goal.start);
}

export function Goals() {
  const { user } = useAuth();
  const { goals, status, loading: goalsLoading, error: goalsError } = useGoals();

  const sortedGoals = useMemo(() => {
    return [...goals].sort((a, b) => {
      const progressA = getProgress(a, status[a.title] ?? a.start);
      const progressB = getProgress(b, status[b.title] ?? b.start);
      return progressB - progressA;
    });
  }, [goals, status]);

  if (goalsLoading) {
    return (
      <div className="App">
        <UserMenu user={user!} />
        <h1>Year Goals Progress</h1>
        <div className="loading">Loading goals...</div>
      </div>
    );
  }

  if (goalsError) {
    return (
      <div className="App">
        <UserMenu user={user!} />
        <h1>Year Goals Progress</h1>
        <div className="error">{goalsError}</div>
      </div>
    );
  }

  return (
    <div className="App">
      <UserMenu user={user!} />
      <h1>Year Goals Progress</h1>
      <div className="goals-container">
        {sortedGoals.map((goal) => {
          const current = status[goal.title];
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
