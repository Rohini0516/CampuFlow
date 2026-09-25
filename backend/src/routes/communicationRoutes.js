const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} = require('../controllers/communicationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);
router.put('/notifications/read-all', markAllNotificationsAsRead);

// Announcements
router
  .route('/announcements')
  .get(getAnnouncements)
  .post(authorize('ADMIN', 'FACULTY'), createAnnouncement);
router.delete('/announcements/:id', authorize('ADMIN', 'FACULTY'), deleteAnnouncement);

module.exports = router;
