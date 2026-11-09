import React from 'react';
import { PRIORITIES } from '../utils/taskUtils';
import { toLocalDateString } from '../utils/dateUtils';

export default function StatisticsCharts({ statistics, tasks = [] }) {
  const {
    total = 0,
    completed = 0,
    pending = 0,
    completionPercentage = 0,
    priorityCounts = {},
    categoryCounts = {}
  } = statistics;

  // Donut chart calculations (circumference = 2 * PI * r)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  // 7-day completion activity calculation
  const getPast7DaysActivity = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = toLocalDateString(d);
      const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });

      // Count tasks completed on this date
      const count = tasks.filter(t => {
        if (t.status !== 'completed' || !t.completedAt) return false;
        return toLocalDateString(t.completedAt) === dateStr;
      }).length;

      days.push({ dayName, dateStr, count });
    }
    return days;
  };

  const activity7Days = getPast7DaysActivity();
  const maxActivity = Math.max(1, ...activity7Days.map(d => d.count));

  return (
    <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
      {/* 1. Completion & Velocity Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          Task Completion Progress
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1.5rem' }}>
          {/* SVG Donut */}
          <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              {/* Background circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="var(--bg-subtle)"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="var(--accent-color)"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>

            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <span style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {completionPercentage}%
              </span>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Done
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '150px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Completed Tasks</span>
              <strong style={{ fontSize: '0.95rem', color: '#10b981' }}>{completed}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pending Tasks</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--accent-color)' }}>{pending}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Tracked</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{total}</strong>
            </div>
          </div>
        </div>

        {/* 7-Day Completion Mini Bar Chart */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Recent 7-Day Velocity
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tasks finished/day</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '60px', gap: '0.5rem' }}>
            {activity7Days.map((item, idx) => {
              const heightPercent = item.count > 0 ? Math.max(20, Math.round((item.count / maxActivity) * 100)) : 8;
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div
                      title={`${item.count} completed on ${item.dateStr}`}
                      style={{
                        width: '75%',
                        height: `${heightPercent}%`,
                        backgroundColor: item.count > 0 ? 'var(--accent-color)' : 'var(--bg-subtle)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s ease'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {item.dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Priority Distribution Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          Priority Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { key: 'urgent', p: PRIORITIES.urgent },
            { key: 'high', p: PRIORITIES.high },
            { key: 'medium', p: PRIORITIES.medium },
            { key: 'low', p: PRIORITIES.low }
          ].map(({ key, p }) => {
            const count = priorityCounts[key] || 0;
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.color }} />
                    {p.label}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <strong>{count}</strong> ({percent}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${percent}%`,
                      height: '100%',
                      backgroundColor: p.color,
                      borderRadius: '4px',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Categories Distribution Footer */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Categories
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {Object.entries(categoryCounts).map(([cat, cnt]) => (
              <span
                key={cat}
                className="badge"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.72rem'
                }}
              >
                {cat}: <strong>{cnt}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
