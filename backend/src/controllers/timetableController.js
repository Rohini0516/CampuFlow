const { Timetable, Subject, Faculty, Student } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get timetable slots
// @route   GET /api/timetable
// @access  Private
const getTimetable = async (req, res, next) => {
  try {
    const { department, course, semester, facultyId, day } = req.query;
    const query = {};

    if (day) query.dayOfWeek = day;

    if (req.user.role === 'STUDENT' && req.student) {
      query.department = req.student.department;
      query.course = req.student.course;
      query.semester = req.student.currentSemester;
    } else if (req.user.role === 'FACULTY' && req.faculty) {
      query.faculty = req.faculty._id;
    } else {
      if (department) query.department = department;
      if (course) query.course = course;
      if (semester) query.semester = Number(semester);
      if (facultyId) query.faculty = facultyId;
    }

    const timetable = await Timetable.find(query)
      .populate('subject', 'name code')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name email' },
      })
      .populate('department', 'name code')
      .populate('course', 'name code')
      .sort({ periodNumber: 1 });

    // Group by day of week for easy calendar view
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const grouped = {};
    days.forEach((d) => (grouped[d] = []));

    timetable.forEach((slot) => {
      if (grouped[slot.dayOfWeek]) {
        grouped[slot.dayOfWeek].push(slot);
      }
    });

    return successResponse(res, 'Timetable retrieved', {
      raw: timetable,
      weekly: grouped,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Update timetable slot
// @route   POST /api/timetable
// @access  Private (Admin)
const createTimetableSlot = async (req, res, next) => {
  try {
    const {
      dayOfWeek,
      periodNumber,
      startTime,
      endTime,
      subject,
      faculty,
      department,
      course,
      semester,
      roomNumber,
    } = req.body;

    const slot = await Timetable.findOneAndUpdate(
      {
        dayOfWeek,
        periodNumber,
        department,
        course,
        semester,
      },
      {
        dayOfWeek,
        periodNumber,
        startTime,
        endTime,
        subject,
        faculty,
        department,
        course,
        semester,
        roomNumber,
      },
      { upsert: true, new: true, runValidators: true }
    )
      .populate('subject', 'name code')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name' },
      });

    return successResponse(res, 'Timetable slot updated successfully', slot, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete timetable slot
// @route   DELETE /api/timetable/:id
// @access  Private (Admin)
const deleteTimetableSlot = async (req, res, next) => {
  try {
    const slot = await Timetable.findByIdAndDelete(req.params.id);
    if (!slot) return errorResponse(res, 'Slot not found', 404);
    return successResponse(res, 'Timetable slot deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTimetable,
  createTimetableSlot,
  deleteTimetableSlot,
};
