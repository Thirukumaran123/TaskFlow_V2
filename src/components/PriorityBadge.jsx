import React from 'react';
import { AlertCircle, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PRIORITIES } from '../utils/taskUtils';

export default function PriorityBadge({ priority = 'medium', size = 'normal', showIcon = true }) {
  const p = PRIORITIES[priority] || PRIORITIES.medium;

  const getIcon = () => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle size={size === 'small' ? 12 : 14} />;
      case 'high':
        return <AlertTriangle size={size === 'small' ? 12 : 14} />;
      case 'medium':
        return <ArrowUpRight size={size === 'small' ? 12 : 14} />;
      case 'low':
      default:
        return <ArrowDownRight size={size === 'small' ? 12 : 14} />;
    }
  };

  return (
    <span
      className="badge"
      style={{
        backgroundColor: p.bg,
        color: p.color,
        border: `1px solid ${p.border}`,
        fontSize: size === 'small' ? '0.7rem' : '0.78rem',
        padding: size === 'small' ? '0.15rem 0.45rem' : '0.2rem 0.6rem'
      }}
      title={p.fullLabel}
    >
      {showIcon && getIcon()}
      <span>{p.label}</span>
    </span>
  );
}
