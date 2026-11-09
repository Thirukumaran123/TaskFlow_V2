/**
 * LocalStorage & Export/Import Utilities for TaskFlow
 * Provides persistence, data validation, recovery, and JSON/CSV export/import.
 */

import { toLocalDateString } from './dateUtils';
import { DEFAULT_CATEGORIES } from './taskUtils';

const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks_v2',
  THEME: 'taskflow_theme_v2',
  ACCENT: 'taskflow_accent_v2',
  CATEGORIES: 'taskflow_categories_v2',
  SETTINGS: 'taskflow_settings_v2'
};

/**
 * Generate a unique ID for a task
 */
export function generateTaskId() {
  return 'tf_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
}

/**
 * Generate rich, realistic sample tasks for showcase & initial demonstration
 */
export function getSampleTasks() {
  const today = new Date();
  
  // Date helpers relative to today
  const offsetDays = (days) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return toLocalDateString(d);
  };

  return [
    {
      id: 'tf_sample_1',
      title: 'Review System Architecture & Tech Specs',
      description: 'Prepare the architecture diagram and database schema for the Q4 product release.',
      category: 'Projects',
      priority: 'urgent',
      status: 'in_progress',
      startDate: offsetDays(-2),
      dueDate: offsetDays(0), // Today
      reminderDateTime: `${offsetDays(0)}T14:00`,
      tags: ['architecture', 'q4', 'review'],
      notes: '- Review Redis cache layer\n- Validate JWT authentication flow\n- Prepare slide deck for team sync',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      completedAt: null
    },
    {
      id: 'tf_sample_2',
      title: 'Fix Staging Environment Database Migration Bug',
      description: 'Resolve the foreign key constraint issue when running migration #42 on PostgreSQL.',
      category: 'Work',
      priority: 'urgent',
      status: 'todo',
      startDate: offsetDays(-3),
      dueDate: offsetDays(-1), // Overdue!
      reminderDateTime: '',
      tags: ['bugfix', 'postgres', 'staging'],
      notes: 'Affects user profile table. Need to check down migration rollback script.',
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      completedAt: null
    },
    {
      id: 'tf_sample_3',
      title: 'Design Dark Theme & Contrast Tokens in Figma',
      description: 'Create high-contrast color tokens and theme switcher specs for TaskFlow UI.',
      category: 'Projects',
      priority: 'high',
      status: 'in_progress',
      startDate: offsetDays(-1),
      dueDate: offsetDays(0), // Today
      reminderDateTime: `${offsetDays(0)}T16:30`,
      tags: ['design', 'ui-ux', 'figma'],
      notes: 'Follow WCAG AAA standards for text readability on dark surfaces.',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: null
    },
    {
      id: 'tf_sample_4',
      title: 'Complete TypeScript Deep Dive Chapter 5',
      description: 'Study advanced conditional types, template literal types, and type gymnastics.',
      category: 'Learning',
      priority: 'medium',
      status: 'todo',
      startDate: offsetDays(0),
      dueDate: offsetDays(1), // Tomorrow
      reminderDateTime: '',
      tags: ['typescript', 'frontend', 'study'],
      notes: 'Exercises on infer keyword and distributed conditional types.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: null
    },
    {
      id: 'tf_sample_5',
      title: 'Weekly 1-on-1 Mentorship Sync with Sarah',
      description: 'Discuss career milestones, current sprint blockers, and conference proposal.',
      category: 'Work',
      priority: 'medium',
      status: 'todo',
      startDate: offsetDays(2),
      dueDate: offsetDays(3), // Next 7 Days
      reminderDateTime: '',
      tags: ['meeting', 'mentorship'],
      notes: 'Agenda:\n1. Sprint progress\n2. Next sprint goals\n3. Learning budget allocation',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: null
    },
    {
      id: 'tf_sample_6',
      title: 'Refactor Task Filtering Hook with useMemo',
      description: 'Improve list render performance by caching multi-criteria filtering computations.',
      category: 'Projects',
      priority: 'high',
      status: 'completed',
      startDate: offsetDays(-4),
      dueDate: offsetDays(-1),
      reminderDateTime: '',
      tags: ['performance', 'react', 'refactoring'],
      notes: 'Benchmarked with 500 tasks, render time reduced from 45ms to 4ms.',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'tf_sample_7',
      title: 'Weekly Grocery Shopping & Meal Prep',
      description: 'Restock fresh vegetables, oat milk, Greek yogurt, and protein essentials.',
      category: 'Shopping',
      priority: 'low',
      status: 'todo',
      startDate: offsetDays(4),
      dueDate: offsetDays(5),
      reminderDateTime: '',
      tags: ['groceries', 'health'],
      notes: 'Check organic section for seasonal berries.',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      completedAt: null
    },
    {
      id: 'tf_sample_8',
      title: 'Morning 5km Jog & Core Workout',
      description: 'Maintain cardiovascular health and hit weekly 20km running target.',
      category: 'Health',
      priority: 'medium',
      status: 'completed',
      startDate: offsetDays(0),
      dueDate: offsetDays(0),
      reminderDateTime: '',
      tags: ['fitness', 'routine'],
      notes: 'Pace: 5:20/km. Felt energetic!',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    },
    {
      id: 'tf_sample_9',
      title: 'Deploy Production Release v2.4.0',
      description: 'Run deployment pipeline, verify health check endpoints, and monitor Sentry errors.',
      category: 'Work',
      priority: 'high',
      status: 'todo',
      startDate: offsetDays(7),
      dueDate: offsetDays(12), // Next 30 days
      reminderDateTime: '',
      tags: ['devops', 'release', 'monitoring'],
      notes: 'Coordinate with QA team before tagging main branch.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: null
    },
    {
      id: 'tf_sample_10',
      title: 'Read "Designing Data-Intensive Applications"',
      description: 'Finish Part 2 on Distributed Data (Replication, Partitioning, Transactions).',
      category: 'Learning',
      priority: 'low',
      status: 'todo',
      startDate: '',
      dueDate: '', // No due date
      reminderDateTime: '',
      tags: ['reading', 'books', 'architecture'],
      notes: 'Take notes in Obsidian on consensus algorithms (Raft and Paxos).',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      completedAt: null
    }
  ];
}

