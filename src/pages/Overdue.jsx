import React from 'react';
import { AlertCircle, Calendar, CheckCircle2, RotateCw, Sparkles } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import { useTasks } from '../hooks/useTasks';
import { isOverdue, toLocalDateString, getDaysDiffFromToday } from '../utils/dateUtils';

export default function Overdue() {
  const { tasks, rescheduleTask, toggleTaskStatus, addToast } = useTasks();

  const todayStr = toLocalDateString(new Date());

  // Filter overdue tasks
  const overdueTasks = tasks.filter(t => isOverdue(t.dueDate, t.status));

  // Batch reschedule all to today
  const handleRescheduleAll = () => {
    overdueTasks.forEach(t => {
      rescheduleTask(t.id, todayStr);
    });
    addToast(`Rescheduled ${overdueTasks.length} tasks to today!`, 'success');
  };

  return (
    <div className="overdue-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-title">
            <AlertCircle size={26} color="#ef4444" />
            <span style={{ color: overdueTasks.length > 0 ? '#ef4444' : 'var(--text-primary)' }}>
              Overdue Tasks
            </span>
            <span
              className="badge"
              style={{
                backgroundColor: overdueTasks.length > 0 ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-subtle)',
                color: overdueTasks.length > 0 ? '#ef4444' : 'var(--text-muted)',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              {overdueTasks.length}
            </span>
          </div>
          <span className="page-subtitle">
            Tasks past their scheduled due dates that are not yet completed
          </span>
        </div>

        {overdueTasks.length > 0 && (
          <button
            onClick={handleRescheduleAll}
            className="btn btn-secondary"
            style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444' }}
          >
            <RotateCw size={15} />
            <span>Reschedule All to Today</span>
          </button>
        )}
      </div>

      {overdueTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Sparkles size={32} />
          </div>
          <h3 className="empty-state-title" style={{ color: '#10b981' }}>
            Zero Overdue Tasks!
          </h3>
          <p className="empty-state-desc">
            Phenomenal work! You are completely on schedule and have zero pending items behind deadline.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {overdueTasks.map(task => {
            const daysBehind = Math.abs(getDaysDiffFromToday(task.dueDate));
            return (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  padding: '0.75rem 1rem'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <TaskCard task={task} />
                </div>

                {/* Quick Action: Reschedule to Today */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
                  <button
                    onClick={() => rescheduleTask(task.id, todayStr)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem' }}
                    title="Reschedule to Today"
                  >
                    <Calendar size={13} color="var(--accent-color)" />
                    <span>Move to Today</span>
                  </button>

                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.78rem', backgroundColor: '#10b981' }}
                    title="Mark Done"
                  >
                    <CheckCircle2 size={13} />
                    <span>Mark Done</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
