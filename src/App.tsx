import { useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { UserMenu } from './components/UserMenu';
import { Goal } from './types/goals';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Goals } from './pages/Goals';
import { ProtectedRoute } from './components/ProtectedRoute';
import { EditGoals } from './pages/EditGoals';
import { AddProgress } from './pages/AddProgress';
import './App.css';

function AppRoutes(): JSX.Element {
  const { user, loading: authLoading, isAuthenticated, error: authError } = useAuth();

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

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        }
      />
      <Route path="/edit-goals" element={
        <ProtectedRoute>
          <EditGoals />
        </ProtectedRoute>
      } />
      <Route path="/add-progress" element={
        <ProtectedRoute>
          <AddProgress />
        </ProtectedRoute>
      } />
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
