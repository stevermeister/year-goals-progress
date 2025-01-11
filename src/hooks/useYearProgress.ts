import { useMemo } from 'react';

interface YearProgress {
  dayOfYear: number;
  yearProgress: number;
  currentMonth: number;
}

export function useYearProgress(): YearProgress {
  return useMemo(() => {
    const today = new Date('2025-01-10T19:46:25+01:00');
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    const totalDays = Math.floor((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      dayOfYear,
      yearProgress: dayOfYear / totalDays,
      currentMonth: today.getMonth()
    };
  }, []); // Will update when component remounts
}
