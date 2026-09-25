const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendance,
  getStudentAttendanceSummary,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getAttendance);
router.get('/summary', getStudentAttendanceSummary);
router.post('/mark', authorize('FACULTY', 'ADMIN'), markAttendance);

module.exports = router;
