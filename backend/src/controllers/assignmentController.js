const { Assignment, Submission, Student, Subject, Faculty, Notification } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get assignments
// @route   GET /api/assignments
// @access  Private
const getAssignments = async (req, res, next) => {
  try {
    const { subject, semester, course, department } = req.query;
    const query = {};

    if (subject) query.subject = subject;
    if (semester) query.semester = Number(semester);
    if (course) query.course = course;
    if (department) query.department = department;

    if (req.user.role === 'FACULTY' && req.faculty) {
      query.faculty = req.faculty._id;
    } else if (req.user.role === 'STUDENT' && req.student) {
      query.semester = req.student.currentSemester;
      query.course = req.student.course;
    }

    const assignments = await Assignment.find(query)
      .populate('subject', 'name code')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name' },
      })
      .populate('department', 'name code')
      .populate('course', 'name code')
      .sort({ dueDate: 1 });

    // If student, attach submission status
    if (req.user.role === 'STUDENT' && req.student) {
      const assignmentIds = assignments.map((a) => a._id);
      const submissions = await Submission.find({
        assignment: { $in: assignmentIds },
        student: req.student._id,
      });

      const submissionMap = new Map();
      submissions.forEach((s) => submissionMap.set(s.assignment.toString(), s));

      const enriched = assignments.map((a) => {
        const sub = submissionMap.get(a._id.toString());
        return {
          ...a.toObject(),
          mySubmission: sub || null,
          isSubmitted: !!sub,
          submissionStatus: sub ? sub.status : 'PENDING',
        };
      });

      return successResponse(res, 'Assignments retrieved', enriched);
    }

    return successResponse(res, 'Assignments retrieved', assignments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('subject', 'name code')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name email' },
      })
      .populate('department', 'name code')
      .populate('course', 'name code');

    if (!assignment) {
      return errorResponse(res, 'Assignment not found', 404);
    }

    let mySubmission = null;
    if (req.user.role === 'STUDENT' && req.student) {
      mySubmission = await Submission.findOne({
        assignment: assignment._id,
        student: req.student._id,
      });
    }

    let submissions = [];
    if (req.user.role === 'FACULTY' || req.user.role === 'ADMIN') {
      submissions = await Submission.find({ assignment: assignment._id })
        .populate({
          path: 'student',
          populate: { path: 'user', select: 'name email avatar' },
          select: 'rollNumber currentSemester',
        })
        .sort({ submissionDate: -1 });
    }

    return successResponse(res, 'Assignment details retrieved', {
      assignment,
      mySubmission,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new assignment (Faculty, Admin)
// @route   POST /api/assignments
// @access  Private (Faculty, Admin)
const createAssignment = async (req, res, next) => {
  try {
    const {
      title,
      description,
      subject,
      semester,
      course,
      department,
      dueDate,
      maxMarks,
      attachments,
      instructions,
    } = req.body;

    let facultyId = req.faculty ? req.faculty._id : null;
    if (!facultyId && req.user.role === 'ADMIN') {
      const sub = await Subject.findById(subject);
      facultyId = sub?.faculty || null;
    }

    const assignment = await Assignment.create({
      title,
      description,
      subject,
      faculty: facultyId,
      semester,
      course,
      department,
      dueDate,
      maxMarks: maxMarks || 100,
      attachments: attachments || [],
      instructions: instructions || '',
    });

    const populated = await Assignment.findById(assignment._id)
      .populate('subject', 'name code')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name' },
      });

    return successResponse(res, 'Assignment created successfully', populated, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assignment (Student)
// @route   POST /api/assignments/:id/submit
// @access  Private (Student)
const submitAssignment = async (req, res, next) => {
  try {
    if (!req.student) {
      return errorResponse(res, 'Student profile required', 403);
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return errorResponse(res, 'Assignment not found', 404);
    }

    const { content, fileUrl } = req.body;
    const isLate = new Date() > new Date(assignment.dueDate);

    const submission = await Submission.findOneAndUpdate(
      {
        assignment: assignment._id,
        student: req.student._id,
      },
      {
        assignment: assignment._id,
        student: req.student._id,
        content: content || '',
        fileUrl: fileUrl || '',
        status: isLate ? 'LATE' : 'SUBMITTED',
        submissionDate: new Date(),
      },
      { upsert: true, new: true }
    );

    return successResponse(res, 'Assignment submitted successfully', submission);
  } catch (error) {
    next(error);
  }
};

// @desc    Grade submission (Faculty, Admin)
// @route   PUT /api/assignments/submissions/:submissionId/grade
// @access  Private (Faculty, Admin)
const gradeSubmission = async (req, res, next) => {
  try {
    const { marksObtained, facultyFeedback } = req.body;

    const submission = await Submission.findById(req.params.submissionId).populate('assignment student');
    if (!submission) {
      return errorResponse(res, 'Submission not found', 404);
    }

    submission.marksObtained = marksObtained;
    submission.facultyFeedback = facultyFeedback || '';
    submission.status = 'GRADED';
    submission.gradedAt = new Date();
    await submission.save();

    // Send notification to student user
    if (submission.student) {
      const studentObj = await Student.findById(submission.student._id);
      if (studentObj && studentObj.user) {
        await Notification.create({
          recipient: studentObj.user,
          title: 'Assignment Graded',
          message: `Your submission for "${submission.assignment?.title}" has been graded: ${marksObtained}/${submission.assignment?.maxMarks}`,
          type: 'ASSIGNMENT',
          link: `/assignments/${submission.assignment?._id}`,
        });
      }
    }

    return successResponse(res, 'Submission graded successfully', submission);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssignments,
  getAssignmentById,
  createAssignment,
  submitAssignment,
  gradeSubmission,
};
