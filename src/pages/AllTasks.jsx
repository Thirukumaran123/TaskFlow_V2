import React from 'react';
import {
  List,
  Kanban,
  Calendar as CalendarIcon,
  Layers,
  Flag,
  FolderKanban,
  Plus,
  CheckSquare
} from 'lucide-react';
import FilterPanel from '../components/FilterPanel';
import TaskList from '../components/TaskList';
import KanbanBoard from '../components/KanbanBoard';
import CalendarView from '../components/CalendarView';
import { useTasks } from '../hooks/useTasks';

export default function AllTasks() {
  const {
    filteredTasks,
    viewMode,
    setViewMode,
    openCreateModal,
    activeFiltersCount
  } = useTasks();

  const viewModes = [
    { id: 'list', label: 'List View', icon: List },
    { id: 'board', label: 'Kanban Board', icon: Kanban },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'group-date', label: 'By Date', icon: Layers },
    { id: 'group-priority', label: 'By Priority', icon: Flag },
    { id: 'group-category', label: 'By Category', icon: FolderKanban }
  ];

  return (
    <div className="all-tasks-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-title">
            <CheckSquare size={24} color="var(--accent-color)" />
            <span>All Tasks</span>
            <span className="badge-count" style={{ fontSize: '0.85rem' }}>
              {filteredTasks.length}
            </span>
          </div>
          <span className="page-subtitle">
            Manage, filter, and organize all your tasks across multiple views
          </span>
        </div>

        {/* View Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="view-mode-tabs">
            {viewModes.map(vm => {
              const Icon = vm.icon;
              const isActive = viewMode === vm.id;
              return (
                <button
                  key={vm.id}
                  onClick={() => setViewMode(vm.id)}
                  className={`view-tab-btn ${isActive ? 'active' : ''}`}
                  title={vm.label}
                >
                  <Icon size={14} />
                  <span>{vm.label}</span>
                </button>
              );
            })}
          </div>

          <button onClick={() => openCreateModal()} className="btn btn-primary">
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <FilterPanel />

      {/* Render Active View Mode */}
      {viewMode === 'board' ? (
        <KanbanBoard tasks={filteredTasks} />
      ) : viewMode === 'calendar' ? (
        <CalendarView tasks={filteredTasks} />
      ) : viewMode === 'group-date' ? (
        <TaskList tasks={filteredTasks} grouping="group-date" />
      ) : viewMode === 'group-priority' ? (
        <TaskList tasks={filteredTasks} grouping="group-priority" />
      ) : viewMode === 'group-category' ? (
        <TaskList tasks={filteredTasks} grouping="group-category" />
      ) : (
        <TaskList tasks={filteredTasks} grouping="none" />
      )}
    </div>
  );
}
