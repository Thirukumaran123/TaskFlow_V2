import React, { useState } from 'react';
import {
  Filter,
  Calendar,
  AlertCircle,
  Tag,
  CheckCircle2,
  ArrowUpDown,
  RotateCcw,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { DATE_FILTER_OPTIONS } from '../utils/dateUtils';
import { PRIORITIES } from '../utils/taskUtils';

export default function FilterPanel() {
  const {
    dateFilter,
    setDateFilter,
    customDateRange,
    setCustomDateRange,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    categories,
    activeFiltersCount,
    clearFilters
  } = useTasks();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="card"
      style={{
        padding: '0.85rem 1.1rem',
        marginBottom: '1.25rem',
        backgroundColor: 'var(--bg-surface)'
      }}
    >
      {/* Top Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
            <SlidersHorizontal size={15} />
            <span>Filters:</span>
          </div>

          {/* 1. Date Filter Select */}
          <div style={{ position: 'relative', minWidth: '150px' }}>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="form-control"
              style={{
                height: '34px',
                padding: '0.2rem 1.8rem 0.2rem 0.65rem',
                fontSize: '0.825rem',
                backgroundColor: dateFilter !== 'all' ? 'var(--accent-light)' : 'var(--bg-subtle)',
                color: dateFilter !== 'all' ? 'var(--accent-color)' : 'var(--text-primary)',
                fontWeight: dateFilter !== 'all' ? 600 : 400
              }}
            >
              <optgroup label="Quick Filters">
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="overdue">Overdue Tasks</option>
              </optgroup>
              <optgroup label="Upcoming Horizons">
                <option value="this_week">This Week</option>
                <option value="next_7_days">Next 7 Days</option>
                <option value="this_month">This Month</option>
                <option value="next_30_days">Next 30 Days</option>
                <option value="upcoming">Upcoming Tasks</option>
              </optgroup>
              <optgroup label="Historical Filters">
                <option value="yesterday">Yesterday</option>
                <option value="previous_days">Previous Days</option>
                <option value="last_week">Last Week</option>
                <option value="previous_months">Previous Months</option>
              </optgroup>
              <optgroup label="Special">
                <option value="no_due_date">No Due Date</option>
                <option value="custom">Custom Date Range...</option>
              </optgroup>
            </select>
          </div>

          {/* 2. Priority Filter Select */}
          <div style={{ position: 'relative', minWidth: '130px' }}>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="form-control"
              style={{
                height: '34px',
                padding: '0.2rem 1.8rem 0.2rem 0.65rem',
                fontSize: '0.825rem',
                backgroundColor: priorityFilter !== 'all' ? 'var(--accent-light)' : 'var(--bg-subtle)',
                color: priorityFilter !== 'all' ? 'var(--accent-color)' : 'var(--text-primary)',
                fontWeight: priorityFilter !== 'all' ? 600 : 400
              }}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent / Critical</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* 3. Category Filter Select */}
          <div style={{ position: 'relative', minWidth: '130px' }}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-control"
              style={{
                height: '34px',
                padding: '0.2rem 1.8rem 0.2rem 0.65rem',
                fontSize: '0.825rem',
                backgroundColor: categoryFilter !== 'all' ? 'var(--accent-light)' : 'var(--bg-subtle)',
                color: categoryFilter !== 'all' ? 'var(--accent-color)' : 'var(--text-primary)',
                fontWeight: categoryFilter !== 'all' ? 600 : 400
              }}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* 4. Status Filter Select */}
          <div style={{ position: 'relative', minWidth: '120px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
              style={{
                height: '34px',
                padding: '0.2rem 1.8rem 0.2rem 0.65rem',
                fontSize: '0.825rem',
                backgroundColor: statusFilter !== 'all' ? 'var(--accent-light)' : 'var(--bg-subtle)',
                color: statusFilter !== 'all' ? 'var(--accent-color)' : 'var(--text-primary)',
                fontWeight: statusFilter !== 'all' ? 600 : 400
              }}
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Sorting & Clear Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <ArrowUpDown size={14} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
              style={{
                height: '34px',
                padding: '0.2rem 0.65rem',
                fontSize: '0.825rem',
                minWidth: '155px',
                backgroundColor: 'var(--bg-subtle)'
              }}
            >
              <option value="priority-desc">Urgent First</option>
              <option value="due-asc">Due Date (Earliest)</option>
              <option value="due-desc">Due Date (Latest)</option>
              <option value="created-desc">Newest Created</option>
              <option value="created-asc">Oldest Created</option>
              <option value="updated-desc">Recently Updated</option>
              <option value="alpha-asc">Title (A - Z)</option>
              <option value="alpha-desc">Title (Z - A)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: '#ef4444',
                borderColor: 'rgba(239, 68, 68, 0.3)'
              }}
              title="Reset all active filters"
            >
              <RotateCcw size={13} />
              <span>Clear ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Custom Date Range Picker Accordion (visible when 'custom' is selected) */}
      {dateFilter === 'custom' && (
        <div
          style={{
            marginTop: '0.85rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Custom Range:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From:</label>
            <input
              type="date"
              value={customDateRange.start}
              onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="form-control"
              style={{ height: '32px', fontSize: '0.8rem', width: 'auto' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>To:</label>
            <input
              type="date"
              value={customDateRange.end}
              onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="form-control"
              style={{ height: '32px', fontSize: '0.8rem', width: 'auto' }}
            />
          </div>
          {(customDateRange.start || customDateRange.end) && (
            <button
              onClick={() => setCustomDateRange({ start: '', end: '' })}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              Reset Dates
            </button>
          )}
        </div>
      )}
    </div>
  );
}
