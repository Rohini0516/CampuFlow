const express = require('express');
const router = express.Router();
const {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/academicController');
const { protect, authorize } = require('../middleware/auth');

// Public endpoints (registration dropdown)
router.get('/departments', getDepartments);

// Protected academic endpoints
router.use(protect);

// Department endpoints
router.route('/departments').post(authorize('ADMIN'), createDepartment);
router
  .route('/departments/:id')
  .get(getDepartmentById)
  .put(authorize('ADMIN'), updateDepartment)
  .delete(authorize('ADMIN'), deleteDepartment);

// Course endpoints
router.route('/courses').get(getCourses).post(authorize('ADMIN'), createCourse);
router
  .route('/courses/:id')
  .put(authorize('ADMIN'), updateCourse)
  .delete(authorize('ADMIN'), deleteCourse);

// Subject endpoints
router.route('/subjects').get(getSubjects).post(authorize('ADMIN'), createSubject);
router
  .route('/subjects/:id')
  .put(authorize('ADMIN'), updateSubject)
  .delete(authorize('ADMIN'), deleteSubject);

module.exports = router;
