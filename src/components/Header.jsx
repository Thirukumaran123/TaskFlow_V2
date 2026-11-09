import React from 'react';
import {
  Menu,
  Plus,
  Moon,
  Sun,
  Bell,
  CheckCircle2,
  Calendar as CalendarIcon
} from 'lucide-react';
import SearchBar from './SearchBar';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../hooks/useTheme';
import { formatDateMedium } from '../utils/dateUtils';
import { requestNotificationPermission, getNotificationPermission, playChimeSound } from '../utils/notificationUtils';

export default function Header() {
  const { openCreateModal, setIsSidebarOpen, activePage, addToast } = useTasks();
  const { isDarkMode, toggleDarkLight } = useTheme();

  // Current formatted date: "Monday, Nov 9, 2026"
  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleNotificationRequest = async () => {
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      playChimeSound('success');
      addToast('Browser notifications enabled! Reminders will notify you.', 'success');
    } else if (permission === 'denied') {
      addToast('Notifications were denied in browser permissions.', 'warning');
    } else {
      addToast('Notifications are not supported in this environment.', 'info');
    }
  };

  return (
    <header
      className="app-header"
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: '1rem'
      }}
    >
      {/* Left side: Hamburger (mobile) + Today's Date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => setIsSidebarOpen(prev => !prev)}
          className="icon-btn"
          style={{ display: 'none' }} /* Will be displayed via responsive.css on mobile */
          id="mobile-menu-btn"
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <CalendarIcon size={15} color="var(--accent-color)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            {todayFormatted}
          </span>
        </div>
      </div>

      {/* Middle: Live Search Bar */}
      <div className="header-search" style={{ flex: 1, maxWidth: '420px' }}>
        <SearchBar />
      </div>

      {/* Right side: Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* Notification Bell */}
        <button
          onClick={handleNotificationRequest}
          className="icon-btn"
          title="Enable/Test Browser Reminders"
        >
          <Bell size={18} />
        </button>

        {/* Theme Dark/Light Mode Switcher */}
        <button
          onClick={toggleDarkLight}
          className="icon-btn"
          title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDarkMode ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} />}
        </button>

        {/* Primary "+ New Task" Button */}
        <button
          onClick={() => openCreateModal()}
          className="btn btn-primary"
          style={{ padding: '0.5rem 1rem' }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
