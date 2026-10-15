const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Allow OPTIONS preflight requests for all auth routes
router.options('*', (req, res) => res.sendStatus(200));

router.post('/register', authController.register);
router.post('/register/', authController.register);
router.post('/login', authController.login);
router.post('/login/', authController.login);
router.post('/admin-login', authController.adminLogin);
router.post('/admin-login/', authController.adminLogin);
router.post('/refresh-token', authController.refreshToken);
router.post('/refresh-token/', authController.refreshToken);

module.exports = router;

