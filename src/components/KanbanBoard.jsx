import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, CircleDot, ArrowLeft, ArrowRight } from 'lucide-react';
import TaskCard from './TaskCard';
import { useTasks } from '../hooks/useTasks';

export default function KanbanBoard({ tasks = [] }) {
  const { updateTaskStatus, openCreateModal } = useTasks();
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [activeDropColumn, setActiveDropColumn] = useState(null);

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      color: '#94a3b8',
      icon: CircleDot,
      bg: 'var(--bg-subtle)'
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      color: '#3b82f6',
      icon: Clock,
      bg: 'rgba(59, 130, 246, 0.08)'
    },
    {
      id: 'completed',
      title: 'Completed',
      color: '#10b981',
      icon: CheckCircle2,
      bg: 'rgba(16, 185, 129, 0.08)'
    }
  ];

  // Drag Handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropColumn !== columnId) {
      setActiveDropColumn(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    if (activeDropColumn === columnId) {
      setActiveDropColumn(null);
    }
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setActiveDropColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      updateTaskStatus(taskId, targetStatus);
    }
    setDraggedTaskId(null);
  };

  return (
    <div
      className="kanban-board-container"
      style={{
        display: 'flex',
        gap: '1.25rem',
        alignItems: 'flex-start',
        overflowX: 'auto',
        paddingBottom: '1.5rem'
      }}
    >
      {columns.map(col => {
        const columnTasks = tasks.filter(t => t.status === col.id);
        const Icon = col.icon;
        const isHovered = activeDropColumn === col.id;

        return (
          <div
            key={col.id}
            className="kanban-column"
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={(e) => handleDragLeave(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
            style={{
              flex: 1,
              minWidth: '310px',
              backgroundColor: isHovered ? 'var(--bg-card-hover)' : 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: isHovered ? `2px dashed ${col.color}` : '1px solid var(--border-color)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.18s ease'
            }}
          >
            {/* Column Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                paddingBottom: '0.6rem',
                borderBottom: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: col.bg,
                    color: col.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={15} />
                </span>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {col.title}
                </h3>
                <span className="badge-count">{columnTasks.length}</span>
              </div>

              <button
                className="icon-btn"
                onClick={() => openCreateModal({ status: col.id })}
                title={`Add task to ${col.title}`}
                style={{ width: '28px', height: '28px' }}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Column Tasks */}
            <div style={{ minHeight: '150px', display: 'flex', flexDirection: 'column' }}>
              {columnTasks.length === 0 ? (
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem 1rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.825rem',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '0.5rem'
                  }}
                >
                  <span>Drop tasks here or</span>
                  <button
                    onClick={() => openCreateModal({ status: col.id })}
                    style={{
                      color: 'var(--accent-color)',
                      fontWeight: 600,
                      marginTop: '0.35rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Task
                  </button>
                </div>
              ) : (
                columnTasks.map(task => (
                  <div key={task.id} style={{ position: 'relative' }}>
                    <TaskCard task={task} onDragStart={handleDragStart} />
                    {/* Quick column mover buttons */}
                    <div
                      style={{
                        position: 'absolute',
                        right: '0.5rem',
                        bottom: '0.55rem',
                        display: 'flex',
                        gap: '0.2rem',
                        zIndex: 2
                      }}
                    >
                      {col.id !== 'todo' && (
                        <button
                          className="icon-btn"
                          onClick={() => updateTaskStatus(task.id, col.id === 'completed' ? 'in_progress' : 'todo')}
                          title={col.id === 'completed' ? 'Move to In Progress' : 'Move to To Do'}
                          style={{ width: '22px', height: '22px', backgroundColor: 'var(--bg-subtle)' }}
                        >
                          <ArrowLeft size={11} />
                        </button>
                      )}
                      {col.id !== 'completed' && (
                        <button
                          className="icon-btn"
                          onClick={() => updateTaskStatus(task.id, col.id === 'todo' ? 'in_progress' : 'completed')}
                          title={col.id === 'todo' ? 'Move to In Progress' : 'Move to Completed'}
                          style={{ width: '22px', height: '22px', backgroundColor: 'var(--bg-subtle)' }}
                        >
                          <ArrowRight size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
