import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEligibility } from '../../context/EligibilityContext';
import { Input, Button, FileUpload, FormSection, RadioGroup, Alert } from '../../components';

export default function Step4Performance() {
  const { step3, step4, setStep4, goToStep } = useEligibility();
  const isSchool = step3?.student_type === 'school';

  const [data, setData] = useState(step4 || {
    tenth_percentage: '', twelfth_percentage: '', current_cgpa: '',
    prev_sem_cgpa: '', has_backlogs: 'No', backlog_count: '0',
    academic_year: '2025-26', achievements: '',
    tenth_marksheet_doc: null, twelfth_marksheet_doc: null, current_marksheet_doc: null
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (step4 && (step4.tenth_percentage || step4.current_cgpa || step4.academic_year)) {
      setData(prev => ({ ...prev, ...step4 }));
    }
  }, [step4]);

  const updateData = (updated) => {
    setData(updated);
    setStep4(updated);
  };

  const handleChange = (e) => updateData({ ...data, [e.target.id]: e.target.value });
  const handleRadio = (e) => updateData({ ...data, [e.target.name]: e.target.value });

  const handleFileChange = (field, file) => {
    updateData({ ...data, [field]: file ? (file.name || file) : null });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    if (!isSchool) {
      if (!data.tenth_percentage) return setError('Please enter your 10th/SSLC percentage.');
      if (!data.tenth_marksheet_doc) return setError('Please upload your 10th / SSLC Marksheet (Required).');
      if (!data.current_cgpa) return setError('Please enter your current CGPA / Percentage.');
      if (!data.current_marksheet_doc) return setError('Please upload your Current / Latest Semester Marksheet (Required).');
    } else {
      if (!data.current_cgpa && !data.tenth_percentage) {
        return setError('Please enter your current academic marks or percentage.');
      }
      if (!data.current_marksheet_doc) {
        return setError('Please upload your Current Academic Marksheet / Progress Card (Required).');
      }
    }

    setStep4(data);
    goToStep(5);
    navigate('/eligibility/step-5');
  };

  const handleBack = () => {
    goToStep(3);
    navigate('/eligibility/step-3');
  };

  return (
    <form onSubmit={handleNext}>
      {error && <Alert type="error" message={error} />}

      <FormSection title={isSchool ? 'School Academic Performance' : 'College Academic Performance'}>
        <div className="grid-2">
          <Input
            id="tenth_percentage"
            label="10th / SSLC Percentage"
            type="number"
            step="0.01"
            value={data.tenth_percentage}
            onChange={handleChange}
            placeholder="e.g. 85.50"
            required={!isSchool}
          />
          <Input
            id="twelfth_percentage"
            label="12th / HSC Percentage"
            type="number"
            step="0.01"
            value={data.twelfth_percentage}
            onChange={handleChange}
            placeholder="e.g. 88.00"
          />
          <Input
            id="current_cgpa"
            label={isSchool ? 'Current Marks / Percentage' : 'Current Cumulative CGPA / Overall Percentage'}
            type="number"
            step="0.01"
            value={data.current_cgpa}
            onChange={handleChange}
            placeholder="e.g. 8.50 or 85.00"
            required
          />
          {!isSchool && (
            <Input
              id="prev_sem_cgpa"
              label="Previous Semester CGPA"
              type="number"
              step="0.01"
              value={data.prev_sem_cgpa}
              onChange={handleChange}
              placeholder="e.g. 8.40"
            />
          )}
          {!isSchool && (
            <RadioGroup
              id="has_backlogs"
              name="has_backlogs"
              label="Any Active Backlogs / Arrears?"
              value={data.has_backlogs}
              onChange={handleRadio}
              options={[{label:'Yes',value:'Yes'}, {label:'No',value:'No'}]}
              required
            />
          )}
          {!isSchool && data.has_backlogs === 'Yes' && (
            <Input id="backlog_count" label="Number of Active Backlogs" type="number" value={data.backlog_count} onChange={handleChange} required />
          )}
          <Input id="academic_year" label="Academic Year" value={data.academic_year} onChange={handleChange} placeholder="e.g. 2025-26" required />
        </div>
      </FormSection>

      <FormSection title="Academic Marksheets & Certificates" description="Upload separate document marksheets as required by your education level.">
        <div className="grid-2">
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: !isSchool ? 'var(--color-danger, #ef4444)' : 'var(--color-text-secondary)' }}>
              {!isSchool ? '[ Required for College ]' : '[ Optional / If Class 10+ ]'}
            </span>
            <FileUpload id="tenth_marksheet_doc" label="10th / SSLC Marksheet" value={data.tenth_marksheet_doc} accept=".pdf,.jpg,.jpeg,.png" onChange={(f) => handleFileChange('tenth_marksheet_doc', f)} />
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>[ Optional / If Applicable ]</span>
            <FileUpload id="twelfth_marksheet_doc" label="12th / HSC Marksheet" value={data.twelfth_marksheet_doc} accept=".pdf,.jpg,.jpeg,.png" onChange={(f) => handleFileChange('twelfth_marksheet_doc', f)} />
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-danger, #ef4444)' }}>[ Required ]</span>
            <FileUpload
              id="current_marksheet_doc"
              label={isSchool ? 'Current Academic Progress Card / Marksheet' : 'Current / Latest Semester Marksheet'}
              value={data.current_marksheet_doc}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(f) => handleFileChange('current_marksheet_doc', f)}
              required
            />
          </div>
        </div>
      </FormSection>

      <div className="step-actions">
        <Button variant="outline" type="button" onClick={handleBack}>Back</Button>
        <Button type="submit">Save & Continue</Button>
      </div>
    </form>
  );
}
