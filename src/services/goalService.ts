import { 
  collection, 
  doc, 
  getDoc,
  getDocs,
  setDoc, 
  deleteDoc,
  onSnapshot,
  Timestamp,
  addDoc,
  query,
  orderBy,
  where,
  runTransaction
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Goal, GoalStatus } from '../types/goals';

const USERS_COLLECTION = 'users';

export async function getGoals(userId: string): Promise<Goal[]> {
  try {
    const userGoalsDoc = await getDoc(doc(db, USERS_COLLECTION, userId, 'data', 'goals'));
    
    if (!userGoalsDoc.exists()) {
      return [];
    }
    
    const data = userGoalsDoc.data();
    if (!data || Object.keys(data).length === 0) {
      return [];
    }

    // Convert object back to array and ensure each goal has an id
    const goalsArray = Object.entries(data).map(([id, goal]: [string, any]) => ({
      ...goal,
      id: goal.id || id
    }));
    return goalsArray;
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
}

export function subscribeToGoals(userId: string, callback: (goals: Goal[]) => void) {
  return onSnapshot(
    doc(db, USERS_COLLECTION, userId, 'data', 'goals'),
    (doc) => {
      if (!doc.exists()) {
        callback([]);
        return;
      }
      
      const data = doc.data();
      if (!data || Object.keys(data).length === 0) {
        callback([]);
        return;
      }

      const goalsArray = Object.entries(data).map(([id, goal]: [string, any]) => ({
        ...goal,
        id: goal.id || id
      }));
      callback(goalsArray);
    },
    (error) => {
      console.error('Error subscribing to goals:', error);
    }
  );
}

export async function getStatus(userId: string): Promise<GoalStatus> {
  try {
    const userStatusDoc = await getDoc(doc(db, USERS_COLLECTION, userId, 'data', 'status'));
    if (!userStatusDoc.exists()) {
      return {};
    }
    return userStatusDoc.data() as GoalStatus;
  } catch (error) {
    console.error('Error fetching status:', error);
    throw error;
  }
}

export function subscribeToStatus(userId: string, callback: (status: GoalStatus) => void) {
  return onSnapshot(
    doc(db, USERS_COLLECTION, userId, 'data', 'status'),
    (doc) => {
      if (!doc.exists()) {
        callback({});
        return;
      }
      callback(doc.data() as GoalStatus);
    },
    (error) => {
      console.error('Error subscribing to status:', error);
    }
  );
}

export async function updateGoals(userId: string, goals: Goal[]): Promise<void> {
  try {
    const goalsRef = doc(db, USERS_COLLECTION, userId, 'data', 'goals');
    await setDoc(goalsRef, { goals });
  } catch (error) {
    console.error('Error updating goals:', error);
    throw error;
  }
}

export async function updateStatus(userId: string, status: GoalStatus): Promise<void> {
  try {
    await setDoc(doc(db, USERS_COLLECTION, userId, 'data', 'status'), status);
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
}

export async function removeUserData(userId: string): Promise<void> {
  try {
    // Delete goals document
    const goalsRef = doc(db, USERS_COLLECTION, userId, 'data', 'goals');
    
    // Delete progress logs collection
    const logsRef = collection(db, USERS_COLLECTION, userId, 'progressLogs');
    const logsSnapshot = await getDocs(logsRef);
    const logDeletions = logsSnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    
    // Delete status document
    const statusRef = doc(db, USERS_COLLECTION, userId, 'data', 'status');

    // Delete preferences document (welcome screen seen status)
    const prefsRef = doc(db, USERS_COLLECTION, userId, 'preferences', 'app');
    
    // Wait for all deletions to complete
    await Promise.all([
      deleteDoc(goalsRef),
      ...logDeletions,
      deleteDoc(statusRef),
      deleteDoc(prefsRef)
    ]);

    console.log('Successfully removed all user data');
  } catch (error) {
    console.error('Error removing user data:', error);
    throw error;
  }
}

export interface ProgressLog {
  goalId: string;
  goalTitle: string;
  value: number;
  date: string;
  notes: string;
  type: 'increment' | 'decrement';
}

export async function addProgressLog(userId: string, log: ProgressLog): Promise<void> {
  try {
    const progressLogRef = collection(db, 'users', userId, 'progressLogs');
    await addDoc(progressLogRef, {
      ...log,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error('Error adding progress log:', error);
    throw error;
  }
}

export async function getProgressLogs(userId: string, goalId: string): Promise<ProgressLog[]> {
  const progressLogRef = collection(db, 'users', userId, 'progressLogs');
  const q = query(
    progressLogRef, 
    where('goalId', '==', goalId),
    orderBy('timestamp', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as ProgressLog);
}

export async function getAllProgressLogs(userId: string): Promise<ProgressLog[]> {
  const progressLogRef = collection(db, 'users', userId, 'progressLogs');
  const q = query(progressLogRef, orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as ProgressLog));
}

export async function calculateCurrentProgress(userId: string, goalId: string, startValue: number): Promise<number> {
  const logs = await getProgressLogs(userId, goalId);
  return logs.reduce((total, log) => {
    return log.type === 'increment' ? total + log.value : total - log.value;
  }, startValue);
}

export async function addGoal(userId: string, goal: { title: string; goal: number; start: number }): Promise<void> {
  try {
    const goalsRef = doc(db, USERS_COLLECTION, userId, 'data', 'goals');
    const statusRef = doc(db, USERS_COLLECTION, userId, 'data', 'status');
    
    // Get current goals
    const goalsDoc = await getDoc(goalsRef);
    const currentGoals = goalsDoc.exists() 
      ? (Array.isArray(goalsDoc.data()) ? goalsDoc.data() : (goalsDoc.data()?.goals || []))
      : [];

    // Create new goal
    const newGoal = {
      id: crypto.randomUUID(),
      title: goal.title,
      goal: goal.goal,
      start: goal.start,
      createdAt: new Date().toISOString()
    };

    // Get current status
    const statusDoc = await getDoc(statusRef);
    const currentStatus = statusDoc.exists() ? statusDoc.data() : {};

    // Use transaction to ensure atomic update of both goals and status
    await runTransaction(db, async (transaction) => {
      // Update goals
      transaction.set(goalsRef, { goals: [...currentGoals, newGoal] });
      
      // Update status
      transaction.set(statusRef, {
        ...currentStatus,
        [newGoal.id]: newGoal.start
      });
    });

  } catch (error) {
    console.error('Error adding goal:', error);
    throw error;
  }
}
