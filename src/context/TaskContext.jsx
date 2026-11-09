import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadCategoriesFromStorage,
  saveCategoriesToStorage,
  loadSettingsFromStorage,
  saveSettingsToStorage,
  generateTaskId,
  getSampleTasks,
  sanitizeTask,
  exportTasksAsJSON,
  exportTasksAsCSV,
  importTasksFromJSON
} from '../utils/storageUtils';
import {
  filterAndSortTasks,
  calculateTaskStatistics,
  DEFAULT_CATEGORIES
} from '../utils/taskUtils';
import { toLocalDateString } from '../utils/dateUtils';
import {
  checkTaskReminders,
  playChimeSound,
  sendNotification,
  requestNotificationPermission
} from '../utils/notificationUtils';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  // 1. Core State
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  const [categories, setCategories] = useState(() => loadCategoriesFromStorage());
  const [settings, setSettings] = useState(() => loadSettingsFromStorage());
  
  // 2. Navigation & View State
  const [activePage, setActivePage] = useState('dashboard');
  const [viewMode, setViewMode] = useState(() => settings.defaultView || 'list');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer toggle

  // 3. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [sortBy, setSortBy] = useState(() => settings.defaultSort || 'priority-desc');

  // 4. Modals State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, task: null, isAll: false });

  // 5. Toast Feedback State
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Save categories whenever changed
  useEffect(() => {
    saveCategoriesToStorage(categories);
  }, [categories]);

  // Save settings whenever changed
  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  // Background reminder checker (runs every 30 seconds while app is open)
  useEffect(() => {
    const interval = setInterval(() => {
      if (settings.enableNotifications) {
        checkTaskReminders(tasks, (task) => {
          addToast(`Reminder: ${task.title}`, 'warning');
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [tasks, settings.enableNotifications, addToast]);

  // Confetti celebration helper
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6']
      });
    } catch (e) {
      // Confetti fallback
    }
  }, []);

  // ==========================================
  // Task CRUD Actions
  // ==========================================

  const createTask = useCallback((taskData) => {
    const newTask = sanitizeTask({
      ...taskData,
      id: generateTaskId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: taskData.status === 'completed' ? new Date().toISOString() : null
    });

    setTasks(prev => [newTask, ...prev]);
    addToast(`Task "${newTask.title}" created successfully!`, 'success');
    if (settings.enableSounds) playChimeSound('chime');

    if (newTask.status === 'completed') {
      triggerConfetti();
    }
    return newTask;
  }, [settings.enableSounds, addToast, triggerConfetti]);

  const updateTask = useCallback((id, updatedData) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== id) return task;

      const wasCompleted = task.status === 'completed';
      const willBeCompleted = updatedData.status === 'completed';

      let completedAt = task.completedAt;
      if (!wasCompleted && willBeCompleted) {
        completedAt = new Date().toISOString();
        triggerConfetti();
        if (settings.enableSounds) playChimeSound('success');
      } else if (wasCompleted && !willBeCompleted) {
        completedAt = null;
      }

      return sanitizeTask({
        ...task,
        ...updatedData,
        id: task.id,
        createdAt: task.createdAt,
        updatedAt: new Date().toISOString(),
        completedAt
      });
    }));

    addToast('Task updated successfully', 'success');
  }, [settings.enableSounds, addToast, triggerConfetti]);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    addToast('Task deleted permanently', 'info');
  }, [addToast]);

  const toggleTaskStatus = useCallback((id) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== id) return task;
      const isNowCompleted = task.status !== 'completed';
      
      if (isNowCompleted) {
        triggerConfetti();
        if (settings.enableSounds) playChimeSound('success');
        addToast(`Completed: ${task.title}`, 'success');
      } else {
        addToast(`Marked pending: ${task.title}`, 'info');
      }

      return {
        ...task,
        status: isNowCompleted ? 'completed' : 'todo',
        completedAt: isNowCompleted ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString()
      };
    }));
  }, [settings.enableSounds, addToast, triggerConfetti]);

  const updateTaskStatus = useCallback((id, newStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== id) return task;
      const isCompleted = newStatus === 'completed';
      if (isCompleted && task.status !== 'completed') {
        triggerConfetti();
        if (settings.enableSounds) playChimeSound('success');
      }
      return {
        ...task,
        status: newStatus,
        completedAt: isCompleted ? (task.completedAt || new Date().toISOString()) : null,
        updatedAt: new Date().toISOString()
      };
    }));
  }, [settings.enableSounds, triggerConfetti]);

  const duplicateTask = useCallback((id) => {
    const original = tasks.find(t => t.id === id);
    if (!original) return;

    const duplicated = sanitizeTask({
      ...original,
      id: generateTaskId(),
      title: `${original.title} (Copy)`,
      status: 'todo',
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setTasks(prev => [duplicated, ...prev]);
    addToast(`Duplicated "${original.title}"`, 'info');
  }, [tasks, addToast]);

  const rescheduleTask = useCallback((id, newDueDate) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== id) return task;
      return {
        ...task,
        dueDate: newDueDate,
        updatedAt: new Date().toISOString()
      };
    }));
    addToast('Task rescheduled to ' + (newDueDate || 'No due date'), 'success');
  }, [addToast]);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
    addToast('All tasks cleared', 'warning');
  }, [addToast]);

  const resetSampleTasks = useCallback(() => {
    const samples = getSampleTasks();
    setTasks(samples);
    addToast('Sample showcase tasks restored!', 'success');
  }, [addToast]);

  // ==========================================
  // Filter & Search Management
  // ==========================================

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setDateFilter('all');
    setCustomDateRange({ start: '', end: '' });
    setPriorityFilter('all');
    setCategoryFilter('all');
    setStatusFilter('all');
    setTagFilter('all');
    addToast('All filters cleared', 'info');
  }, [addToast]);

  // Compute active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (dateFilter !== 'all') count++;
    if (priorityFilter !== 'all') count++;
    if (categoryFilter !== 'all') count++;
    if (statusFilter !== 'all') count++;
    if (tagFilter !== 'all') count++;
    return count;
  }, [searchQuery, dateFilter, priorityFilter, categoryFilter, statusFilter, tagFilter]);

  // Filtered & Sorted Tasks memoized
  const filteredTasks = useMemo(() => {
    return filterAndSortTasks(tasks, {
      searchQuery,
      dateFilter,
      customDateRange,
      priorityFilter,
      categoryFilter,
      statusFilter,
      tagFilter,
      sortBy
    });
  }, [tasks, searchQuery, dateFilter, customDateRange, priorityFilter, categoryFilter, statusFilter, tagFilter, sortBy]);

  // Compute live statistics
  const statistics = useMemo(() => {
    return calculateTaskStatistics(tasks);
  }, [tasks]);

  // Extract all unique tags across tasks
  const allTags = useMemo(() => {
    const set = new Set();
    tasks.forEach(t => {
      if (Array.isArray(t.tags)) {
        t.tags.forEach(tag => set.add(tag));
      }
    });
    return Array.from(set).sort();
  }, [tasks]);

  // ==========================================
  // Modal Openers & Closers
  // ==========================================

  const openCreateModal = useCallback((initialData = {}) => {
    setEditingTask(initialData);
    setIsTaskModalOpen(true);
  }, []);

  const openEditModal = useCallback((task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }, []);

  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  }, []);

  const openDetailModal = useCallback((task) => {
    setViewingTask(task);
    setIsDetailModalOpen(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setViewingTask(null);
  }, []);

  const openDeleteConfirm = useCallback((task) => {
    if (settings.confirmBeforeDelete) {
      setDeleteModal({ isOpen: true, task, isAll: false });
    } else {
      deleteTask(task.id);
    }
  }, [settings.confirmBeforeDelete, deleteTask]);

  const openClearAllConfirm = useCallback(() => {
    setDeleteModal({ isOpen: true, task: null, isAll: true });
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setDeleteModal({ isOpen: false, task: null, isAll: false });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteModal.isAll) {
      clearAllTasks();
    } else if (deleteModal.task) {
      deleteTask(deleteModal.task.id);
    }
    closeDeleteConfirm();
  }, [deleteModal, clearAllTasks, deleteTask, closeDeleteConfirm]);

  // ==========================================
  // Export & Import Handlers
  // ==========================================

  const handleExportJSON = useCallback(() => {
    exportTasksAsJSON(tasks);
    addToast('Tasks exported to JSON', 'success');
  }, [tasks, addToast]);

  const handleExportCSV = useCallback(() => {
    exportTasksAsCSV(tasks);
    addToast('Tasks exported to CSV', 'success');
  }, [tasks, addToast]);

  const handleImportJSON = useCallback((jsonString) => {
    const result = importTasksFromJSON(jsonString);
    if (!result.success) {
      addToast(result.error, 'danger');
      return false;
    }

    setTasks(result.tasks);
    addToast(`Successfully imported ${result.count} tasks!`, 'success');
    return true;
  }, [addToast]);

  // Category management
  const addCategory = useCallback((categoryObj) => {
    setCategories(prev => {
      if (prev.some(c => c.name.toLowerCase() === categoryObj.name.toLowerCase())) {
        return prev;
      }
      return [...prev, categoryObj];
    });
    addToast(`Category "${categoryObj.name}" added`, 'success');
  }, [addToast]);

  return (
    <TaskContext.Provider value={{
      tasks,
      filteredTasks,
      categories,
      statistics,
      allTags,
      settings,
      setSettings,
      activePage,
      setActivePage,
      viewMode,
      setViewMode,
      isSidebarOpen,
      setIsSidebarOpen,

      // Search & Filters
      searchQuery,
      setSearchQuery,
      dateFilter,
      setDateFilter,
      customDateRange,
      setCustomDateRange,
      priorityFilter,
      setPriorityFilter,
      categoryFilter,
      setCategoryFilter,
      statusFilter,
      setStatusFilter,
      tagFilter,
      setTagFilter,
      sortBy,
      setSortBy,
      activeFiltersCount,
      clearFilters,

      // CRUD
      createTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      updateTaskStatus,
      duplicateTask,
      rescheduleTask,
      clearAllTasks,
      resetSampleTasks,
      addCategory,

      // Modals
      isTaskModalOpen,
      editingTask,
      openCreateModal,
      openEditModal,
      closeTaskModal,
      isDetailModalOpen,
      viewingTask,
      openDetailModal,
      closeDetailModal,
      deleteModal,
      openDeleteConfirm,
      openClearAllConfirm,
      closeDeleteConfirm,
      handleConfirmDelete,

      // Export / Import
      handleExportJSON,
      handleExportCSV,
      handleImportJSON,

      // Toasts
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
