import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useGoals } from '../hooks/useGoals';
import { Goal } from '../types/goals';
import ProgressBar from '../ProgressBar';
import { UserMenu } from '../components/UserMenu';
import './Goals.css';

export function getProgress(goal: Goal, current: number): number {
  const range = goal.goal - goal.start;
  const progress = current - goal.start;
  return (progress / range) * 100;
}

export function Goals() {
  const { user } = useAuth();
  const { goals, status, updateGoalProgress, loading: goalsLoading, error: goalsError } = useGoals();
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);

  const handleProgressIncrement = async (e: React.MouseEvent, goalId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const currentValue = status[goalId] ?? goal.start;
    if (currentValue < goal.goal) {
      await updateGoalProgress(goalId, currentValue + 1);
    }
  };

  if (goalsLoading) {
    return (
      <div className="App">
        <div className="app-header">
          <UserMenu user={user} />
        </div>
        <div className="loading">Loading goals...</div>
      </div>
    );
  }

  if (goalsError) {
    return (
      <div className="App">
        <div className="app-header">
          <UserMenu user={user} />
        </div>
        <div className="error">Error loading goals: {goalsError.message}</div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="app-header">
        <UserMenu user={user} />
      </div>
      <div className="page-content">
        <div className="page-header">
          <h1>Year Goals Progress</h1>
        </div>
        <div className="goals-container">
          {goals.length === 0 ? (
            <div className="no-goals-message">
              <p>You haven't set any goals yet.</p>
            </div>
          ) : (
            <div className="goals-content">
              <ul className="goals-list">
                {goals.map((goal: Goal) => {
                  const currentValue = status[goal.id] ?? goal.start;
                  const isMaxed = currentValue >= goal.goal;
                  
                  return (
                    <li key={goal.id} className="goal-item">
                      <div className="goal-header">
                        <h3>{goal.title}</h3>
                        <button 
                          className="add-progress-button compact-button"
                          onClick={(e) => handleProgressIncrement(e, goal.id)}
                          disabled={isMaxed}
                          title={isMaxed ? "Goal reached!" : "Add 1 to progress"}
                        >
                          +1 Progress
                        </button>
                      </div>
                      <div className="goal-progress">
                        <ProgressBar 
                          start={goal.start} 
                          current={currentValue}
                          goal={goal.goal} 
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
