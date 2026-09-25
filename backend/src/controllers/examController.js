const { Exam, Mark, Student, Subject, Course, Department } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// --- EXAMS ---
const getExams = async (req, res, next) => {
  try {
    const { course, department, semester, status } = req.query;
    const query = {};
    if (course) query.course = course;
    if (department) query.department = department;
    if (semester) query.semester = Number(semester);
    if (status) query.status = status;

    if (req.user.role === 'STUDENT' && req.student) {
      query.course = req.student.course;
      query.semester = req.student.currentSemester;
    }

    const exams = await Exam.find(query)
      .populate('department', 'name code')
      .populate('course', 'name code')
      .sort({ startDate: 1 });

    return successResponse(res, 'Exams retrieved', exams);
  } catch (error) {
    next(error);
  }
};

const createExam = async (req, res, next) => {
  try {
    const { title, type, department, course, semester, academicYear, startDate, endDate, instructions } = req.body;
    const exam = await Exam.create({
      title,
      type,
      department,
      course,
      semester,
      academicYear: academicYear || '2025-2026',
      startDate,
      endDate,
      instructions,
    });
    return successResponse(res, 'Exam created successfully', exam, 201);
  } catch (error) {
    next(error);
  }
};

// --- MARKS ---
const enterMarks = async (req, res, next) => {
  try {
    const { examId, subjectId, marksData } = req.body;
    // marksData: [ { studentId, internalMarks, externalMarks, maxMarks, remarks } ]

    if (!examId || !subjectId || !Array.isArray(marksData)) {
      return errorResponse(res, 'Exam, Subject, and marksData array required', 400);
    }

    const savedMarks = [];
    for (const item of marksData) {
      const { studentId, internalMarks, externalMarks, maxMarks, remarks } = item;
      const doc = await Mark.findOneAndUpdate(
        { exam: examId, subject: subjectId, student: studentId },
        {
          exam: examId,
          subject: subjectId,
          student: studentId,
          internalMarks: Number(internalMarks) || 0,
          externalMarks: Number(externalMarks) || 0,
          maxMarks: Number(maxMarks) || 100,
          remarks: remarks || '',
          enteredBy: req.user._id,
        },
        { upsert: true, new: true, runValidators: true }
      );
      savedMarks.push(doc);
    }

    return successResponse(res, 'Marks entered and calculated successfully', savedMarks);
  } catch (error) {
    next(error);
  }
};

const getMarks = async (req, res, next) => {
  try {
    const { examId, studentId, subjectId, semester } = req.query;
    const query = {};

    if (examId) query.exam = examId;
    if (subjectId) query.subject = subjectId;

    if (req.user.role === 'STUDENT' && req.student) {
      query.student = req.student._id;
    } else if (studentId) {
      query.student = studentId;
    }

    const marks = await Mark.find(query)
      .populate('exam', 'title type academicYear')
      .populate('subject', 'name code credits')
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email avatar' },
        select: 'rollNumber currentSemester',
      })
      .sort({ createdAt: -1 });

    // Calculate total summary if for a specific student/exam
    let summary = null;
    if (marks.length > 0) {
      const totalMarksObtained = marks.reduce((acc, m) => acc + (m.totalMarks || 0), 0);
      const totalMaxMarks = marks.reduce((acc, m) => acc + (m.maxMarks || 100), 0);
      const passCount = marks.filter((m) => m.resultStatus === 'PASS').length;
      summary = {
        totalSubjects: marks.length,
        totalMarksObtained,
        totalMaxMarks,
        percentage: totalMaxMarks > 0 ? Math.round((totalMarksObtained / totalMaxMarks) * 100) : 0,
        passPercentage: marks.length > 0 ? Math.round((passCount / marks.length) * 100) : 0,
        allPassed: passCount === marks.length,
      };
    }

    return successResponse(res, 'Marks retrieved', { marks, summary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExams,
  createExam,
  enterMarks,
  getMarks,
};
