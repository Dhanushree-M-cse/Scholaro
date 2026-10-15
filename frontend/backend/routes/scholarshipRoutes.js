const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');
const { protect } = require('../middleware/authMiddleware');

// Optional auth for these routes to handle "is_saved" logic
const optionalProtect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, (err) => {
      // If error, just ignore and proceed as unauthenticated
      if (err) req.user = null;
      next();
    });
  }
  next();
};

router.get('/', optionalProtect, scholarshipController.listScholarships);
router.get('/:id', optionalProtect, scholarshipController.getScholarship);

module.exports = router;
