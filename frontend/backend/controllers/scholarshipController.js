const { pool } = require('../config/db');
const { success, error } = require('../utils/responseHelper');

const listScholarships = async (req, res, next) => {
  try {
    const { category, education_level, search, is_active = '1' } = req.query;
    let query = 'SELECT * FROM scholarships WHERE is_active = ?';
    const params = [parseInt(is_active)];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (education_level) {
      query += ' AND education_level = ?';
      params.push(education_level);
    }
    
    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    const [scholarships] = await pool.query(query, params);
    
    if (req.user && req.user.id) {
      const [saved] = await pool.query('SELECT scholarship_id FROM saved_scholarships WHERE user_id = ?', [req.user.id]);
      const savedIds = new Set(saved.map(s => s.scholarship_id));
      const withSaved = scholarships.map(s => ({
        ...s,
        is_saved: savedIds.has(s.id)
      }));
      return success(res, withSaved, 'Scholarships fetched successfully');
    }

    return success(res, scholarships, 'Scholarships fetched successfully');
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
    
    if (req.user && req.user.id) {
      const [saved] = await pool.query('SELECT id FROM saved_scholarships WHERE user_id = ? AND scholarship_id = ?', [req.user.id, scholarshipId]);
      scholarship.is_saved = saved.length > 0;
    }

    return success(res, scholarship, 'Scholarship details fetched');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listScholarships,
  getScholarship
};
