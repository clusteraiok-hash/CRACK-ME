import { useState, useEffect, useRef, useCallback } from 'react';

interface UseClockReturn {
  time: string;
  date: string;
}

export function useClock(): UseClockReturn {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateClock = useCallback(() => {
    setTime(
      new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
    );
    setDate(
      new Date().toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );
  }, []);

  useEffect(() => {
    updateClock();
    timerRef.current = setInterval(updateClock, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [updateClock]);

  return { time, date };
}
