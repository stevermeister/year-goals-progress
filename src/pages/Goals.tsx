import { useState, useRef, useEffect } from 'react';
import { useGoals } from '../hooks/useGoals';
import { Goal } from '../types/goals';
import ProgressBar from '../ProgressBar';
import { addProgressLog } from '../services/storageService';
import './Goals.css';

export function getProgress(goal: Goal, current: number): number {
  // For decreasing goals (target < start)
  if (goal.goal < goal.start) {
    return ((goal.start - current) / (goal.start - goal.goal)) * 100;
  }
  // For increasing goals (target > start)
  const range = goal.goal - goal.start;
  const progress = current - goal.start;
  return (progress / range) * 100;
}

interface AddGoalFormData {
  title: string;
  goal: number;
  start: number;
}

export function Goals() {
  const { goals = [], status = {}, updateGoalProgress, addNewGoal, removeGoal, loading: goalsLoading, error: goalsError } = useGoals();
  const [showAddForm, setShowAddForm] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<AddGoalFormData>({
    title: '',
    goal: 0,
    start: 0
  });

  useEffect(() => {
    if (showAddForm && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [showAddForm]);

  const handleProgressIncrement = async (e: React.MouseEvent, goalId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const currentValue = status[goalId] ?? goal.start;
    const newValue = currentValue - 1;
    
    // For decreasing goals, we can only decrease until we reach the target
    if (newValue >= goal.goal) {
      try {
        await Promise.all([
          addProgressLog({
            goalId,
            goalTitle: goal.title,
            value: -1,
            date: new Date().toISOString().split('T')[0],
            notes: '',
            type: 'increment'
          }),
          updateGoalProgress(goalId, newValue)
        ]);
      } catch (error) {
        console.error('Failed to update progress:', error);
        alert('Failed to update progress. Please try again.');
      }
    }
  };

  const handleAddGoal = async () => {
    try {
      await addNewGoal(formData);
      setFormData({ title: '', goal: 0, start: 0 });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add goal:', error);
      alert('Failed to add goal. Please try again.');
    }
  };

  if (goalsLoading) {
    return <div className="loading">Loading goals...</div>;
  }

  if (goalsError) {
    return <div className="error">Error loading goals: {goalsError.message}</div>;
  }

  return (
    <div className="page-content">
      <div className="goals-container">
        <div className="goals-header">
        </div>

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
                    <div className="goal-content">
                      <div className="goal-header">
                        <h3>{goal.title}</h3>
                        <div className="goal-values">
                          {goal.start !== 0 && (
                            <span className="start-value">({goal.start})</span>
                          )}
                          <span className="current-value">{currentValue}</span>
                          <span className="separator">→</span>
                          <span className="goal-value">{goal.goal}</span>
                        </div>
                      </div>
                      <div className="goal-progress">
                        <ProgressBar 
                          progress={getProgress(goal, currentValue)} 
                        />
                      </div>
                    </div>
                    <div className="progress-buttons-overlay">
                      <div className="progress-buttons">
                        <button 
                          className="add-progress-button decrease"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            const newValue = currentValue - 1;
                            const isDecreasingGoal = goal.goal < goal.start;
                            
                            if ((isDecreasingGoal && newValue >= goal.goal) || 
                                (!isDecreasingGoal && newValue >= goal.start)) {
                              addProgressLog({
                                goalId: goal.id,
                                goalTitle: goal.title,
                                value: -1,
                                date: new Date().toISOString().split('T')[0],
                                notes: '',
                                type: 'increment'
                              });
                              updateGoalProgress(goal.id, newValue);
                            }
                          }}
                          title="Decrease by 1"
                          disabled={
                            (goal.goal < goal.start && currentValue <= goal.goal) || 
                            (goal.goal > goal.start && currentValue <= goal.start)
                          }
                        >
                          -1
                        </button>
                        <button 
                          className="add-progress-button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            const newValue = currentValue + 1;
                            const isDecreasingGoal = goal.goal < goal.start;
                            
                            if ((isDecreasingGoal && newValue <= goal.start) || 
                                (!isDecreasingGoal && newValue <= goal.goal)) {
                              addProgressLog({
                                goalId: goal.id,
                                goalTitle: goal.title,
                                value: 1,
                                date: new Date().toISOString().split('T')[0],
                                notes: '',
                                type: 'increment'
                              });
                              updateGoalProgress(goal.id, newValue);
                            }
                          }}
                          title="Increase by 1"
                          disabled={
                            (goal.goal < goal.start && currentValue >= goal.start) || 
                            (goal.goal > goal.start && currentValue >= goal.goal)
                          }
                        >
                          +1
                        </button>
                      </div>
                      <button 
                        className="remove-goal-button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to remove this goal?')) {
                            removeGoal(goal.id);
                          }
                        }}
                        title="Remove goal"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        
        {!showAddForm ? (
          <button 
            className="add-goal-button"
            onClick={() => setShowAddForm(true)}
          >
            Add Goal
          </button>
        ) : (
          <div className="inline-add-goal-form">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddGoal();
            }}>
              <div className="form-row">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Goal Title"
                  required
                />
                <div className="range-inputs">
                  <span className="range-label">From</span>
                  <input
                    type="number"
                    value={formData.start}
                    onChange={e => setFormData(prev => ({ ...prev, start: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    required
                    min="0"
                  />
                  <span className="range-label">To</span>
                  <input
                    type="number"
                    value={formData.goal}
                    onChange={e => setFormData(prev => ({ ...prev, goal: parseInt(e.target.value) || 0 }))}
                    placeholder="100"
                    required
                    min="1"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button 
                  type="submit"
                  className="submit-button"
                >
                  Save
                </button>
                <button 
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ title: '', goal: 0, start: 0 });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
