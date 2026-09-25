const express = require('express');
const router = express.Router();
const {
  getInternships,
  createInternship,
  applyForInternship,
} = require('../controllers/internshipController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(getInternships)
  .post(authorize('ADMIN', 'PLACEMENT_OFFICER'), createInternship);

router.post('/:id/apply', authorize('STUDENT'), applyForInternship);

module.exports = router;
