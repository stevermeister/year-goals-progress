import { useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { UserMenu } from './components/UserMenu';
import { Goal } from './types/goals';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Goals } from './pages/Goals';
import { ProtectedRoute } from './components/ProtectedRoute';
import { History } from './pages/History';
import { Welcome } from './pages/Welcome';
import { Inspiration } from './pages/Inspiration';
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
      <Route path="/" element={<Navigate to="/welcome" />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/inspiration" element={<Inspiration />} />
      <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/welcome" replace />} />
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
