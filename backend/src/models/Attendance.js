const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
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
    date: {
      type: Date,
      required: true,
    },
    period: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE', 'LEAVE'],
      default: 'PRESENT',
    },
    remarks: {
      type: String,
      default: '',
    },
    semester: {
      type: Number,
      default: 1,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
    },
  },
  { timestamps: true }
);

// Compound index to avoid duplicate attendance for student + subject + date + period
attendanceSchema.index({ student: 1, subject: 1, date: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
