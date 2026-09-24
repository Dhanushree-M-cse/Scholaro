import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEligibility } from '../../context/EligibilityContext';
import { Input, Select, Button, FileUpload, FormSection, RadioGroup, Alert } from '../../components';

export default function Step5Financial() {
  const { step5, setStep5, goToStep } = useEligibility();
  const [data, setData] = useState(step5 || {
    annual_income: '', income_cert_status: 'Available',
    father_name: '', father_occupation: '', father_income: '', father_doc: null,
    mother_name: '', mother_occupation: '', mother_income: '', mother_doc: null,
    family_size: '', sibling_count: '0', siblings_studying: '0',
    first_gen_graduate: 'No', income_cert_doc: null
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setData({ ...data, [e.target.id]: e.target.value });
  const handleRadio = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleFileChange = (field, file) => {
    setData(prev => ({ ...prev, [field]: file ? (file.name || file) : null }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    if (!data.annual_income) return setError('Please enter your Annual Family Income.');
    if (!data.father_name?.trim()) return setError('Please enter your Father / Guardian Name.');
    if (!data.father_occupation?.trim()) return setError('Please enter your Father / Guardian Occupation.');
    if (!data.mother_name?.trim()) return setError('Please enter your Mother / Guardian Name.');
    if (!data.mother_occupation?.trim()) return setError('Please enter your Mother / Guardian Occupation.');

    if (data.income_cert_status === 'Available' && !data.income_cert_doc) {
      return setError('Please upload your Income Certificate (Required when status is Available).');
    }

    setStep5(data);
    goToStep(6);
    navigate('/eligibility/step-6');
  };

  const handleBack = () => {
    goToStep(4);
    navigate('/eligibility/step-4');
  };

  return (
    <form onSubmit={handleNext}>
      {error && <Alert type="error" message={error} />}

      <FormSection title="Family Financial Details">
        <div className="grid-2">
          <Input id="annual_income" label="Annual Family Income (INR ₹)" type="number" value={data.annual_income} onChange={handleChange} placeholder="e.g. 150000" required />
          <Select id="income_cert_status" label="Income Certificate Status" value={data.income_cert_status} onChange={handleChange} options={[{label:'Available',value:'Available'},{label:'Applied',value:'Applied'},{label:'Not Available',value:'Not Available'}]} required />
        </div>
      </FormSection>

      <FormSection title="Father / Guardian Details">
        <div className="grid-2">
          <Input id="father_name" label="Father / Guardian Name" value={data.father_name} onChange={handleChange} placeholder="Full name" required />
          <Input id="father_occupation" label="Father / Guardian Occupation" value={data.father_occupation} onChange={handleChange} placeholder="e.g. Agriculture / Private / Self Employed" required />
          <Input id="father_income" label="Father Annual Income (INR ₹, if separate)" type="number" value={data.father_income} onChange={handleChange} placeholder="Optional" />
        </div>
      </FormSection>

      <FormSection title="Mother / Guardian Details">
        <div className="grid-2">
          <Input id="mother_name" label="Mother / Guardian Name" value={data.mother_name} onChange={handleChange} placeholder="Full name" required />
          <Input id="mother_occupation" label="Mother / Guardian Occupation" value={data.mother_occupation} onChange={handleChange} placeholder="e.g. Homemaker / Service" required />
          <Input id="mother_income" label="Mother Annual Income (INR ₹, if separate)" type="number" value={data.mother_income} onChange={handleChange} placeholder="Optional" />
        </div>
      </FormSection>

      <FormSection title="Family Background & First Generation Status">
        <div className="grid-2">
          <Input id="family_size" label="Total Family Members" type="number" value={data.family_size} onChange={handleChange} placeholder="e.g. 4" required />
          <Input id="sibling_count" label="Number of Siblings" type="number" value={data.sibling_count} onChange={handleChange} required />
          <Input id="siblings_studying" label="Siblings Currently Studying" type="number" value={data.siblings_studying} onChange={handleChange} required />
          <RadioGroup id="first_gen_graduate" name="first_gen_graduate" label="Are you a First-Generation Graduate / Student?" value={data.first_gen_graduate} onChange={handleRadio} options={[{label:'Yes',value:'Yes'}, {label:'No',value:'No'}]} required />
        </div>
      </FormSection>

      <FormSection title="Family & Financial Documents Upload">
        <div className="grid-2">
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: data.income_cert_status === 'Available' ? 'var(--color-danger, #ef4444)' : 'var(--color-text-secondary)' }}>
              {data.income_cert_status === 'Available' ? '[ Required ]' : '[ Optional / If Available ]'}
            </span>
            <FileUpload id="income_cert_doc" label="Income Certificate" value={data.income_cert_doc} accept=".pdf,.jpg,.jpeg,.png" onChange={(f) => handleFileChange('income_cert_doc', f)} />
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>[ Optional / If Applicable ]</span>
            <FileUpload id="father_doc" label="Father / Guardian Document / ID" value={data.father_doc} accept=".pdf,.jpg,.jpeg,.png" onChange={(f) => handleFileChange('father_doc', f)} />
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>[ Optional / If Applicable ]</span>
            <FileUpload id="mother_doc" label="Mother / Guardian Document / ID" value={data.mother_doc} accept=".pdf,.jpg,.jpeg,.png" onChange={(f) => handleFileChange('mother_doc', f)} />
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
