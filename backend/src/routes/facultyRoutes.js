const express = require('express');
const router = express.Router();
const {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  assignSubjects,
  deleteFaculty,
} = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(getAllFaculty)
  .post(authorize('ADMIN'), createFaculty);

router
  .route('/:id')
  .get(getFacultyById)
  .put(authorize('ADMIN', 'FACULTY'), updateFaculty)
  .delete(authorize('ADMIN'), deleteFaculty);

router.put('/:id/assign-subjects', authorize('ADMIN'), assignSubjects);

module.exports = router;
