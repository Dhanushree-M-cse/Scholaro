import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEligibility } from '../../context/EligibilityContext';
import { Input, Button, FileUpload, FormSection, RadioGroup, Alert } from '../../components';

export default function Step6Bank() {
  const { step6, setStep6, goToStep } = useEligibility();
  const [data, setData] = useState(step6 || {
    has_bank_account: 'Yes', account_holder_name: '', bank_name: '',
    aadhaar_linked: 'Yes', dbt_enabled: 'Yes', passbook_doc: null
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (step6 && (step6.bank_name || step6.account_holder_name)) {
      setData(prev => ({ ...prev, ...step6 }));
    }
  }, [step6]);

  const updateData = (updated) => {
    setData(updated);
    setStep6(updated);
  };

  const handleChange = (e) => updateData({ ...data, [e.target.id]: e.target.value });
  const handleRadio = (e) => updateData({ ...data, [e.target.name]: e.target.value });

  const handleFileChange = (field, file) => {
    updateData({ ...data, [field]: file ? (file.name || file) : null });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    if (data.has_bank_account === 'Yes') {
      if (!data.account_holder_name?.trim()) return setError('Please enter the Account Holder Name.');
      if (!data.bank_name?.trim()) return setError('Please enter the Bank Name.');
    }

    setStep6(data);
    navigate('/eligibility/review');
  };

  const handleBack = () => {
    goToStep(5);
    navigate('/eligibility/step-5');
  };

  return (
    <form onSubmit={handleNext}>
      {error && <Alert type="error" message={error} />}

      <FormSection title="Bank Account & Direct Benefit Transfer (DBT) Details">
        <Alert type="info" message="IMPORTANT: Do not enter PIN, UPI PIN, or passwords here. We only collect basic bank details to check DBT eligibility." />
        
        <RadioGroup
          id="has_bank_account"
          name="has_bank_account"
          label="Do you have an active Bank Account?"
          value={data.has_bank_account}
          onChange={handleRadio}
          options={[{label:'Yes',value:'Yes'}, {label:'No',value:'No'}]}
          required
        />

        {data.has_bank_account === 'Yes' && (
          <div className="grid-2 mt-4">
            <Input id="account_holder_name" label="Account Holder Name" value={data.account_holder_name} onChange={handleChange} placeholder="Name as per bank passbook" required />
            <Input id="bank_name" label="Bank Name" value={data.bank_name} onChange={handleChange} placeholder="e.g. State Bank of India" required />
            <RadioGroup id="aadhaar_linked" name="aadhaar_linked" label="Is Bank Account Linked with Aadhaar?" value={data.aadhaar_linked} onChange={handleRadio} options={[{label:'Yes',value:'Yes'}, {label:'No',value:'No'}]} required />
            <RadioGroup id="dbt_enabled" name="dbt_enabled" label="Is Direct Benefit Transfer (DBT) Enabled?" value={data.dbt_enabled} onChange={handleRadio} options={[{label:'Yes',value:'Yes'}, {label:'No',value:'No'}]} required />
          </div>
        )}
      </FormSection>

      <FormSection title="Bank Passbook / Proof Upload">
        <div className="grid-2">
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: data.has_bank_account === 'Yes' ? 'var(--color-danger, #ef4444)' : 'var(--color-text-secondary)' }}>
              {data.has_bank_account === 'Yes' ? '[ Required ]' : '[ Optional / If Available ]'}
            </span>
            <FileUpload
              id="passbook_doc"
              label="Bank Passbook Front Page / Account Statement"
              value={data.passbook_doc}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(f) => handleFileChange('passbook_doc', f)}
            />
          </div>
        </div>
      </FormSection>

      <div className="step-actions">
        <Button variant="outline" type="button" onClick={handleBack}>Back</Button>
        <Button type="submit">Review Details & Submit</Button>
      </div>
    </form>
  );
}
