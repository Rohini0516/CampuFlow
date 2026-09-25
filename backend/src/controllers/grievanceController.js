const { Complaint, CertificateRequest, Student, Notification } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// --- COMPLAINTS ---
const getComplaints = async (req, res, next) => {
  try {
    const { category, status, priority } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (req.user.role === 'STUDENT' && req.student) {
      query.student = req.student._id;
    }

    const complaints = await Complaint.find(query)
      .populate({
        path: 'student',
        populate: [
          { path: 'user', select: 'name email avatar' },
          { path: 'department', select: 'name code' },
        ],
      })
      .populate('assignedDepartment', 'name code')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, 'Complaints retrieved', complaints);
  } catch (error) {
    next(error);
  }
};

const raiseComplaint = async (req, res, next) => {
  try {
    if (!req.student) return errorResponse(res, 'Student profile required', 403);

    const { category, title, description, assignedDepartment, priority } = req.body;

    const complaint = await Complaint.create({
      student: req.student._id,
      category,
      title,
      description,
      assignedDepartment: assignedDepartment || req.student.department,
      priority: priority || 'MEDIUM',
      status: 'Submitted',
    });

    const populated = await Complaint.findById(complaint._id).populate('assignedDepartment', 'name code');

    return successResponse(res, 'Complaint submitted successfully', populated, 201);
  } catch (error) {
    next(error);
  }
};

const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, resolutionNotes, assignedDepartment, priority } = req.body;

    const complaint = await Complaint.findById(req.params.id).populate('student');
    if (!complaint) return errorResponse(res, 'Complaint not found', 404);

    if (status) complaint.status = status;
    if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;
    if (assignedDepartment) complaint.assignedDepartment = assignedDepartment;
    if (priority) complaint.priority = priority;

    if (status === 'Resolved' || status === 'Closed') {
      complaint.resolvedBy = req.user._id;
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    // Notify student
    if (complaint.student) {
      const studentObj = await Student.findById(complaint.student._id);
      if (studentObj && studentObj.user) {
        await Notification.create({
          recipient: studentObj.user,
          title: `Grievance #${complaint.ticketNumber} Update`,
          message: `Status updated to: ${complaint.status}. ${resolutionNotes ? `Note: ${resolutionNotes}` : ''}`,
          type: 'COMPLAINT',
          link: '/complaints',
        });
      }
    }

    const updated = await Complaint.findById(complaint._id)
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' },
      })
      .populate('assignedDepartment', 'name code');

    return successResponse(res, 'Complaint updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// --- CERTIFICATE REQUESTS ---
const getCertificateRequests = async (req, res, next) => {
  try {
    const { status, certificateType } = req.query;
    const query = {};

    if (status) query.status = status;
    if (certificateType) query.certificateType = certificateType;

    if (req.user.role === 'STUDENT' && req.student) {
      query.student = req.student._id;
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

    return successResponse(res, 'Certificate requests retrieved', requests);
  } catch (error) {
    next(error);
  }
};

const requestCertificate = async (req, res, next) => {
  try {
    if (!req.student) return errorResponse(res, 'Student profile required', 403);

    const { certificateType, reason } = req.body;

    const request = await CertificateRequest.create({
      student: req.student._id,
      certificateType,
      reason,
      status: 'PENDING',
    });

    return successResponse(res, 'Certificate request submitted', request, 201);
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

    if (status === 'READY' && !cert.certificateNumber) {
      cert.certificateNumber = 'CERT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    }

    await cert.save();

    // Notify student
    if (cert.student) {
      const studentObj = await Student.findById(cert.student._id);
      if (studentObj && studentObj.user) {
        await Notification.create({
          recipient: studentObj.user,
          title: `Certificate Request: ${cert.certificateType}`,
          message: `Your request #${cert.requestNumber} is now: ${cert.status}`,
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
  getComplaints,
  raiseComplaint,
  updateComplaintStatus,
  getCertificateRequests,
  requestCertificate,
  updateCertificateStatus,
};
