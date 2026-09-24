const { pool } = require('../config/db');
const { success, error } = require('../utils/responseHelper');
const { calculateEligibility } = require('../services/eligibilityService');

// Table column whitelists to prevent unknown column errors
const ALLOWED_COLUMNS = {
  students: ['dob', 'gender', 'religion', 'marital_status', 'aadhaar_doc', 'photo_doc', 'signature_doc'],
  student_community: ['community', 'caste_certificate', 'domicile', 'country', 'state', 'district', 'tn_resident', 'community_cert_doc', 'domicile_cert_doc'],
  student_academic: ['student_type', 'education_level', 'course', 'branch', 'institution', 'year_of_study', 'semester', 'course_type', 'college_location', 'school_name', 'school_location', 'class_standard', 'currently_studying', 'school_id_doc', 'college_id_doc'],
  student_performance: ['tenth_percentage', 'twelfth_percentage', 'current_cgpa', 'prev_sem_cgpa', 'has_backlogs', 'backlog_count', 'academic_year', 'achievements', 'tenth_marksheet_doc', 'twelfth_marksheet_doc', 'current_marksheet_doc'],
  student_financial: ['annual_income', 'income_cert_status', 'father_name', 'father_occupation', 'father_income', 'father_doc', 'mother_name', 'mother_occupation', 'mother_income', 'mother_doc', 'family_size', 'sibling_count', 'siblings_studying', 'first_gen_graduate', 'income_cert_doc'],
  student_bank: ['has_bank_account', 'account_holder_name', 'bank_name', 'aadhaar_linked', 'dbt_enabled', 'passbook_doc']
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const [userRows] = await pool.query('SELECT id, full_name, email, mobile, role, is_active FROM users WHERE id = ?', [userId]);
    if (!userRows.length) return error(res, 'User not found', 404);
    const user = userRows[0];
    
    const [students] = await pool.query('SELECT * FROM students WHERE user_id = ?', [userId]);
    const [community] = await pool.query('SELECT * FROM student_community WHERE user_id = ?', [userId]);
    const [academic] = await pool.query('SELECT * FROM student_academic WHERE user_id = ?', [userId]);
    const [performance] = await pool.query('SELECT * FROM student_performance WHERE user_id = ?', [userId]);
    const [financial] = await pool.query('SELECT * FROM student_financial WHERE user_id = ?', [userId]);
    const [bank] = await pool.query('SELECT * FROM student_bank WHERE user_id = ?', [userId]);
    
    let completedSections = 0;
    if (students.length) completedSections++;
    if (community.length) completedSections++;
    if (academic.length) completedSections++;
    if (performance.length) completedSections++;
    if (financial.length) completedSections++;
    if (bank.length) completedSections++;
    
    const profile_completion = Math.round((completedSections / 6) * 100);
    
    const profile = {
      ...user,
      personal: students.length ? students[0] : null,
      community: community.length ? community[0] : null,
      academic: academic.length ? academic[0] : null,
      performance: performance.length ? performance[0] : null,
      financial: financial.length ? financial[0] : null,
      bank: bank.length ? bank[0] : null,
      profile_completion
    };
    
    return success(res, profile, 'Profile fetched successfully');
  } catch (err) {
    next(err);
  }
};

const upsertTable = async (table, data, userId) => {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) return;
  
  const allowed = ALLOWED_COLUMNS[table] || [];
  const cleanData = {};
  
  for (const [k, v] of Object.entries(data)) {
    if (allowed.includes(k) && v !== undefined && v !== null) {
      cleanData[k] = v;
    }
  }

  if (Object.keys(cleanData).length === 0) return;

  const keys = Object.keys(cleanData);
  const placeholders = keys.map(() => '?').join(',');
  const updateStr = keys.map(k => `${k}=VALUES(${k})`).join(',');
  const values = [userId, ...Object.values(cleanData)];

  await pool.query(
    `INSERT INTO ${table} (user_id, ${keys.join(',')}) VALUES (?, ${placeholders}) ON DUPLICATE KEY UPDATE ${updateStr}`,
    values
  );
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { personal, community, academic, performance, financial, bank } = req.body;
    
    if (personal) await upsertTable('students', personal, userId);
    if (community) await upsertTable('student_community', community, userId);
    if (academic) await upsertTable('student_academic', academic, userId);
    if (performance) await upsertTable('student_performance', performance, userId);
    if (financial) await upsertTable('student_financial', financial, userId);
    if (bank) await upsertTable('student_bank', bank, userId);
    
    return success(res, null, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

const saveEligibility = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let { personal, community, academic, performance, financial, bank } = req.body;

    if (personal) await upsertTable('students', personal, userId);
    if (community) await upsertTable('student_community', community, userId);
    if (academic) await upsertTable('student_academic', academic, userId);
    if (performance) await upsertTable('student_performance', performance, userId);
    if (financial) await upsertTable('student_financial', financial, userId);
    if (bank) await upsertTable('student_bank', bank, userId);

    // Also update full_name if passed in personal
    if (personal && personal.full_name) {
      await pool.query('UPDATE users SET full_name = ? WHERE id = ?', [personal.full_name, userId]);
    }

    // Calculate eligibility results
    const results = await calculateEligibility(userId, pool);
    
    await pool.query(
      'INSERT INTO eligibility_results (user_id, results_json) VALUES (?, ?)',
      [userId, JSON.stringify(results)]
    );
    
    return success(res, results, 'Eligibility calculated and saved successfully');
  } catch (err) {
    console.error('saveEligibility Error:', err);
    next(err);
  }
};

const getResults = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      'SELECT results_json FROM eligibility_results WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 1',
      [userId]
    );
    
    if (!rows.length) {
      return success(res, [], 'No eligibility results found');
    }
    
    const results = JSON.parse(rows[0].results_json);
    return success(res, results, 'Latest eligibility results fetched');
  } catch (err) {
    next(err);
  }
};

const getSavedScholarships = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT s.*, ss.saved_at 
       FROM saved_scholarships ss 
       JOIN scholarships s ON ss.scholarship_id = s.id 
       WHERE ss.user_id = ?`,
      [userId]
    );
    return success(res, rows, 'Saved scholarships fetched');
  } catch (err) {
    next(err);
  }
};

const saveScholarship = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const scholarshipId = req.params.id;
    
    await pool.query(
      'INSERT IGNORE INTO saved_scholarships (user_id, scholarship_id) VALUES (?, ?)',
      [userId, scholarshipId]
    );
    return success(res, null, 'Scholarship saved');
  } catch (err) {
    next(err);
  }
};

const removeSavedScholarship = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const scholarshipId = req.params.id;
    
    await pool.query(
      'DELETE FROM saved_scholarships WHERE user_id = ? AND scholarship_id = ?',
      [userId, scholarshipId]
    );
    return success(res, null, 'Scholarship removed from saved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  saveEligibility,
  getResults,
  getSavedScholarships,
  saveScholarship,
  removeSavedScholarship
};
