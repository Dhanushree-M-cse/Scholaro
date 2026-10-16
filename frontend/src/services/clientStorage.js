// =============================================================================
// SCHOLARO — Client-Side Standalone Storage & Matching Engine
// Enables complete standalone frontend operation on Vercel without a database.
// =============================================================================

export const VERIFIED_SCHOLARSHIPS = [
  {
    id: 1,
    name: 'Central Sector Scheme of Scholarships for College and University Students',
    scholarship_name: 'Central Sector Scheme of Scholarships for College and University Students',
    provider: 'Department of Higher Education, Ministry of Education, Govt of India',
    category: 'central_government',
    description: 'Financial assistance to meritorious students from low-income families to meet day-to-day expenses while pursuing higher studies in colleges and universities.',
    education_level: 'undergraduate,postgraduate',
    benefits: 'Rs. 12,000 per annum at Graduation level for first three years and Rs. 20,000 per annum at Post-Graduation level.',
    required_documents: 'Aadhaar Card, Class 12th Marksheet, Family Income Certificate, Bank Passbook Front Page, Institution Bonafide Certificate',
    guidelines: 'Students must be in the top 20th percentile of successful candidates in Class 12. Apply via National Scholarship Portal.',
    official_url: 'https://scholarships.gov.in/',
    officialUrl: 'https://scholarships.gov.in/',
    application_url: 'https://scholarships.gov.in/',
    application_start: '2026-07-01',
    application_end: '2026-10-31',
    is_active: 1,
    criteria: {
      tn_resident_required: 0,
      education_level: 'undergraduate,postgraduate',
      min_twelfth_pct: 60.00,
      max_annual_income: 450000.00,
      bank_account_required: 1,
      dbt_required: 1
    }
  },
  {
    id: 2,
    name: 'Post-Matric Scholarship Scheme for SC / ST Students',
    scholarship_name: 'Post-Matric Scholarship Scheme for SC / ST Students',
    provider: 'Adi Dravidar and Tribal Welfare Department, Government of Tamil Nadu',
    category: 'tn_government',
    description: 'Comprehensive financial assistance including fee exemption and maintenance allowance for Scheduled Caste (SC) and Scheduled Tribe (ST) students pursuing higher secondary and higher education.',
    education_level: 'school,undergraduate,postgraduate',
    benefits: '100% compulsory non-refundable tuition and examination fee waiver plus monthly maintenance allowance.',
    required_documents: 'Community Certificate (SC/ST), Family Income Certificate, 10th & 12th Marksheets, School/College ID, Bank Passbook',
    guidelines: 'Applicant must belong to SC/ST community and be a resident of Tamil Nadu. Annual family income must be within government prescribed limit.',
    official_url: 'https://www.tnesevai.tn.gov.in/',
    officialUrl: 'https://www.tnesevai.tn.gov.in/',
    application_url: 'https://www.tnesevai.tn.gov.in/',
    application_start: '2026-07-01',
    application_end: '2026-11-30',
    is_active: 1,
    criteria: {
      community: 'SC,ST',
      tn_resident_required: 1,
      education_level: 'school,undergraduate,postgraduate',
      max_annual_income: 250000.00,
      bank_account_required: 1
    }
  },
  {
    id: 3,
    name: 'Free Education Scheme for BC / MBC / DNC Students',
    scholarship_name: 'Free Education Scheme for BC / MBC / DNC Students',
    provider: 'Backward Classes, Most Backward Classes & Minorities Welfare Department, Govt of Tamil Nadu',
    category: 'tn_government',
    description: 'Tuition fee reimbursement and free education support for BC, MBC, and DNC students enrolled in undergraduate degree courses in recognized institutions.',
    education_level: 'undergraduate',
    benefits: 'Complete tuition fee waiver and special fee reimbursement for 3 to 4 years of undergraduate study.',
    required_documents: 'Community Certificate (BC/MBC/DNC), Income Certificate, 10th & 12th Marksheets, College ID/Bonafide Certificate, Bank Passbook',
    guidelines: 'Must belong to BC, MBC, or DNC category and be a domicile resident of Tamil Nadu. Must be enrolled in a recognized college.',
    official_url: 'https://www.tnesevai.tn.gov.in/',
    officialUrl: 'https://www.tnesevai.tn.gov.in/',
    application_url: 'https://www.tnesevai.tn.gov.in/',
    application_start: '2026-07-15',
    application_end: '2026-11-15',
    is_active: 1,
    criteria: {
      community: 'BC,MBC,DNC',
      tn_resident_required: 1,
      education_level: 'undergraduate',
      max_annual_income: 250000.00
    }
  },
  {
    id: 4,
    name: 'Pudhumai Penn Scheme (Moovalur Ramamirtham Ammiyar Higher Education Assurance Scheme)',
    scholarship_name: 'Pudhumai Penn Scheme (Moovalur Ramamirtham Ammiyar Higher Education Assurance Scheme)',
    provider: 'Social Welfare and Women Empowerment Department, Govt of Tamil Nadu',
    category: 'tn_government',
    description: 'Financial assistance scheme aimed at promoting female higher education by providing Rs. 1,000 monthly financial aid to female students who completed schooling in TN Government schools.',
    education_level: 'undergraduate',
    benefits: 'Rs. 1,000 per month paid directly into the student\'s bank account via DBT until completion of degree/diploma.',
    required_documents: 'Aadhaar Card, Class 6th to 12th Govt School Study Proof Certificate, College Bonafide Certificate, Bank Passbook',
    guidelines: 'Female students who studied in Tamil Nadu Government Schools from Class 6 to 12 and are currently pursuing higher education in diploma or undergraduate degree.',
    official_url: 'https://www.penkalvi.tn.gov.in/',
    officialUrl: 'https://www.penkalvi.tn.gov.in/',
    application_url: 'https://www.penkalvi.tn.gov.in/',
    application_start: '2026-06-01',
    application_end: '2026-12-31',
    is_active: 1,
    criteria: {
      gender: 'Female',
      tn_resident_required: 1,
      education_level: 'undergraduate',
      bank_account_required: 1,
      dbt_required: 1
    }
  },
  {
    id: 5,
    name: 'Chief Minister\'s School Talent Search & Merit Award',
    scholarship_name: 'Chief Minister\'s School Talent Search & Merit Award',
    provider: 'School Education Department, Government of Tamil Nadu',
    category: 'tn_government',
    description: 'Merit scholarship award designed to encourage and financially support meritorious school students studying in Class 6 to 12 in Tamil Nadu.',
    education_level: 'school',
    benefits: 'Annual cash award of Rs. 10,000 and merit certificate from the Department of School Education.',
    required_documents: 'School Student ID Card, SSLC / Annual Progress Report Card, Aadhaar Card, Bank Passbook Front Page',
    guidelines: 'Student must be currently enrolled in Class 6th to 12th in a recognized Tamil Nadu school and demonstrate high academic performance.',
    official_url: 'https://www.tn.gov.in/',
    officialUrl: 'https://www.tn.gov.in/',
    application_url: 'https://www.tn.gov.in/',
    application_start: '2026-06-01',
    application_end: '2026-12-31',
    is_active: 1,
    criteria: {
      tn_resident_required: 1,
      education_level: 'school',
      min_tenth_pct: 60.00
    }
  },
  {
    id: 6,
    name: 'First-Generation Graduate Tuition Fee Concession',
    scholarship_name: 'First-Generation Graduate Tuition Fee Concession',
    provider: 'Directorate of Technical & Higher Education, Government of Tamil Nadu',
    category: 'tn_government',
    description: 'Complete tuition fee exemption for students who are the first person in their immediate family to pursue higher education degree courses.',
    education_level: 'undergraduate',
    benefits: 'Full tuition fee exemption for 4 years of undergraduate professional degree program.',
    required_documents: 'First Generation Graduate Certificate issued by Tahsildar, Family Tree Certificate, 10th & 12th Marksheets, Allotment Order',
    guidelines: 'Neither parents nor siblings of the applicant should have completed a graduate degree. Must be admitted via single window counseling.',
    official_url: 'https://www.tn.gov.in/',
    officialUrl: 'https://www.tn.gov.in/',
    application_url: 'https://www.tn.gov.in/',
    application_start: '2026-07-01',
    application_end: '2026-11-30',
    is_active: 1,
    criteria: {
      tn_resident_required: 1,
      education_level: 'undergraduate',
      first_gen_required: 1,
      min_twelfth_pct: 50.00
    }
  },
  {
    id: 7,
    name: 'PM YASASVI Central Sector Scheme for OBC, EBC and DNT Students',
    scholarship_name: 'PM YASASVI Central Sector Scheme for OBC, EBC and DNT Students',
    provider: 'Department of Social Justice and Empowerment, Government of India',
    category: 'central_government',
    description: 'Scholarship for meritorious students belonging to Other Backward Classes (OBC), Economically Backward Classes (EBC), and De-notified Tribes (DNT).',
    education_level: 'school,undergraduate,postgraduate',
    benefits: 'Academic allowance up to Rs. 20,000 per annum based on education level and course group.',
    required_documents: 'OBC / EBC / DNT Community Certificate, Income Certificate, Qualifying Marksheet, Aadhaar Card, Bank Passbook',
    guidelines: 'Apply online via the National Scholarship Portal (NSP). Annual family income limit must not exceed Rs. 2,50,000.',
    official_url: 'https://scholarships.gov.in/',
    officialUrl: 'https://scholarships.gov.in/',
    application_url: 'https://scholarships.gov.in/',
    application_start: '2026-07-01',
    application_end: '2026-10-31',
    is_active: 1,
    criteria: {
      community: 'BC,MBC,DNC,Others',
      tn_resident_required: 0,
      education_level: 'school,undergraduate,postgraduate',
      max_annual_income: 250000.00,
      bank_account_required: 1
    }
  }
];

