const { Attendance, Student, Subject, Faculty } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Mark batch attendance for a subject class
// @route   POST /api/attendance/mark
// @access  Private (Faculty, Admin)
const markAttendance = async (req, res, next) => {
  try {
    const { subjectId, date, period, records, semester, academicYear } = req.body;

    if (!subjectId || !date || !records || !Array.isArray(records)) {
      return errorResponse(res, 'Subject, date and attendance records array are required', 400);
    }

    let facultyId = req.faculty ? req.faculty._id : null;
    if (!facultyId && req.user.role === 'ADMIN') {
      const subject = await Subject.findById(subjectId);
      facultyId = subject?.faculty || null;
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const savedRecords = [];

    for (const record of records) {
      const { studentId, status, remarks } = record;

      const updated = await Attendance.findOneAndUpdate(
        {
          student: studentId,
          subject: subjectId,
          date: attendanceDate,
          period: period || 1,
        },
        {
          student: studentId,
          subject: subjectId,
          faculty: facultyId,
          date: attendanceDate,
          period: period || 1,
          status: status || 'PRESENT',
          remarks: remarks || '',
          semester: semester || 1,
          academicYear: academicYear || '2025-2026',
        },
        { upsert: true, new: true }
      );
      savedRecords.push(updated);

      // Recalculate student overall attendance
      const totalClasses = await Attendance.countDocuments({ student: studentId });
      const presentClasses = await Attendance.countDocuments({
        student: studentId,
        status: { $in: ['PRESENT', 'LATE'] },
      });
      const pct = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;
      await Student.findByIdAndUpdate(studentId, { attendancePercentage: pct });
    }

    return successResponse(res, 'Attendance marked successfully', {
      count: savedRecords.length,
      records: savedRecords,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance records with filter
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res, next) => {
  try {
    const { studentId, subjectId, date, startDate, endDate, month, semester } = req.query;
    const query = {};

    if (req.user.role === 'STUDENT' && req.student) {
      query.student = req.student._id;
    } else if (studentId) {
      query.student = studentId;
    }

    if (subjectId) query.subject = subjectId;
    if (semester) query.semester = Number(semester);

    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: d, $lt: nextDay };
    } else if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const records = await Attendance.find(query)
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email avatar' },
        select: 'rollNumber currentSemester',
      })
      .populate('subject', 'name code')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name' },
      })
      .sort({ date: -1, period: 1 });

    return successResponse(res, 'Attendance records retrieved', records);
  } catch (error) {
    next(error);
  }
};

// @desc    Get student overall & subject-wise attendance analytics
// @route   GET /api/attendance/summary
// @access  Private
const getStudentAttendanceSummary = async (req, res, next) => {
  try {
    let studentId = req.query.studentId;
    if (req.user.role === 'STUDENT') {
      if (!req.student) {
        return errorResponse(res, 'Student profile not found', 404);
      }
      studentId = req.student._id;
    }

    if (!studentId) {
      return errorResponse(res, 'Student ID is required', 400);
    }

    const totalClasses = await Attendance.countDocuments({ student: studentId });
    const presentClasses = await Attendance.countDocuments({
      student: studentId,
      status: { $in: ['PRESENT', 'LATE'] },
    });
    const absentClasses = await Attendance.countDocuments({
      student: studentId,
      status: 'ABSENT',
    });
    const leaveClasses = await Attendance.countDocuments({
      student: studentId,
      status: 'LEAVE',
    });

    const overallPercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;

    // Subject wise breakdown
    const subjectWise = await Attendance.aggregate([
      { $match: { student: new (require('mongoose').Types.ObjectId)(studentId) } },
      {
        $group: {
          _id: '$subject',
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $in: ['$status', ['PRESENT', 'LATE']] }, 1, 0],
            },
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'ABSENT'] }, 1, 0],
            },
          },
        },
      },
    ]);

    const populatedSubjects = await Subject.populate(subjectWise, {
      path: '_id',
      select: 'name code credits',
    });

    const subjectAnalytics = populatedSubjects.map((item) => {
      const pct = item.total > 0 ? Math.round((item.present / item.total) * 100) : 100;
      return {
        subject: item._id,
        total: item.total,
        present: item.present,
        absent: item.absent,
        percentage: pct,
        isLow: pct < 75,
      };
    });

    return successResponse(res, 'Attendance summary retrieved', {
      totalClasses,
      presentClasses,
      absentClasses,
      leaveClasses,
      overallPercentage,
      isLowAttendance: overallPercentage < 75,
      subjectBreakdown: subjectAnalytics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getStudentAttendanceSummary,
};
