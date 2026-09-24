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
  const [success, setSuccess] = useState('');

  const isSchool = step3?.student_type === 'school';

  const validateAll = () => {
    // Step 1 Validation
    if (!step1?.full_name?.trim()) return 'Please enter your Full Name in Step 1.';
    if (!step1?.dob) return 'Please select your Date of Birth in Step 1.';
    if (!step1?.gender) return 'Please select your Gender in Step 1.';
    if (!step1?.aadhaar_doc) return 'Please upload your Aadhaar Card.';
    if (!step1?.photo_doc) return 'Please upload your Passport Photo.';
    if (!step1?.signature_doc) return 'Please upload your Signature.';

    // Step 2 Validation
    if (!step2?.community) return 'Please select your Community/Category in Step 2.';
    if (!step2?.country) return 'Please select your Country in Step 2.';
    if (step2?.country === 'India') {
      if (!step2?.state) return 'Please select your State in Step 2.';
      if (!step2?.district) return 'Please select your District in Step 2.';
    }
    if (['BC', 'MBC', 'DNC', 'SC', 'ST'].includes(step2?.community) && step2?.caste_cert_status === 'Available' && !step2?.community_cert_doc) {
      return `Please upload your Community Certificate for category ${step2.community}.`;
    }

    // Step 3 Validation
    if (isSchool) {
      if (!step3?.school_name?.trim()) return 'Please enter your School Name in Step 3.';
      if (!step3?.class_standard) return 'Please select your Class/Standard in Step 3.';
      if (!step3?.school_id_doc) return 'Please upload your School ID / Bonafide Certificate.';
    } else {
      if (!step3?.institution?.trim()) return 'Please enter your College Name in Step 3.';
      if (!step3?.course?.trim()) return 'Please enter your Course / Degree in Step 3.';
      if (!step3?.branch?.trim()) return 'Please enter your Branch / Department in Step 3.';
      if (!step3?.college_id_doc) return 'Please upload your College ID / Bonafide Certificate.';
    }

    // Step 4 Validation
    if (!isSchool) {
      if (!step4?.tenth_percentage) return 'Please enter your 10th Percentage in Step 4.';
      if (!step4?.tenth_marksheet_doc) return 'Please upload your 10th/SSLC Marksheet.';
      if (step4?.twelfth_percentage && !step4?.twelfth_marksheet_doc) {
        return 'Please upload your 12th/HSC Marksheet.';
      }
      if (!step4?.current_cgpa) return 'Please enter your Current CGPA in Step 4.';
      if (!step4?.current_marksheet_doc) return 'Please upload your Current Semester Marksheet.';
    } else {
      if (!step4?.current_marksheet_doc) return 'Please upload your Current Academic Marksheet / Report Card.';
    }

    // Step 5 Validation
    if (!step5?.annual_income) return 'Please enter your Annual Family Income in Step 5.';
    if (!step5?.father_name?.trim()) return 'Please enter your Father Name in Step 5.';
    if (!step5?.mother_name?.trim()) return 'Please enter your Mother Name in Step 5.';
    if (step5?.income_cert_status === 'Available' && !step5?.income_cert_doc) {
      return 'Please upload your Income Certificate.';
    }

    // Step 6 Validation
    if (step6?.has_bank_account === 'Yes') {
      if (!step6?.account_holder_name?.trim()) return 'Please enter the Bank Account Holder Name in Step 6.';
      if (!step6?.bank_name?.trim()) return 'Please enter the Bank Name in Step 6.';
      if (!step6?.passbook_doc) return 'Please upload your Bank Passbook Front Page.';
    }

    return null;
  };

  const handleSubmit = async () => {
    if (loading) return;
    setError('');
    setSuccess('');

    const valErr = validateAll();
    if (valErr) {
      setError(valErr);
      return;
    }

    setLoading(true);

    const payload = {
      personal: {
        full_name: step1.full_name,
        dob: step1.dob,
        gender: step1.gender,
        mobile: step1.mobile,
        email: step1.email,
        religion: step1.religion,
        marital_status: step1.marital_status,
        aadhaar_doc: step1.aadhaar_doc,
        photo_doc: step1.photo_doc,
        signature_doc: step1.signature_doc
      },
      community: {
        community: step2.community,
        caste_certificate: step2.caste_cert_status,
        country: step2.country,
        domicile: step2.domicile,
        state: step2.state,
        district: step2.district,
        tn_resident: step2.tn_resident === 'Yes' ? 1 : 0,
        community_cert_doc: step2.community_cert_doc,
        domicile_cert_doc: step2.domicile_cert_doc
      },
      academic: {
        student_type: step3.student_type,
        school_name: step3.school_name,
        school_location: step3.school_location,
        class_standard: step3.class_standard,
        education_level: isSchool ? 'school' : 'undergraduate',
        course: step3.course,
        branch: step3.branch,
        institution: step3.institution || step3.school_name,
        year_of_study: step3.year_of_study ? parseInt(step3.year_of_study) : null,
        semester: step3.semester ? parseInt(step3.semester) : null,
        course_type: step3.course_type?.toLowerCase() || 'government',
        college_location: step3.college_location || step3.school_location,
        currently_studying: step3.currently_studying === 'Yes' ? 1 : 0,
        school_id_doc: step3.school_id_doc,
        college_id_doc: step3.college_id_doc
      },
      performance: {
        tenth_percentage: step4.tenth_percentage ? parseFloat(step4.tenth_percentage) : null,
        twelfth_percentage: step4.twelfth_percentage ? parseFloat(step4.twelfth_percentage) : null,
        current_cgpa: step4.current_cgpa ? parseFloat(step4.current_cgpa) : null,
        prev_sem_cgpa: step4.prev_sem_cgpa ? parseFloat(step4.prev_sem_cgpa) : null,
        has_backlogs: step4.has_backlogs === 'Yes' ? 1 : 0,
        backlog_count: step4.backlog_count ? parseInt(step4.backlog_count) : 0,
        academic_year: step4.academic_year,
        achievements: step4.achievements,
        tenth_marksheet_doc: step4.tenth_marksheet_doc,
        twelfth_marksheet_doc: step4.twelfth_marksheet_doc,
        current_marksheet_doc: step4.current_marksheet_doc
      },
      financial: {
        annual_income: step5.annual_income ? parseFloat(step5.annual_income) : 0,
        income_cert_status: step5.income_cert_status,
        father_name: step5.father_name,
        father_occupation: step5.father_occupation,
        father_income: step5.father_income ? parseFloat(step5.father_income) : null,
        father_doc: step5.father_doc,
        mother_name: step5.mother_name,
        mother_occupation: step5.mother_occupation,
        mother_income: step5.mother_income ? parseFloat(step5.mother_income) : null,
        mother_doc: step5.mother_doc,
        family_size: step5.family_size ? parseInt(step5.family_size) : null,
        sibling_count: step5.sibling_count ? parseInt(step5.sibling_count) : 0,
        siblings_studying: step5.siblings_studying ? parseInt(step5.siblings_studying) : 0,
        first_gen_graduate: step5.first_gen_graduate === 'Yes' ? 1 : 0,
        income_cert_doc: step5.income_cert_doc
      },
      bank: {
        has_bank_account: step6.has_bank_account === 'Yes' ? 1 : 0,
        account_holder_name: step6.account_holder_name,
        bank_name: step6.bank_name,
        aadhaar_linked: step6.aadhaar_linked === 'Yes' ? 1 : 0,
        dbt_enabled: step6.dbt_enabled === 'Yes' ? 1 : 0,
        passbook_doc: step6.passbook_doc
      }
    };

    try {
      await studentService.submitEligibility(payload);
      setSuccess('Eligibility submitted successfully!');
      setTimeout(() => {
        navigate('/results');
      }, 1200);
    } catch (err) {
      console.error('Eligibility Submit Error:', err);
      const msg = err.customMessage || err.response?.data?.message || err.message || 'Unable to save eligibility. Please try again.';
      setError(msg);
      setLoading(false);
    }
  };

  const documentSummary = [
    { label: 'Aadhaar Card', val: step1?.aadhaar_doc, req: true },
    { label: 'Passport Photo', val: step1?.photo_doc, req: true },
    { label: 'Signature', val: step1?.signature_doc, req: true },
    { label: 'Community Certificate', val: step2?.community_cert_doc, req: step2?.community !== 'OC' },
    { label: 'Domicile Proof', val: step2?.domicile_cert_doc, req: false },
    { label: isSchool ? 'School ID / Bonafide' : 'College ID / Bonafide', val: isSchool ? step3?.school_id_doc : step3?.college_id_doc, req: true },
    { label: '10th / SSLC Marksheet', val: step4?.tenth_marksheet_doc, req: !isSchool },
    { label: '12th / HSC Marksheet', val: step4?.twelfth_marksheet_doc, req: false },
    { label: isSchool ? 'Current Academic Progress Card' : 'Current Semester Marksheet', val: step4?.current_marksheet_doc, req: true },
    { label: 'Income Certificate', val: step5?.income_cert_doc, req: step5?.income_cert_status === 'Available' },
    { label: 'Father Document', val: step5?.father_doc, req: false },
    { label: 'Mother Document', val: step5?.mother_doc, req: false },
    { label: 'Bank Passbook', val: step6?.passbook_doc, req: step6?.has_bank_account === 'Yes' }
  ];

  return (
    <div className="review-container">
      <h2>Review Your Information</h2>
      <p className="text-secondary mb-6">Please carefully verify all your details before final submission.</p>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

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

      <div className="step-actions mt-6">
        <Button variant="outline" type="button" onClick={() => { goToStep(6); navigate('/eligibility/step-6'); }}>Back</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <Loading size="small" text="Submitting..." /> : 'Submit Eligibility'}
        </Button>
      </div>
    </div>
  );
}
