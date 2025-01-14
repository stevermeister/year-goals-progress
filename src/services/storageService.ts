import { openDB } from 'idb';
import { Goal, ProgressLog } from '../types/goals';

const DB_NAME = 'goalsProgressDB';
const DB_VERSION = 1;
const GOALS_STORE = 'goals';
const STATUS_STORE = 'status';
const PROGRESS_LOGS_STORE = 'progressLogs';

async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(GOALS_STORE)) {
        db.createObjectStore(GOALS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STATUS_STORE)) {
        db.createObjectStore(STATUS_STORE);
      }
      if (!db.objectStoreNames.contains(PROGRESS_LOGS_STORE)) {
        db.createObjectStore(PROGRESS_LOGS_STORE, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function getGoals(): Promise<Goal[]> {
  const db = await initDB();
  return db.getAll(GOALS_STORE);
}

export async function getStatus(): Promise<Record<string, number>> {
  const db = await initDB();
  const tx = db.transaction(STATUS_STORE, 'readonly');
  const store = tx.objectStore(STATUS_STORE);
  const keys = await store.getAllKeys();
  const values = await store.getAll();
  
  return keys.reduce((acc, key, index) => {
    acc[key as string] = values[index];
    return acc;
  }, {} as Record<string, number>);
}

export async function addGoal(goalData: Omit<Goal, 'id'>): Promise<Goal> {
  const db = await initDB();
  const newGoal: Goal = {
    ...goalData,
    id: Date.now().toString(),
  };
  
  await db.add(GOALS_STORE, newGoal);
  await db.put(STATUS_STORE, goalData.start, newGoal.id);
  
  return newGoal;
}

export async function updateGoalStatus(goalId: string, value: number): Promise<void> {
  const db = await initDB();
  await db.put(STATUS_STORE, value, goalId);
}

export async function addProgressLog(log: Omit<ProgressLog, 'id'>): Promise<void> {
  const db = await initDB();
  await db.add(PROGRESS_LOGS_STORE, log);
}

export async function getProgressLogs(): Promise<ProgressLog[]> {
  const db = await initDB();
  return db.getAll(PROGRESS_LOGS_STORE);
}

export async function removeGoal(goalId: string): Promise<void> {
  const db = await initDB();
  const tx = db.transaction([GOALS_STORE, STATUS_STORE], 'readwrite');
  await tx.objectStore(GOALS_STORE).delete(goalId);
  await tx.objectStore(STATUS_STORE).delete(goalId);
  await tx.done;
}
