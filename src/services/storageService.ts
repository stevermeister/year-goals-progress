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

export interface Goal {
  id: string;
  title: string;
  startValue: number;
  goalValue: number;
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

export async function addGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
  const db = await initDB();
  const id = Date.now().toString();
  const newGoal: Goal = {
    ...goal,
    id
  };
  
  const tx = db.transaction([GOALS_STORE, STATUS_STORE], 'readwrite');
  await tx.objectStore(GOALS_STORE).add(newGoal);
  await tx.objectStore(STATUS_STORE).put(goal.startValue, id);
  await tx.done;
  
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

export async function clearAllData(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction([GOALS_STORE, STATUS_STORE, PROGRESS_LOGS_STORE], 'readwrite');
  
  await Promise.all([
    tx.objectStore(GOALS_STORE).clear(),
    tx.objectStore(STATUS_STORE).clear(),
    tx.objectStore(PROGRESS_LOGS_STORE).clear(),
  ]);
  
  await tx.done;
}

export async function importGoals(goals: Array<Goal & { currentValue: number }>): Promise<void> {
  const db = await initDB();
  const tx = db.transaction([GOALS_STORE, STATUS_STORE], 'readwrite');
  
  await Promise.all([
    tx.objectStore(GOALS_STORE).clear(),
    tx.objectStore(STATUS_STORE).clear()
  ]);
  
  await Promise.all(goals.map(async ({ id, title, startValue, goalValue, currentValue }) => {
    await tx.objectStore(GOALS_STORE).add({ id, title, startValue, goalValue });
    await tx.objectStore(STATUS_STORE).put(currentValue, id);
  }));
  
  await tx.done;
}
