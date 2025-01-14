import { useState, useEffect } from 'react';
import { Goal } from '../types/goals';
import { 
  getGoals, 
  getStatus, 
  addGoal as addGoalToStorage, 
  updateGoalStatus, 
  removeGoal as removeGoalFromStorage,
  clearAllData,
  importGoals as importGoalsToStorage
} from '../services/storageService';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [status, setStatus] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadGoals();
  }, []);

  async function loadGoals() {
    try {
      const [goalsData, statusData] = await Promise.all([
        getGoals(),
        getStatus()
      ]);
      setGoals(goalsData);
      setStatus(statusData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load goals'));
    } finally {
      setLoading(false);
    }
  }

  const updateGoalProgress = async (goalId: string, newValue: number) => {
    try {
      await updateGoalStatus(goalId, newValue);
      setStatus(prev => ({
        ...prev,
        [goalId]: newValue
      }));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update goal progress');
    }
  };

  const addNewGoal = async (goalData: Omit<Goal, 'id'>) => {
    try {
      const newGoal = await addGoalToStorage(goalData);
      setGoals(prev => [...prev, newGoal]);
      setStatus(prev => ({
        ...prev,
        [newGoal.id]: goalData.start
      }));
      return newGoal;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add goal');
    }
  };

  const removeGoal = async (goalId: string) => {
    try {
      await removeGoalFromStorage(goalId);
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      setStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[goalId];
        return newStatus;
      });
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to remove goal');
    }
  };

  const clearAllGoals = async () => {
    try {
      await clearAllData();
      setGoals([]);
      setStatus({});
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to clear all data');
    }
  };

  const importGoals = async (goals: Goal[]) => {
    try {
      await importGoalsToStorage(goals);
      setGoals(goals);
      const newStatus = goals.reduce((acc, goal) => {
        acc[goal.id] = goal.currentValue;
        return acc;
      }, {} as Record<string, number>);
      setStatus(newStatus);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to import goals');
    }
  };

  return {
    goals,
    status,
    loading,
    error,
    updateGoalProgress,
    addNewGoal,
    removeGoal,
    setGoals,
    clearAllGoals,
    importGoals
  };
}
