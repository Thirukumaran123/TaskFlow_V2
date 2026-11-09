/**
 * Task Utilities for TaskFlow
 * Handles priorities, categories, multi-criteria filtering, search, sorting, grouping, and statistics.
 */

import { matchesDateFilter, isOverdue, isToday, isTomorrow, getMidnight } from './dateUtils';

// Priority definitions with consistent color palette
export const PRIORITIES = {
  urgent: {
    id: 'urgent',
    label: 'Urgent',
    fullLabel: 'Urgent / Critical',
    rank: 4,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.35)',
    darkBg: 'rgba(239, 68, 68, 0.2)'
  },
  high: {
    id: 'high',
    label: 'High',
    fullLabel: 'High Priority',
    rank: 3,
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.12)',
    border: 'rgba(249, 115, 22, 0.35)',
    darkBg: 'rgba(249, 115, 22, 0.2)'
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    fullLabel: 'Medium Priority',
    rank: 2,
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
    border: 'rgba(59, 130, 246, 0.35)',
    darkBg: 'rgba(59, 130, 246, 0.2)'
  },
  low: {
    id: 'low',
    label: 'Low',
    fullLabel: 'Low Priority',
    rank: 1,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    darkBg: 'rgba(16, 185, 129, 0.2)'
  }
};

// Default categories with distinct icons/colors
export const DEFAULT_CATEGORIES = [
  { id: 'Work', name: 'Work', color: '#6366f1', icon: 'Briefcase' },
  { id: 'Personal', name: 'Personal', color: '#ec4899', icon: 'User' },
  { id: 'Projects', name: 'Projects', color: '#8b5cf6', icon: 'FolderKanban' },
  { id: 'Learning', name: 'Learning', color: '#0ea5e9', icon: 'BookOpen' },
  { id: 'Health', name: 'Health', color: '#10b981', icon: 'Heart' },
  { id: 'Shopping', name: 'Shopping', color: '#f59e0b', icon: 'ShoppingCart' },
  { id: 'Other', name: 'Other', color: '#64748b', icon: 'Tag' }
];

// Status configurations
export const STATUSES = {
  todo: { id: 'todo', label: 'To Do', color: '#94a3b8' },
  in_progress: { id: 'in_progress', label: 'In Progress', color: '#3b82f6' },
  completed: { id: 'completed', label: 'Completed', color: '#10b981' }
};

/**
 * Filter and sort tasks based on all active criteria
 * @param {Array} tasks 
 * @param {Object} filterOptions
 * @returns {Array} filtered and sorted tasks
 */
export function filterAndSortTasks(tasks, {
  searchQuery = '',
  dateFilter = 'all',
  customDateRange = { start: '', end: '' },
  priorityFilter = 'all',
  categoryFilter = 'all',
  statusFilter = 'all',
  tagFilter = 'all',
  sortBy = 'priority-desc'
} = {}) {
  if (!Array.isArray(tasks)) return [];

  const query = searchQuery.trim().toLowerCase();

  // 1. Filter
  const filtered = tasks.filter(task => {
    // Search query check: title, description, category, tags, notes
    if (query) {
      const matchTitle = (task.title || '').toLowerCase().includes(query);
      const matchDesc = (task.description || '').toLowerCase().includes(query);
      const matchCat = (task.category || '').toLowerCase().includes(query);
      const matchNotes = (task.notes || '').toLowerCase().includes(query);
      const matchTags = Array.isArray(task.tags) && task.tags.some(tag => tag.toLowerCase().includes(query));

      if (!matchTitle && !matchDesc && !matchCat && !matchNotes && !matchTags) {
        return false;
      }
    }

    // Date filter (handles all 15 cases)
    if (dateFilter && dateFilter !== 'all') {
      if (!matchesDateFilter(task, dateFilter, customDateRange)) {
        return false;
      }
    }

    // Priority filter
    if (priorityFilter && priorityFilter !== 'all') {
      if (task.priority !== priorityFilter) {
        return false;
      }
    }

    // Category filter
    if (categoryFilter && categoryFilter !== 'all') {
      if (task.category !== categoryFilter) {
        return false;
      }
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      if (task.status !== statusFilter) {
        return false;
      }
    }

    // Tag filter
    if (tagFilter && tagFilter !== 'all') {
      if (!Array.isArray(task.tags) || !task.tags.includes(tagFilter)) {
        return false;
      }
    }

    return true;
  });

  // 2. Sort
  return sortTasks(filtered, sortBy);
}

/**
 * Sort tasks by given sort key
 * @param {Array} tasks 
 * @param {string} sortBy 
 * @returns {Array} sorted tasks
 */
export function sortTasks(tasks, sortBy = 'priority-desc') {
  const sorted = [...tasks];

  sorted.sort((a, b) => {
    // Always put completed tasks at the end if sorting by priority or due date, unless status sorting
    const aRank = PRIORITIES[a.priority]?.rank || 0;
    const bRank = PRIORITIES[b.priority]?.rank || 0;

    switch (sortBy) {
      case 'priority-desc': {
        // Urgent first (rank 4 down to 1)
        if (aRank !== bRank) return bRank - aRank;
        // Tie-breaker: due date earliest first
        return compareDueDates(a.dueDate, b.dueDate, true);
      }

      case 'priority-asc': {
        // Low first (rank 1 up to 4)
        if (aRank !== bRank) return aRank - bRank;
        return compareDueDates(a.dueDate, b.dueDate, true);
      }

      case 'due-asc': {
        // Due date: oldest / earliest first (overdue items first)
        return compareDueDates(a.dueDate, b.dueDate, true);
      }

      case 'due-desc': {
        // Due date: newest / latest first
        return compareDueDates(a.dueDate, b.dueDate, false);
      }

      case 'created-desc': {
        // Newest created first
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      }

      case 'created-asc': {
        // Oldest created first
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aTime - bTime;
      }

      case 'updated-desc': {
        // Recently updated
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return bTime - aTime;
      }

      case 'alpha-asc': {
        return (a.title || '').localeCompare(b.title || '');
      }

      case 'alpha-desc': {
        return (b.title || '').localeCompare(a.title || '');
      }

      default:
        return 0;
    }
  });

  return sorted;
}

