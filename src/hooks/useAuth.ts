import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { signInWithGoogle, signOut, onAuthChange } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      await signOut();
      setUser(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isAuthenticated: !!user
  };
}