export function runMatchingEngine(profile = {}) {
  const pPersonal = profile.personal || profile.step1 || {};
  const pCommunity = profile.community || profile.step2 || {};
  const pAcademic = profile.academic || profile.step3 || {};
  const pPerformance = profile.performance || profile.step4 || {};
  const pFinancial = profile.financial || profile.step5 || {};
  const pBank = profile.bank || profile.step6 || {};

  const isSchool = pAcademic.student_type === 'school';
  const educationLevel = (isSchool ? 'school' : (pAcademic.education_level || 'undergraduate')).toLowerCase();
  const userIncome = Number(pFinancial.annual_income || 0);
  const user10th = Number(pPerformance.tenth_percentage || 0);
  const user12th = Number(pPerformance.twelfth_percentage || 0);
  const userGender = pPersonal.gender || '';
  const userCommunity = pCommunity.community || '';
  const isTnResident = pCommunity.tn_resident === 1 || pCommunity.tn_resident === 'Yes' || (pCommunity.state || '').toLowerCase() === 'tamil nadu';
  const isFirstGen = pFinancial.first_gen_graduate === 1 || pFinancial.first_gen_graduate === 'Yes';
  const hasBank = pBank.has_bank_account === 1 || pBank.has_bank_account === 'Yes';
  const hasDbt = pBank.dbt_enabled === 1 || pBank.dbt_enabled === 'Yes';

  return VERIFIED_SCHOLARSHIPS.map(sch => {
    const c = sch.criteria || {};
    let totalCriteria = 0;
    let metCriteria = 0;
    const matched = [];
    const unmet = [];
    const reasons = [];
    let isEligible = true;

    const check = (condition, name, passMsg, failMsg) => {
      totalCriteria++;
      if (condition) {
        metCriteria++;
        matched.push(name);
        reasons.push(passMsg);
      } else {
        unmet.push(name);
        reasons.push(failMsg);
        isEligible = false;
      }
    };

    if (c.tn_resident_required) {
      check(isTnResident, 'tn_resident', 'Tamil Nadu residency verified', 'Tamil Nadu residency required');
    }

    if (c.education_level) {
      const levels = c.education_level.split(',').map(s => s.trim().toLowerCase());
      check(levels.includes(educationLevel) || levels.includes('all'), 'education_level', 'Education level matches', `Education level must be: ${c.education_level}`);
    }

    if (c.community) {
      const comms = c.community.split(',').map(s => s.trim().toLowerCase());
      check(comms.includes(userCommunity.toLowerCase()) || comms.includes('all'), 'community', `Community (${userCommunity || 'General'}) matches criteria`, `Community must be: ${c.community}`);
    }

    if (c.gender) {
      check(c.gender.toLowerCase() === userGender.toLowerCase(), 'gender', `Gender (${userGender}) matches scheme criteria`, `Open exclusively to ${c.gender} candidates`);
    }

    if (c.max_annual_income) {
      check(userIncome > 0 && userIncome <= c.max_annual_income, 'annual_income', `Annual family income (₹${userIncome.toLocaleString()}) within prescribed limit (₹${c.max_annual_income.toLocaleString()})`, `Family income exceeds limit of ₹${c.max_annual_income.toLocaleString()}`);
    }

    if (c.min_tenth_pct) {
      check(user10th >= c.min_tenth_pct, 'tenth_percentage', `10th marks (${user10th}%) meets minimum requirement (${c.min_tenth_pct}%)`, `10th percentage must be at least ${c.min_tenth_pct}%`);
    }

    if (c.min_twelfth_pct && !isSchool) {
      check(user12th >= c.min_twelfth_pct, 'twelfth_percentage', `12th marks (${user12th}%) meets minimum requirement (${c.min_twelfth_pct}%)`, `12th percentage must be at least ${c.min_twelfth_pct}%`);
    }

    if (c.first_gen_required) {
      check(isFirstGen, 'first_gen_graduate', 'First-generation graduate status confirmed', 'Applicant must be a First Generation Graduate');
    }

    if (c.bank_account_required) {
      check(hasBank, 'bank_account', 'Active bank account available', 'Active bank account required');
    }

    if (c.dbt_required) {
      check(hasDbt, 'dbt_enabled', 'Direct Benefit Transfer (DBT) enabled', 'Aadhaar-seeded bank account with DBT required');
    }

    const matchScore = totalCriteria > 0 ? Math.round((metCriteria / totalCriteria) * 100) : 100;

    return {
      id: sch.id,
      scholarship_id: sch.id,
      scholarship: sch,
      name: sch.name,
      scholarship_name: sch.name,
      provider: sch.provider,
      category: sch.category,
      benefits: sch.benefits,
      required_documents: sch.required_documents,
      official_url: sch.official_url,
      officialUrl: sch.official_url,
      application_url: sch.application_url,
      applicationUrl: sch.application_url,
      is_eligible: isEligible,
      matchPercentage: matchScore,
      match_score: matchScore,
      matched_criteria: matched,
      unmet_criteria: unmet,
      reasons: reasons
    };
  }).sort((a, b) => b.match_score - a.match_score);
}

