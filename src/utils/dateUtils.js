/**
 * Date Utilities for TaskFlow
 * Provides robust, timezone-safe date calculations, formatting, and filtering.
 */

/**
 * Format a Date object to 'YYYY-MM-DD' using local timezone
 * @param {Date|string} date 
 * @returns {string} 'YYYY-MM-DD' or ''
 */
export function toLocalDateString(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? parseDateSafe(date) : date;
  if (!d || isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Safely parse a date string (YYYY-MM-DD or ISO) into a local Date object
 * Avoiding the UTC midnight offset bug.
 * @param {string|Date} dateInput 
 * @returns {Date|null}
 */
export function parseDateSafe(dateInput) {
  if (!dateInput) return null;
  if (dateInput instanceof Date) return isNaN(dateInput.getTime()) ? null : dateInput;
  if (typeof dateInput !== 'string') return null;

  // If format is YYYY-MM-DD
  const ymdMatch = dateInput.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    
    // Check if there is also time like THH:mm
    const timeMatch = dateInput.match(/T(\d{2}):(\d{2})/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      return new Date(year, month, day, hours, minutes);
    }
    return new Date(year, month, day, 0, 0, 0, 0);
  }

  const parsed = new Date(dateInput);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Get a Date normalized to midnight (00:00:00.000)
 * @param {Date|string} [date] 
 * @returns {Date}
 */
export function getMidnight(date = new Date()) {
  const d = parseDateSafe(date) || new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

/**
 * Check if two dates fall on the exact same calendar day
 * @param {Date|string} d1 
 * @param {Date|string} d2 
 * @returns {boolean}
 */
export function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  const date1 = parseDateSafe(d1);
  const date2 = parseDateSafe(d2);
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if a date is today
 * @param {Date|string} date 
 * @returns {boolean}
 */
export function isToday(date) {
  return isSameDay(date, new Date());
}

/**
 * Check if a date is yesterday
 * @param {Date|string} date 
 * @returns {boolean}
 */
export function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}

/**
 * Check if a date is tomorrow
 * @param {Date|string} date 
 * @returns {boolean}
 */
export function isTomorrow(date) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(date, tomorrow);
}

/**
 * Check if a task is overdue:
 * dueDate is strictly before today AND task is not completed.
 * @param {string|Date} dueDate 
 * @param {string} status 
 * @returns {boolean}
 */
export function isOverdue(dueDate, status) {
  if (!dueDate || status === 'completed') return false;
  const d = getMidnight(dueDate);
  const today = getMidnight();
  return d < today;
}

/**
 * Calculate the difference in calendar days between date and today
 * @param {Date|string} date 
 * @returns {number} positive for future, negative for past, 0 for today
 */
export function getDaysDiffFromToday(date) {
  const d = getMidnight(date);
  const today = getMidnight();
  const diffTime = d.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format relative date for UI display
 * e.g. "Today", "Tomorrow", "Yesterday", "Overdue by 3 days", "In 4 days", "Nov 15"
 * @param {Date|string} date 
 * @param {boolean} [showOverdueWarning=true]
 * @returns {string}
 */
export function formatRelativeDate(date, showOverdueWarning = true) {
  if (!date) return 'No due date';
  const d = parseDateSafe(date);
  if (!d) return 'Invalid date';

  const diff = getDaysDiffFromToday(d);

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';

  if (diff < -1) {
    return showOverdueWarning ? `Overdue by ${Math.abs(diff)} days` : `${Math.abs(diff)} days ago`;
  }
  if (diff > 1 && diff <= 7) {
    return `In ${diff} days (${formatDateShort(d)})`;
  }

  return formatDateMedium(d);
}

/**
 * Format short date (e.g. "Nov 9")
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatDateShort(date) {
  const d = parseDateSafe(date);
  if (!d) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * Format medium date (e.g. "Nov 9, 2026")
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatDateMedium(date) {
  const d = parseDateSafe(date);
  if (!d) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format date & time (e.g. "Nov 9, 2026 at 3:30 PM")
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatDateTime(date) {
  const d = parseDateSafe(date);
  if (!d) return '';
  return d.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

/**
 * Get start and end dates for This Week (Monday to Sunday)
 */
export function getThisWeekRange() {
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 1 is Monday...
  const distanceToMonday = (day + 6) % 7;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday, 0, 0, 0, 0);
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6, 23, 59, 59, 999);
  return { start: monday, end: sunday };
}

/**
 * Get start and end dates for Last Week (Monday to Sunday)
 */
export function getLastWeekRange() {
  const { start: thisMon } = getThisWeekRange();
  const lastMon = new Date(thisMon.getFullYear(), thisMon.getMonth(), thisMon.getDate() - 7, 0, 0, 0, 0);
  const lastSun = new Date(lastMon.getFullYear(), lastMon.getMonth(), lastMon.getDate() + 6, 23, 59, 59, 999);
  return { start: lastMon, end: lastSun };
}

/**
 * Get start and end dates for This Month
 */
export function getThisMonthRange() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start: firstDay, end: lastDay };
}

/**
 * Evaluate if a task matches one of the 15 Date Filters:
 * 1. all
 * 2. today
 * 3. yesterday
 * 4. previous_days
 * 5. this_week
 * 6. last_week
 * 7. this_month
 * 8. previous_months
 * 9. tomorrow
 * 10. upcoming
 * 11. next_7_days
 * 12. next_30_days
 * 13. overdue
 * 14. no_due_date
 * 15. custom
 * 
 * @param {Object} task 
 * @param {string} filterType 
 * @param {Object} [customRange={ start: '', end: '' }]
 * @returns {boolean}
 */
