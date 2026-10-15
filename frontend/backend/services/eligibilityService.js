const calculateEligibility = async (userId, pool) => {
  const [students] = await pool.query('SELECT * FROM students WHERE user_id = ?', [userId]);
  const [community] = await pool.query('SELECT * FROM student_community WHERE user_id = ?', [userId]);
  const [academic] = await pool.query('SELECT * FROM student_academic WHERE user_id = ?', [userId]);
  const [performance] = await pool.query('SELECT * FROM student_performance WHERE user_id = ?', [userId]);
  const [financial] = await pool.query('SELECT * FROM student_financial WHERE user_id = ?', [userId]);
  const [bank] = await pool.query('SELECT * FROM student_bank WHERE user_id = ?', [userId]);
  
  const profile = {
    students: students[0] || {},
    community: community[0] || {},
    academic: academic[0] || {},
    performance: performance[0] || {},
    financial: financial[0] || {},
    bank: bank[0] || {}
  };

  const [scholarships] = await pool.query('SELECT * FROM scholarships WHERE is_active = 1');
  const [criteriaList] = await pool.query('SELECT * FROM scholarship_criteria');
  
  const results = [];
  
  for (const scholarship of scholarships) {
    const criteria = criteriaList.find(c => c.scholarship_id === scholarship.id) || {};
    
    let totalCriteria = 0;
    let metCriteria = 0;
    const matched_criteria = [];
    const unmet_criteria = [];
    const reasons = [];
    let is_eligible = true;
    
    const check = (condition, name, failMsg, passMsg) => {
      totalCriteria++;
      if (condition) {
        metCriteria++;
        matched_criteria.push(name);
        reasons.push(passMsg);
      } else {
        unmet_criteria.push(name);
        reasons.push(failMsg);
        is_eligible = false;
      }
    };
    
    if (criteria.tn_resident_required) {
      check(
        profile.community.tn_resident === 1 || profile.community.state === 'Tamil Nadu',
        'tn_resident',
        'Tamil Nadu residency required',
        'Tamil Nadu residency verified'
      );
    }
    
    if (criteria.state) {
      const states = criteria.state.split(',').map(s => s.trim().toLowerCase());
      const userState = (profile.community.state || '').toLowerCase();
      check(
        states.includes(userState) || states.includes('all'),
        'state',
        `State must be: ${criteria.state}`,
        'State matches'
      );
    }

    if (criteria.district) {
      const districts = criteria.district.split(',').map(s => s.trim().toLowerCase());
      const userDistrict = (profile.community.district || '').toLowerCase();
      check(
        districts.includes(userDistrict) || districts.includes('all'),
        'district',
        `District must be: ${criteria.district}`,
        'District matches'
      );
    }

    const stType = scholarship.student_type || 'both';
    if (stType !== 'both') {
      const userStType = profile.academic.student_type || 'college';
      check(
        stType === userStType,
        'student_type',
        `Student type must be: ${stType}`,
        'Student type matches'
      );
    }

    const eduLevelRule = criteria.education_level || scholarship.education_level;
    if (eduLevelRule) {
      const levels = eduLevelRule.split(',').map(s => s.trim().toLowerCase());
      const studentEduLevel = (profile.academic.student_type === 'school' ? 'school' : profile.academic.education_level || 'undergraduate').toLowerCase();
      
      check(
        levels.includes(studentEduLevel) || levels.includes('all'),
        'education_level',
        `Education level must be one of: ${eduLevelRule}`,
        'Education level matches'
      );
    }
    
    if (criteria.community) {
      const comms = criteria.community.split(',').map(s => s.trim().toUpperCase());
      const userComm = (profile.community.community || '').toUpperCase();
      
      // DNC matching: if scholarship accepts BC or MBC, DNC is also treated as matching
      const commMatches = comms.includes(userComm) || (userComm === 'DNC' && (comms.includes('BC') || comms.includes('MBC') || comms.includes('DNC')));
      
      check(
        commMatches,
        'community',
        `Community must be one of: ${criteria.community}`,
        'Community matches'
      );
    }

    if (criteria.religion) {
      const religions = criteria.religion.split(',').map(s => s.trim().toLowerCase());
      const userRel = (profile.students.religion || '').toLowerCase();
      check(
        religions.includes(userRel) || religions.includes('all'),
        'religion',
        `Religion must be: ${criteria.religion}`,
        'Religion matches'
      );
    }

    if (criteria.course) {
      const courses = criteria.course.split(',').map(s => s.trim().toLowerCase());
      const userCourse = (profile.academic.course || '').toLowerCase();
      check(
        courses.some(c => userCourse.includes(c)) || courses.includes('all'),
        'course',
        `Course must be: ${criteria.course}`,
        'Course requirement met'
      );
    }
    
    if (criteria.min_tenth_pct !== null && criteria.min_tenth_pct !== undefined) {
      let userTenth = parseFloat(profile.performance.tenth_percentage);
      if (isNaN(userTenth) && profile.academic.student_type === 'school') {
        userTenth = parseFloat(profile.performance.current_cgpa);
      }
      check(
        !isNaN(userTenth) && userTenth >= parseFloat(criteria.min_tenth_pct),
        'min_tenth_pct',
        `10th percentage must be at least ${criteria.min_tenth_pct}%`,
        '10th percentage requirement met'
      );
    }
    
    if (criteria.min_twelfth_pct !== null && criteria.min_twelfth_pct !== undefined) {
      const userTwelfth = parseFloat(profile.performance.twelfth_percentage);
      check(
        !isNaN(userTwelfth) && userTwelfth >= parseFloat(criteria.min_twelfth_pct),
        'min_twelfth_pct',
        `12th percentage must be at least ${criteria.min_twelfth_pct}%`,
        '12th percentage requirement met'
      );
    }
    
    if (criteria.min_cgpa !== null && criteria.min_cgpa !== undefined) {
      const userCgpa = parseFloat(profile.performance.current_cgpa);
      check(
        !isNaN(userCgpa) && userCgpa >= parseFloat(criteria.min_cgpa),
        'min_cgpa',
        `CGPA / Marks must be at least ${criteria.min_cgpa}`,
        'CGPA / Marks requirement met'
      );
    }
    
    if (criteria.max_annual_income !== null && criteria.max_annual_income !== undefined) {
      const userIncome = parseFloat(profile.financial.annual_income);
      check(
        !isNaN(userIncome) && userIncome <= parseFloat(criteria.max_annual_income),
        'max_annual_income',
        `Annual income must not exceed ₹${criteria.max_annual_income}`,
        'Annual income requirement met'
      );
    }
    
    if (criteria.first_gen_required) {
      check(
        profile.financial.first_gen_graduate === 1,
        'first_gen_required',
        'Must be a first generation graduate',
        'First generation graduate verified'
      );
    }
    
    if (criteria.backlog_allowed === 0) {
      check(
        profile.performance.has_backlogs === 0,
        'no_backlogs',
        'No active backlogs allowed',
        'No active backlogs verified'
      );
    }
    
    if (criteria.bank_account_required) {
      check(
        profile.bank.has_bank_account === 1,
        'bank_account_required',
        'Bank account is required',
        'Bank account verified'
      );
    }
    
    if (criteria.gender) {
      const genders = criteria.gender.split(',').map(s => s.trim().toLowerCase());
      check(
        genders.includes(profile.students.gender?.toLowerCase()),
        'gender',
        `Gender must be one of: ${criteria.gender}`,
        'Gender requirement met'
      );
    }
    
    const match_score = totalCriteria > 0 ? Math.round((metCriteria / totalCriteria) * 100) : 100;
    if (totalCriteria === 0) is_eligible = true;
    
    const officialUrl = scholarship.official_url || scholarship.application_url || null;
    const applicationUrl = scholarship.application_url || scholarship.official_url || null;

    results.push({
      id: scholarship.id,
      scholarship_id: scholarship.id,
      name: scholarship.name,
      scholarship_name: scholarship.name,
      provider: scholarship.provider,
      category: scholarship.category,
      description: scholarship.description,
      benefits: scholarship.benefits,
      required_documents: scholarship.required_documents,
      officialUrl: officialUrl,
      official_url: officialUrl,
      applicationUrl: applicationUrl,
      application_url: applicationUrl,
      education_level: scholarship.education_level ? scholarship.education_level.split(',') : ['undergraduate'],
      is_eligible,
      matchPercentage: match_score,
      match_score,
      matched_criteria,
      unmet_criteria,
      reasons,
      scholarship: {
        id: scholarship.id,
        name: scholarship.name,
        provider: scholarship.provider,
        category: scholarship.category,
        description: scholarship.description,
        benefits: scholarship.benefits,
        required_documents: scholarship.required_documents,
        education_level: scholarship.education_level ? scholarship.education_level.split(',') : ['undergraduate'],
        official_url: officialUrl,
        officialUrl: officialUrl,
        application_url: applicationUrl,
        applicationUrl: applicationUrl,
      }
    });
  }
  
  // Sort by match_score descending so highest match appears first
  results.sort((a, b) => b.match_score - a.match_score);

  return results;
};

module.exports = {
  calculateEligibility
};
