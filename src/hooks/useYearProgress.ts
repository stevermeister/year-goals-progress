import { useMemo } from 'react';
import { YearProgress } from '../types/goals';

export function useYearProgress(): YearProgress {
  return useMemo(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    return {
      dayOfYear,
      yearProgress: dayOfYear / 365,
      currentMonth: today.getMonth()
    };
  }, []); // Will update when component remounts
}
