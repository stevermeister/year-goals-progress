import { useMemo } from 'react';

export function useYearProgress() {
  return useMemo(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
    return {
      dayOfYear,
      yearProgress: dayOfYear / 365,
      currentMonth: today.getMonth()
    };
  }, []); // Will update when component remounts
}