// Client Storage API
export const clientStorage = {
  // Users
  getUsers() {
    try {
      const raw = localStorage.getItem('scholaro_users');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  registerUser({ full_name, name, email, mobile, password, role = 'student' }) {
    const users = this.getUsers();
    const user_name = full_name || name;
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const token = 'mock_jwt_' + existing.id + '_' + Date.now();
      return { user: existing, token };
    }
    const newUser = {
      id: Date.now(),
      full_name: user_name,
      name: user_name,
      email,
      mobile,
      role
    };
    users.push(newUser);
    try { localStorage.setItem('scholaro_users', JSON.stringify(users)); } catch {}
    const token = 'mock_jwt_' + newUser.id + '_' + Date.now();
    return { user: newUser, token };
  },
  loginUser({ email, password }) {
    const cleanEmail = (email || '').trim().toLowerCase();
    // Default demo student
    if (cleanEmail === 'dhanushreemeyyar271@gmail.com' || cleanEmail === 'mail2mdhanu@gmail.com') {
      const u = { id: 25, full_name: 'Dhanushree', name: 'Dhanushree', email: cleanEmail, role: 'student' };
      return { user: u, token: 'mock_jwt_25_' + Date.now() };
    }
    // Default admin
    if (cleanEmail === 'admin@scholaro.dev') {
      const u = { id: 1, full_name: 'SCHOLARO Admin', name: 'SCHOLARO Admin', email: cleanEmail, role: 'admin' };
      return { user: u, token: 'mock_jwt_1_' + Date.now() };
    }
    const users = this.getUsers();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (found) {
      return { user: found, token: 'mock_jwt_' + found.id + '_' + Date.now() };
    }
    // Auto-create on first login if not registered yet
    const autoUser = {
      id: Date.now(),
      full_name: cleanEmail.split('@')[0],
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      mobile: '9876543210',
      role: 'student'
    };
    users.push(autoUser);
    try { localStorage.setItem('scholaro_users', JSON.stringify(users)); } catch {}
    return { user: autoUser, token: 'mock_jwt_' + autoUser.id + '_' + Date.now() };
  },

  // Profile & Eligibility
  getProfile() {
    try {
      const raw = localStorage.getItem('scholaro_eligibility_draft_v3');
      if (raw) {
        const d = JSON.parse(raw);
        return {
          full_name: d.step1?.full_name || '',
          email: d.step1?.email || '',
          mobile: d.step1?.mobile || '',
          personal: d.step1,
          community: d.step2,
          academic: d.step3,
          performance: d.step4,
          financial: d.step5,
          bank: d.step6
        };
      }
    } catch {}
    return null;
  },
  saveEligibility(payload) {
    const matches = runMatchingEngine(payload);
    try {
      localStorage.setItem('scholaro_matched_results', JSON.stringify(matches));
    } catch {}
    return matches;
  },
  getResults() {
    try {
      const raw = localStorage.getItem('scholaro_matched_results');
      if (raw) return JSON.parse(raw);
      // Fallback: calculate from current draft
      const profile = this.getProfile();
      if (profile) {
        const matches = runMatchingEngine(profile);
        localStorage.setItem('scholaro_matched_results', JSON.stringify(matches));
        return matches;
      }
    } catch {}
    // Default: return all verified scholarships scored with default college student criteria
    return runMatchingEngine({
      community: { tn_resident: 'Yes', community: 'BC' },
      academic: { student_type: 'college', education_level: 'undergraduate' },
      financial: { annual_income: 150000 },
      performance: { tenth_percentage: 85, twelfth_percentage: 82 },
      bank: { has_bank_account: 'Yes', dbt_enabled: 'Yes' }
    });
  },

  // Saved Bookmarks
  getSaved() {
    try {
      const raw = localStorage.getItem('scholaro_saved_scholarships');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  saveScholarship(id) {
    const saved = this.getSaved();
    const target = VERIFIED_SCHOLARSHIPS.find(s => s.id === Number(id));
    if (target && !saved.find(s => s.id === target.id)) {
      saved.push(target);
      try { localStorage.setItem('scholaro_saved_scholarships', JSON.stringify(saved)); } catch {}
    }
    return { success: true };
  },
  unsaveScholarship(id) {
    let saved = this.getSaved();
    saved = saved.filter(s => s.id !== Number(id) && s.scholarship_id !== Number(id));
    try { localStorage.setItem('scholaro_saved_scholarships', JSON.stringify(saved)); } catch {}
    return { success: true };
  }
};
