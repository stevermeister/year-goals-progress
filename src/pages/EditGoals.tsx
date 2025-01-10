import { useState, useEffect } from 'react';
import { useGoals } from '../hooks/useGoals';
import { Goal } from '../types/goals';
import { UserMenu } from '../components/UserMenu';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';
import { updateGoals } from '../services/goalService';

export function EditGoals() {
  const { user } = useAuth();
  const { goals, loading, error, refreshGoals } = useGoals();
  const [editedGoals, setEditedGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setEditedGoals(goals);
  }, [goals]);

  const handleGoalChange = (index: number, field: keyof Goal, value: string | number) => {
    const newGoals = [...editedGoals];
    newGoals[index] = {
      ...newGoals[index],
      [field]: field === 'title' ? value : Number(value)
    };
    setEditedGoals(newGoals);
  };

  const handleAddGoal = () => {
    setEditedGoals([
      ...editedGoals,
      {
        title: 'New Goal',
        start: 0,
        goal: 100
      }
    ]);
  };

  const handleDeleteGoal = (index: number) => {
    const newGoals = [...editedGoals];
    newGoals.splice(index, 1);
    setEditedGoals(newGoals);
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      await updateGoals(user.uid, editedGoals);
      await refreshGoals();
    } catch (error) {
      console.error('Failed to save goals:', error);
    }
  };

  const handleCancel = () => {
    setEditedGoals(goals);
  };

  if (loading) {
    return <div className="loading">Loading goals...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  return (
    <div className="App">
      <UserMenu user={user} />
      <Navigation />
      <div className="page-content">
        <h1>Edit Goals</h1>
        <div className="goals-editor">
          {editedGoals.map((goal, index) => (
            <div key={index} className="goal-edit-item">
              <div className="goal-edit-field">
                <label>Title:</label>
                <input
                  type="text"
                  value={goal.title}
                  onChange={(e) => handleGoalChange(index, 'title', e.target.value)}
                />
              </div>
              <div className="goal-edit-field">
                <label>Start Value:</label>
                <input
                  type="number"
                  value={goal.start}
                  onChange={(e) => handleGoalChange(index, 'start', e.target.value)}
                />
              </div>
              <div className="goal-edit-field">
                <label>Target Value:</label>
                <input
                  type="number"
                  value={goal.goal}
                  onChange={(e) => handleGoalChange(index, 'goal', e.target.value)}
                />
              </div>
              <button 
                className="delete-goal"
                onClick={() => handleDeleteGoal(index)}
              >
                Delete
              </button>
            </div>
          ))}
          <button 
            className="add-goal"
            onClick={handleAddGoal}
          >
            + Add New Goal
          </button>
          <div className="action-buttons">
            <button 
              className="save-changes"
              onClick={handleSave}
            >
              Save Changes
            </button>
            <button 
              className="cancel-changes"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
