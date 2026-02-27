import { useState, useEffect } from 'react';
import { timeAge } from '@/utils/date/timeAge';

export function useTimeAgo(date: Date | string | null, intervalMs = 60_000): string {
  const [text, setText] = useState(() => (date ? timeAge(date) : ''));
  useEffect(() => {
    if (!date) return;
    setText(timeAge(date));
    const id = setInterval(() => setText(timeAge(date)), intervalMs);
    return () => clearInterval(id);
  }, [date, intervalMs]);
  return text;
}
