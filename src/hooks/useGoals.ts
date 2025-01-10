import { useState, useEffect, useCallback } from 'react';
import { Goal, GoalStatus } from '../types/goals';
import { getGoals, getStatus, initializeUserData } from '../services/goalService';
import { useAuth } from './useAuth';

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [status, setStatus] = useState<GoalStatus>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!user) {
      setGoals([]);
      setStatus({});
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Initialize user data if needed
      await initializeUserData(user.uid);

      // Fetch user's goals and status
      const [goalsData, statusData] = await Promise.all([
        getGoals(user.uid),
        getStatus(user.uid)
      ]);

      setGoals(goalsData);
      setStatus(statusData);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    status,
    loading,
    error,
    refreshGoals: fetchGoals
  };
}
