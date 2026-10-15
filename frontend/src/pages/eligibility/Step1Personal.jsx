import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEligibility } from '../../context/EligibilityContext';
import { Input, Select, Button, FileUpload, FormSection, Alert } from '../../components';

export default function Step1Personal() {
  const { step1, setStep1, goToStep } = useEligibility();
  const [data, setData] = useState(step1 || {
    full_name: '', dob: '', gender: '', mobile: '', email: '',
    religion: '', marital_status: '',
    aadhaar_doc: null, photo_doc: null, signature_doc: null
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (step1 && (step1.full_name || step1.email || step1.dob)) {
      setData(prev => ({ ...prev, ...step1 }));
    }
  }, [step1]);

  const updateData = (updated) => {
    setData(updated);
    setStep1(updated);
  };

  const handleChange = (e) => {
    updateData({ ...data, [e.target.id]: e.target.value });
  };

  const handleFileChange = (field, file) => {
    updateData({
      ...data,
      [field]: file ? (file.name || file) : null
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    if (!data.full_name?.trim()) return setError('Please enter your full name.');
    if (!data.dob) return setError('Please select your date of birth.');
    if (!data.gender) return setError('Please select your gender.');
    if (!data.mobile || data.mobile.length !== 10) return setError('Please enter a valid 10-digit mobile number.');
    if (!data.email || !data.email.includes('@')) return setError('Please enter a valid email address.');
    if (!data.religion) return setError('Please select your religion.');
    if (!data.marital_status) return setError('Please select your marital status.');

    // Document validation for Step 1
    if (!data.aadhaar_doc) return setError('Please upload your Aadhaar Card (Required document).');
    if (!data.photo_doc) return setError('Please upload your Passport-size Photo (Required document).');
    if (!data.signature_doc) return setError('Please upload your Signature (Required document).');

    setStep1(data);
    goToStep(2);
    navigate('/eligibility/step-2');
  };

  return (
    <form onSubmit={handleNext}>
      {error && <Alert type="error" message={error} />}

      <FormSection title="Personal Information" description="Please provide your basic details as per official records.">
        <div className="grid-2">
          <Input id="full_name" label="Full Name" value={data.full_name} onChange={handleChange} required />
          <Input id="dob" label="Date of Birth" type="date" value={data.dob} onChange={handleChange} required />
          <Select id="gender" label="Gender" value={data.gender} onChange={handleChange} options={[ {label:'Male',value:'Male'}, {label:'Female',value:'Female'}, {label:'Transgender',value:'Transgender'}, {label:'Prefer not to say',value:'Other'} ]} required />
          <Input id="mobile" label="Mobile Number" type="tel" value={data.mobile} onChange={handleChange} required />
          <Input id="email" label="Email Address" type="email" value={data.email} onChange={handleChange} required />
          <Select id="religion" label="Religion" value={data.religion} onChange={handleChange} options={[ {label:'Hindu',value:'Hindu'}, {label:'Muslim',value:'Muslim'}, {label:'Christian',value:'Christian'}, {label:'Sikh',value:'Sikh'}, {label:'Buddhist',value:'Buddhist'}, {label:'Jain',value:'Jain'}, {label:'Other',value:'Other'} ]} required />
          <Select id="marital_status" label="Marital Status" value={data.marital_status} onChange={handleChange} options={[ {label:'Single',value:'Single'}, {label:'Married',value:'Married'}, {label:'Widowed',value:'Widowed'}, {label:'Divorced',value:'Divorced'} ]} required />
        </div>
      </FormSection>

      <FormSection title="Personal Documents Upload" description="Upload clear scanned copies in PDF or image format (Max 5MB).">
        <div className="grid-2">
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-danger, #ef4444)' }}>[ Required ]</span>
            <FileUpload id="aadhaar_doc" label="Aadhaar Card" value={data.aadhaar_doc} accept=".pdf,.jpg,.jpeg,.png" onChange={(f) => handleFileChange('aadhaar_doc', f)} required />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-danger, #ef4444)' }}>[ Required ]</span>
            <FileUpload id="photo_doc" label="Passport-size Photograph" value={data.photo_doc} accept=".jpg,.jpeg,.png" onChange={(f) => handleFileChange('photo_doc', f)} required />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-danger, #ef4444)' }}>[ Required ]</span>
            <FileUpload id="signature_doc" label="Signature" value={data.signature_doc} accept=".jpg,.jpeg,.png" onChange={(f) => handleFileChange('signature_doc', f)} required />
          </div>
        </div>
      </FormSection>

      <div className="step-actions">
        <Button variant="outline" type="button" disabled>Back</Button>
        <Button type="submit">Save & Continue</Button>
      </div>
    </form>
  );
}
