import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

/**
 * NotFoundPage — 404 fallback page.
 */
const NotFoundPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', gap: 'var(--space-5)', padding: 'var(--space-8)' }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: 'var(--radius-xl)',
        background: 'var(--color-primary-light)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)',
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
          <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--space-2)' }}>
          404
        </h1>
        <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
          Page Not Found
        </p>
        <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)', maxWidth: '400px', lineHeight: 'var(--line-height-relaxed)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Link to="/">
        <Button variant="primary">Return to Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
