import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';

export default function SearchBar({ placeholder = 'Search tasks (title, description, tags, notes)...' }) {
  const { searchQuery, setSearchQuery, filteredTasks } = useTasks();
  const inputRef = useRef(null);

  // Global keyboard shortcut to focus search: '/' or 'Ctrl+K'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') ||
          (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '460px'
      }}
    >
      <Search
        size={16}
        color="var(--text-muted)"
        style={{
          position: 'absolute',
          left: '0.85rem',
          pointerEvents: 'none'
        }}
      />
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="form-control"
        style={{
          paddingLeft: '2.4rem',
          paddingRight: searchQuery ? '4.5rem' : '2.8rem',
          height: '38px',
          fontSize: '0.875rem',
          borderRadius: 'var(--radius-full)'
        }}
      />
      {searchQuery ? (
        <button
          onClick={() => setSearchQuery('')}
          className="icon-btn"
          title="Clear search"
          style={{
            position: 'absolute',
            right: '0.5rem',
            width: '24px',
            height: '24px'
          }}
        >
          <X size={14} />
        </button>
      ) : (
        <span
          style={{
            position: 'absolute',
            right: '0.75rem',
            fontSize: '0.7rem',
            padding: '0.1rem 0.35rem',
            borderRadius: '4px',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-color)',
            pointerEvents: 'none'
          }}
        >
          /
        </span>
      )}
    </div>
  );
}
