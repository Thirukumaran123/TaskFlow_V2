import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Sun,
  Calendar,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  Flag,
  FolderKanban,
  Settings,
  X,
  Sparkles,
  Zap
} from 'lucide-react';
import { useTasks } from '../hooks/useTasks';

export default function Sidebar() {
  const {
    activePage,
    setActivePage,
    statistics,
    isSidebarOpen,
    setIsSidebarOpen,
    setDateFilter,
    setPriorityFilter,
    setStatusFilter
  } = useTasks();

  const {
    total = 0,
    completed = 0,
    today = 0,
    upcoming = 0,
    overdue = 0,
    completionPercentage = 0
  } = statistics;

  const handleNavClick = (pageId, customAction) => {
    setActivePage(pageId);
    if (customAction) customAction();
    setIsSidebarOpen(false); // Close mobile drawer
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'all',
      label: 'All Tasks',
      icon: CheckSquare,
      badge: total,
      action: () => {
        setDateFilter('all');
        setStatusFilter('all');
        setPriorityFilter('all');
      }
    },
    {
      id: 'my-day',
      label: 'My Day',
      icon: Sun,
      badge: today,
      highlight: today > 0,
      action: () => setDateFilter('today')
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      badge: null
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: CalendarDays,
      badge: upcoming,
      action: () => setDateFilter('upcoming')
    },
    {
      id: 'overdue',
      label: 'Overdue',
      icon: AlertCircle,
      badge: overdue,
      badgeColor: overdue > 0 ? '#ef4444' : null,
      action: () => setDateFilter('overdue')
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle2,
      badge: completed,
      action: () => setStatusFilter('completed')
    },
    {
      id: 'priority',
      label: 'Priority',
      icon: Flag,
      badge: null
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: FolderKanban,
      badge: null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 998,
            display: 'none'
          }}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`sidebar-container ${isSidebarOpen ? 'mobile-open' : ''}`}
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          flexShrink: 0,
          userSelect: 'none'
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, var(--accent-color) 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)'
              }}
            >
              <Zap size={19} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  TaskFlow
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.35rem',
                    borderRadius: '4px',
                    backgroundColor: 'var(--accent-light)',
                    color: 'var(--accent-color)'
                  }}
                >
                  PRO
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Smart Task Manager
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="icon-btn"
            style={{ display: isSidebarOpen ? 'flex' : 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.85rem 0.65rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem'
          }}
        >
          {navItems.map(item => {
            const isActive = activePage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.action)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                  color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon
                    size={17}
                    color={isActive ? 'var(--accent-color)' : 'var(--text-secondary)'}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && item.badge > 0 && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: item.badgeColor ? 'rgba(239, 68, 68, 0.15)' : isActive ? 'var(--accent-light)' : 'var(--bg-subtle)',
                      color: item.badgeColor || (isActive ? 'var(--accent-color)' : 'var(--text-secondary)')
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Progress Widget */}
        <div
          style={{
            padding: '1.1rem',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Overall Progress
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-color)' }}>
              {completionPercentage}%
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${completionPercentage}%`,
                height: '100%',
                backgroundColor: 'var(--accent-color)',
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>{completed} of {total} done</span>
            <span>{total - completed} pending</span>
          </div>
        </div>
      </aside>
    </>
  );
}
