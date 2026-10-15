const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.post('/eligibility', studentController.saveEligibility);
router.get('/results', studentController.getResults);
router.get('/saved', studentController.getSavedScholarships);
router.post('/scholarships/:id/save', studentController.saveScholarship);
router.delete('/scholarships/:id/save', studentController.removeSavedScholarship);

module.exports = router;
