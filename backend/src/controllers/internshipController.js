const { Internship, Student, Notification } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get all internships
// @route   GET /api/internships
// @access  Private
const getInternships = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status) query.status = status;

    let internships = await Internship.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    if (search) {
      internships = internships.filter(
        (i) =>
          i.title.toLowerCase().includes(search.toLowerCase()) ||
          i.company.toLowerCase().includes(search.toLowerCase()) ||
          i.role.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (req.user.role === 'STUDENT' && req.student) {
      const studentId = req.student._id.toString();
      const enriched = internships.map((item) => {
        const myApp = item.applicants.find((a) => a.student?.toString() === studentId);
        return {
          ...item.toObject(),
          isApplied: !!myApp,
          myStatus: myApp ? myApp.status : null,
        };
      });
      return successResponse(res, 'Internships retrieved', enriched);
    }

    return successResponse(res, 'Internships retrieved', internships);
  } catch (error) {
    next(error);
  }
};

// @desc    Create internship
// @route   POST /api/internships
// @access  Private (Admin, Placement Officer)
const createInternship = async (req, res, next) => {
  try {
    const internship = await Internship.create({
      ...req.body,
      postedBy: req.user._id,
    });
    return successResponse(res, 'Internship opportunity created', internship, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for internship (Student)
// @route   POST /api/internships/:id/apply
// @access  Private (Student)
const applyForInternship = async (req, res, next) => {
  try {
    if (!req.student) return errorResponse(res, 'Student profile required', 403);

    const internship = await Internship.findById(req.params.id);
    if (!internship) return errorResponse(res, 'Internship not found', 404);

    const alreadyApplied = internship.applicants.some(
      (a) => a.student?.toString() === req.student._id.toString()
    );

    if (alreadyApplied) {
      return errorResponse(res, 'You have already applied for this internship', 400);
    }

    internship.applicants.push({
      student: req.student._id,
      appliedAt: new Date(),
      status: 'APPLIED',
    });

    await internship.save();
    return successResponse(res, 'Application submitted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInternships,
  createInternship,
  applyForInternship,
};
