import React from 'react';

/**
 * PlaceholderPage — Generic placeholder for routes not yet built.
 * Accepts a `title` and `description` prop.
 */
const PlaceholderPage = ({ title = 'Coming Soon', description = 'This page will be built in a future step.' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      gap: 'var(--space-4)',
      padding: 'var(--space-8)',
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: 'var(--radius-xl)',
        background: 'var(--color-primary-light)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)',
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
      <div>
        <h1 style={{
          fontSize: 'var(--font-size-3xl)',
          fontWeight: 'var(--font-weight-extrabold)',
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: 'var(--space-2)',
        }}>
          {title}
        </h1>
        <p style={{
          fontSize: 'var(--font-size-md)',
          color: 'var(--color-text-secondary)',
          maxWidth: '440px',
          lineHeight: 'var(--line-height-relaxed)',
        }}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
