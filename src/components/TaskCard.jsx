import React from 'react';
import {
  Check,
  Calendar,
  Clock,
  AlertTriangle,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  Eye,
  FileText,
  Tag,
  ArrowRight
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import { formatRelativeDate, isOverdue, isToday } from '../utils/dateUtils';
import { useTasks } from '../hooks/useTasks';

export default function TaskCard({ task, onDragStart }) {
  const {
    toggleTaskStatus,
    updateTaskStatus,
    duplicateTask,
    openEditModal,
    openDetailModal,
    openDeleteConfirm
  } = useTasks();

  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';
  const overdue = isOverdue(task.dueDate, task.status);
  const dueToday = task.dueDate && isToday(task.dueDate) && !isCompleted;

  // Due date badge style
  const getDueDateStyle = () => {
    if (!task.dueDate) return { color: 'var(--text-muted)', bg: 'var(--bg-subtle)' };
    if (isCompleted) return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
    if (overdue) return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' };
    if (dueToday) return { color: 'var(--accent-color)', bg: 'var(--accent-light)', border: '1px solid var(--accent-ring)' };
    return { color: 'var(--text-secondary)', bg: 'var(--bg-subtle)' };
  };

  const dueStyle = getDueDateStyle();

  return (
    <div
      className={`task-card ${isCompleted ? 'is-completed' : ''} ${isInProgress ? 'is-in-progress' : ''}`}
      draggable={Boolean(onDragStart)}
      onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: overdue ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '0.9rem 1.1rem',
        marginBottom: '0.75rem',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.18s ease',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskStatus(task.id);
          }}
          className="task-checkbox"
          style={{
            marginTop: '2px',
            width: '20px',
            height: '20px',
            borderRadius: '6px',
            border: isCompleted ? '2px solid #10b981' : '2px solid var(--border-color)',
            backgroundColor: isCompleted ? '#10b981' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s ease'
          }}
          title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {isCompleted && <Check size={14} color="#ffffff" strokeWidth={3} />}
        </button>

        {/* Task Content */}
        <div style={{ flex: 1, minWidth: 0 }} onClick={() => openDetailModal(task)}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                textDecoration: isCompleted ? 'line-through' : 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
              title={task.title}
            >
              {task.title}
            </h4>

            {/* Actions Menu */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="icon-btn"
                onClick={() => openDetailModal(task)}
                title="View Details"
                style={{ width: '28px', height: '28px' }}
              >
                <Eye size={15} />
              </button>
              <button
                className="icon-btn"
                onClick={() => openEditModal(task)}
                title="Edit Task"
                style={{ width: '28px', height: '28px' }}
              >
                <Edit2 size={15} />
              </button>
              <button
                className="icon-btn"
                onClick={() => duplicateTask(task.id)}
                title="Duplicate Task"
                style={{ width: '28px', height: '28px' }}
              >
                <Copy size={15} />
              </button>
              <button
                className="icon-btn"
                onClick={() => openDeleteConfirm(task)}
                title="Delete Task"
                style={{ width: '28px', height: '28px', color: '#ef4444' }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Description Snippet */}
          {task.description && (
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.6rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: '1.4'
              }}
            >
              {task.description}
            </p>
          )}

          {/* Metadata Row: Category, Priority, Due Date, Tags */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
            {/* Priority Badge */}
            <PriorityBadge priority={task.priority} size="small" />

            {/* Category Pill */}
            {task.category && (
              <span
                className="badge"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.72rem'
                }}
              >
                {task.category}
              </span>
            )}

            {/* Status Pill */}
            <span
              className="badge"
              style={{
                backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.12)' : isInProgress ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-subtle)',
                color: isCompleted ? '#10b981' : isInProgress ? '#3b82f6' : 'var(--text-muted)',
                fontSize: '0.72rem'
              }}
            >
              {task.status === 'completed' ? 'Completed' : task.status === 'in_progress' ? 'In Progress' : 'To Do'}
            </span>

            {/* Due Date Pill */}
            {task.dueDate && (
              <span
                className="badge"
                style={{
                  backgroundColor: dueStyle.bg,
                  color: dueStyle.color,
                  border: dueStyle.border || '1px solid transparent',
                  fontSize: '0.72rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                title={`Due: ${task.dueDate}`}
              >
                {overdue ? <AlertTriangle size={12} /> : dueToday ? <Clock size={12} /> : <Calendar size={12} />}
                {formatRelativeDate(task.dueDate)}
              </span>
            )}

            {/* Notes Indicator */}
            {task.notes && (
              <span
                className="badge"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.7rem'
                }}
                title="Has additional notes"
              >
                <FileText size={11} />
                Notes
              </span>
            )}

            {/* Tags */}
            {Array.isArray(task.tags) && task.tags.map((tag, idx) => (
              <span
                key={idx}
                className="badge"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.7rem'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
