import React from 'react';
import './Card.css';

/**
 * Reusable Card Component
 * @param {Object} props
 * @param {'default'|'flat'|'elevated'} [props.variant='default']
 * @param {boolean} [props.hoverable=false]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
const Card = ({
  variant = 'default',
  hoverable = false,
  className = '',
  children,
  onClick,
  ...rest
}) => {
  const classNames = [
    'card',
    `card--${variant}`,
    hoverable ? 'card--hoverable' : '',
    onClick ? 'card--clickable' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e); } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>{children}</div>
);

export default Card;
