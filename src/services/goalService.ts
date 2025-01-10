import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Goal, GoalStatus } from '../types/goals';

const USERS_COLLECTION = 'users';

const DEFAULT_GOALS: Goal[] = [
  {
    title: "Books Read",
    start: 0,
    goal: 12
  },
  {
    title: "Blog Posts",
    start: 0,
    goal: 24
  },
  {
    title: "Side Projects",
    start: 0,
    goal: 4
  }
];

export async function getGoals(userId: string): Promise<Goal[]> {
  try {
    const userGoalsDoc = await getDoc(doc(db, USERS_COLLECTION, userId, 'data', 'goals'));
    console.log('Fetched goals doc:', userGoalsDoc.data()); // Debug log
    
    if (!userGoalsDoc.exists()) {
      console.log('No goals doc exists, returning empty array'); // Debug log
      return [];
    }
    
    const data = userGoalsDoc.data();
    // Handle both array and object with goals property
    const goals = Array.isArray(data) ? data : data.goals;
    console.log('Parsed goals:', goals); // Debug log
    
    return goals || [];
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
}

export async function getStatus(userId: string): Promise<GoalStatus> {
  try {
    const userStatusDoc = await getDoc(doc(db, USERS_COLLECTION, userId, 'data', 'status'));
    console.log('Fetched status doc:', userStatusDoc.data()); // Debug log
    
    if (!userStatusDoc.exists()) {
      console.log('No status doc exists, returning empty object'); // Debug log
      return {};
    }
    
    return userStatusDoc.data() as GoalStatus;
  } catch (error) {
    console.error('Error fetching status:', error);
    return {};
  }
}

export async function updateStatus(userId: string, newStatus: GoalStatus): Promise<void> {
  try {
    const statusRef = doc(db, USERS_COLLECTION, userId, 'data', 'status');
    await setDoc(statusRef, newStatus);
    console.log('Status updated successfully:', newStatus); // Debug log
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
}

export async function updateGoals(userId: string, goals: Goal[]): Promise<void> {
  try {
    const goalsRef = doc(db, USERS_COLLECTION, userId, 'data', 'goals');
    // Store goals directly as an array
    await setDoc(goalsRef, goals);
    console.log('Goals updated successfully:', goals); // Debug log
  } catch (error) {
    console.error('Error updating goals:', error);
    throw error;
  }
}

export async function initializeUserData(userId: string): Promise<void> {
  try {
    console.log('Initializing user data for:', userId); // Debug log
    
    const userGoalsDoc = await getDoc(doc(db, USERS_COLLECTION, userId, 'data', 'goals'));
    const userStatusDoc = await getDoc(doc(db, USERS_COLLECTION, userId, 'data', 'status'));

    if (!userGoalsDoc.exists()) {
      console.log('Creating default goals'); // Debug log
      await updateGoals(userId, DEFAULT_GOALS);
    }

    if (!userStatusDoc.exists()) {
      console.log('Creating default status'); // Debug log
      const defaultStatus: GoalStatus = {};
      DEFAULT_GOALS.forEach(goal => {
        defaultStatus[goal.title] = goal.start;
      });
      await updateStatus(userId, defaultStatus);
    }
  } catch (error) {
    console.error('Error initializing user data:', error);
    throw error;
  }
}
