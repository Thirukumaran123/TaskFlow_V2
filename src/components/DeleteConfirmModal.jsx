import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';

export default function DeleteConfirmModal() {
  const { deleteModal, closeDeleteConfirm, handleConfirmDelete } = useTasks();

  if (!deleteModal.isOpen) return null;

  const isAll = deleteModal.isAll;
  const task = deleteModal.task;

  return (
    <div className="modal-overlay" onClick={closeDeleteConfirm}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
            <AlertTriangle size={20} />
            <h3 className="modal-title" style={{ color: '#ef4444' }}>
              {isAll ? 'Clear All Tasks?' : 'Delete Task Permanently?'}
            </h3>
          </div>
          <button onClick={closeDeleteConfirm} className="icon-btn">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {isAll ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Are you sure you want to delete <strong>all tasks</strong>? This action cannot be undone and will wipe your local task records.
            </p>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Are you sure you want to delete "<strong>{task?.title}</strong>"? This action cannot be undone.
            </p>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={closeDeleteConfirm} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleConfirmDelete} className="btn btn-danger">
            <Trash2 size={15} />
            <span>{isAll ? 'Yes, Clear All' : 'Yes, Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
