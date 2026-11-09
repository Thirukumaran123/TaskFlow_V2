import React from 'react';
import { Sun, Plus, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import TaskList from '../components/TaskList';
import TaskCard from '../components/TaskCard';
import { useTasks } from '../hooks/useTasks';
import { isToday, isOverdue, toLocalDateString } from '../utils/dateUtils';

export default function MyDay() {
  const { tasks, openCreateModal, rescheduleTask, addToast } = useTasks();

  const todayStr = toLocalDateString(new Date());

  // Tasks due today
  const todayTasks = tasks.filter(t => t.dueDate && isToday(t.dueDate));
  const pendingToday = todayTasks.filter(t => t.status !== 'completed');
  const completedToday = todayTasks.filter(t => t.status === 'completed');

  // Overdue tasks that need attention
  const overdueTasks = tasks.filter(t => isOverdue(t.dueDate, t.status));

  // Handle rescheduling all overdue tasks to today
  const handleRescheduleAllToToday = () => {
    overdueTasks.forEach(t => {
      rescheduleTask(t.id, todayStr);
    });
    addToast(`Rescheduled ${overdueTasks.length} overdue tasks to today!`, 'success');
  };

  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="my-day-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-title">
            <Sun size={26} color="#f59e0b" />
            <span>My Day</span>
            <span className="badge-count">{todayTasks.length}</span>
          </div>
          <span className="page-subtitle">
            {todayFormatted} • Focus on today's priorities
          </span>
        </div>

        <button
          onClick={() => openCreateModal({ dueDate: todayStr })}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>Add Task for Today</span>
        </button>
      </div>

      {/* Overdue Attention Banner */}
      {overdueTasks.length > 0 && (
        <div
          className="card"
          style={{
            marginBottom: '1.5rem',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1rem 1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <AlertTriangle size={20} color="#ef4444" />
            <div>
              <strong style={{ fontSize: '0.9rem', color: '#ef4444' }}>
                You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}!
              </strong>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Would you like to bring them into your focus for today?
              </p>
            </div>
          </div>

          <button
            onClick={handleRescheduleAllToToday}
            className="btn btn-sm"
            style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontWeight: 600
            }}
          >
            Reschedule All to Today
          </button>
        </div>
      )}

      {/* Today's Tasks */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
          Scheduled for Today ({pendingToday.length} pending)
        </h3>
        <TaskList
          tasks={pendingToday}
          emptyTitle="Nothing due today! 🎉"
          emptyMessage="You have no pending tasks scheduled for today. Take time to relax or plan ahead."
        />
      </div>

      {/* Completed Today Section */}
      {completedToday.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 600,
              marginBottom: '0.85rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <CheckCircle2 size={16} color="#10b981" />
            <span>Completed Today ({completedToday.length})</span>
          </h3>
          <div style={{ opacity: 0.85 }}>
            {completedToday.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
