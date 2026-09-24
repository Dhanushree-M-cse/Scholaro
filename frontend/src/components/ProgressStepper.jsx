import React from 'react';
import './ProgressStepper.css';

/**
 * SCHOLARO Eligibility Stepper — 6 steps
 * @param {Object} props
 * @param {number} props.currentStep  - 1-indexed active step
 * @param {Array<{label: string}>} [props.steps] - Override default steps
 */

const DEFAULT_STEPS = [
  { label: 'Personal & Identity' },
  { label: 'Community & Residence' },
  { label: 'Academic Details' },
  { label: 'Academic Performance' },
  { label: 'Family & Financial' },
  { label: 'Bank / DBT' },
];

const ProgressStepper = ({ currentStep = 1, steps = DEFAULT_STEPS }) => {
  return (
    <nav className="progress-stepper" aria-label="Eligibility check progress">
      <ol className="stepper-list">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          const statusClass = isCompleted
            ? 'stepper-step--completed'
            : isCurrent
            ? 'stepper-step--current'
            : 'stepper-step--upcoming';

          return (
            <li key={stepNumber} className={`stepper-step ${statusClass}`}>
              {/* Connector line (except first) */}
              {index > 0 && (
                <div
                  className={`stepper-connector ${isCompleted ? 'stepper-connector--filled' : ''}`}
                  aria-hidden="true"
                />
              )}

              <div className="stepper-step-inner">
                <div
                  className="stepper-circle"
                  aria-hidden="true"
                >
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="stepper-number">{stepNumber}</span>
                  )}
                </div>

                <span
                  className="stepper-label"
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default ProgressStepper;
