import React from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import CalendarView from '../components/CalendarView';
import { useTasks } from '../hooks/useTasks';

export default function CalendarPage() {
  const { tasks, openCreateModal } = useTasks();

  return (
    <div className="calendar-page">
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-title">
            <CalendarIcon size={26} color="var(--accent-color)" />
            <span>Interactive Calendar</span>
          </div>
          <span className="page-subtitle">
            Visual month, week, and day schedule of upcoming deliverables and deadlines
          </span>
        </div>

        <button onClick={() => openCreateModal()} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>

      <CalendarView tasks={tasks} />
    </div>
  );
}
