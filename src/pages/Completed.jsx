import React from 'react';
import { CheckCircle2, RotateCcw, Trash2, Calendar } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { formatDateTime, formatDateMedium } from '../utils/dateUtils';
import PriorityBadge from '../components/PriorityBadge';

export default function Completed() {
  const { tasks, toggleTaskStatus, openDeleteConfirm, addToast } = useTasks();

  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="completed-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-title">
            <CheckCircle2 size={26} color="#10b981" />
            <span>Completed Tasks Archive</span>
            <span className="badge-count">{completedTasks.length}</span>
          </div>
          <span className="page-subtitle">
            Historical log of all resolved goals and completed milestones
          </span>
        </div>
      </div>

      {completedTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="empty-state-title">No completed tasks yet</h3>
          <p className="empty-state-desc">
            Complete your scheduled tasks by clicking their checkmarks to celebrate your progress here!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {completedTasks.map(task => (
            <div
              key={task.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.1rem',
                gap: '1rem',
                backgroundColor: 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                {/* Completed Checkmark Icon */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <CheckCircle2 size={16} color="#ffffff" />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      textDecoration: 'line-through',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {task.title}
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <PriorityBadge priority={task.priority} size="small" />

                    {task.category && (
                      <span className="badge" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
                        {task.category}
                      </span>
                    )}

                    {task.completedAt && (
                      <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} />
                        Finished: {formatDateTime(task.completedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className="btn btn-secondary btn-sm"
                  title="Reopen task and mark as pending"
                >
                  <RotateCcw size={13} />
                  <span>Reopen</span>
                </button>

                <button
                  onClick={() => openDeleteConfirm(task)}
                  className="icon-btn"
                  title="Delete permanently"
                  style={{ color: '#ef4444' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
