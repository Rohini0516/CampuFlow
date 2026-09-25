const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getEvents).post(authorize('ADMIN', 'FACULTY'), createEvent);
router
  .route('/:id')
  .get(getEventById)
  .put(authorize('ADMIN', 'FACULTY'), updateEvent)
  .delete(authorize('ADMIN'), deleteEvent);

router.post('/:id/register', authorize('STUDENT'), registerForEvent);

module.exports = router;
