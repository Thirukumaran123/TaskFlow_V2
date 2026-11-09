import React from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sun,
  CalendarDays,
  Percent,
  Plus,
  ArrowRight,
  Sparkles,
  Flame
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import StatisticsCharts from '../components/StatisticsCharts';
import TaskCard from '../components/TaskCard';
import { useTasks } from '../hooks/useTasks';
import { isOverdue, isToday } from '../utils/dateUtils';

export default function Dashboard() {
  const {
    tasks,
    statistics,
    setActivePage,
    openCreateModal,
    setDateFilter,
    setPriorityFilter
  } = useTasks();

  const {
    total = 0,
    completed = 0,
    pending = 0,
    overdue = 0,
    today = 0,
    upcoming = 0,
    completionPercentage = 0
  } = statistics;

  // Time-based welcome message
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Urgent tasks needing attention (urgent or high priority & pending)
  const urgentTasks = tasks
    .filter(t => t.status !== 'completed' && (t.priority === 'urgent' || t.priority === 'high' || isOverdue(t.dueDate, t.status)))
    .slice(0, 4);

  // Recent tasks (sorted by updatedAt or createdAt)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          marginBottom: '1.75rem',
          padding: '1.75rem 2rem',
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-subtle) 100%)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '1.35rem' }}>👋</span>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {getGreeting()}, welcome to TaskFlow!
            </h1>
          </div>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
            Here is your productivity overview for today. You have{' '}
            <strong style={{ color: 'var(--accent-color)' }}>{today} tasks due today</strong>
            {overdue > 0 && (
              <>
                {' '}and <strong style={{ color: '#ef4444' }}>{overdue} overdue task{overdue > 1 ? 's' : ''}</strong>
              </>
            )}.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => {
              setDateFilter('today');
              setActivePage('my-day');
            }}
            className="btn btn-secondary"
          >
            <Sun size={15} color="var(--accent-color)" />
            <span>Open My Day</span>
          </button>
          <button
            onClick={() => openCreateModal()}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* 7 Metric Cards */}
      <div
        className="grid-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <DashboardCard
          title="Total Tasks"
          value={total}
          subtitle="All recorded tasks"
          icon={CheckSquare}
          color="var(--accent-color)"
          bg="var(--accent-light)"
          onClick={() => setActivePage('all')}
        />
        <DashboardCard
          title="Completed"
          value={completed}
          subtitle={`${completionPercentage}% completion rate`}
          icon={CheckCircle2}
          color="#10b981"
          bg="rgba(16, 185, 129, 0.12)"
          onClick={() => setActivePage('completed')}
        />
        <DashboardCard
          title="Pending"
          value={pending}
          subtitle="Tasks in progress or to do"
          icon={Clock}
          color="#6366f1"
          bg="rgba(99, 102, 241, 0.12)"
          onClick={() => setActivePage('all')}
        />
        <DashboardCard
          title="Overdue"
          value={overdue}
          subtitle={overdue > 0 ? "Requires attention" : "All caught up!"}
          icon={AlertTriangle}
          color={overdue > 0 ? "#ef4444" : "#10b981"}
          bg={overdue > 0 ? "rgba(239, 68, 68, 0.12)" : "rgba(16, 185, 129, 0.12)"}
          onClick={() => setActivePage('overdue')}
        />
        <DashboardCard
          title="Due Today"
          value={today}
          subtitle="Scheduled for today"
          icon={Sun}
          color="#f59e0b"
          bg="rgba(245, 158, 11, 0.12)"
          onClick={() => setActivePage('my-day')}
        />
        <DashboardCard
          title="Upcoming"
          value={upcoming}
          subtitle="Next 30 days"
          icon={CalendarDays}
          color="#0ea5e9"
          bg="rgba(14, 165, 233, 0.12)"
          onClick={() => setActivePage('upcoming')}
        />
        <DashboardCard
          title="Completion"
          value={`${completionPercentage}%`}
          subtitle={`${completed}/${total} resolved`}
          icon={Percent}
          color="#8b5cf6"
          bg="rgba(139, 92, 246, 0.12)"
        />
      </div>

      {/* Task Statistics Charts */}
      <StatisticsCharts statistics={statistics} tasks={tasks} />

      {/* Two Column Section: Priority Focus & Recent Tasks */}
      <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Urgent & Attention Tasks */}
        <div className="card" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={18} color="#ef4444" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Urgent & Critical Focus
              </h3>
            </div>
            <button
              onClick={() => {
                setPriorityFilter('urgent');
                setActivePage('priority');
              }}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {urgentTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <Sparkles size={24} color="#10b981" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem' }}>No urgent blockers or overdue items right now! 🎉</p>
            </div>
          ) : (
            <div>
              {urgentTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="card" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--accent-color)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Recently Updated
              </h3>
            </div>
            <button
              onClick={() => setActivePage('all')}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <span>View All Tasks</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {recentTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.85rem' }}>No recent tasks found.</p>
            </div>
          ) : (
            <div>
              {recentTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
