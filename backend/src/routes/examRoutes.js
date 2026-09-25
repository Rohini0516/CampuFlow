const express = require('express');
const router = express.Router();
const {
  getExams,
  createExam,
  enterMarks,
  getMarks,
} = require('../controllers/examController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getExams).post(authorize('ADMIN'), createExam);
router.get('/marks', getMarks);
router.post('/marks', authorize('FACULTY', 'ADMIN'), enterMarks);

module.exports = router;
