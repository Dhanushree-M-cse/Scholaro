const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { success, error } = require('../utils/responseHelper');

const register = async (req, res, next) => {
  try {
    const { full_name, email, mobile, password, role = 'student' } = req.body;
    
    if (!full_name || !email || !mobile || !password) {
      return error(res, 'Please provide all required fields');
    }
    
    if (mobile.length !== 10) {
      return error(res, 'Mobile must be 10 digits');
    }
    
    if (password.length < 8) {
      return error(res, 'Password must be at least 8 characters');
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return error(res, 'User with this email already exists', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, mobile, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, mobile, password_hash, role]
    );

    const user = { id: result.insertId, full_name, email, mobile, role };
    return success(res, user, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return error(res, 'Please provide email and password');
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return error(res, 'Invalid email or password', 401);
    }

    const user = rows[0];
    if (user.is_active === 0) {
      return error(res, 'Account is inactive', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return error(res, 'Invalid email or password', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userData = { id: user.id, full_name: user.full_name, email: user.email, role: user.role };
    return success(res, { token, user: userData }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return error(res, 'Please provide email and password');
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return error(res, 'Invalid email or password', 401);
    }

    const user = rows[0];
    if (user.role !== 'admin') {
      return error(res, 'Not authorized as admin', 403);
    }
    
    if (user.is_active === 0) {
      return error(res, 'Account is inactive', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return error(res, 'Invalid email or password', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userData = { id: user.id, full_name: user.full_name, email: user.email, role: user.role };
    return success(res, { token, user: userData }, 'Admin login successful');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  adminLogin
};
