const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
    },
    periodNumber: {
      type: Number,
      required: true,
    },
    startTime: {
      type: String,
      required: true, // e.g. "09:00"
    },
    endTime: {
      type: String,
      required: true, // e.g. "10:00"
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    roomNumber: {
      type: String,
      required: true, // e.g. "IT-302"
    },
    academicYear: {
      type: String,
      default: '2025-2026',
    },
  },
  { timestamps: true }
);

timetableSchema.index({ dayOfWeek: 1, periodNumber: 1, department: 1, course: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);
