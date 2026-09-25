const express = require('express');
const router = express.Router();
const {
  getAssignments,
  getAssignmentById,
  createAssignment,
  submitAssignment,
  gradeSubmission,
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getAssignments).post(authorize('FACULTY', 'ADMIN'), createAssignment);
router.route('/:id').get(getAssignmentById);
router.post('/:id/submit', authorize('STUDENT'), submitAssignment);
router.put('/submissions/:submissionId/grade', authorize('FACULTY', 'ADMIN'), gradeSubmission);

module.exports = router;
