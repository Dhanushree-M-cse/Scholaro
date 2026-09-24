import React from 'react';
import './FormControls.css';

/**
 * Reusable Input Component
 */
export const Input = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  className = '',
  ...rest
}) => {
  return (
    <div className={`form-field ${error ? 'form-field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="required-indicator" aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`form-input ${error ? 'form-input--error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        aria-invalid={!!error}
        {...rest}
      />
      {helperText && !error && (
        <p id={`${id}-helper`} className="form-helper">{helperText}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="form-error" role="alert">{error}</p>
      )}
    </div>
  );
};

/**
 * Reusable Select Component
 */
export const Select = ({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  className = '',
  ...rest
}) => {
  return (
    <div className={`form-field ${error ? 'form-field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="required-indicator" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className="select-wrapper">
        <select
          id={id}
          className={`form-select ${error ? 'form-select--error' : ''}`}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          aria-invalid={!!error}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="select-chevron" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {helperText && !error && (
        <p id={`${id}-helper`} className="form-helper">{helperText}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="form-error" role="alert">{error}</p>
      )}
    </div>
  );
};

/**
 * Reusable RadioGroup Component
 */
export const RadioGroup = ({
  id,
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  className = '',
}) => {
  return (
    <fieldset className={`form-field ${error ? 'form-field--error' : ''} ${className}`} id={id}>
      {label && (
        <legend className="form-label">
          {label}
          {required && <span className="required-indicator" aria-hidden="true"> *</span>}
        </legend>
      )}
      <div className="radio-group">
        {options.map((opt) => (
          <label key={opt.value} className={`radio-option ${disabled ? 'radio-option--disabled' : ''}`}>
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange}
              disabled={disabled}
              aria-describedby={error ? `${id}-error` : undefined}
              className="radio-input"
            />
            <span className="radio-mark" aria-hidden="true" />
            <span className="radio-label-text">{opt.label}</span>
          </label>
        ))}
      </div>
      {helperText && !error && (
        <p id={`${id}-helper`} className="form-helper">{helperText}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="form-error" role="alert">{error}</p>
      )}
    </fieldset>
  );
};

/**
 * Reusable Checkbox Component
 */
export const Checkbox = ({
  id,
  label,
  checked,
  onChange,
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  className = '',
}) => {
  return (
    <div className={`form-field ${className}`}>
      <label className={`checkbox-option ${disabled ? 'checkbox-option--disabled' : ''}`} htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="checkbox-input"
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
        />
        <span className="checkbox-mark" aria-hidden="true">
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="checkbox-label-text">{label}</span>
        {required && <span className="required-indicator" aria-hidden="true"> *</span>}
      </label>
      {helperText && !error && (
        <p id={`${id}-helper`} className="form-helper" style={{ marginLeft: '28px' }}>{helperText}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="form-error" role="alert" style={{ marginLeft: '28px' }}>{error}</p>
      )}
    </div>
  );
};
