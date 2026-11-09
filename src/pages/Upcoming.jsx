import React from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import { useTasks } from '../hooks/useTasks';
import { getMidnight, isTomorrow, toLocalDateString } from '../utils/dateUtils';

export default function Upcoming() {
  const { tasks, openCreateModal } = useTasks();

  const today = getMidnight();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const in7Days = new Date(today);
  in7Days.setDate(in7Days.getDate() + 7);

  const in30Days = new Date(today);
  in30Days.setDate(in30Days.getDate() + 30);

  // Filter tasks with dueDate > today
  const upcomingTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'completed') return false;
    const due = getMidnight(t.dueDate);
    return due > today;
  });

  // Group into horizons
  const tomorrowTasks = upcomingTasks.filter(t => isTomorrow(t.dueDate));
  const weekTasks = upcomingTasks.filter(t => {
    const due = getMidnight(t.dueDate);
    return due > tomorrow && due <= in7Days;
  });
  const monthTasks = upcomingTasks.filter(t => {
    const due = getMidnight(t.dueDate);
    return due > in7Days && due <= in30Days;
  });
  const laterTasks = upcomingTasks.filter(t => {
    const due = getMidnight(t.dueDate);
    return due > in30Days;
  });

  return (
    <div className="upcoming-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-title">
            <CalendarDays size={26} color="#0ea5e9" />
            <span>Upcoming Tasks</span>
            <span className="badge-count">{upcomingTasks.length}</span>
          </div>
          <span className="page-subtitle">
            Plan ahead and anticipate what is coming down the pipeline
          </span>
        </div>

        <button
          onClick={() => {
            const nextDay = new Date();
            nextDay.setDate(nextDay.getDate() + 1);
            openCreateModal({ dueDate: toLocalDateString(nextDay) });
          }}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>Add Upcoming Task</span>
        </button>
      </div>

      {upcomingTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <CalendarDays size={28} />
          </div>
          <h3 className="empty-state-title">No upcoming tasks scheduled</h3>
          <p className="empty-state-desc">
            You don't have any future tasks planned. Start organizing future milestones now.
          </p>
          <button onClick={() => openCreateModal()} className="btn btn-primary">
            <Plus size={16} />
            Schedule a Task
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Tomorrow */}
          {tomorrowTasks.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
                <span>Tomorrow</span>
                <span className="badge-count">{tomorrowTasks.length}</span>
              </h3>
              <div>
                {tomorrowTasks.map(t => (
                  <TaskCard key={t.id} task={t} />
                ))}
              </div>
            </div>
          )}

          {/* Next 7 Days */}
          {weekTasks.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                <span>Next 7 Days</span>
                <span className="badge-count">{weekTasks.length}</span>
              </h3>
              <div>
                {weekTasks.map(t => (
                  <TaskCard key={t.id} task={t} />
                ))}
              </div>
            </div>
          )}

          {/* Next 30 Days */}
          {monthTasks.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0ea5e9' }} />
                <span>Next 30 Days</span>
                <span className="badge-count">{monthTasks.length}</span>
              </h3>
              <div>
                {monthTasks.map(t => (
                  <TaskCard key={t.id} task={t} />
                ))}
              </div>
            </div>
          )}

          {/* Later */}
          {laterTasks.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#64748b' }} />
                <span>Later</span>
                <span className="badge-count">{laterTasks.length}</span>
              </h3>
              <div>
                {laterTasks.map(t => (
                  <TaskCard key={t.id} task={t} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
