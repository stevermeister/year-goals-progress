import { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useGoals } from '../hooks/useGoals';
import { Goal } from '../types/goals';
import ProgressBar from '../ProgressBar';
import { UserMenu } from '../components/UserMenu';
import { Navigation } from '../components/Navigation';

export function getProgress(goal: Goal, current: number): number {
  const range = goal.goal - goal.start;
  const progress = current - goal.start;
  return (progress / range) * 100;
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
        <Navigation />
        <div className="loading">Loading goals...</div>
      </div>
    );
  }

  if (goalsError) {
    return (
      <div className="App">
        <UserMenu user={user!} />
        <Navigation />
        <div className="error">Error loading goals: {goalsError.message}</div>
      </div>
    );
  }

  return (
    <div className="App">
      <UserMenu user={user!} />
      <Navigation />
      <div className="page-content">
        <h1>Year Goals Progress</h1>
        <div className="goals-container">
          {sortedGoals.map((goal) => (
            <div key={goal.title} className="goal-item">
              <h3>{goal.title}</h3>
              <ProgressBar 
                start={goal.start}
                current={status[goal.title] ?? goal.start}
                goal={goal.goal}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
