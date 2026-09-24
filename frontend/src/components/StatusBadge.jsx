import React from 'react';
import './StatusBadge.css';

/**
 * Reusable StatusBadge Component
 * @param {'eligible'|'not-eligible'|'recommended'|'saved'|'verified'|'pending'|'info'} props.status
 * @param {string} [props.label] - Override default label text
 * @param {'sm'|'md'} [props.size='md']
 */
const STATUS_CONFIG = {
  eligible: {
    label: 'Eligible',
    className: 'badge--success',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  'not-eligible': {
    label: 'Not Eligible',
    className: 'badge--error',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
        <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
      </svg>
    ),
  },
  recommended: {
    label: 'Recommended',
    className: 'badge--primary',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  saved: {
    label: 'Saved',
    className: 'badge--info',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
      </svg>
    ),
  },
  verified: {
    label: 'Verified',
    className: 'badge--success',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  pending: {
    label: 'Pending',
    className: 'badge--warning',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
};

const StatusBadge = ({ status, label, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || {
    label: label || status,
    className: 'badge--info',
    icon: null,
  };

  return (
    <span className={`status-badge ${config.className} badge--${size}`}>
      {config.icon && <span className="badge-icon" aria-hidden="true">{config.icon}</span>}
      <span className="badge-text">{label || config.label}</span>
    </span>
  );
};

export default StatusBadge;
