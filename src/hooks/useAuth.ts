import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth effect running');
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      console.log('useAuth cleanup');
    };
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user
  };
}
