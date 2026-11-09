import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider, useTasks } from './context/TaskContext';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskModal from './components/TaskModal';
import TaskDetailModal from './components/TaskDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ToastContainer from './components/Toast';

import Dashboard from './pages/Dashboard';
import AllTasks from './pages/AllTasks';
import MyDay from './pages/MyDay';
import CalendarPage from './pages/CalendarPage';
import Upcoming from './pages/Upcoming';
import Overdue from './pages/Overdue';
import Completed from './pages/Completed';
import PriorityPage from './pages/PriorityPage';
import CategoriesPage from './pages/CategoriesPage';
import Settings from './pages/Settings';

import './styles/themes.css';
import './styles/global.css';
import './styles/responsive.css';

function MainApp() {
  const { activePage } = useTasks();

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'all':
        return <AllTasks />;
      case 'my-day':
        return <MyDay />;
      case 'calendar':
        return <CalendarPage />;
      case 'upcoming':
        return <Upcoming />;
      case 'overdue':
        return <Overdue />;
      case 'completed':
        return <Completed />;
      case 'priority':
        return <PriorityPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header />
        <main className="main-content">
          {renderActivePage()}
        </main>
      </div>

      {/* Modals & Portals */}
      <TaskModal />
      <TaskDetailModal />
      <DeleteConfirmModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <MainApp />
      </TaskProvider>
    </ThemeProvider>
  );
}