export function matchesDateFilter(task, filterType = 'all', customRange = {}) {
  if (!filterType || filterType === 'all') return true;

  const hasDueDate = Boolean(task.dueDate);
  const isCompleted = task.status === 'completed';

  // 14. No Due Date
  if (filterType === 'no_due_date') {
    return !hasDueDate;
  }

  // If task has no due date and filter requires a due date, return false
  if (!hasDueDate) {
    return false;
  }

  const due = getMidnight(task.dueDate);
  const today = getMidnight();

  switch (filterType) {
    // 2. Today: tasks due today
    case 'today':
      return isSameDay(due, today);

    // 3. Yesterday: tasks due yesterday
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return isSameDay(due, yesterday);
    }

    // 4. Previous Days: tasks with due dates before today
    case 'previous_days':
      return due < today;

    // 5. This Week: Monday to Sunday of current week
    case 'this_week': {
      const { start, end } = getThisWeekRange();
      return due >= getMidnight(start) && due <= getMidnight(end);
    }

    // 6. Last Week: Monday to Sunday of previous week
    case 'last_week': {
      const { start, end } = getLastWeekRange();
      return due >= getMidnight(start) && due <= getMidnight(end);
    }

    // 7. This Month: Current month
    case 'this_month': {
      const { start, end } = getThisMonthRange();
      return due >= getMidnight(start) && due <= getMidnight(end);
    }

    // 8. Previous Months: before the 1st of current month
    case 'previous_months': {
      const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
      return due < firstOfMonth;
    }

    // 9. Tomorrow: tasks due tomorrow
    case 'tomorrow': {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return isSameDay(due, tomorrow);
    }

    // 10. Upcoming Tasks: tasks due after today
    case 'upcoming':
      return due > today;

    // 11. Next 7 Days: [today, today + 7 days]
    case 'next_7_days': {
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + 7);
      return due >= today && due <= maxDate;
    }

    // 12. Next 30 Days: [today, today + 30 days]
    case 'next_30_days': {
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + 30);
      return due >= today && due <= maxDate;
    }

    // 13. Overdue Tasks: due before today and NOT completed
    case 'overdue':
      return due < today && !isCompleted;

    // 15. Custom Date Range
    case 'custom': {
      if (!customRange.start && !customRange.end) return true;
      const start = customRange.start ? getMidnight(customRange.start) : null;
      const end = customRange.end ? getMidnight(customRange.end) : null;

      if (start && end) {
        return due >= start && due <= end;
      } else if (start) {
        return due >= start;
      } else if (end) {
        return due <= end;
      }
      return true;
    }

    default:
      return true;
  }
}

/**
 * Filter definitions metadata for UI selectors
 */
export const DATE_FILTER_OPTIONS = [
  { id: 'all', label: 'All Tasks', category: 'General' },
  { id: 'today', label: 'Today', category: 'Focus' },
  { id: 'tomorrow', label: 'Tomorrow', category: 'Focus' },
  { id: 'overdue', label: 'Overdue Tasks', category: 'Urgent' },
  { id: 'this_week', label: 'This Week', category: 'Upcoming' },
  { id: 'next_7_days', label: 'Next 7 Days', category: 'Upcoming' },
  { id: 'this_month', label: 'This Month', category: 'Upcoming' },
  { id: 'next_30_days', label: 'Next 30 Days', category: 'Upcoming' },
  { id: 'upcoming', label: 'Upcoming Tasks', category: 'Upcoming' },
  { id: 'yesterday', label: 'Yesterday', category: 'History' },
  { id: 'previous_days', label: 'Previous Days', category: 'History' },
  { id: 'last_week', label: 'Last Week', category: 'History' },
  { id: 'previous_months', label: 'Previous Months', category: 'History' },
  { id: 'no_due_date', label: 'No Due Date', category: 'Other' },
  { id: 'custom', label: 'Custom Date Range', category: 'Custom' }
];

/**
 * Generate calendar matrix for a given year and month (0-indexed)
 * Returns 42 calendar cells (6 rows x 7 days)
 */
export function getCalendarMonthMatrix(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Day of week: 0 (Sun) to 6 (Sat)
  const startDayOfWeek = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const matrix = [];
  
  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const dateObj = new Date(year, month - 1, dayNum);
    matrix.push({
      date: toLocalDateString(dateObj),
      dayNumber: dayNum,
      isCurrentMonth: false,
      isPrevMonth: true,
      isNextMonth: false,
      dateObj
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const dateObj = new Date(year, month, d);
    matrix.push({
      date: toLocalDateString(dateObj),
      dayNumber: d,
      isCurrentMonth: true,
      isPrevMonth: false,
      isNextMonth: false,
      dateObj
    });
  }

  // Next month leading days to complete 42 or 35 cells
  const remaining = (7 - (matrix.length % 7)) % 7;
  const targetLength = matrix.length + remaining <= 35 ? 35 : matrix.length + remaining <= 42 ? 42 : matrix.length + remaining;
  const needed = targetLength - matrix.length;

  for (let d = 1; d <= needed; d++) {
    const dateObj = new Date(year, month + 1, d);
    matrix.push({
      date: toLocalDateString(dateObj),
      dayNumber: d,
      isCurrentMonth: false,
      isPrevMonth: false,
      isNextMonth: true,
      dateObj
    });
  }

  return matrix;
}
