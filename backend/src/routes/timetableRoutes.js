const express = require('express');
const router = express.Router();
const {
  getTimetable,
  createTimetableSlot,
  deleteTimetableSlot,
} = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getTimetable).post(authorize('ADMIN'), createTimetableSlot);
router.route('/:id').delete(authorize('ADMIN'), deleteTimetableSlot);

module.exports = router;
