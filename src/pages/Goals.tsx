import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useGoals } from '../hooks/useGoals';
import { Goal } from '../types/goals';
import ProgressBar from '../ProgressBar';
import { UserMenu } from '../components/UserMenu';
import { Modal } from '../components/Modal';
import { AddProgressForm } from '../components/AddProgressForm';
import { AddGoalForm } from '../components/AddGoalForm';
import './Goals.css';

export function getProgress(goal: Goal, current: number): number {
  const range = goal.goal - goal.start;
  const progress = current - goal.start;
  return (progress / range) * 100;
}

export function Goals() {
  const { user } = useAuth();
  const { goals, status, loading: goalsLoading, error: goalsError } = useGoals();
  const [isAddProgressOpen, setIsAddProgressOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);

  if (goalsLoading) {
    return (
      <div className="App">
        <UserMenu user={user} />
        <div className="loading">Loading goals...</div>
      </div>
    );
  }

  if (goalsError) {
    return (
      <div className="App">
        <UserMenu user={user} />
        <div className="error">Error loading goals: {goalsError.message}</div>
      </div>
    );
  }

  return (
    <div className="App">
      <UserMenu user={user} />
      <div className="page-content">
        <div className="page-header">
          <h1>Year Goals Progress</h1>
          {goals.length > 0 && (
            <button 
              className="add-progress-button primary-button"
              onClick={() => setIsAddProgressOpen(true)}
            >
              Add Progress
            </button>
          )}
        </div>
        <div className="goals-container">
          {goals.length === 0 ? (
            <div className="no-goals-message">
              <p>You haven't set any goals yet.</p>
              <button 
                className="create-goals-button primary-button"
                onClick={() => setIsAddGoalOpen(true)}
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            <div className="goals-content">
              <ul className="goals-list">
                {goals.map((goal: Goal) => (
                  <li key={goal.id} className="goal-item">
                    <h3>{goal.title}</h3>
                    <ProgressBar 
                      start={goal.start} 
                      current={status[goal.id] ?? goal.start}
                      goal={goal.goal} 
                    />
                  </li>
                ))}
              </ul>
              <button 
                className="add-goal-button compact-button"
                onClick={() => setIsAddGoalOpen(true)}
              >
                + Add Goal
              </button>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isAddProgressOpen}
        onClose={() => setIsAddProgressOpen(false)}
        title="Add Progress"
      >
        <AddProgressForm onClose={() => setIsAddProgressOpen(false)} />
      </Modal>
      <Modal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        title="Add Goal"
      >
        <AddGoalForm onClose={() => setIsAddGoalOpen(false)} />
      </Modal>
    </div>
  );
}
