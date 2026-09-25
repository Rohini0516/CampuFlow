const { Notification, Announcement, Department, Course, CertificateRequest, Student } = require('../models');
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

// --- CERTIFICATES ---
const getCertificateRequests = async (req, res, next) => {
  try {
    const { status, certificateType, type } = req.query;
    const query = {};

    if (status) query.status = status;
    const certTypeFilter = certificateType || type;
    if (certTypeFilter) query.certificateType = certTypeFilter;

    if (req.user.role === 'STUDENT') {
      let studentId = req.student?._id;
      if (!studentId) {
        const studentObj = await Student.findOne({ user: req.user._id });
        if (studentObj) studentId = studentObj._id;
      }
      if (studentId) query.student = studentId;
    }

    const requests = await CertificateRequest.find(query)
      .populate({
        path: 'student',
        populate: [
          { path: 'user', select: 'name email avatar' },
          { path: 'department', select: 'name code' },
          { path: 'course', select: 'name code' },
        ],
      })
      .populate('processedBy', 'name email')
      .sort({ createdAt: -1 });

    const normalized = requests.map((item) => {
      const doc = item.toObject();
      return {
        ...doc,
        type: doc.type || doc.certificateType,
        purpose: doc.purpose || doc.reason,
      };
    });

    return successResponse(res, 'Certificate requests retrieved', {
      requests: normalized,
    });
  } catch (error) {
    next(error);
  }
};

const requestCertificate = async (req, res, next) => {
  try {
    const { type, certificateType, purpose, reason, remarks } = req.body;

    let studentId = req.student?._id;
    if (!studentId && req.user.role === 'STUDENT') {
      const studentObj = await Student.findOne({ user: req.user._id });
      if (studentObj) studentId = studentObj._id;
    }

    if (!studentId && req.user.role === 'STUDENT') {
      return errorResponse(res, 'Student profile required to apply for certificates', 400);
    }

    const certType = type || certificateType || 'BONAFIDE';
    const certReason = purpose || reason || 'Official Verification';

    const newRequest = await CertificateRequest.create({
      student: studentId,
      certificateType: certType,
      type: certType,
      reason: certReason,
      purpose: certReason,
      remarks: remarks || '',
      status: 'PENDING',
    });

    const populated = await CertificateRequest.findById(newRequest._id).populate({
      path: 'student',
      populate: [{ path: 'user', select: 'name email' }],
    });

    return successResponse(res, 'Certificate request submitted', populated, 201);
  } catch (error) {
    next(error);
  }
};

const updateCertificateStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason, certificateNumber, documentUrl } = req.body;

    const cert = await CertificateRequest.findById(req.params.id).populate('student');
    if (!cert) return errorResponse(res, 'Certificate request not found', 404);

    cert.status = status;
    if (rejectionReason) cert.rejectionReason = rejectionReason;
    if (certificateNumber) cert.certificateNumber = certificateNumber;
    if (documentUrl) cert.documentUrl = documentUrl;
    cert.processedBy = req.user._id;
    cert.processedAt = new Date();

    if ((status === 'APPROVED' || status === 'ISSUED' || status === 'READY') && !cert.certificateNumber) {
      cert.certificateNumber = 'CERT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    }

    await cert.save();

    if (cert.student) {
      const studentObj = await Student.findById(cert.student._id || cert.student);
      if (studentObj && studentObj.user) {
        await Notification.create({
          recipient: studentObj.user,
          title: `Certificate Request Updated`,
          message: `Your certificate request status is now: ${cert.status}`,
          type: 'CERTIFICATE',
          link: '/certificates',
        });
      }
    }

    return successResponse(res, 'Certificate request status updated', cert);
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
  getCertificateRequests,
  requestCertificate,
  updateCertificateStatus,
};
