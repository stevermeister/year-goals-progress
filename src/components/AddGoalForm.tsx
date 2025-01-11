import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { addGoal } from '../services/goalService';
import { useNavigate } from 'react-router-dom';
import { useGoals } from '../hooks/useGoals';
import { Goal } from '../types/goals';
import './AddGoalForm.css';

interface AddGoalFormProps {
  onClose: () => void;
}

export function AddGoalForm({ onClose }: AddGoalFormProps) {
  const { user } = useAuth();
  const { addGoal: addGoalHook } = useGoals();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('0');
  const [goal, setGoal] = useState('100');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateId = () => {
    return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!user) {
      console.error('You must be logged in to add a goal');
      return;
    }

    try {
      setIsSubmitting(true);
      const newGoal: Goal = {
        id: generateId(),
        title: title.trim(),
        start: Number(start),
        goal: Number(goal)
      };

      await addGoalHook(newGoal);
      onClose();
      navigate('/goals'); // Navigate to goals page after successful addition
    } catch (error) {
      console.error('Error adding goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-goal-form">
      <div className="form-content">
        <div className="form-group">
          <label htmlFor="title">Goal Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your goal title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="start">Start Value</label>
          <input
            id="start"
            type="number"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="Enter starting value"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="goal">Target Value</label>
          <input
            id="goal"
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Enter target value"
            required
          />
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
          type="submit"
          className="submit-button"
          disabled={isSubmitting || !title.trim() || Number(goal) <= Number(start)}
        >
          {isSubmitting ? 'Adding...' : 'Add Goal'}
        </button>
      </div>
    </form>
  );
}
