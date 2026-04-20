export const getISTTime = (): string =>
  new Date().toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

export const getISTTimeFull = (): string =>
  new Date().toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

export const getISTDate = (): string =>
  new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export const getISTShortDate = (): string =>
  new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const getISTNow = (): {
  year: number;
  month: number;
  day: number;
  weekday: number;
  hours: number;
  minutes: number;
} => {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate(),
    weekday: d.getDay(),
    hours: d.getHours(),
    minutes: d.getMinutes(),
  };
};

export const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

export const getFirstDayOfMonth = (year: number, month: number): number =>
  new Date(year, month, 1).getDay();

export const format24to12 = (time24: string): string => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12.toString().padStart(2, '0')}:${minutes} ${suffix}`;
};

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const parseStandardDate = (dateStr: string): Date | null => {
  if (!dateStr || dateStr === 'N/A') return null;

  // Handle YYYY-MM-DD (from input type="date")
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d, 12, 0, 0);
  }

  // Handle "DD MMM, YYYY" or "MMM DD, YYYY" or "DD Month YYYY"
  const s = dateStr.toLowerCase().replace(/,/g, '').trim();
  const monthMap: Record<string, number> = {
    'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
    'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
  };

  let month = -1;
  for (const [name, idx] of Object.entries(monthMap)) {
    if (s.includes(name)) {
      month = idx;
      break;
    }
  }

  const dMatch = s.match(/(\d{1,2})/);
  const yMatch = s.match(/(\d{4})/);

  if (month !== -1 && dMatch && yMatch) {
    return new Date(parseInt(yMatch[1], 10), month, parseInt(dMatch[1], 10), 12, 0, 0);
  }

  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? null : fallback;
};

export const getGoalMetrics = (startDateStr: string, dueDateStr: string) => {
  const start = parseStandardDate(startDateStr);
  const due = parseStandardDate(dueDateStr);
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);

  if (!due) return { totalDays: 0, daysRemaining: 0, isOverdue: false, progress: 0 };

  // Total Span (Initialized to Deadline)
  const effectiveStart = start || today;
  const totalDiffTime = due.getTime() - effectiveStart.getTime();
  const totalDays = Math.max(0, Math.round(totalDiffTime / (1000 * 60 * 60 * 24)));

  // Countdown (Every day reduces by one)
  const remainingDiffTime = due.getTime() - today.getTime();
  const daysRemaining = Math.round(remainingDiffTime / (1000 * 60 * 60 * 24));

  const isOverdue = daysRemaining < 0;

  return {
    totalDays,
    daysRemaining: isOverdue ? Math.abs(daysRemaining) : daysRemaining,
    isOverdue
  };
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
};
