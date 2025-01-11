import { useState, useMemo, useEffect } from 'react';
import { useGoals } from '../hooks/useGoals';
import { Goal } from '../types/goals';
import './AddProgressForm.css';

interface AddProgressFormProps {
  onClose: () => void;
}

export function AddProgressForm({ onClose }: AddProgressFormProps) {
  const { goals, status, updateGoalProgress } = useGoals();
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [value, setValue] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentGoal = useMemo(() => 
    goals.find(g => g.id === selectedGoal) || goals[0], 
    [goals, selectedGoal]
  );

  useEffect(() => {
    if (goals.length > 0 && !selectedGoal) {
      const firstGoal = goals[0];
      setSelectedGoal(firstGoal.id);
      setValue(status[firstGoal.id] || firstGoal.start);
    }
  }, [goals, status, selectedGoal]);

  const handleSliderChange = (newValue: number) => {
    setValue(newValue);
  };

  const handleSave = async () => {
    if (!currentGoal || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await updateGoalProgress(currentGoal.id, value);
      onClose();
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentGoal) return null;

  return (
    <div className="add-progress-form">
      <div className="form-content">
        <div className="form-group">
          <label htmlFor="goal">Goal</label>
          <select
            id="goal"
            value={selectedGoal}
            onChange={(e) => {
              const goalId = e.target.value;
              setSelectedGoal(goalId);
              const goal = goals.find(g => g.id === goalId);
              setValue(status[goalId] || goal?.start || 0);
            }}
            disabled={isSubmitting}
          >
            {goals.map((goal: Goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <div className="value-input-container">
            <div className="progress-change">
              <span className="current-value">
                Current: {value} / {currentGoal.goal}
              </span>
            </div>
            <div className="slider-container">
              <input
                type="range"
                aria-label="Progress slider"
                min={currentGoal.start}
                max={currentGoal.goal}
                value={value}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                disabled={isSubmitting}
                className="progress-slider"
              />
              <div className="slider-labels">
                <span>{currentGoal.start}</span>
                <span>{currentGoal.goal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="form-footer">
        <button 
          type="button" 
          onClick={onClose} 
          className="cancel-button"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="submit-button"
          disabled={
            isSubmitting || 
            !currentGoal || 
            value < currentGoal.start || 
            value > currentGoal.goal ||
            value === (status[currentGoal.id] || currentGoal.start)
          }
        >
          {isSubmitting ? 'Saving...' : 'Save Progress'}
        </button>
      </div>
    </div>
  );
}
