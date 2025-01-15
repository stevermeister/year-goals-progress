import { useState, useRef, useEffect } from 'react';
import { useGoals } from '../hooks/useGoals';
import { Goal } from '../types/goals';
import ProgressBar from '../ProgressBar';
import { addProgressLog } from '../services/storageService';
import './Goals.css';

export function getProgress(goal: Goal, current: number): number {
  // For decreasing goals (target < start)
  if (goal.goalValue < goal.startValue) {
    const range = goal.startValue - goal.goalValue;
    const progress = goal.startValue - current;
    return Math.min(100, Math.max(0, (progress / range) * 100));
  }
  // For increasing goals (target > start)
  const range = goal.goalValue - goal.startValue;
  const progress = current - goal.startValue;
  return Math.min(100, Math.max(0, (progress / range) * 100));
}

interface AddGoalFormData {
  title: string;
  start: number;
  goal: number;
}

export function Goals() {
  const { 
    goals = [], 
    status = {}, 
    updateGoalProgress, 
    addNewGoal, 
    removeGoal, 
    loading: goalsLoading, 
    error: goalsError, 
    setGoals,
    clearAllGoals,
    importGoals 
  } = useGoals();
  const [showAddForm, setShowAddForm] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<AddGoalFormData>({
    title: '',
    start: 0,
    goal: 0
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

    const currentValue = status[goalId] ?? goal.startValue;
    const newValue = currentValue - 1;
    
    // For decreasing goals, we can only decrease until we reach the target
    if (newValue >= goal.goalValue) {
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
      await addNewGoal({
        title: formData.title,
        startValue: formData.start,
        goalValue: formData.goal
      });
      setFormData({ title: '', start: 0, goal: 0 });
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add goal:', err);
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

        {!goals.length && (
          <div className="no-goals-message">
            <p>You haven't added any goals yet.</p>
            <button 
              className="add-goal-button"
              onClick={() => setShowAddForm(true)}
            >
              Add Your First Goal
            </button>
          </div>
        )}
        
        {goals.length > 0 && (
          <div className="goals-content">
            <ul className="goals-list">
              {goals.map((goal: Goal) => {
                const currentValue = status[goal.id] ?? goal.startValue;
                const isMaxed = currentValue >= goal.goalValue;
                
                return (
                  <li key={goal.id} className="goal-item">
                    <div className="goal-content">
                      <div className="goal-header">
                        <h3>{goal.title}</h3>
                        <div className="goal-values">
                          {goal.startValue !== 0 && (
                            <span className="start-value">({goal.startValue})</span>
                          )}
                          <span className="current-value">{currentValue}</span>
                          <span className="separator">→</span>
                          <span className="goal-value">{goal.goalValue}</span>
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
                            const isDecreasingGoal = goal.goalValue < goal.startValue;
                            
                            if ((isDecreasingGoal && newValue >= goal.goalValue) || 
                                (!isDecreasingGoal && newValue >= goal.startValue)) {
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
                            (goal.goalValue < goal.startValue && currentValue <= goal.goalValue) || 
                            (goal.goalValue > goal.startValue && currentValue <= goal.startValue)
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
                            const isDecreasingGoal = goal.goalValue < goal.startValue;
                            
                            if ((isDecreasingGoal && newValue <= goal.startValue) || 
                                (!isDecreasingGoal && newValue <= goal.goalValue)) {
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
                            (goal.goalValue < goal.startValue && currentValue >= goal.startValue) || 
                            (goal.goalValue > goal.startValue && currentValue >= goal.goalValue)
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {!showAddForm && (
              <button 
                className="add-goal-button"
                onClick={() => setShowAddForm(true)}
              >
                Add Goal
              </button>
            )}
          </div>
        )}
        
        {showAddForm && (
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
                    setFormData({ title: '', start: 0, goal: 0 });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="data-actions">
          <a 
            className="data-action-link"
            onClick={() => {
              if (!goals.length) {
                alert('No goals to export');
                return;
              }
              
              try {
                const exportGoals = goals.map(goal => ({
                  id: goal.id,
                  title: goal.title,
                  startValue: goal.startValue,
                  currentValue: status[goal.id] ?? goal.startValue,
                  goalValue: goal.goalValue
                }));
                
                const goalsJson = JSON.stringify(exportGoals, null, 2);
                const blob = new Blob([goalsJson], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                const date = new Date().toISOString().split('T')[0];
                
                link.href = url;
                link.download = `goals-${date}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              } catch (err) {
                console.error('Export error:', err);
                alert('Failed to export goals');
              }
            }}
          >
            Export Goals
          </a>
          <a 
            className="data-action-link" 
            onClick={() => {
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.accept = '.json';
              fileInput.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  try {
                    const text = await file.text();
                    const importedData = JSON.parse(text);
                    
                    if (!Array.isArray(importedData)) {
                      throw new Error('Invalid goals format: must be an array');
                    }
                    
                    const transformedGoals = importedData.map(goal => {
                      if (
                        !goal.id || 
                        !goal.title || 
                        typeof goal.startValue !== 'number' ||
                        typeof goal.currentValue !== 'number' ||
                        typeof goal.goalValue !== 'number'
                      ) {
                        throw new Error('Invalid goal structure: missing or invalid required fields');
                      }

                      return {
                        id: goal.id,
                        title: goal.title,
                        startValue: goal.startValue,
                        currentValue: goal.currentValue,
                        goalValue: goal.goalValue
                      };
                    });
                    
                    await importGoals(transformedGoals);
                  } catch (err) {
                    console.error('Import error:', err);
                    alert(err instanceof Error ? err.message : 'Failed to import goals');
                  }
                }
              };
              fileInput.click();
            }}
          >
            Import Goals
          </a>
          <a 
            className="data-action-link danger"
            onClick={async () => {
              if (window.confirm('Are you sure you want to remove all goals? This action cannot be undone.')) {
                try {
                  await clearAllGoals();
                } catch (err) {
                  alert('Failed to remove all data');
                }
              }
            }}
          >
            Remove All Data
          </a>
        </div>
      </div>
    </div>
  );
}
