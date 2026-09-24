import React from 'react';
import './EmptyState.css';

/**
 * Reusable EmptyState Component
 * @param {React.ReactNode} [props.icon] - Icon element to display
 * @param {string} props.title - Main empty state heading
 * @param {string} [props.description] - Supporting text
 * @param {React.ReactNode} [props.action] - CTA button or element
 * @param {'sm'|'md'|'lg'} [props.size='md']
 */
const EmptyState = ({
  icon,
  title,
  description,
  action,
  size = 'md',
  className = '',
}) => {
  const defaultIcon = (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );

  return (
    <div className={`empty-state empty-state--${size} ${className}`} role="status">
      <div className="empty-state-icon" aria-hidden="true">
        {icon || defaultIcon}
      </div>
      <h2 className="empty-state-title">{title}</h2>
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
      {action && (
        <div className="empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
