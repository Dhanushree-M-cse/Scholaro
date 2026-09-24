import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEligibility } from '../../context/EligibilityContext';
import { Input, Select, Button, FileUpload, FormSection, RadioGroup, Alert } from '../../components';
import { COUNTRIES, INDIAN_STATES, getDistrictsForState } from '../../utils/locationData';

export default function Step2Community() {
  const { step2, setStep2, goToStep } = useEligibility();
  const [data, setData] = useState(step2 || {
    community: '', caste_cert_status: 'Available', country: 'India', domicile: 'Tamil Nadu',
    state: 'Tamil Nadu', district: '', tn_resident: 'Yes',
    community_cert_doc: null, domicile_cert_doc: null
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const districtOptions = getDistrictsForState(data.state).map(d => ({ label: d, value: d }));

  // Reset district if state changes and selected district isn't in new list
  useEffect(() => {
    if (data.country === 'India' && data.state) {
      const validDistricts = getDistrictsForState(data.state);
      if (data.district && !validDistricts.includes(data.district)) {
        setData(prev => ({ ...prev, district: validDistricts[0] || '' }));
      }
    }
  }, [data.state, data.country]);

  const handleChange = (e) => setData({ ...data, [e.target.id]: e.target.value });
  const handleRadio = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleCountryChange = (e) => {
    const val = e.target.value;
    if (val !== 'India') {
      setData({ ...data, country: val, state: '', district: '', tn_resident: 'No' });
    } else {
      setData({ ...data, country: 'India', state: 'Tamil Nadu', district: 'Chennai', tn_resident: 'Yes' });
    }
  };

  const handleFileChange = (field, file) => {
    setData(prev => ({ ...prev, [field]: file ? (file.name || file) : null }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    if (!data.community) return setError('Please select your Community/Category.');
    if (!data.country) return setError('Please select your Country.');

    if (data.country === 'India') {
      if (!data.state) return setError('Please select your State.');
      if (!data.district) return setError('Please select your District.');
    }

    // Community Certificate required for non-OC categories
    if (['BC', 'MBC', 'DNC', 'SC', 'ST'].includes(data.community) && !data.community_cert_doc && data.caste_cert_status === 'Available') {
      return setError(`Please upload your Community / Caste Certificate for ${data.community} category.`);
    }

    setStep2(data);
    goToStep(3);
    navigate('/eligibility/step-3');
  };

  const handleBack = () => {
    goToStep(1);
    navigate('/eligibility/step-1');
  };

  const communityOptions = [
    { label: 'BC - Backward Classes', value: 'BC' },
    { label: 'MBC - Most Backward Classes', value: 'MBC' },
    { label: 'DNC - Denotified Communities', value: 'DNC' },
    { label: 'SC - Scheduled Castes', value: 'SC' },
    { label: 'ST - Scheduled Tribes', value: 'ST' },
    { label: 'OC - Open Category / General', value: 'OC' },
    { label: 'Others', value: 'Others' }
  ];

  return (
    <form onSubmit={handleNext}>
      {error && <Alert type="error" message={error} />}

      <FormSection title="Community & Category Information">
        <div className="grid-2">
          <Select id="community" label="Community / Category" value={data.community} onChange={handleChange} options={communityOptions} required />
          <Select id="caste_cert_status" label="Community Certificate Status" value={data.caste_cert_status} onChange={handleChange} options={[ {label:'Available',value:'Available'}, {label:'Applied',value:'Applied'}, {label:'Not Applicable (OC)',value:'Not Applicable'} ]} required />
        </div>
      </FormSection>

      <FormSection title="Residence & Location Details">
        <div className="grid-2">
          <Select id="country" label="Country" value={data.country} onChange={handleCountryChange} options={COUNTRIES.map(c => ({ label: c, value: c }))} required />
          
          {data.country === 'India' ? (
            <>
              <Select id="state" label="State / Union Territory" value={data.state} onChange={handleChange} options={INDIAN_STATES.map(s => ({ label: s, value: s }))} required />
              <Select id="district" label="District" value={data.district} onChange={handleChange} options={districtOptions.length > 0 ? districtOptions : [{ label: 'Select District', value: '' }]} required />
            </>
          ) : (
            <Input id="state" label="State / Province" value={data.state} onChange={handleChange} placeholder="Enter state/province" />
          )}

          <RadioGroup id="tn_resident" name="tn_resident" label="Are you a Resident of Tamil Nadu?" value={data.tn_resident} onChange={handleRadio} options={[ {label:'Yes',value:'Yes'}, {label:'No',value:'No'} ]} required />
        </div>
      </FormSection>

      <FormSection title="Community & Residence Documents" description="Upload self-attested document proofs. (Note: Nativity Certificate is NOT required).">
        <div className="grid-2">
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: data.community !== 'OC' ? 'var(--color-danger, #ef4444)' : 'var(--color-text-secondary)' }}>
              {data.community !== 'OC' ? '[ Required for BC/MBC/DNC/SC/ST ]' : '[ Optional for OC ]'}
            </span>
            <FileUpload id="community_cert_doc" label="Community / Caste Certificate" value={data.community_cert_doc} accept=".pdf,.jpg,.jpeg,.png" onChange={(f) => handleFileChange('community_cert_doc', f)} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>[ Optional / If Applicable ]</span>
            <FileUpload id="domicile_cert_doc" label="Domicile / Residence Proof" value={data.domicile_cert_doc} accept=".pdf,.jpg,.jpeg,.png" onChange={(f) => handleFileChange('domicile_cert_doc', f)} />
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
