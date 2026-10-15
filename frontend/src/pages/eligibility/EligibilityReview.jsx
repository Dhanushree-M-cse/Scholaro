import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEligibility } from '../../context/EligibilityContext';
import { studentService } from '../../services/studentService';
import { Button, Card, CardBody, Alert, Loading } from '../../components';
import './EligibilityReview.css';

export default function EligibilityReview() {
  const { step1, step2, step3, step4, step5, step6, goToStep } = useEligibility();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorStep, setErrorStep] = useState(null);
  const [success, setSuccess] = useState('');

  const isSchool = step3?.student_type === 'school';

  const validateAll = () => {
    // Step 1 Validation
    if (!step1?.full_name?.trim()) return { message: 'Please enter your Full Name in Step 1.', step: 1 };
    if (!step1?.dob) return { message: 'Please select your Date of Birth in Step 1.', step: 1 };
    if (!step1?.gender) return { message: 'Please select your Gender in Step 1.', step: 1 };

    // Step 2 Validation
    if (!step2?.community) return { message: 'Please select your Community / Category in Step 2.', step: 2 };
    if (!step2?.country) return { message: 'Please select your Country in Step 2.', step: 2 };
    if (step2?.country === 'India') {
      if (!step2?.state) return { message: 'Please select your State in Step 2.', step: 2 };
      if (!step2?.district) return { message: 'Please select your District in Step 2.', step: 2 };
    }

    // Step 3 Validation
    if (isSchool) {
      if (!step3?.school_name?.trim()) return { message: 'Please enter your School Name in Step 3.', step: 3 };
      if (!step3?.class_standard) return { message: 'Please select your Class / Standard in Step 3.', step: 3 };
    } else {
      if (!step3?.institution?.trim()) return { message: 'Please enter your College / Institution Name in Step 3.', step: 3 };
      if (!step3?.course?.trim()) return { message: 'Please enter your Course / Degree in Step 3.', step: 3 };
      if (!step3?.branch?.trim()) return { message: 'Please enter your Branch / Department in Step 3.', step: 3 };
    }

    // Step 4 Validation
    if (!isSchool) {
      if (!step4?.tenth_percentage && !step4?.current_cgpa) {
        return { message: 'Please enter your 10th Percentage or Current CGPA in Step 4.', step: 4 };
      }
    } else {
      if (!step4?.current_cgpa && !step4?.tenth_percentage) {
        return { message: 'Please enter your current academic marks or percentage in Step 4.', step: 4 };
      }
    }

    // Step 5 Validation
    if (step5?.annual_income === '' || step5?.annual_income === null || step5?.annual_income === undefined) {
      return { message: 'Please enter your Annual Family Income in Step 5.', step: 5 };
    }
    if (!step5?.father_name?.trim()) return { message: 'Please enter your Father / Guardian Name in Step 5.', step: 5 };
    if (!step5?.mother_name?.trim()) return { message: 'Please enter your Mother / Guardian Name in Step 5.', step: 5 };

    // Step 6 Validation
    if (step6?.has_bank_account === 'Yes') {
      if (!step6?.account_holder_name?.trim()) return { message: 'Please enter the Bank Account Holder Name in Step 6.', step: 6 };
      if (!step6?.bank_name?.trim()) return { message: 'Please enter the Bank Name in Step 6.', step: 6 };
    }

    return null;
  };

  const handleSubmit = async () => {
    if (loading) return;
    setError('');
    setSuccess('');

    const valErr = validateAll();
    if (valErr) {
      setError(valErr.message || valErr);
      setErrorStep(valErr.step || null);
      setTimeout(() => {
        const el = document.getElementById('review-error-box') || document.getElementById('top-error-box');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }

    setLoading(true);

    const toNum = (v, def = null) => {
      if (v === '' || v === null || v === undefined) return def;
      const n = Number(v);
      return isNaN(n) ? def : n;
    };

    const payload = {
      personal: {
        full_name: step1.full_name?.trim() || '',
        dob: step1.dob || null,
        gender: step1.gender || '',
        mobile: step1.mobile || '',
        email: step1.email || '',
        religion: step1.religion || '',
        marital_status: step1.marital_status || '',
        aadhaar_doc: step1.aadhaar_doc || null,
        photo_doc: step1.photo_doc || null,
        signature_doc: step1.signature_doc || null
      },
      community: {
        community: step2.community || '',
        caste_certificate: step2.caste_cert_status || 'Available',
        country: step2.country || 'India',
        domicile: step2.domicile || 'Tamil Nadu',
        state: step2.state || 'Tamil Nadu',
        district: step2.district || '',
        tn_resident: step2.tn_resident === 'Yes' ? 1 : 0,
        community_cert_doc: step2.community_cert_doc || null,
        domicile_cert_doc: step2.domicile_cert_doc || null
      },
      academic: {
        student_type: step3.student_type || 'college',
        school_name: step3.school_name || null,
        school_location: step3.school_location || null,
        class_standard: step3.class_standard || null,
        education_level: isSchool ? 'school' : (step3.education_level || 'undergraduate').toLowerCase(),
        course: step3.course || '',
        branch: step3.branch || '',
        institution: step3.institution || step3.school_name || '',
        year_of_study: toNum(step3.year_of_study, null),
        semester: toNum(step3.semester, null),
        course_type: (step3.course_type || 'government').toLowerCase(),
        college_location: step3.college_location || step3.school_location || '',
        currently_studying: step3.currently_studying === 'Yes' ? 1 : 0,
        school_id_doc: step3.school_id_doc || null,
        college_id_doc: step3.college_id_doc || null
      },
      performance: {
        tenth_percentage: toNum(step4.tenth_percentage, null),
        twelfth_percentage: toNum(step4.twelfth_percentage, null),
        current_cgpa: toNum(step4.current_cgpa, null),
        prev_sem_cgpa: toNum(step4.prev_sem_cgpa, null),
        has_backlogs: step4.has_backlogs === 'Yes' ? 1 : 0,
        backlog_count: toNum(step4.backlog_count, 0),
        academic_year: step4.academic_year || '2025-26',
        achievements: step4.achievements || '',
        tenth_marksheet_doc: step4.tenth_marksheet_doc || null,
        twelfth_marksheet_doc: step4.twelfth_marksheet_doc || null,
        current_marksheet_doc: step4.current_marksheet_doc || null
      },
      financial: {
        annual_income: toNum(step5.annual_income, 0),
        income_cert_status: step5.income_cert_status || 'Available',
        father_name: step5.father_name || '',
        father_occupation: step5.father_occupation || '',
        father_income: toNum(step5.father_income, null),
        father_doc: step5.father_doc || null,
        mother_name: step5.mother_name || '',
        mother_occupation: step5.mother_occupation || '',
        mother_income: toNum(step5.mother_income, null),
        mother_doc: step5.mother_doc || null,
        family_size: toNum(step5.family_size, null),
        sibling_count: toNum(step5.sibling_count, 0),
        siblings_studying: toNum(step5.siblings_studying, 0),
        first_gen_graduate: step5.first_gen_graduate === 'Yes' ? 1 : 0,
        income_cert_doc: step5.income_cert_doc || null
      },
      bank: {
        has_bank_account: step6.has_bank_account === 'Yes' ? 1 : 0,
        account_holder_name: step6.account_holder_name || '',
        bank_name: step6.bank_name || '',
        aadhaar_linked: step6.aadhaar_linked === 'Yes' ? 1 : 0,
        dbt_enabled: step6.dbt_enabled === 'Yes' ? 1 : 0,
        passbook_doc: step6.passbook_doc || null
      }
    };

    try {
      await studentService.submitEligibility(payload);
      setSuccess('Eligibility submitted successfully! Calculating your matched scholarships...');
      // Clear persistent draft
      try { localStorage.removeItem('scholaro_eligibility_draft_v3'); } catch {}
      setTimeout(() => {
        navigate('/results');
      }, 1000);
    } catch (err) {
      console.error('Eligibility Submit Error:', err);
      const msg = err.customMessage || err.response?.data?.message || err.message || 'Unable to save eligibility. Please check your network and try again.';
      setError(msg);
      setLoading(false);
      setTimeout(() => {
        const el = document.getElementById('review-error-box') || document.getElementById('top-error-box');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  };

  const documentSummary = [
    { label: 'Aadhaar Card', val: step1?.aadhaar_doc, req: false },
    { label: 'Passport Photo', val: step1?.photo_doc, req: false },
    { label: 'Signature', val: step1?.signature_doc, req: false },
    { label: 'Community Certificate', val: step2?.community_cert_doc, req: false },
    { label: 'Domicile Proof', val: step2?.domicile_cert_doc, req: false },
    { label: isSchool ? 'School ID / Bonafide' : 'College ID / Bonafide', val: isSchool ? step3?.school_id_doc : step3?.college_id_doc, req: false },
    { label: '10th / SSLC Marksheet', val: step4?.tenth_marksheet_doc, req: false },
    { label: '12th / HSC Marksheet', val: step4?.twelfth_marksheet_doc, req: false },
    { label: isSchool ? 'Current Academic Progress Card' : 'Current Semester Marksheet', val: step4?.current_marksheet_doc, req: false },
    { label: 'Income Certificate', val: step5?.income_cert_doc, req: false },
    { label: 'Father Document', val: step5?.father_doc, req: false },
    { label: 'Mother Document', val: step5?.mother_doc, req: false },
    { label: 'Bank Passbook', val: step6?.passbook_doc, req: false }
  ];

  return (
    <div className="review-container">
      <div className="review-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Review Your Information</h2>
          <p className="text-secondary" style={{ margin: '4px 0 0 0' }}>Please carefully verify all your details before final submission.</p>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#059669', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
          <span>✓</span> Auto-saved latest changes
        </div>
      </div>

      {error && <div id="top-error-box" className="mb-4"><Alert type="error" message={error} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

      {/* Section 1: Personal Details */}
      <Card className="review-section-card">
        <CardBody>
          <div className="review-header">
            <h3>1. Personal Details</h3>
            <Button variant="outline" size="small" onClick={() => { goToStep(1); navigate('/eligibility/step-1'); }}>Edit</Button>
          </div>
          <div className="review-data-grid">
            <div className="review-data-item"><span className="label">Full Name</span><span className="value">{step1?.full_name || '-'}</span></div>
            <div className="review-data-item"><span className="label">Date of Birth</span><span className="value">{step1?.dob || '-'}</span></div>
            <div className="review-data-item"><span className="label">Gender</span><span className="value">{step1?.gender || '-'}</span></div>
            <div className="review-data-item"><span className="label">Mobile Number</span><span className="value">{step1?.mobile || '-'}</span></div>
            <div className="review-data-item"><span className="label">Email Address</span><span className="value">{step1?.email || '-'}</span></div>
            <div className="review-data-item"><span className="label">Religion</span><span className="value">{step1?.religion || '-'}</span></div>
            <div className="review-data-item"><span className="label">Marital Status</span><span className="value">{step1?.marital_status || '-'}</span></div>
          </div>
        </CardBody>
      </Card>

      {/* Section 2: Community & Residence */}
      <Card className="review-section-card">
        <CardBody>
          <div className="review-header">
            <h3>2. Community & Residence Details</h3>
            <Button variant="outline" size="small" onClick={() => { goToStep(2); navigate('/eligibility/step-2'); }}>Edit</Button>
          </div>
          <div className="review-data-grid">
            <div className="review-data-item"><span className="label">Community / Category</span><span className="value">{step2?.community || '-'}</span></div>
            <div className="review-data-item"><span className="label">Certificate Status</span><span className="value">{step2?.caste_cert_status || '-'}</span></div>
            <div className="review-data-item"><span className="label">Country</span><span className="value">{step2?.country || '-'}</span></div>
            <div className="review-data-item"><span className="label">State</span><span className="value">{step2?.state || '-'}</span></div>
            <div className="review-data-item"><span className="label">District</span><span className="value">{step2?.district || '-'}</span></div>
            <div className="review-data-item"><span className="label">TN Resident</span><span className="value">{step2?.tn_resident || '-'}</span></div>
          </div>
        </CardBody>
      </Card>

      {/* Section 3: Academic Details */}
      <Card className="review-section-card">
        <CardBody>
          <div className="review-header">
            <h3>3. Academic Details ({isSchool ? 'School Student' : 'College Student'})</h3>
            <Button variant="outline" size="small" onClick={() => { goToStep(3); navigate('/eligibility/step-3'); }}>Edit</Button>
          </div>
          <div className="review-data-grid">
            {isSchool ? (
              <>
                <div className="review-data-item"><span className="label">School Name</span><span className="value">{step3?.school_name || '-'}</span></div>
                <div className="review-data-item"><span className="label">School Location</span><span className="value">{step3?.school_location || '-'}</span></div>
                <div className="review-data-item"><span className="label">Class / Standard</span><span className="value">{step3?.class_standard || '-'}</span></div>
                <div className="review-data-item"><span className="label">Currently Studying</span><span className="value">{step3?.currently_studying || '-'}</span></div>
              </>
            ) : (
              <>
                <div className="review-data-item"><span className="label">College Name</span><span className="value">{step3?.institution || '-'}</span></div>
                <div className="review-data-item"><span className="label">College Location</span><span className="value">{step3?.college_location || '-'}</span></div>
                <div className="review-data-item"><span className="label">Course / Degree</span><span className="value">{step3?.course || '-'}</span></div>
                <div className="review-data-item"><span className="label">Branch / Department</span><span className="value">{step3?.branch || '-'}</span></div>
                <div className="review-data-item"><span className="label">Year of Study</span><span className="value">{step3?.year_of_study ? `${step3.year_of_study} Year` : '-'}</span></div>
                <div className="review-data-item"><span className="label">Semester</span><span className="value">{step3?.semester ? `Sem ${step3.semester}` : '-'}</span></div>
                <div className="review-data-item"><span className="label">Institution Type</span><span className="value">{step3?.course_type || '-'}</span></div>
                <div className="review-data-item"><span className="label">Currently Studying</span><span className="value">{step3?.currently_studying || '-'}</span></div>
              </>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Section 4: Academic Performance */}
      <Card className="review-section-card">
        <CardBody>
          <div className="review-header">
            <h3>4. Academic Performance</h3>
            <Button variant="outline" size="small" onClick={() => { goToStep(4); navigate('/eligibility/step-4'); }}>Edit</Button>
          </div>
          <div className="review-data-grid">
            <div className="review-data-item"><span className="label">10th Percentage</span><span className="value">{step4?.tenth_percentage ? `${step4.tenth_percentage}%` : '-'}</span></div>
            <div className="review-data-item"><span className="label">12th Percentage</span><span className="value">{step4?.twelfth_percentage ? `${step4.twelfth_percentage}%` : '-'}</span></div>
            <div className="review-data-item"><span className="label">Current CGPA / %</span><span className="value">{step4?.current_cgpa || '-'}</span></div>
            {!isSchool && <div className="review-data-item"><span className="label">Prev Sem CGPA</span><span className="value">{step4?.prev_sem_cgpa || '-'}</span></div>}
            {!isSchool && <div className="review-data-item"><span className="label">Active Backlogs</span><span className="value">{step4?.has_backlogs === 'Yes' ? `Yes (${step4.backlog_count || 0})` : 'No'}</span></div>}
            <div className="review-data-item"><span className="label">Academic Year</span><span className="value">{step4?.academic_year || '-'}</span></div>
          </div>
        </CardBody>
      </Card>

      {/* Section 5: Family & Financial Details */}
      <Card className="review-section-card">
        <CardBody>
          <div className="review-header">
            <h3>5. Family & Financial Details</h3>
            <Button variant="outline" size="small" onClick={() => { goToStep(5); navigate('/eligibility/step-5'); }}>Edit</Button>
          </div>
          <div className="review-data-grid">
            <div className="review-data-item"><span className="label">Annual Family Income</span><span className="value">{step5?.annual_income ? `₹${step5.annual_income}` : '-'}</span></div>
            <div className="review-data-item"><span className="label">Income Cert Status</span><span className="value">{step5?.income_cert_status || '-'}</span></div>
            <div className="review-data-item"><span className="label">Father Name</span><span className="value">{step5?.father_name || '-'}</span></div>
            <div className="review-data-item"><span className="label">Father Occupation</span><span className="value">{step5?.father_occupation || '-'}</span></div>
            <div className="review-data-item"><span className="label">Mother Name</span><span className="value">{step5?.mother_name || '-'}</span></div>
            <div className="review-data-item"><span className="label">Mother Occupation</span><span className="value">{step5?.mother_occupation || '-'}</span></div>
            <div className="review-data-item"><span className="label">Family Size</span><span className="value">{step5?.family_size || '-'}</span></div>
            <div className="review-data-item"><span className="label">First-Gen Graduate</span><span className="value">{step5?.first_gen_graduate || '-'}</span></div>
          </div>
        </CardBody>
      </Card>

      {/* Section 6: Bank Details */}
      <Card className="review-section-card">
        <CardBody>
          <div className="review-header">
            <h3>6. Bank & DBT Details</h3>
            <Button variant="outline" size="small" onClick={() => { goToStep(6); navigate('/eligibility/step-6'); }}>Edit</Button>
          </div>
          <div className="review-data-grid">
            <div className="review-data-item"><span className="label">Active Bank Account</span><span className="value">{step6?.has_bank_account || '-'}</span></div>
            {step6?.has_bank_account === 'Yes' && (
              <>
                <div className="review-data-item"><span className="label">Account Holder Name</span><span className="value">{step6?.account_holder_name || '-'}</span></div>
                <div className="review-data-item"><span className="label">Bank Name</span><span className="value">{step6?.bank_name || '-'}</span></div>
                <div className="review-data-item"><span className="label">Aadhaar Linked</span><span className="value">{step6?.aadhaar_linked || '-'}</span></div>
                <div className="review-data-item"><span className="label">DBT Enabled</span><span className="value">{step6?.dbt_enabled || '-'}</span></div>
              </>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Section 7: Uploaded Documents Summary */}
      <Card className="review-section-card">
        <CardBody>
          <div className="review-header">
            <h3>7. Uploaded Documents Summary</h3>
          </div>
          <div className="review-data-grid">
            {documentSummary.map((doc, idx) => (
              <div key={idx} className="review-data-item">
                <span className="label">{doc.label} {doc.req && <span style={{ color: 'var(--color-danger, #ef4444)' }}>*</span>}</span>
                <span className="value">
                  {doc.val ? (
                    <span style={{ color: 'var(--color-success, #10b981)', fontWeight: 'bold' }}>✓ Uploaded ({doc.val})</span>
                  ) : doc.req ? (
                    <span style={{ color: 'var(--color-danger, #ef4444)', fontWeight: 'bold' }}>✗ Missing (Required)</span>
                  ) : (
                    <span style={{ color: 'var(--color-text-secondary)' }}>- Not Uploaded (Optional)</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Alert type="info" message="Disclaimer: Scholarship matching results are calculated automatically based on your submitted profile against available eligibility rules." />

      {error && (
        <div id="review-error-box" className="mt-4 mb-4" style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: '#b91c1c', fontWeight: '600', fontSize: '0.95rem' }}>
            ⚠️ {error}
          </div>
          {(error.toLowerCase().includes('authorized') || error.toLowerCase().includes('token') || error.toLowerCase().includes('session') || error.toLowerCase().includes('log in') || error.toLowerCase().includes('login')) ? (
            <div style={{ marginTop: '12px', background: '#ffffff', borderRadius: '6px', padding: '14px', border: '1px solid #fca5a5' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#374151', lineHeight: '1.4' }}>
                Your login session has expired. <strong>All your entered information and documents are safely auto-saved in your browser.</strong>
              </p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  onClick={() => navigate('/login', { state: { from: '/eligibility/review' } })}
                  style={{ background: '#059669', borderColor: '#059669', color: '#fff', fontWeight: '600' }}
                >
                  🔑 Log In to Complete Submission →
                </Button>
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                  (You will return right back to this review page with all details intact)
                </span>
              </div>
            </div>
          ) : errorStep && (
            <div style={{ marginTop: '10px' }}>
              <Button
                variant="outline"
                size="small"
                onClick={() => { goToStep(errorStep); navigate(`/eligibility/step-${errorStep}`); }}
              >
                Go to Step {errorStep} to Fix →
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="step-actions mt-6">
        <Button variant="outline" type="button" onClick={() => { goToStep(6); navigate('/eligibility/step-6'); }}>Back</Button>
        <Button onClick={handleSubmit} disabled={loading} style={{ minWidth: '180px' }}>
          {loading ? 'Submitting & Matching...' : 'Submit Eligibility'}
        </Button>
      </div>
    </div>
  );
}
