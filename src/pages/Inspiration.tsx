import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { goalTemplates, GoalTemplate } from '../data/goalTemplates';
import { addGoal } from '../services/goalService';
import './Inspiration.css';

export function Inspiration() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedGoals, setSelectedGoals] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const toggleGoal = (index: number) => {
    const newSelected = new Set(selectedGoals);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedGoals(newSelected);
  };

  const selectRandom = () => {
    const newSelected = new Set<number>();
    const available = Array.from({ length: goalTemplates.length }, (_, i) => i);
    
    while (newSelected.size < 5 && available.length > 0) {
      const randomIndex = Math.floor(Math.random() * available.length);
      const selectedIndex = available.splice(randomIndex, 1)[0];
      newSelected.add(selectedIndex);
    }
    
    setSelectedGoals(newSelected);
  };

  const handleSubmit = async () => {
    if (!user || isSubmitting || selectedGoals.size === 0) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Add each selected goal sequentially to avoid race conditions
      for (const index of selectedGoals) {
        const template = goalTemplates[index];
        await addGoal(user.uid, {
          title: template.title,
          goal: template.goal,
          start: 0  // Initialize start at 0
        });
      }

      navigate('/goals');
    } catch (error) {
      console.error('Error adding goals:', error);
      setError('Failed to add goals. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="inspiration-container">
      <h1>Pick Goals for Your Best Year Yet!</h1>
      
      <div className="inspiration-header">
        <span className="selected-count">
          {selectedGoals.size} {selectedGoals.size === 1 ? 'goal' : 'goals'} selected
        </span>
        <button 
          className="surprise-button"
          onClick={selectRandom}
        >
          🎲 Surprise Me
        </button>
      </div>

      <div className="goals-grid">
        {goalTemplates.map((goal, index) => (
          <div 
            key={index}
            className={`goal-card ${selectedGoals.has(index) ? 'selected' : ''}`}
            onClick={() => toggleGoal(index)}
          >
            <div className="goal-emoji">{goal.emoji}</div>
            <h3>{goal.title}</h3>
            <div className="goal-number">{goal.goal}</div>
            {selectedGoals.has(index) && (
              <div className="checkmark">✓</div>
            )}
          </div>
        ))}
      </div>

      <button 
        className="next-button"
        disabled={selectedGoals.size === 0 || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? 'Adding Goals...' : 'Start Your Journey'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
