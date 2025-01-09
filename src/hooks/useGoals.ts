import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Goal, GoalStatus } from '../types/goals';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [status, setStatus] = useState<GoalStatus>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Subscribe to goals collection
    const goalsUnsubscribe = onSnapshot(
      collection(db, 'goals'),
      (snapshot) => {
        const goalsData = snapshot.docs.map(doc => doc.data() as Goal);
        setGoals(goalsData);
        setError(null);
      },
      (err) => {
        console.error('Error fetching goals:', err);
        setError('Failed to load goals');
      }
    );

    // Subscribe to status collection
    const statusUnsubscribe = onSnapshot(
      collection(db, 'status'),
      (snapshot) => {
        const statusDoc = snapshot.docs[0];
        if (statusDoc) {
          setStatus(statusDoc.data() as GoalStatus);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching status:', err);
        setError('Failed to load status');
        setLoading(false);
      }
    );

    // Cleanup subscriptions
    return () => {
      goalsUnsubscribe();
      statusUnsubscribe();
    };
  }, []);

  return {
    goals,
    status,
    loading,
    error
  };
}
