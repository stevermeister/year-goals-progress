import { useState, useEffect, useCallback } from 'react';
import { Goal, GoalStatus } from '../types/goals';
import { updateStatus as updateStatusService, updateGoals as updateGoalsService, subscribeToGoals, subscribeToStatus } from '../services/goalService';
import { useAuth } from './useAuth';

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [status, setStatus] = useState<GoalStatus>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setGoals([]);
      setStatus({});
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to real-time updates
    const unsubscribeGoals = subscribeToGoals(user.uid, (goalsData) => {
      setGoals(goalsData);
      setLoading(false);
    });

    const unsubscribeStatus = subscribeToStatus(user.uid, (statusData) => {
      setStatus(statusData);
      setLoading(false);
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeGoals();
      unsubscribeStatus();
    };
  }, [user]);

  const updateGoalProgress = useCallback(async (goalId: string, value: number) => {
    if (!user) return;

    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) throw new Error('Goal not found');

      const newStatus = { ...status, [goalId]: value };
      await updateStatusService(user.uid, newStatus);
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  }, [user, goals, status]);

  const addGoal = useCallback(async (newGoal: Goal) => {
    if (!user) return;

    try {
      const updatedGoals = [...goals, newGoal];
      await updateGoalsService(user.uid, updatedGoals);
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  }, [user, goals]);

  const updateGoals = useCallback(async (newGoals: Goal[]) => {
    if (!user) return;

    try {
      await updateGoalsService(user.uid, newGoals);
    } catch (error) {
      console.error('Error updating goals:', error);
      throw error;
    }
  }, [user]);

  return {
    goals,
    status,
    loading,
    error,
    updateGoalProgress,
    updateGoals,
    addGoal
  };
}
