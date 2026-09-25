const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(getAllStudents)
  .post(authorize('ADMIN'), createStudent);

router
  .route('/:id')
  .get(getStudentById)
  .put(authorize('ADMIN'), updateStudent)
  .delete(authorize('ADMIN'), deleteStudent);

module.exports = router;
