import React, { createContext, useContext, useState, useCallback } from 'react';

const EligibilityContext = createContext(null);

const INITIAL_STEP1 = {
  full_name: '', dob: '', gender: '', mobile: '', email: '',
  religion: '', marital_status: '',
  aadhaar_doc: null, photo_doc: null, signature_doc: null,
};

const INITIAL_STEP2 = {
  community: '', caste_cert_status: '', country: 'India', domicile: 'Tamil Nadu',
  state: 'Tamil Nadu', district: '', tn_resident: 'Yes',
  community_cert_doc: null, domicile_cert_doc: null,
};

const INITIAL_STEP3 = {
  student_type: 'college', // 'school' | 'college'
  school_name: '', school_location: '', class_standard: '',
  course: '', branch: '', institution: '', year_of_study: '', semester: '',
  course_type: '', college_location: '', currently_studying: 'Yes',
  school_id_doc: null, college_id_doc: null,
};

const INITIAL_STEP4 = {
  tenth_percentage: '', twelfth_percentage: '', current_cgpa: '',
  prev_sem_cgpa: '', has_backlogs: 'No', backlog_count: '0',
  academic_year: '', achievements: '',
  tenth_marksheet_doc: null, twelfth_marksheet_doc: null, current_marksheet_doc: null,
};

const INITIAL_STEP5 = {
  annual_income: '', income_cert_status: 'Available',
  father_name: '', father_occupation: '', father_income: '', father_doc: null,
  mother_name: '', mother_occupation: '', mother_income: '', mother_doc: null,
  family_size: '', sibling_count: '0', siblings_studying: '0',
  first_gen_graduate: 'No', income_cert_doc: null,
};

const INITIAL_STEP6 = {
  has_bank_account: 'Yes', account_holder_name: '', bank_name: '',
  aadhaar_linked: 'Yes', dbt_enabled: 'Yes', passbook_doc: null,
};

const STORAGE_KEY = 'scholaro_eligibility_draft_v2';

const loadDraft = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const EligibilityProvider = ({ children }) => {
  const draft = loadDraft();

  const [step1, setStep1Raw] = useState(draft?.step1 || INITIAL_STEP1);
  const [step2, setStep2Raw] = useState(draft?.step2 || INITIAL_STEP2);
  const [step3, setStep3Raw] = useState(draft?.step3 || INITIAL_STEP3);
  const [step4, setStep4Raw] = useState(draft?.step4 || INITIAL_STEP4);
  const [step5, setStep5Raw] = useState(draft?.step5 || INITIAL_STEP5);
  const [step6, setStep6Raw] = useState(draft?.step6 || INITIAL_STEP6);
  const [currentStep, setCurrentStep] = useState(draft?.currentStep || 1);

  const persist = useCallback((updates) => {
    const state = { step1, step2, step3, step4, step5, step6, currentStep, ...updates };
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [step1, step2, step3, step4, step5, step6, currentStep]);

  const setStep1 = (data) => { setStep1Raw(data); persist({ step1: data }); };
  const setStep2 = (data) => { setStep2Raw(data); persist({ step2: data }); };
  const setStep3 = (data) => { setStep3Raw(data); persist({ step3: data }); };
  const setStep4 = (data) => { setStep4Raw(data); persist({ step4: data }); };
  const setStep5 = (data) => { setStep5Raw(data); persist({ step5: data }); };
  const setStep6 = (data) => { setStep6Raw(data); persist({ step6: data }); };
  const goToStep = (n) => { setCurrentStep(n); persist({ currentStep: n }); };

  const resetEligibility = () => {
    setStep1Raw(INITIAL_STEP1); setStep2Raw(INITIAL_STEP2);
    setStep3Raw(INITIAL_STEP3); setStep4Raw(INITIAL_STEP4);
    setStep5Raw(INITIAL_STEP5); setStep6Raw(INITIAL_STEP6);
    setCurrentStep(1);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return (
    <EligibilityContext.Provider value={{
      step1, step2, step3, step4, step5, step6,
      setStep1, setStep2, setStep3, setStep4, setStep5, setStep6,
      currentStep, goToStep, resetEligibility,
    }}>
      {children}
    </EligibilityContext.Provider>
  );
};

export const useEligibility = () => {
  const ctx = useContext(EligibilityContext);
  if (!ctx) throw new Error('useEligibility must be used inside EligibilityProvider');
  return ctx;
};

export default EligibilityContext;
