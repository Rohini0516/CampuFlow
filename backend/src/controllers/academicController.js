const { Department, Course, Subject, Faculty, Student } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// --- DEPARTMENTS ---
const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    return successResponse(res, 'Departments retrieved', departments);
  } catch (error) {
    next(error);
  }
};

const getDepartmentById = async (req, res, next) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return errorResponse(res, 'Department not found', 404);
    return successResponse(res, 'Department retrieved', dept);
  } catch (error) {
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const { name, code, description, hodName, hodEmail, establishedYear } = req.body;
    const exists = await Department.findOne({ $or: [{ name }, { code }] });
    if (exists) return errorResponse(res, 'Department with this name or code already exists', 400);

    const dept = await Department.create({
      name,
      code,
      description,
      hodName,
      hodEmail,
      establishedYear,
    });
    return successResponse(res, 'Department created successfully', dept, 201);
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dept) return errorResponse(res, 'Department not found', 404);
    return successResponse(res, 'Department updated successfully', dept);
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) return errorResponse(res, 'Department not found', 404);
    return successResponse(res, 'Department deleted successfully');
  } catch (error) {
    next(error);
  }
};

// --- COURSES ---
const getCourses = async (req, res, next) => {
  try {
    const { department } = req.query;
    const query = {};
    if (department) query.department = department;

    const courses = await Course.find(query).populate('department', 'name code').sort({ name: 1 });
    return successResponse(res, 'Courses retrieved', courses);
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { name, code, department, durationYears, totalSemesters, description } = req.body;
    const exists = await Course.findOne({ code });
    if (exists) return errorResponse(res, 'Course with this code already exists', 400);

    const course = await Course.create({
      name,
      code,
      department,
      durationYears,
      totalSemesters,
      description,
    });
    const populated = await Course.findById(course._id).populate('department', 'name code');
    return successResponse(res, 'Course created successfully', populated, 201);
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('department', 'name code');
    if (!course) return errorResponse(res, 'Course not found', 404);
    return successResponse(res, 'Course updated successfully', course);
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return errorResponse(res, 'Course not found', 404);
    return successResponse(res, 'Course deleted successfully');
  } catch (error) {
    next(error);
  }
};

// --- SUBJECTS ---
const getSubjects = async (req, res, next) => {
  try {
    const { department, course, semester, faculty } = req.query;
    const query = {};
    if (department) query.department = department;
    if (course) query.course = course;
    if (semester) query.semester = Number(semester);
    if (faculty) query.faculty = faculty;

    const subjects = await Subject.find(query)
      .populate('department', 'name code')
      .populate('course', 'name code')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ semester: 1, name: 1 });

    return successResponse(res, 'Subjects retrieved', subjects);
  } catch (error) {
    next(error);
  }
};

const createSubject = async (req, res, next) => {
  try {
    const { name, code, department, course, semester, credits, type, faculty } = req.body;
    const exists = await Subject.findOne({ code });
    if (exists) return errorResponse(res, 'Subject with this code already exists', 400);

    const subject = await Subject.create({
      name,
      code,
      department,
      course,
      semester,
      credits,
      type,
      faculty: faculty || null,
    });

    const populated = await Subject.findById(subject._id)
      .populate('department', 'name code')
      .populate('course', 'name code')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name email' },
      });

    return successResponse(res, 'Subject created successfully', populated, 201);
  } catch (error) {
    next(error);
  }
};

const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('department', 'name code')
      .populate('course', 'name code')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name email' },
      });
    if (!subject) return errorResponse(res, 'Subject not found', 404);
    return successResponse(res, 'Subject updated successfully', subject);
  } catch (error) {
    next(error);
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return errorResponse(res, 'Subject not found', 404);
    return successResponse(res, 'Subject deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