/**
 * Helper to compare due dates (handles empty due dates placed at the end)
 */
function compareDueDates(dateA, dateB, ascending = true) {
  if (!dateA && !dateB) return 0;
  if (!dateA) return 1; // No due date always goes to bottom
  if (!dateB) return -1;

  const timeA = new Date(dateA).getTime();
  const timeB = new Date(dateB).getTime();

  return ascending ? timeA - timeB : timeB - timeA;
}

/**
 * Group tasks by Date:
 * Overdue, Today, Tomorrow, Upcoming, No Due Date
 */
export function groupTasksByDate(tasks) {
  const groups = {
    overdue: { title: 'Overdue', color: '#ef4444', tasks: [] },
    today: { title: 'Today', color: '#3b82f6', tasks: [] },
    tomorrow: { title: 'Tomorrow', color: '#8b5cf6', tasks: [] },
    upcoming: { title: 'Upcoming', color: '#0ea5e9', tasks: [] },
    no_due_date: { title: 'No Due Date', color: '#64748b', tasks: [] }
  };

  const today = getMidnight();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  tasks.forEach(task => {
    if (!task.dueDate) {
      groups.no_due_date.tasks.push(task);
      return;
    }

    if (isOverdue(task.dueDate, task.status)) {
      groups.overdue.tasks.push(task);
    } else if (isToday(task.dueDate)) {
      groups.today.tasks.push(task);
    } else if (isTomorrow(task.dueDate)) {
      groups.tomorrow.tasks.push(task);
    } else {
      const due = getMidnight(task.dueDate);
      if (due > tomorrow) {
        groups.upcoming.tasks.push(task);
      } else {
        // Completed past task
        groups.today.tasks.push(task);
      }
    }
  });

  return Object.values(groups).filter(g => g.tasks.length > 0);
}

/**
 * Group tasks by Priority: Urgent, High, Medium, Low
 */
export function groupTasksByPriority(tasks) {
  const groups = [
    { key: 'urgent', title: 'Urgent / Critical', priority: PRIORITIES.urgent, tasks: [] },
    { key: 'high', title: 'High Priority', priority: PRIORITIES.high, tasks: [] },
    { key: 'medium', title: 'Medium Priority', priority: PRIORITIES.medium, tasks: [] },
    { key: 'low', title: 'Low Priority', priority: PRIORITIES.low, tasks: [] }
  ];

  tasks.forEach(task => {
    const p = task.priority || 'medium';
    const group = groups.find(g => g.key === p);
    if (group) group.tasks.push(task);
  });

  return groups;
}

/**
 * Group tasks by Category
 */
export function groupTasksByCategory(tasks, categories = DEFAULT_CATEGORIES) {
  const map = new Map();

  // Pre-seed known categories
  categories.forEach(cat => {
    map.set(cat.id, {
      id: cat.id,
      title: cat.name,
      color: cat.color || '#6366f1',
      tasks: []
    });
  });

  // Ensure 'Other' category
  if (!map.has('Other')) {
    map.set('Other', { id: 'Other', title: 'Other', color: '#64748b', tasks: [] });
  }

  tasks.forEach(task => {
    const cat = task.category || 'Other';
    if (!map.has(cat)) {
      map.set(cat, { id: cat, title: cat, color: '#6366f1', tasks: [] });
    }
    map.get(cat).tasks.push(task);
  });

  // Only return groups with tasks or standard categories
  return Array.from(map.values()).filter(g => g.tasks.length > 0);
}

/**
 * Calculate comprehensive dashboard statistics
 */
export function calculateTaskStatistics(tasks = []) {
  const total = tasks.length;
  let completed = 0;
  let inProgress = 0;
  let overdue = 0;
  let today = 0;
  let upcoming = 0;

  const priorityCounts = {
    urgent: 0,
    high: 0,
    medium: 0,
    low: 0
  };

  const categoryCounts = {};

  tasks.forEach(task => {
    const isComp = task.status === 'completed';
    const isInProg = task.status === 'in_progress';

    if (isComp) completed++;
    if (isInProg) inProgress++;

    if (isOverdue(task.dueDate, task.status)) {
      overdue++;
    }

    if (task.dueDate && isToday(task.dueDate)) {
      today++;
    }

    if (task.dueDate) {
      const due = getMidnight(task.dueDate);
      const now = getMidnight();
      if (due > now) upcoming++;
    }

    // Priority counts
    const p = task.priority || 'medium';
    if (priorityCounts[p] !== undefined) {
      priorityCounts[p]++;
    }

    // Category counts
    const cat = task.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const pending = total - completed;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    inProgress,
    overdue,
    today,
    upcoming,
    completionPercentage,
    priorityCounts,
    categoryCounts
  };
}
