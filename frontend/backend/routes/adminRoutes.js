const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);
router.use(restrictTo('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/scholarships', adminController.listScholarships);
router.post('/scholarships', adminController.createScholarship);
router.get('/scholarships/:id', adminController.getScholarship);
router.put('/scholarships/:id', adminController.updateScholarship);
router.delete('/scholarships/:id', adminController.deleteScholarship);
router.get('/students', adminController.listStudents);

module.exports = router;
