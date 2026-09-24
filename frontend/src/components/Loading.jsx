import React from 'react';
import './Loading.css';

/**
 * Reusable Loading Component
 * @param {'page'|'inline'|'overlay'} [props.variant='inline']
 * @param {string} [props.text='Loading...']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 */
const Loading = ({ variant = 'inline', text = 'Loading...', size = 'md' }) => {
  if (variant === 'page') {
    return (
      <div className="loading-page" role="status" aria-live="polite">
        <div className={`loading-spinner loading-spinner--${size}`} aria-hidden="true" />
        <p className="loading-text">{text}</p>
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className="loading-overlay" role="status" aria-live="polite">
        <div className="loading-overlay-box">
          <div className={`loading-spinner loading-spinner--${size}`} aria-hidden="true" />
          <p className="loading-text">{text}</p>
        </div>
      </div>
    );
  }

  // inline (default)
  return (
    <div className="loading-inline" role="status" aria-live="polite">
      <div className={`loading-spinner loading-spinner--${size}`} aria-hidden="true" />
      {text && <span className="loading-text loading-text--inline">{text}</span>}
    </div>
  );
};

export default Loading;
