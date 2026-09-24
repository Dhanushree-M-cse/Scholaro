import React from 'react';
import { Outlet } from 'react-router-dom';
import { useEligibility } from '../../context/EligibilityContext';
import { PageHeader, ProgressStepper } from '../../components';
import './EligibilityLayout.css';

export default function EligibilityLayout() {
  const { currentStep } = useEligibility();
  
  const steps = [
    { id: 1, title: 'Personal', description: 'Basic info' },
    { id: 2, title: 'Community', description: 'Category & Nativity' },
    { id: 3, title: 'Academic', description: 'Education details' },
    { id: 4, title: 'Performance', description: 'Marks & CGPA' },
    { id: 5, title: 'Financial', description: 'Income details' },
    { id: 6, title: 'Bank', description: 'Account info' }
  ];

  return (
    <div className="eligibility-layout">
      <PageHeader 
        title="Eligibility Check" 
        breadcrumbs={[{label: 'Dashboard', href: '/dashboard'}, {label: 'Eligibility Check', href: '/eligibility'}]}
      />
      <div className="eligibility-container">
        <div className="stepper-wrapper">
          <ProgressStepper steps={steps} currentStep={currentStep} />
        </div>
        <div className="step-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
