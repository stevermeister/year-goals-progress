import { useState } from 'react';
import { useGoals } from '../hooks/useGoals';
import { Goal } from '../types/goals';
import { UserMenu } from '../components/UserMenu';
import { Navigation } from '../components/Navigation';

interface ProgressEntry {
  goalTitle: string;
  value: number;
  date: string;
  notes: string;
}

export function AddProgress() {
  const { goals, status, loading, error, refreshGoals } = useGoals();
  const [entry, setEntry] = useState<ProgressEntry>({
    goalTitle: '',
    value: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement progress submission
  };

  if (loading) {
    return <div className="loading">Loading goals...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  return (
    <div className="App">
      <UserMenu user={null} />
      <Navigation />
      <div className="page-content">
        <h1>Add Progress</h1>
        <form onSubmit={handleSubmit} className="progress-form">
          <div className="form-field">
            <label>Goal:</label>
            <select 
              value={entry.goalTitle}
              onChange={(e) => setEntry({ ...entry, goalTitle: e.target.value })}
            >
              <option value="">Select a goal</option>
              {goals.map((goal) => (
                <option key={goal.title} value={goal.title}>
                  {goal.title} (Current: {status[goal.title] ?? goal.start})
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Progress Value:</label>
            <input 
              type="number"
              value={entry.value}
              onChange={(e) => setEntry({ ...entry, value: Number(e.target.value) })}
              step="any"
            />
          </div>

          <div className="form-field">
            <label>Date:</label>
            <input 
              type="date"
              value={entry.date}
              onChange={(e) => setEntry({ ...entry, date: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label>Notes:</label>
            <textarea
              value={entry.notes}
              onChange={(e) => setEntry({ ...entry, notes: e.target.value })}
              rows={4}
              placeholder="Add any additional notes..."
            />
          </div>

          <button type="submit" className="submit-progress">
            Add Progress
          </button>
        </form>
      </div>
    </div>
  );
}
