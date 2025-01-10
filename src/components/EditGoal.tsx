import { useState } from 'react';
import { Goal } from '../types/goals';

interface EditGoalProps {
  goal: Goal;
  currentValue: number;
  onSave: (newValue: number) => Promise<void>;
  onCancel: () => void;
}

export function EditGoal({ goal, currentValue, onSave, onCancel }: EditGoalProps) {
  const [value, setValue] = useState(currentValue.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await onSave(numValue);
    } catch (err) {
      setError('Failed to save changes');
      console.error('Error saving goal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-goal">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Current value for "{goal.title}":
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isLoading}
              step="any"
            />
          </label>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="button-group">
          <button 
            type="submit" 
            className="save-button"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
