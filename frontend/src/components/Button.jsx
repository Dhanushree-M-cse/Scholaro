import React from 'react';
import './Button.css';

/**
 * Reusable Button Component
 * @param {Object} props
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'|'success'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.isLoading=false]
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.fullWidth=false]
 * @param {React.ReactNode} [props.iconLeft]
 * @param {React.ReactNode} [props.iconRight]
 * @param {Function} [props.onClick]
 * @param {string} [props.type='button']
 * @param {React.ReactNode} props.children
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  children,
  className = '',
  type = 'button',
  onClick,
  ...rest
}) => {
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full-width' : '',
    isLoading ? 'btn-loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading && (
        <span className="btn-spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2 a 10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        </span>
      )}
      {!isLoading && iconLeft && <span className="btn-icon btn-icon-left">{iconLeft}</span>}
      <span className="btn-label">{children}</span>
      {!isLoading && iconRight && <span className="btn-icon btn-icon-right">{iconRight}</span>}
    </button>
  );
};

export default Button;
