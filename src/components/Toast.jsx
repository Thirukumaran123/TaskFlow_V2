import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';

export default function ToastContainer() {
  const { toasts, removeToast } = useTasks();

  if (!toasts || toasts.length === 0) return null;

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} color="#10b981" />;
      case 'danger':
        return <AlertCircle size={16} color="#ef4444" />;
      case 'warning':
        return <AlertTriangle size={16} color="#f59e0b" />;
      case 'info':
      default:
        return <Info size={16} color="var(--accent-color)" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        maxWidth: '380px',
        width: '100%',
        pointerEvents: 'none'
      }}
    >
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            borderLeft: toast.type === 'success' ? '4px solid #10b981' :
                        toast.type === 'danger' ? '4px solid #ef4444' :
                        toast.type === 'warning' ? '4px solid #f59e0b' : '4px solid var(--accent-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {getToastIcon(toast.type)}
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
              {toast.message}
            </span>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="icon-btn"
            style={{ width: '22px', height: '22px' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
