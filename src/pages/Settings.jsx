import React, { useRef } from 'react';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  Bell,
  Volume2,
  VolumeX,
  ShieldAlert,
  Info,
  CheckCircle2,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';
import ThemeSelector from '../components/ThemeSelector';
import { useTasks } from '../hooks/useTasks';
import { requestNotificationPermission, getNotificationPermission, playChimeSound } from '../utils/notificationUtils';

export default function Settings() {
  const {
    settings,
    setSettings,
    handleExportJSON,
    handleExportCSV,
    handleImportJSON,
    openClearAllConfirm,
    resetSampleTasks,
    addToast
  } = useTasks();

  const fileInputRef = useRef(null);

  const permission = getNotificationPermission();

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    if (res === 'granted') {
      playChimeSound('success');
      addToast('Notification permission granted!', 'success');
    } else {
      addToast('Notification permission not granted.', 'warning');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        handleImportJSON(text);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="settings-page" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-title">
            <SettingsIcon size={26} color="var(--accent-color)" />
            <span>Preferences & Settings</span>
          </div>
          <span className="page-subtitle">
            Configure appearance, notifications, default views, and data persistence
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* 1. Appearance & Themes */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Appearance & Themes
          </h3>
          <ThemeSelector />
        </div>

        {/* 2. Default Preferences */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Application Defaults
          </h3>

          <div className="grid-2" style={{ gap: '1.25rem' }}>
            {/* Default View Mode */}
            <div className="form-group">
              <label className="form-label">Default Task View</label>
              <select
                value={settings.defaultView || 'list'}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultView: e.target.value }))}
                className="form-control"
              >
                <option value="list">List View</option>
                <option value="board">Kanban Board</option>
                <option value="calendar">Calendar View</option>
                <option value="group-date">Grouped by Date</option>
                <option value="group-priority">Grouped by Priority</option>
                <option value="group-category">Grouped by Category</option>
              </select>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                View presented upon launching the All Tasks page.
              </span>
            </div>

            {/* Default Sorting */}
            <div className="form-group">
              <label className="form-label">Default Task Sorting</label>
              <select
                value={settings.defaultSort || 'priority-desc'}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultSort: e.target.value }))}
                className="form-control"
              >
                <option value="priority-desc">Urgent First (Highest Priority)</option>
                <option value="due-asc">Due Date (Earliest First)</option>
                <option value="due-desc">Due Date (Latest First)</option>
                <option value="created-desc">Created Date (Newest First)</option>
                <option value="created-asc">Created Date (Oldest First)</option>
                <option value="alpha-asc">Alphabetical (A to Z)</option>
              </select>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Initial order applied to task lists.
              </span>
            </div>
          </div>
        </div>

        {/* 3. Notifications & Audio Chimes */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Reminders & Sound Notifications
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Browser Permission Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={18} color="var(--accent-color)" />
                  <strong style={{ fontSize: '0.925rem' }}>Browser Push Notifications</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Current browser status:{' '}
                  <span
                    style={{
                      fontWeight: 700,
                      color: permission === 'granted' ? '#10b981' : permission === 'denied' ? '#ef4444' : 'var(--text-muted)'
                    }}
                  >
                    {permission.toUpperCase()}
                  </span>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleRequestPermission}
                  className="btn btn-secondary btn-sm"
                >
                  Request / Test Permission
                </button>
                <button
                  onClick={() => playChimeSound('alert')}
                  className="btn btn-secondary btn-sm"
                  title="Test notification chime sound"
                >
                  <Volume2 size={14} />
                  Test Sound
                </button>
              </div>
            </div>

            {/* Sound Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div>
                <strong style={{ fontSize: '0.925rem' }}>Completion & Alert Sounds</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Play subtle Web Audio synthesizer chimes when tasks are completed or reminders trigger
                </p>
              </div>

              <button
                onClick={() => setSettings(prev => ({ ...prev, enableSounds: !prev.enableSounds }))}
                className="btn btn-secondary btn-sm"
              >
                {settings.enableSounds ? <Volume2 size={15} color="#10b981" /> : <VolumeX size={15} />}
                <span>{settings.enableSounds ? 'Sounds Enabled' : 'Sounds Muted'}</span>
              </button>
            </div>

            {/* Important Disclaimer Note as required by prompt */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                borderLeft: '4px solid var(--accent-color)',
                display: 'flex',
                gap: '0.65rem'
              }}
            >
              <Info size={18} color="var(--accent-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                <strong>Browser Notification Architecture Notice:</strong>
                <br />
                TaskFlow uses the standard HTML5 Web Notification API. Reminders trigger while TaskFlow is running in your browser (including when minimized or in a background tab). If the browser window is completely closed, reminders will not dispatch until reopened, as no remote server or backend push daemon is configured for this client-side version.
              </div>
            </div>
          </div>
        </div>

        {/* 4. Data Management & LocalStorage */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Data Persistence & Management
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* LocalStorage Profile Explanation */}
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Your tasks and preferences are stored locally in your browser's <code>LocalStorage</code>.
              Data remains safely preserved across browser sessions and offline reloads. Because data resides in your current browser profile, export a JSON backup to migrate tasks to another computer or browser.
            </div>

            {/* Export & Import Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem' }}>
              <button onClick={handleExportJSON} className="btn btn-secondary">
                <FileCode size={16} color="var(--accent-color)" />
                <span>Export as JSON</span>
              </button>

              <button onClick={handleExportCSV} className="btn btn-secondary">
                <FileSpreadsheet size={16} color="#10b981" />
                <span>Export as CSV</span>
              </button>

              {/* Import JSON */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-secondary"
              >
                <Upload size={16} color="#6366f1" />
                <span>Import JSON Backup</span>
              </button>

              <button onClick={resetSampleTasks} className="btn btn-secondary">
                <RotateCcw size={16} color="#f59e0b" />
                <span>Restore Sample Data</span>
              </button>
            </div>

            {/* Danger Zone: Clear All Tasks */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <strong style={{ fontSize: '0.925rem', color: '#ef4444' }}>Danger Zone: Reset Data</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Permanently delete all tasks and reset to a clean empty state.
                  </p>
                </div>

                <button
                  onClick={openClearAllConfirm}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 size={14} />
                  <span>Clear All Tasks</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
