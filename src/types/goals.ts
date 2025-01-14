export interface Goal {
  id: string;
  title: string;
  goal: number;
  start: number;
}

export interface ProgressLog {
  id?: number;
  goalId: string;
  goalTitle: string;
  value: number;
  date: string;
  notes: string;
  type: 'increment' | 'decrement';
}
