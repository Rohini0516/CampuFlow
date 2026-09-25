const { Project, Student, Department, Faculty } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get all projects with filters
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const { department, semester, status, search, studentId } = req.query;
    const query = {};

    if (department) query.department = department;
    if (semester) query.semester = Number(semester);
    if (status) query.status = status;
    if (studentId) query.student = studentId;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { projectId: { $regex: search, $options: 'i' } },
      ];
    }

    // Role specific filter
    if (req.user.role === 'STUDENT' && req.student) {
      query.$or = [{ student: req.student._id }, { teamMembers: req.student._id }];
    }

    const projects = await Project.find(query)
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email avatar' },
      })
      .populate({
        path: 'teamMembers',
        populate: { path: 'user', select: 'name email' },
      })
      .populate('department', 'name code')
      .populate({
        path: 'facultyMentor',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ createdAt: -1 });

    return successResponse(res, 'Projects retrieved successfully', projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email avatar' },
      })
      .populate({
        path: 'teamMembers',
        populate: { path: 'user', select: 'name email' },
      })
      .populate('department', 'name code')
      .populate({
        path: 'facultyMentor',
        populate: { path: 'user', select: 'name email' },
      });

    if (!project) return errorResponse(res, 'Project not found', 404);

    return successResponse(res, 'Project details retrieved', project);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { title, description, department, semester, facultyMentor, expectedCompletionDate, teamMembers } = req.body;

    let studentId = req.student?._id;
    if (!studentId && req.body.studentId) {
      studentId = req.body.studentId;
    }

    if (!studentId && req.user.role === 'STUDENT') {
      const studentObj = await Student.findOne({ user: req.user._id });
      if (studentObj) studentId = studentObj._id;
    }

    if (!studentId) {
      return errorResponse(res, 'Student profile is required to assign project', 400);
    }

    const project = await Project.create({
      title,
      description,
      student: studentId,
      teamMembers: teamMembers || [],
      department: department || req.student?.department,
      semester: semester || 5,
      facultyMentor,
      expectedCompletionDate,
      status: 'Planning',
      progress: 25,
    });

    const populated = await Project.findById(project._id)
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .populate('department', 'name code');

    return successResponse(res, 'Project created successfully', populated, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update project status & progress
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const { status, progress, score, remarks, actualCompletionDate, facultyMentor } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) return errorResponse(res, 'Project not found', 404);

    if (status) project.status = status;
    if (progress !== undefined) project.progress = progress;
    if (score !== undefined) project.score = score;
    if (remarks) project.remarks = remarks;
    if (facultyMentor) project.facultyMentor = facultyMentor;

    if (status === 'Completed') {
      project.progress = 100;
      project.actualCompletionDate = actualCompletionDate || new Date();
    }

    await project.save();

    const populated = await Project.findById(project._id)
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .populate('department', 'name code')
      .populate({ path: 'facultyMentor', populate: { path: 'user', select: 'name email' } });

    return successResponse(res, 'Project updated successfully', populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return errorResponse(res, 'Project not found', 404);

    return successResponse(res, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
