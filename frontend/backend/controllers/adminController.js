const { pool } = require('../config/db');
const { success, error } = require('../utils/responseHelper');

const getDashboard = async (req, res, next) => {
  try {
    const [[{ total_scholarships }]] = await pool.query('SELECT COUNT(*) as total_scholarships FROM scholarships');
    const [[{ active_scholarships }]] = await pool.query('SELECT COUNT(*) as active_scholarships FROM scholarships WHERE is_active = 1');
    const [[{ total_students }]] = await pool.query("SELECT COUNT(*) as total_students FROM users WHERE role = 'student'");
    const [recent_scholarships] = await pool.query('SELECT * FROM scholarships ORDER BY id DESC LIMIT 5');

    return success(res, {
      total_scholarships,
      active_scholarships,
      total_students,
      recent_scholarships
    }, 'Admin dashboard fetched');
  } catch (err) {
    next(err);
  }
};

const listScholarships = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM scholarships WHERE 1=1';
    const params = [];
    
    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [scholarships] = await pool.query(query, params);
    
    return success(res, scholarships, 'Scholarships fetched');
  } catch (err) {
    next(err);
  }
};

const { isValidUrl } = require('../utils/urlSanitizer');

const createScholarship = async (req, res, next) => {
  try {
    const { name, provider, category, description, education_level, benefits, required_documents, guidelines, official_url, application_url, application_start, application_end, is_active, criteria } = req.body;
    
    if (!name || !provider || !category) {
      return error(res, 'Name, provider, and category are required');
    }
    
    const finalOfficialUrl = official_url || application_url || null;
    const finalApplicationUrl = application_url || official_url || null;

    if (finalOfficialUrl && !isValidUrl(finalOfficialUrl)) {
      return error(res, 'Official Website URL must be a valid HTTP or HTTPS URL');
    }
    if (finalApplicationUrl && !isValidUrl(finalApplicationUrl)) {
      return error(res, 'Application URL must be a valid HTTP or HTTPS URL');
    }
    
    const [result] = await pool.query(
      `INSERT INTO scholarships 
      (name, provider, category, description, education_level, benefits, required_documents, guidelines, official_url, application_url, application_start, application_end, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, provider, category, description, education_level || 'undergraduate', benefits, required_documents, guidelines, finalOfficialUrl, finalApplicationUrl, application_start, application_end, is_active ?? 1]
    );
    
    const scholarshipId = result.insertId;
    
    if (criteria && Object.keys(criteria).length > 0) {
      const keys = Object.keys(criteria);
      const placeholders = keys.map(() => '?').join(',');
      const values = [scholarshipId, ...Object.values(criteria)];
      await pool.query(
        `INSERT INTO scholarship_criteria (scholarship_id, ${keys.join(',')}) VALUES (?, ${placeholders})`,
        values
      );
    }
    
    return success(res, { id: scholarshipId }, 'Scholarship created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const getScholarship = async (req, res, next) => {
  try {
    const scholarshipId = req.params.id;
    const [rows] = await pool.query('SELECT * FROM scholarships WHERE id = ?', [scholarshipId]);
    
    if (!rows.length) return error(res, 'Scholarship not found', 404);
    
    const scholarship = rows[0];
    const [criteriaRows] = await pool.query('SELECT * FROM scholarship_criteria WHERE scholarship_id = ?', [scholarshipId]);
    scholarship.criteria = criteriaRows.length ? criteriaRows[0] : null;
    
    return success(res, scholarship, 'Scholarship details fetched');
  } catch (err) {
    next(err);
  }
};

const updateScholarship = async (req, res, next) => {
  try {
    const scholarshipId = req.params.id;
    const { criteria, ...scholarshipData } = req.body;
    
    if (scholarshipData.official_url && !isValidUrl(scholarshipData.official_url)) {
      return error(res, 'Official Website URL must be a valid HTTP or HTTPS URL');
    }
    if (scholarshipData.application_url && !isValidUrl(scholarshipData.application_url)) {
      return error(res, 'Application URL must be a valid HTTP or HTTPS URL');
    }

    if (Object.keys(scholarshipData).length > 0) {
      const keys = Object.keys(scholarshipData);
      const updateStr = keys.map(k => `${k}=?`).join(',');
      const values = [...Object.values(scholarshipData), scholarshipId];
      await pool.query(`UPDATE scholarships SET ${updateStr} WHERE id = ?`, values);
    }
    
    if (criteria && Object.keys(criteria).length > 0) {
      const keys = Object.keys(criteria);
      const updateStr = keys.map(k => `${k}=VALUES(${k})`).join(',');
      const placeholders = keys.map(() => '?').join(',');
      const values = [scholarshipId, ...Object.values(criteria)];
      await pool.query(
        `INSERT INTO scholarship_criteria (scholarship_id, ${keys.join(',')}) VALUES (?, ${placeholders}) ON DUPLICATE KEY UPDATE ${updateStr}`,
        values
      );
    }
    
    return success(res, null, 'Scholarship updated successfully');
  } catch (err) {
    next(err);
  }
};

const deleteScholarship = async (req, res, next) => {
  try {
    const scholarshipId = req.params.id;
    await pool.query('UPDATE scholarships SET is_active = 0 WHERE id = ?', [scholarshipId]);
    return success(res, null, 'Scholarship soft deleted (deactivated)');
  } catch (err) {
    next(err);
  }
};

const listStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    
    let query = "SELECT id, full_name, email, mobile, is_active, created_at FROM users WHERE role = 'student'";
    const params = [];
    
    if (search) {
      query += ' AND (full_name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [students] = await pool.query(query, params);
    
    return success(res, students, 'Students fetched');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
  listScholarships,
  createScholarship,
  getScholarship,
  updateScholarship,
  deleteScholarship,
  listStudents
};
