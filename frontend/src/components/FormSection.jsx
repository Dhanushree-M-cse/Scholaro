import React from 'react';
import './FormSection.css';

/**
 * Reusable FormSection Component
 * Groups related form fields with a title and optional description.
 *
 * @param {string} props.title - Section heading
 * @param {string} [props.description] - Optional supporting text under title
 * @param {React.ReactNode} props.children - Form fields inside this section
 * @param {boolean} [props.noBorder=false] - Remove the bottom border divider
 * @param {string} [props.className]
 */
const FormSection = ({ title, description, children, noBorder = false, className = '' }) => {
  return (
    <section className={`form-section ${noBorder ? 'form-section--no-border' : ''} ${className}`}>
      <div className="form-section-header">
        <h3 className="form-section-title">{title}</h3>
        {description && (
          <p className="form-section-description">{description}</p>
        )}
      </div>
      <div className="form-section-body">
        {children}
      </div>
    </section>
  );
};

export default FormSection;
