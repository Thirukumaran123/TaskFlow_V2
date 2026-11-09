import React from 'react';
import {
  X,
  Calendar,
  Clock,
  Tag,
  CheckCircle2,
  Edit2,
  Copy,
  Trash2,
  FileText,
  AlertCircle
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import { formatDateTime, formatDateMedium, formatRelativeDate, isOverdue } from '../utils/dateUtils';
import { useTasks } from '../hooks/useTasks';

export default function TaskDetailModal() {
  const {
    isDetailModalOpen,
    viewingTask,
    closeDetailModal,
    openEditModal,
    toggleTaskStatus,
    duplicateTask,
    openDeleteConfirm
  } = useTasks();

  if (!isDetailModalOpen || !viewingTask) return null;

  const isCompleted = viewingTask.status === 'completed';
  const overdue = isOverdue(viewingTask.dueDate, viewingTask.status);

  return (
    <div className="modal-overlay" onClick={closeDetailModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={() => toggleTaskStatus(viewingTask.id)}
              className="btn btn-sm"
              style={{
                backgroundColor: isCompleted ? '#10b981' : 'var(--bg-subtle)',
                color: isCompleted ? '#ffffff' : 'var(--text-secondary)',
                border: isCompleted ? 'none' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <CheckCircle2 size={14} />
              <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>
            <PriorityBadge priority={viewingTask.priority} />
          </div>

          <button onClick={closeDetailModal} className="icon-btn" title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Title */}
          <div>
            <h2
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                textDecoration: isCompleted ? 'line-through' : 'none'
              }}
            >
              {viewingTask.title}
            </h2>
          </div>

          {/* Description */}
          {viewingTask.description && (
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Description
              </span>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-primary)', marginTop: '0.35rem', whiteSpace: 'pre-wrap' }}>
                {viewingTask.description}
              </p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid-2" style={{ gap: '0.85rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {viewingTask.category || 'General'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: isCompleted ? '#10b981' : 'var(--text-primary)' }}>
                {viewingTask.status === 'completed' ? 'Completed' : viewingTask.status === 'in_progress' ? 'In Progress' : 'To Do'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due Date</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: overdue ? '#ef4444' : 'var(--text-primary)' }}>
                {viewingTask.dueDate ? `${formatDateMedium(viewingTask.dueDate)} (${formatRelativeDate(viewingTask.dueDate)})` : 'No Due Date'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Start Date</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {viewingTask.startDate ? formatDateMedium(viewingTask.startDate) : 'Not specified'}
              </span>
            </div>

            {viewingTask.reminderDateTime && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reminder Alert</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 500 }}>
                  <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  {formatDateTime(viewingTask.reminderDateTime)}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {Array.isArray(viewingTask.tags) && viewingTask.tags.length > 0 && (
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Tags
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {viewingTask.tags.map(tag => (
                  <span
                    key={tag}
                    className="badge"
                    style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)' }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {viewingTask.notes && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Notes & Checklist
              </span>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  marginTop: '0.35rem',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.5'
                }}
              >
                {viewingTask.notes}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Created: {formatDateTime(viewingTask.createdAt)}</span>
            {viewingTask.completedAt && (
              <span style={{ color: '#10b981' }}>Completed: {formatDateTime(viewingTask.completedAt)}</span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            onClick={() => {
              closeDetailModal();
              openDeleteConfirm(viewingTask);
            }}
            className="btn btn-danger btn-sm"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => {
                duplicateTask(viewingTask.id);
                closeDetailModal();
              }}
              className="btn btn-secondary btn-sm"
            >
              <Copy size={14} />
              <span>Duplicate</span>
            </button>
            <button
              onClick={() => {
                closeDetailModal();
                openEditModal(viewingTask);
              }}
              className="btn btn-primary btn-sm"
            >
              <Edit2 size={14} />
              <span>Edit Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
