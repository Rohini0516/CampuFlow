const { Notification, Announcement, Department, Course } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// --- NOTIFICATIONS ---
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    return successResponse(res, 'Notifications retrieved', {
      notifications,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

const markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );
    return successResponse(res, 'Notification marked as read', notification);
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    return successResponse(res, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

// --- ANNOUNCEMENTS ---
const getAnnouncements = async (req, res, next) => {
  try {
    const { category, audience } = req.query;
    const query = {};

    if (category) query.category = category;

    // Filter by audience according to role
    if (req.user.role === 'STUDENT' && req.student) {
      query.$or = [
        { audience: 'ALL' },
        { audience: 'STUDENTS' },
        { audience: 'DEPARTMENT', targetDepartment: req.student.department },
        { audience: 'COURSE', targetCourse: req.student.course },
      ];
    } else if (req.user.role === 'FACULTY') {
      query.$or = [{ audience: 'ALL' }, { audience: 'FACULTY' }];
    } else if (audience) {
      query.audience = audience;
    }

    const announcements = await Announcement.find(query)
      .populate('author', 'name role')
      .populate('targetDepartment', 'name code')
      .populate('targetCourse', 'name code')
      .sort({ isPinned: -1, createdAt: -1 });

    return successResponse(res, 'Announcements retrieved', announcements);
  } catch (error) {
    next(error);
  }
};

const createAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      author: req.user._id,
    });

    const populated = await Announcement.findById(announcement._id)
      .populate('author', 'name role')
      .populate('targetDepartment', 'name code')
      .populate('targetCourse', 'name code');

    return successResponse(res, 'Announcement published successfully', populated, 201);
  } catch (error) {
    next(error);
  }
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return errorResponse(res, 'Announcement not found', 404);
    return successResponse(res, 'Announcement deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
};
