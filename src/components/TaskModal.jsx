import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, Tag, Flag, AlertCircle, Plus, Check } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { PRIORITIES, DEFAULT_CATEGORIES } from '../utils/taskUtils';
import { toLocalDateString } from '../utils/dateUtils';

export default function TaskModal() {
  const {
    isTaskModalOpen,
    editingTask,
    closeTaskModal,
    createTask,
    updateTask,
    categories,
    addCategory
  } = useTasks();

  const titleInputRef = useRef(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [reminderDateTime, setReminderDateTime] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [notes, setNotes] = useState('');
  const [newCatInput, setNewCatInput] = useState('');
  const [showNewCatInput, setShowNewCatInput] = useState(false);

  // Validation
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(editingTask && editingTask.id);

  // Populate form on open
  useEffect(() => {
    if (isTaskModalOpen) {
      if (editingTask) {
        setTitle(editingTask.title || '');
        setDescription(editingTask.description || '');
        setCategory(editingTask.category || 'Work');
        setPriority(editingTask.priority || 'medium');
        setStatus(editingTask.status || 'todo');
        setStartDate(editingTask.startDate || '');
        setDueDate(editingTask.dueDate || '');
        setReminderDateTime(editingTask.reminderDateTime || '');
        setTags(Array.isArray(editingTask.tags) ? [...editingTask.tags] : []);
        setNotes(editingTask.notes || '');
      } else {
        // Reset defaults
        setTitle('');
        setDescription('');
        setCategory('Work');
        setPriority('medium');
        setStatus('todo');
        setStartDate('');
        setDueDate(toLocalDateString(new Date()));
        setReminderDateTime('');
        setTags([]);
        setNotes('');
      }
      setErrors({});
      setShowNewCatInput(false);

      // Auto focus
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isTaskModalOpen, editingTask]);

  // Handle escape & ctrl+enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isTaskModalOpen) return;
      if (e.key === 'Escape') {
        closeTaskModal();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        handleSubmit(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskModalOpen, title, description, category, priority, status, startDate, dueDate, reminderDateTime, tags, notes]);

  if (!isTaskModalOpen) return null;

  // Add tag chip
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '').toLowerCase();
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Add custom category
  const handleAddNewCategory = () => {
    const clean = newCatInput.trim();
    if (clean) {
      addCategory({ id: clean, name: clean, color: '#6366f1' });
      setCategory(clean);
      setNewCatInput('');
      setShowNewCatInput(false);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    // Validation
    const validationErrors = {};
    if (!title.trim()) {
      validationErrors.title = 'Task title is required';
    }

    if (startDate && dueDate && startDate > dueDate) {
      validationErrors.dates = 'Start date cannot be after due date';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status,
      startDate,
      dueDate,
      reminderDateTime,
      tags,
      notes: notes.trim()
    };

    if (isEditing) {
      updateTask(editingTask.id, payload);
    } else {
      createTask(payload);
    }

    closeTaskModal();
  };

  return (
    <div className="modal-overlay" onClick={closeTaskModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button onClick={closeTaskModal} className="icon-btn" title="Close (Esc)">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Title Input */}
          <div className="form-group">
            <label className="form-label">
              Task Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors(prev => ({ ...prev, title: null }));
              }}
              placeholder="e.g. Prepare presentation for Monday sync"
              className="form-control"
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                borderColor: errors.title ? '#ef4444' : undefined
              }}
            />
            {errors.title && (
              <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.2rem' }}>
                {errors.title}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key deliverables, goals, or context..."
              className="form-control"
              rows={2}
            />
          </div>

          {/* Priority Selection Cards */}
          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {Object.values(PRIORITIES).map(p => {
                const isSelected = priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    style={{
                      padding: '0.55rem 0.4rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? `2px solid ${p.color}` : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? p.bg : 'var(--bg-subtle)',
                      color: isSelected ? p.color : 'var(--text-secondary)',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.825rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.color }} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category & Status Row */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              {!showNewCatInput ? (
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-control"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCatInput(true)}
                    className="btn btn-secondary btn-sm"
                    title="Add new category"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    placeholder="New category..."
                    className="form-control"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategory}
                    className="btn btn-primary btn-sm"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCatInput(false)}
                    className="btn btn-ghost btn-sm"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-control"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Dates Row: Start Date, Due Date */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Start Date (Optional)</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
          {errors.dates && (
            <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '-0.5rem', marginBottom: '0.75rem' }}>
              {errors.dates}
            </p>
          )}

          {/* Reminder Date & Time */}
          <div className="form-group">
            <label className="form-label">
              <Clock size={14} /> Reminder Alert (Optional)
            </label>
            <input
              type="datetime-local"
              value={reminderDateTime}
              onChange={(e) => setReminderDateTime(e.target.value)}
              className="form-control"
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Triggers a browser notification & sound when TaskFlow is open.
            </span>
          </div>

          {/* Tags Chip Input */}
          <div className="form-group">
            <label className="form-label">
              <Tag size={14} /> Tags
            </label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-input)'
              }}
            >
              {tags.map(tag => (
                <span
                  key={tag}
                  className="badge"
                  style={{
                    backgroundColor: 'var(--accent-light)',
                    color: 'var(--accent-color)',
                    fontSize: '0.75rem'
                  }}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    style={{ marginLeft: '4px', cursor: 'pointer', color: 'inherit' }}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? "Type tag & press Enter..." : "Add tag..."}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  flex: 1,
                  minWidth: '120px'
                }}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Meeting links, checklist items, research links, or reminders..."
              className="form-control"
              rows={3}
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" onClick={closeTaskModal} className="btn btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="btn btn-primary">
            {isEditing ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
