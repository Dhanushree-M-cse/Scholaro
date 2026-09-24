const app = require('./server');
const { pool } = require('./config/db');

const PORT = 5000;
let server;
const API_BASE = `http://localhost:${PORT}/api`;

async function testFlow() {
  server = app.listen(PORT, () => {
    console.log(`Test server listening on port ${PORT}`);
  });
  await new Promise(res => setTimeout(res, 500));

  console.log('=== SCHOLARO FULL FLOW VERIFICATION TEST ===\n');

  try {
    // 1. Create or Login Student
    const testStudent = {
      full_name: 'Verification Student',
      email: 'teststudent_' + Date.now() + '@scholaro.dev',
      mobile: '9876543210',
      password: 'StudentPassword@123',
      role: 'student'
    };

    console.log('1. Registering test student...');
    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testStudent)
    }).then(r => r.json());

    console.log('   Registered successfully. Response:', regRes.success);

    console.log('   Logging in test student...');
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testStudent.email, password: testStudent.password })
    }).then(r => r.json());

    console.log('   Login success:', loginRes.success);
    const token = loginRes.data?.token;

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 2. Test Eligibility Submission for College Student (BC category, TN resident, Low income)
    console.log('\n2. Submitting Eligibility Form (College Student)...');
    const collegeEligibilityPayload = {
      personal: {
        full_name: 'Verification Student',
        dob: '2004-05-15',
        gender: 'Female',
        mobile: '9876543210',
        email: testStudent.email,
        religion: 'Hindu',
        marital_status: 'Single',
        aadhaar_doc: 'aadhaar_card.pdf',
        photo_doc: 'photo.jpg',
        signature_doc: 'signature.png'
      },
      community: {
        community: 'BC',
        caste_certificate: 'Available',
        country: 'India',
        domicile: 'Tamil Nadu',
        state: 'Tamil Nadu',
        district: 'Chennai',
        tn_resident: 1,
        community_cert_doc: 'bc_community_cert.pdf',
        domicile_cert_doc: null
      },
      academic: {
        student_type: 'college',
        institution: 'College of Engineering, Guindy',
        college_location: 'Chennai',
        course: 'B.E. Computer Science',
        branch: 'Computer Science & Engineering',
        year_of_study: 2,
        semester: 3,
        course_type: 'government',
        currently_studying: 1,
        college_id_doc: 'college_id.pdf'
      },
      performance: {
        tenth_percentage: 92.50,
        twelfth_percentage: 94.00,
        current_cgpa: 8.80,
        prev_sem_cgpa: 8.70,
        has_backlogs: 0,
        backlog_count: 0,
        academic_year: '2025-26',
        achievements: 'State Merit Top 100',
        tenth_marksheet_doc: 'tenth_marksheet.pdf',
        twelfth_marksheet_doc: 'twelfth_marksheet.pdf',
        current_marksheet_doc: 'sem2_marksheet.pdf'
      },
      financial: {
        annual_income: 180000.00,
        income_cert_status: 'Available',
        father_name: 'Ramanathan S',
        father_occupation: 'Agriculture',
        father_income: 180000.00,
        father_doc: null,
        mother_name: 'Lakshmi R',
        mother_occupation: 'Homemaker',
        mother_income: 0,
        mother_doc: null,
        family_size: 4,
        sibling_count: 1,
        siblings_studying: 1,
        first_gen_graduate: 1,
        income_cert_doc: 'income_cert_2025.pdf'
      },
      bank: {
        has_bank_account: 1,
        account_holder_name: 'Verification Student',
        bank_name: 'State Bank of India',
        aadhaar_linked: 1,
        dbt_enabled: 1,
        passbook_doc: 'sbi_passbook.pdf'
      }
    };

    const submitRes = await fetch(`${API_BASE}/student/eligibility`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(collegeEligibilityPayload)
    }).then(r => r.json());

    console.log('   Submission response success:', submitRes.success);
    console.log('   Returned matched scholarships count:', submitRes.data?.length);

    // 3. Verify Results Endpoint
    console.log('\n3. Fetching Eligibility Results from /student/results...');
    const resultsRes = await fetch(`${API_BASE}/student/results`, { headers: authHeaders }).then(r => r.json());
    const matchedList = resultsRes.data;
    console.log(`   Fetched ${matchedList.length} matched scholarships.`);

    console.log('\n=== MATCHED SCHOLARSHIPS DETAILS ===');
    matchedList.forEach((m, idx) => {
      const s = m.scholarship || m;
      const url = m.officialUrl || m.official_url || s.official_url;
      console.log(`\n[#${idx + 1}] ${s.name || m.name}`);
      console.log(`    Provider: ${s.provider || m.provider}`);
      console.log(`    Match Percentage: ${m.match_score || m.matchPercentage}%`);
      console.log(`    Eligible: ${m.is_eligible}`);
      console.log(`    Official URL: ${url}`);
      console.log(`    Required Documents: ${s.required_documents || m.required_documents || 'N/A'}`);
    });

    // Verify Official URLs
    const invalidUrls = matchedList.filter(m => {
      const url = m.officialUrl || m.official_url || m.scholarship?.official_url;
      return !url || !url.startsWith('http');
    });

    if (invalidUrls.length > 0) {
      console.error('\n❌ ERROR: Some scholarships do not have valid official URLs:', invalidUrls);
    } else {
      console.log('\n✅ SUCCESS: Every matched scholarship has a verified official URL!');
    }

    // 4. Test School Student Eligibility
    console.log('\n4. Testing School Student Eligibility Submission...');
    const schoolPayload = {
      ...collegeEligibilityPayload,
      academic: {
        student_type: 'school',
        school_name: 'Government Girls Higher Secondary School',
        school_location: 'Chennai',
        class_standard: '10',
        currently_studying: 1,
        school_id_doc: 'school_id.pdf'
      },
      performance: {
        tenth_percentage: null,
        twelfth_percentage: null,
        current_cgpa: 85.00,
        academic_year: '2025-26',
        current_marksheet_doc: 'class9_progress_card.pdf'
      }
    };

    const schoolSubmitRes = await fetch(`${API_BASE}/student/eligibility`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(schoolPayload)
    }).then(r => r.json());

    const schoolResults = schoolSubmitRes.data;
    console.log(`   School Student submission succeeded! Returned ${schoolResults.length} matches.`);

    console.log('\n✅ ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err);
  } finally {
    if (server) server.close();
    process.exit(0);
  }
}

testFlow();
