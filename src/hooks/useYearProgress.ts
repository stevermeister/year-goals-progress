import { useMemo } from 'react';

export function useYearProgress() {
  return useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1); // January 1st
    const end = new Date(now.getFullYear() + 1, 0, 1); // January 1st next year
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    
    return (elapsed / total) * 100;
  }, []);
}
