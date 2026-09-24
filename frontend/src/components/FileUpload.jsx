import React, { useRef, useState } from 'react';
import './FileUpload.css';

/**
 * Reusable FileUpload Component
 * @param {Object} props
 * @param {string} props.id
 * @param {string} [props.label]
 * @param {boolean} [props.required]
 * @param {string} [props.accept='.pdf,.jpg,.jpeg,.png']
 * @param {string} [props.acceptLabel='PDF, JPG, JPEG, PNG']
 * @param {string} [props.maxSizeLabel='Max file size: 5MB']
 * @param {Function} props.onChange  - receives File object or null
 * @param {string} [props.error]
 * @param {string} [props.helperText]
 * @param {boolean} [props.disabled]
 */
const FileUpload = ({
  id,
  label,
  required = false,
  accept = '.pdf,.jpg,.jpeg,.png',
  acceptLabel = 'PDF, JPG, JPEG, PNG',
  maxSizeLabel = 'Max file size: 5MB',
  onChange,
  value,
  error = '',
  helperText = '',
  disabled = false,
  className = '',
}) => {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(value || null);
  const [isDragging, setIsDragging] = useState(false);

  React.useEffect(() => {
    setSelectedFile(value || null);
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setSelectedFile(file);
    if (onChange) onChange(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = '';
    if (onChange) onChange(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0] || null;
    if (file) {
      setSelectedFile(file);
      if (onChange) onChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="required-indicator" aria-hidden="true"> *</span>}
        </label>
      )}

      <div
        className={[
          'file-upload-zone',
          isDragging ? 'file-upload-zone--dragging' : '',
          error ? 'file-upload-zone--error' : '',
          disabled ? 'file-upload-zone--disabled' : '',
          selectedFile ? 'file-upload-zone--has-file' : '',
        ].filter(Boolean).join(' ')}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label={label ? `Upload ${label}` : 'Upload file'}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="file-upload-input"
          aria-hidden="true"
          tabIndex={-1}
        />

        {!selectedFile ? (
          <div className="file-upload-placeholder">
            <span className="file-upload-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
              </svg>
            </span>
            <p className="file-upload-primary-text">
              <span className="file-upload-link">Click to upload</span> or drag and drop
            </p>
            <p className="file-upload-meta">{acceptLabel} &bull; {maxSizeLabel}</p>
          </div>
        ) : (
          <div className="file-upload-selected">
            <span className="file-upload-file-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </span>
            <span className="file-upload-filename" title={typeof selectedFile === 'string' ? selectedFile : selectedFile?.name}>
              {typeof selectedFile === 'string' ? selectedFile : selectedFile?.name}
            </span>
            <button
              type="button"
              className="file-upload-remove"
              onClick={handleRemove}
              aria-label="Remove file"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
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

export default FileUpload;
