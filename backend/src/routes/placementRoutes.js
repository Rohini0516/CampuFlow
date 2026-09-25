const express = require('express');
const router = express.Router();
const {
  getCompanies,
  createCompany,
  getPlacementDrives,
  getPlacementDriveById,
  createPlacementDrive,
  updatePlacementDrive,
  applyForPlacementDrive,
  updateApplicationStatus,
  getPlacementApplications,
} = require('../controllers/placementController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Companies
router.route('/companies').get(getCompanies).post(authorize('ADMIN', 'PLACEMENT_OFFICER'), createCompany);

// Drives
router
  .route('/drives')
  .get(getPlacementDrives)
  .post(authorize('ADMIN', 'PLACEMENT_OFFICER'), createPlacementDrive);

router
  .route('/drives/:id')
  .get(getPlacementDriveById)
  .put(authorize('ADMIN', 'PLACEMENT_OFFICER'), updatePlacementDrive);

// Applications
router.get('/applications', getPlacementApplications);
router.post('/drives/:id/apply', authorize('STUDENT'), applyForPlacementDrive);
router.put(
  '/applications/:id/status',
  authorize('ADMIN', 'PLACEMENT_OFFICER'),
  updateApplicationStatus
);

module.exports = router;
