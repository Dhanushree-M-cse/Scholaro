import React from 'react';
import { Link } from 'react-router-dom';
import './PageHeader.css';

/**
 * Reusable PageHeader Component
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} [props.description] - Optional subtitle
 * @param {Array<{label: string, href: string}>} [props.breadcrumbs]
 * @param {React.ReactNode} [props.action] - Optional right-side action element
 */
const PageHeader = ({ title, description, breadcrumbs = [], action }) => {
  return (
    <div className="page-header">
      {breadcrumbs.length > 0 && (
        <nav className="page-header-breadcrumb" aria-label="Breadcrumb">
          <ol className="breadcrumb-list">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="breadcrumb-item">
                {index < breadcrumbs.length - 1 ? (
                  <>
                    <Link to={crumb.href} className="breadcrumb-link">{crumb.label}</Link>
                    <span className="breadcrumb-separator" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </>
                ) : (
                  <span className="breadcrumb-current" aria-current="page">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="page-header-row">
        <div className="page-header-text">
          <h1 className="page-header-title">{title}</h1>
          {description && <p className="page-header-description">{description}</p>}
        </div>
        {action && <div className="page-header-action">{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
