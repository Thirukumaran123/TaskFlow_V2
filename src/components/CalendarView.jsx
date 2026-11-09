import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { getCalendarMonthMatrix, toLocalDateString, isToday, isSameDay, parseDateSafe } from '../utils/dateUtils';
import { PRIORITIES } from '../utils/taskUtils';
import { useTasks } from '../hooks/useTasks';

export default function CalendarView({ tasks = [] }) {
  const { openCreateModal, openDetailModal } = useTasks();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => toLocalDateString(new Date()));
  const [calendarMode, setCalendarMode] = useState('month'); // 'month' | 'week' | 'day'

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleTodayJump = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(toLocalDateString(today));
  };

  // Month title: "November 2026"
  const monthTitle = currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  // Get month matrix
  const monthCells = getCalendarMonthMatrix(currentYear, currentMonth);

  // Group tasks by dueDate
  const tasksByDate = {};
  tasks.forEach(task => {
    if (!task.dueDate) return;
    const dStr = toLocalDateString(task.dueDate);
    if (!tasksByDate[dStr]) tasksByDate[dStr] = [];
    tasksByDate[dStr].push(task);
  });

  // Selected date tasks
  const selectedDateTasks = tasksByDate[selectedDate] || [];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)' }}>
      {/* Calendar Header Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
          paddingBottom: '0.85rem',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button onClick={handlePrevMonth} className="icon-btn" title="Previous Month">
              <ChevronLeft size={18} />
            </button>
            <button onClick={handleNextMonth} className="icon-btn" title="Next Month">
              <ChevronRight size={18} />
            </button>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {monthTitle}
          </h2>

          <button onClick={handleTodayJump} className="btn btn-secondary btn-sm">
            Today
          </button>
        </div>

        {/* View Mode Switcher (Month, Week, Day) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="view-mode-tabs" style={{ padding: '0.15rem' }}>
            <button
              onClick={() => setCalendarMode('month')}
              className={`view-tab-btn ${calendarMode === 'month' ? 'active' : ''}`}
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
            >
              Month
            </button>
            <button
              onClick={() => setCalendarMode('week')}
              className={`view-tab-btn ${calendarMode === 'week' ? 'active' : ''}`}
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
            >
              Week
            </button>
            <button
              onClick={() => setCalendarMode('day')}
              className={`view-tab-btn ${calendarMode === 'day' ? 'active' : ''}`}
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
            >
              Day
            </button>
          </div>

          <button
            onClick={() => openCreateModal({ dueDate: selectedDate })}
            className="btn btn-primary btn-sm"
          >
            <Plus size={14} />
            <span>Add on Date</span>
          </button>
        </div>
      </div>

      {/* MONTH VIEW */}
      {calendarMode === 'month' && (
        <div>
          {/* Day Names Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '0.5rem'
            }}
          >
            {daysOfWeek.map(d => (
              <div key={d} style={{ padding: '0.4rem 0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Month Matrix Grid */}
          <div
            className="calendar-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              backgroundColor: 'var(--border-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden'
            }}
          >
            {monthCells.map((cell, idx) => {
              const cellTasks = tasksByDate[cell.date] || [];
              const isCellToday = isToday(cell.date);
              const isSelected = selectedDate === cell.date;

              return (
                <div
                  key={idx}
                  className="calendar-day-cell"
                  onClick={() => setSelectedDate(cell.date)}
                  style={{
                    minHeight: '85px',
                    backgroundColor: isSelected
                      ? 'var(--bg-card-hover)'
                      : cell.isCurrentMonth
                      ? 'var(--bg-card)'
                      : 'var(--bg-subtle)',
                    padding: '0.45rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'background-color 0.15s ease',
                    border: isSelected ? '2px solid var(--accent-color)' : 'none',
                    opacity: cell.isCurrentMonth ? 1 : 0.6
                  }}
                >
                  {/* Day Number Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: isCellToday ? '22px' : 'auto',
                        height: isCellToday ? '22px' : 'auto',
                        borderRadius: '50%',
                        backgroundColor: isCellToday ? 'var(--accent-color)' : 'transparent',
                        color: isCellToday ? '#ffffff' : cell.isCurrentMonth ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontSize: '0.78rem',
                        fontWeight: isCellToday ? 700 : 500
                      }}
                    >
                      {cell.dayNumber}
                    </span>

                    {cellTasks.length > 0 && (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: 'var(--accent-color)',
                          backgroundColor: 'var(--accent-light)',
                          padding: '0.05rem 0.35rem',
                          borderRadius: '10px'
                        }}
                      >
                        {cellTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task Pills Preview */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                    {cellTasks.slice(0, 3).map(t => {
                      const p = PRIORITIES[t.priority] || PRIORITIES.medium;
                      const isDone = t.status === 'completed';
                      return (
                        <div
                          key={t.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailModal(t);
                          }}
                          title={t.title}
                          style={{
                            fontSize: '0.68rem',
                            padding: '2px 4px',
                            borderRadius: '3px',
                            backgroundColor: isDone ? 'rgba(16, 185, 129, 0.15)' : p.bg,
                            color: isDone ? '#10b981' : p.color,
                            borderLeft: `3px solid ${isDone ? '#10b981' : p.color}`,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textDecoration: isDone ? 'line-through' : 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {t.title}
                        </div>
                      );
                    })}
                    {cellTasks.length > 3 && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        +{cellTasks.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {calendarMode === 'week' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
          {monthCells.slice(0, 7).map((cell, idx) => {
            const cellTasks = tasksByDate[cell.date] || [];
            return (
              <div
                key={idx}
                className="card"
                onClick={() => setSelectedDate(cell.date)}
                style={{
                  minHeight: '200px',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  border: selectedDate === cell.date ? '2px solid var(--accent-color)' : '1px solid var(--border-color)'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {daysOfWeek[idx]} {cell.dayNumber}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {cellTasks.map(t => (
                    <div
                      key={t.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailModal(t);
                      }}
                      style={{
                        padding: '0.35rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-subtle)',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {t.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DAY VIEW */}
      {calendarMode === 'day' && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
            Day Focus: {selectedDate}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {selectedDateTasks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No tasks scheduled for this date.</p>
            ) : (
              selectedDateTasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => openDetailModal(t)}
                  className="card"
                  style={{ padding: '0.75rem 1rem', cursor: 'pointer' }}
                >
                  <strong style={{ fontSize: '0.9rem' }}>{t.title}</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Selected Date Drawer / Details Banner below Calendar */}
      <div
        style={{
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon size={18} color="var(--accent-color)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Tasks Due on {selectedDate} ({selectedDateTasks.length})
            </h4>
          </div>
          <button
            onClick={() => openCreateModal({ dueDate: selectedDate })}
            className="btn btn-secondary btn-sm"
          >
            <Plus size={13} />
            <span>Add Task for {selectedDate}</span>
          </button>
        </div>

        {selectedDateTasks.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No tasks due on this date. Click "Add Task for {selectedDate}" to schedule one.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {selectedDateTasks.map(task => (
              <div
                key={task.id}
                onClick={() => openDetailModal(task)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: PRIORITIES[task.priority]?.color || '#3b82f6'
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                    }}
                  >
                    {task.title}
                  </span>
                </div>
                <span className="badge" style={{ fontSize: '0.72rem' }}>
                  {task.status === 'completed' ? 'Completed' : task.priority.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
