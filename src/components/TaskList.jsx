import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Search,
  Plus,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import TaskCard from './TaskCard';
import { useTasks } from '../hooks/useTasks';
import {
  groupTasksByDate,
  groupTasksByPriority,
  groupTasksByCategory
} from '../utils/taskUtils';

export default function TaskList({ tasks = [], grouping = 'none', emptyMessage, emptyTitle }) {
  const { openCreateModal, searchQuery, dateFilter, activeFiltersCount, clearFilters, categories } = useTasks();

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          {searchQuery ? (
            <Search size={28} />
          ) : dateFilter === 'overdue' ? (
            <Sparkles size={28} color="#10b981" />
          ) : (
            <CheckCircle2 size={28} />
          )}
        </div>
        <h3 className="empty-state-title">
          {emptyTitle || (searchQuery ? 'No matching tasks found' : dateFilter === 'overdue' ? 'No Overdue Tasks!' : 'No tasks to display')}
        </h3>
        <p className="empty-state-desc">
          {emptyMessage || (searchQuery
            ? `No tasks matched "${searchQuery}". Try adjusting your keywords or clearing filters.`
            : dateFilter === 'overdue'
            ? 'Awesome job! You have cleared all past due tasks and are right on track.'
            : 'Get organized and boost your productivity by adding a new task.')}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="btn btn-secondary">
              Reset Filters
            </button>
          )}
          <button onClick={() => openCreateModal()} className="btn btn-primary">
            <Plus size={16} />
            Add New Task
          </button>
        </div>
      </div>
    );
  }

  // 1. Grouped by Date
  if (grouping === 'group-date') {
    const groups = groupTasksByDate(tasks);
    return (
      <div className="grouped-task-list">
        {groups.map(group => (
          <div key={group.title} style={{ marginBottom: '1.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                paddingBottom: '0.4rem',
                borderBottom: `2px solid ${group.color}33`
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: group.color
                }}
              />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {group.title}
              </h3>
              <span className="badge-count">{group.tasks.length}</span>
            </div>
            <div>
              {group.tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Grouped by Priority
  if (grouping === 'group-priority') {
    const groups = groupTasksByPriority(tasks).filter(g => g.tasks.length > 0);
    return (
      <div className="grouped-task-list">
        {groups.map(group => (
          <div key={group.key} style={{ marginBottom: '1.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                paddingBottom: '0.4rem',
                borderBottom: `2px solid ${group.priority.color}33`
              }}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '3px',
                  backgroundColor: group.priority.color
                }}
              />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {group.title}
              </h3>
              <span className="badge-count">{group.tasks.length}</span>
            </div>
            <div>
              {group.tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 3. Grouped by Category
  if (grouping === 'group-category') {
    const groups = groupTasksByCategory(tasks, categories);
    return (
      <div className="grouped-task-list">
        {groups.map(group => (
          <div key={group.id} style={{ marginBottom: '1.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                paddingBottom: '0.4rem',
                borderBottom: `2px solid ${group.color}33`
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: group.color
                }}
              />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {group.title}
              </h3>
              <span className="badge-count">{group.tasks.length}</span>
            </div>
            <div>
              {group.tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default Standard Flat List
  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
