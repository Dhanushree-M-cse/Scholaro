import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { studentService } from '../services/studentService';

const EligibilityContext = createContext(null);

const INITIAL_STEP1 = {
  full_name: '', dob: '', gender: '', mobile: '', email: '',
  religion: '', marital_status: '',
  aadhaar_doc: null, photo_doc: null, signature_doc: null,
};

const INITIAL_STEP2 = {
  community: '', caste_cert_status: 'Available', country: 'India', domicile: 'Tamil Nadu',
  state: 'Tamil Nadu', district: '', tn_resident: 'Yes',
  community_cert_doc: null, domicile_cert_doc: null,
};

const INITIAL_STEP3 = {
  student_type: 'college', // 'school' | 'college'
  school_name: '', school_location: '', class_standard: '',
  course: '', branch: '', institution: '', year_of_study: '', semester: '',
  course_type: 'Government', college_location: '', currently_studying: 'Yes',
  school_id_doc: null, college_id_doc: null,
};

const INITIAL_STEP4 = {
  tenth_percentage: '', twelfth_percentage: '', current_cgpa: '',
  prev_sem_cgpa: '', has_backlogs: 'No', backlog_count: '0',
  academic_year: '2025-26', achievements: '',
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

const STORAGE_KEY = 'scholaro_eligibility_draft_v3';

const loadSavedDraft = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const EligibilityProvider = ({ children }) => {
  const initialDraft = loadSavedDraft();

  const [step1, setStep1Raw] = useState(initialDraft?.step1 || INITIAL_STEP1);
  const [step2, setStep2Raw] = useState(initialDraft?.step2 || INITIAL_STEP2);
  const [step3, setStep3Raw] = useState(initialDraft?.step3 || INITIAL_STEP3);
  const [step4, setStep4Raw] = useState(initialDraft?.step4 || INITIAL_STEP4);
  const [step5, setStep5Raw] = useState(initialDraft?.step5 || INITIAL_STEP5);
  const [step6, setStep6Raw] = useState(initialDraft?.step6 || INITIAL_STEP6);
  const [currentStep, setCurrentStep] = useState(initialDraft?.currentStep || 1);
  const [lastSaved, setLastSaved] = useState(initialDraft ? 'Saved' : null);

  // Keep a ref of latest states for atomic persistence
  const stateRef = useRef({ step1, step2, step3, step4, step5, step6, currentStep });
  useEffect(() => {
    stateRef.current = { step1, step2, step3, step4, step5, step6, currentStep };
  }, [step1, step2, step3, step4, step5, step6, currentStep]);

  const saveToStorage = useCallback((customState = {}) => {
    try {
      const payload = {
        ...stateRef.current,
        ...customState,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setLastSaved('Saved');
    } catch (e) {
      console.warn('Auto-save error:', e);
    }
  }, []);

  // On mount, if user is logged in, try loading pre-existing student profile from database
  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('scholaro_token');
    if (!token) return;

    studentService.getProfile()
      .then((profile) => {
        if (!isMounted || !profile) return;
        const currentSaved = loadSavedDraft();

        // If local draft is empty or missing full_name, hydrate from backend profile
        if (!currentSaved?.step1?.full_name && profile.full_name) {
          const hydratedStep1 = {
            ...INITIAL_STEP1,
            full_name: profile.full_name || '',
            email: profile.email || '',
            mobile: profile.mobile || '',
            dob: profile.personal?.dob ? profile.personal.dob.split('T')[0] : '',
            gender: profile.personal?.gender || '',
            religion: profile.personal?.religion || '',
            marital_status: profile.personal?.marital_status || '',
            aadhaar_doc: profile.personal?.aadhaar_doc || null,
            photo_doc: profile.personal?.photo_doc || null,
            signature_doc: profile.personal?.signature_doc || null,
          };
          setStep1Raw(hydratedStep1);
          saveToStorage({ step1: hydratedStep1 });
        }

        if (!currentSaved?.step2?.community && profile.community) {
          const hydratedStep2 = {
            ...INITIAL_STEP2,
            community: profile.community.community || '',
            caste_cert_status: profile.community.caste_certificate || 'Available',
            country: profile.community.country || 'India',
            domicile: profile.community.domicile || 'Tamil Nadu',
            state: profile.community.state || 'Tamil Nadu',
            district: profile.community.district || '',
            tn_resident: profile.community.tn_resident ? 'Yes' : 'No',
            community_cert_doc: profile.community.community_cert_doc || null,
          };
          setStep2Raw(hydratedStep2);
          saveToStorage({ step2: hydratedStep2 });
        }

        if (!currentSaved?.step3?.institution && profile.academic) {
          const hydratedStep3 = {
            ...INITIAL_STEP3,
            student_type: profile.academic.student_type || 'college',
            school_name: profile.academic.school_name || '',
            school_location: profile.academic.school_location || '',
            class_standard: profile.academic.class_standard || '',
            course: profile.academic.course || '',
            branch: profile.academic.branch || '',
            institution: profile.academic.institution || '',
            year_of_study: profile.academic.year_of_study ? String(profile.academic.year_of_study) : '',
            semester: profile.academic.semester ? String(profile.academic.semester) : '',
            course_type: profile.academic.course_type || 'Government',
            college_location: profile.academic.college_location || '',
            currently_studying: profile.academic.currently_studying ? 'Yes' : 'No',
            school_id_doc: profile.academic.school_id_doc || null,
            college_id_doc: profile.academic.college_id_doc || null,
          };
          setStep3Raw(hydratedStep3);
          saveToStorage({ step3: hydratedStep3 });
        }
      })
      .catch(() => {
        // Ignore network / offline error on profile prefill
      });

    return () => {
      isMounted = false;
    };
  }, [saveToStorage]);

  const setStep1 = useCallback((data) => {
    setStep1Raw(data);
    saveToStorage({ step1: data });
  }, [saveToStorage]);

  const setStep2 = useCallback((data) => {
    setStep2Raw(data);
    saveToStorage({ step2: data });
  }, [saveToStorage]);

  const setStep3 = useCallback((data) => {
    setStep3Raw(data);
    saveToStorage({ step3: data });
  }, [saveToStorage]);

  const setStep4 = useCallback((data) => {
    setStep4Raw(data);
    saveToStorage({ step4: data });
  }, [saveToStorage]);

  const setStep5 = useCallback((data) => {
    setStep5Raw(data);
    saveToStorage({ step5: data });
  }, [saveToStorage]);

  const setStep6 = useCallback((data) => {
    setStep6Raw(data);
    saveToStorage({ step6: data });
  }, [saveToStorage]);

  const goToStep = useCallback((n) => {
    setCurrentStep(n);
    saveToStorage({ currentStep: n });
  }, [saveToStorage]);

  const resetEligibility = useCallback(() => {
    setStep1Raw(INITIAL_STEP1);
    setStep2Raw(INITIAL_STEP2);
    setStep3Raw(INITIAL_STEP3);
    setStep4Raw(INITIAL_STEP4);
    setStep5Raw(INITIAL_STEP5);
    setStep6Raw(INITIAL_STEP6);
    setCurrentStep(1);
    setLastSaved(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return (
    <EligibilityContext.Provider value={{
      step1, step2, step3, step4, step5, step6,
      setStep1, setStep2, setStep3, setStep4, setStep5, setStep6,
      currentStep, goToStep, resetEligibility,
      lastSaved
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