/**
 * Load tasks from LocalStorage, with fallback to initial sample data
 */
export function loadTasksFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      const initial = getSampleTasks();
      saveTasksToStorage(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(sanitizeTask);
    }
    return getSampleTasks();
  } catch (err) {
    console.error('TaskFlow: Error loading tasks from localStorage', err);
    return getSampleTasks();
  }
}

/**
 * Save tasks to LocalStorage safely
 */
export function saveTasksToStorage(tasks) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('TaskFlow: Error saving tasks to localStorage', err);
  }
}

/**
 * Load categories from LocalStorage
 */
export function loadCategoriesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

/**
 * Save categories to LocalStorage
 */
export function saveCategoriesToStorage(categories) {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('TaskFlow: Error saving categories', err);
  }
}

/**
 * Load theme settings
 */
export function loadThemeFromStorage() {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    const accent = localStorage.getItem(STORAGE_KEYS.ACCENT) || '';
    return { theme, accent };
  } catch {
    return { theme: 'light', accent: '' };
  }
}

/**
 * Save theme settings
 */
export function saveThemeToStorage(theme, accent = '') {
  try {
    if (theme) localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (accent) {
      localStorage.setItem(STORAGE_KEYS.ACCENT, accent);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACCENT);
    }
  } catch (err) {
    console.error('TaskFlow: Error saving theme', err);
  }
}

/**
 * Load user app settings
 */
export function loadSettingsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      return {
        defaultView: 'list',
        defaultSort: 'priority-desc',
        enableNotifications: true,
        enableSounds: true,
        confirmBeforeDelete: true
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      defaultView: 'list',
      defaultSort: 'priority-desc',
      enableNotifications: true,
      enableSounds: true,
      confirmBeforeDelete: true
    };
  }
}

/**
 * Save user app settings
 */
export function saveSettingsToStorage(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('TaskFlow: Error saving settings', err);
  }
}

/**
 * Sanitize and validate task object to guarantee data integrity
 */
export function sanitizeTask(t) {
  return {
    id: t.id || generateTaskId(),
    title: typeof t.title === 'string' ? t.title.trim() : 'Untitled Task',
    description: typeof t.description === 'string' ? t.description : '',
    category: t.category || 'Other',
    priority: ['urgent', 'high', 'medium', 'low'].includes(t.priority) ? t.priority : 'medium',
    status: ['todo', 'in_progress', 'completed'].includes(t.status) ? t.status : 'todo',
    startDate: t.startDate || '',
    dueDate: t.dueDate || '',
    reminderDateTime: t.reminderDateTime || '',
    tags: Array.isArray(t.tags) ? t.tags.filter(tag => typeof tag === 'string' && tag.trim().length > 0) : [],
    notes: typeof t.notes === 'string' ? t.notes : '',
    createdAt: t.createdAt || new Date().toISOString(),
    updatedAt: t.updatedAt || new Date().toISOString(),
    completedAt: t.completedAt || null
  };
}

/**
 * Export tasks as downloadable JSON
 */
export function exportTasksAsJSON(tasks) {
  const exportData = {
    app: 'TaskFlow',
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    totalTasks: tasks.length,
    tasks: tasks
  };

  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `taskflow-export-${toLocalDateString(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export tasks as downloadable CSV
 */
export function exportTasksAsCSV(tasks) {
  const headers = [
    'ID',
    'Title',
    'Description',
    'Category',
    'Priority',
    'Status',
    'Start Date',
    'Due Date',
    'Reminder',
    'Tags',
    'Notes',
    'Created At',
    'Completed At'
  ];

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = tasks.map(t => [
    escapeCSV(t.id),
    escapeCSV(t.title),
    escapeCSV(t.description),
    escapeCSV(t.category),
    escapeCSV(t.priority),
    escapeCSV(t.status),
    escapeCSV(t.startDate),
    escapeCSV(t.dueDate),
    escapeCSV(t.reminderDateTime),
    escapeCSV((t.tags || []).join('; ')),
    escapeCSV(t.notes),
    escapeCSV(t.createdAt),
    escapeCSV(t.completedAt)
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `taskflow-export-${toLocalDateString(new Date())}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import tasks from JSON file text
 * Validates schema and deduplicates/generates unique IDs
 * @param {string} jsonString 
 * @returns {{ success: boolean, tasks?: Array, count?: number, error?: string }}
 */
export function importTasksFromJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    let taskList = [];

    if (Array.isArray(parsed)) {
      taskList = parsed;
    } else if (parsed && Array.isArray(parsed.tasks)) {
      taskList = parsed.tasks;
    } else {
      return { success: false, error: 'Invalid TaskFlow backup file format. Expected a JSON array or object with tasks property.' };
    }

    if (taskList.length === 0) {
      return { success: false, error: 'The imported file contains no tasks.' };
    }

    // Sanitize and validate every task
    const validatedTasks = taskList.map(item => {
      if (!item || typeof item !== 'object') {
        throw new Error('Task entry is not a valid object');
      }
      return sanitizeTask({
        ...item,
        id: item.id || generateTaskId()
      });
    });

    return {
      success: true,
      tasks: validatedTasks,
      count: validatedTasks.length
    };
  } catch (err) {
    return {
      success: false,
      error: `Failed to parse file: ${err.message}`
    };
  }
}
