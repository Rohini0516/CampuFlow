const express = require('express');
const router = express.Router();
const {
  getComplaints,
  raiseComplaint,
  updateComplaintStatus,
  getCertificateRequests,
  requestCertificate,
  updateCertificateStatus,
} = require('../controllers/grievanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Complaints / Grievances
router.route('/complaints').get(getComplaints).post(authorize('STUDENT'), raiseComplaint);
router.put('/complaints/:id/status', authorize('ADMIN'), updateComplaintStatus);

// Certificate Requests
router
  .route('/certificates')
  .get(getCertificateRequests)
  .post(authorize('STUDENT'), requestCertificate);
router.put('/certificates/:id/status', authorize('ADMIN'), updateCertificateStatus);

module.exports = router;
