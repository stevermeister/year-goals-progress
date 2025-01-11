export interface Goal {
  id: string;
  title: string;
  start: number;
  goal: number;
}

export interface GoalStatus {
  [key: string]: number;
}

export interface YearProgress {
  dayOfYear: number;
  yearProgress: number;
  currentMonth: number;
}