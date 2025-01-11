import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserMenu } from '../components/UserMenu';
import { ProgressLog, getAllProgressLogs } from '../services/goalService';
import './History.css';

export function History() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      if (!user?.uid) return;
      
      try {
        const allLogs = await getAllProgressLogs(user.uid);
        // Sort logs by date and time, most recent first
        const sortedLogs = allLogs.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setLogs(sortedLogs);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch logs'));
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [user]);

  if (loading) {
    return (
      <div className="App">
        <div className="app-header">
          <UserMenu user={user} />
        </div>
        <div className="loading">Loading history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="app-header">
          <UserMenu user={user} />
        </div>
        <div className="error">Error: {error.message}</div>
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
          <h1>Progress History</h1>
        </div>
        <div className="history-container">
          {logs.length === 0 ? (
            <div className="no-history-message">
              <p>No progress history yet.</p>
            </div>
          ) : (
            <div className="history-list">
              {logs.map((log, index) => (
                <div key={index} className="history-item">
                  <span className="history-datetime">
                    {new Date(log.date).toLocaleDateString()} {log.timestamp?.toDate().toLocaleTimeString()}
                  </span>
                  <span className="history-goal">{log.goalTitle}</span>
                  <span className="history-value">
                    {log.type === 'increment' ? '+' : '-'}{log.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
