import { useState, useEffect, useCallback } from 'react';
import { Goal, GoalStatus } from '../types/goals';
import { updateStatus as updateStatusService, updateGoals as updateGoalsService, subscribeToGoals, subscribeToStatus } from '../services/goalService';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [status, setStatus] = useState<GoalStatus>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const unsubscribeGoals = onSnapshot(
      doc(db, 'users', user.uid, 'data', 'goals'),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setGoals(data?.goals || []);
        } else {
          setGoals([]);
        }
        setLoading(false);
      }
    );

    const unsubscribeStatus = subscribeToStatus(user.uid, (statusData) => {
      setStatus(statusData);
    });

    return () => {
      unsubscribeGoals();
      unsubscribeStatus();
    };
  }, [user]);

  const updateGoalProgress = useCallback(async (goalId: string, newValue: number) => {
    if (!user) return;

    try {
      await updateStatusService(user.uid, {
        ...status,
        [goalId]: newValue
      });
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  }, [user, status]);

  return {
    goals,
    status,
    loading,
    error,
    updateGoalProgress
  };
}
