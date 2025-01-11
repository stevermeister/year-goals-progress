import { collection, doc, getDoc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
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
    const goalsObject = goals.reduce((acc, goal) => ({
      ...acc,
      [goal.id]: goal
    }), {});

    await setDoc(doc(db, USERS_COLLECTION, userId, 'data', 'goals'), goalsObject);
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
    const userDataRef = doc(db, USERS_COLLECTION, userId, 'data', 'goals');
    const userStatusRef = doc(db, USERS_COLLECTION, userId, 'data', 'status');
    
    await Promise.all([
      deleteDoc(userDataRef),
      deleteDoc(userStatusRef)
    ]);
  } catch (error) {
    console.error('Error removing user data:', error);
    throw error;
  }
}
