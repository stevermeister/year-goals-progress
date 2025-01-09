import { collection, getDocs, setDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Goal, GoalStatus } from '../types/goals';

const GOALS_COLLECTION = 'goals';
const STATUS_COLLECTION = 'status';

export const getGoals = async (): Promise<Goal[]> => {
  const goalsCol = collection(db, GOALS_COLLECTION);
  const goalSnapshot = await getDocs(goalsCol);
  return goalSnapshot.docs.map(doc => doc.data() as Goal);
};

export const getStatus = async (): Promise<GoalStatus> => {
  const statusCol = collection(db, STATUS_COLLECTION);
  const statusSnapshot = await getDocs(statusCol);
  const statusDoc = statusSnapshot.docs[0];
  return statusDoc?.data() as GoalStatus || {};
};

export const updateStatus = async (newStatus: GoalStatus) => {
  await setDoc(doc(db, STATUS_COLLECTION, 'current'), newStatus);
};

// Initial data migration function
export const migrateInitialData = async (goals: Goal[], status: GoalStatus) => {
  // Store goals
  for (const goal of goals) {
    await setDoc(doc(db, GOALS_COLLECTION, goal.title), goal);
  }
  
  // Store status
  await setDoc(doc(db, STATUS_COLLECTION, 'current'), status);
};
