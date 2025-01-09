import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { signInWithGoogle } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    console.log('User is authenticated, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-container">
      <h2>Welcome to Year Goals Progress</h2>
      <p>Please sign in to continue</p>
      <button 
        onClick={handleLogin} 
        className="login-button"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
