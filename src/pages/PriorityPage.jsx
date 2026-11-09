import React from 'react';
import { Flag, Plus, AlertCircle, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import { useTasks } from '../hooks/useTasks';
import { PRIORITIES } from '../utils/taskUtils';

export default function PriorityPage() {
  const { tasks, openCreateModal } = useTasks();

  const prioritySections = [
    {
      id: 'urgent',
      p: PRIORITIES.urgent,
      icon: AlertCircle,
      tasks: tasks.filter(t => t.priority === 'urgent')
    },
    {
      id: 'high',
      p: PRIORITIES.high,
      icon: AlertTriangle,
      tasks: tasks.filter(t => t.priority === 'high')
    },
    {
      id: 'medium',
      p: PRIORITIES.medium,
      icon: ArrowUpRight,
      tasks: tasks.filter(t => t.priority === 'medium')
    },
    {
      id: 'low',
      p: PRIORITIES.low,
      icon: ArrowDownRight,
      tasks: tasks.filter(t => t.priority === 'low')
    }
  ];

  return (
    <div className="priority-page">
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-title">
            <Flag size={26} color="var(--accent-color)" />
            <span>Priority Management</span>
          </div>
          <span className="page-subtitle">
            Eisenhower-matrix inspired organization: tackle urgent & high priority goals first
          </span>
        </div>

        <button onClick={() => openCreateModal()} className="btn btn-primary">
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {prioritySections.map(section => {
          const Icon = section.icon;
          const pendingCount = section.tasks.filter(t => t.status !== 'completed').length;

          return (
            <div key={section.id} className="card" style={{ padding: '1.25rem' }}>
              {/* Section Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                  paddingBottom: '0.65rem',
                  borderBottom: `2px solid ${section.p.color}33`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: section.p.bg,
                      color: section.p.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={16} />
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {section.p.fullLabel}
                  </h3>
                  <span className="badge-count" style={{ backgroundColor: section.p.bg, color: section.p.color, fontWeight: 700 }}>
                    {pendingCount} pending / {section.tasks.length} total
                  </span>
                </div>

                <button
                  onClick={() => openCreateModal({ priority: section.id })}
                  className="btn btn-secondary btn-sm"
                >
                  <Plus size={13} />
                  <span>Add {section.p.label}</span>
                </button>
              </div>

              {/* Tasks List */}
              {section.tasks.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                  No tasks currently tagged under {section.p.label}.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {section.tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
