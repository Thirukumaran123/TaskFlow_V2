import React from 'react';

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'var(--accent-color)',
  bg = 'var(--accent-light)',
  onClick
}) {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-muted)'
          }}
        >
          {title}
        </span>
        <h2
          style={{
            fontSize: '1.85rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginTop: '0.2rem',
            lineHeight: 1.1
          }}
        >
          {value}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              marginTop: '0.35rem'
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: bg,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
}
