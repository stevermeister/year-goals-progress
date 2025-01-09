import { useMemo } from 'react';
import ProgressBar from './ProgressBar';
import { useGoals } from './hooks/useGoals';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { UserMenu } from './components/UserMenu';
import { Goal } from './types/goals';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Goals } from './pages/Goals';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function getProgress(goal: Goal, current: number): number {
  return (current - goal.start) / (goal.goal - goal.start);
}

function AppRoutes(): JSX.Element {
  const { user, loading: authLoading, isAuthenticated, error: authError } = useAuth();
  const { goals, status, loading: goalsLoading, error: goalsError } = useGoals();

  // Sort goals by completion percentage
  const sortedGoals = useMemo(() => {
    return [...goals].sort((a, b) => {
      const progressA = getProgress(a, status[a.title] ?? a.start);
      const progressB = getProgress(b, status[b.title] ?? b.start);
      return progressB - progressA;
    });
  }, [goals, status]);

  if (authLoading) {
    return (
      <div className="App">
        <div className="loading">Initializing...</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="App">
        <div className="error">Authentication error: {authError.message}</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Login />;
  }

  if (goalsLoading) {
    return (
      <div className="App">
        <UserMenu user={user} />
        <h1>Year Goals Progress</h1>
        <div className="loading">Loading goals...</div>
      </div>
    );
  }

  if (goalsError) {
    return (
      <div className="App">
        <UserMenu user={user} />
        <h1>Year Goals Progress</h1>
        <div className="error">{goalsError}</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="App">
              <UserMenu user={user} />
              <h1>Year Goals Progress</h1>
              <div className="goals-container">
                {sortedGoals.map((goal) => {
                  const current = status[goal.title];
                  if (current === undefined) {
                    console.warn(`No status found for goal: ${goal.title}`);
                    return null;
                  }

                  return (
                    <div key={goal.title} className="goal-item">
                      <h3>{goal.title}</h3>
                      <ProgressBar 
                        start={goal.start}
                        current={current}
                        goal={goal.goal}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App(): JSX.Element {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
