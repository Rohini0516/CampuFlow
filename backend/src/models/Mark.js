const mongoose = require('mongoose');

const markSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
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
    internalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },
    externalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxMarks: {
      type: Number,
      default: 100,
    },
    grade: {
      type: String,
      default: 'A',
    },
    resultStatus: {
      type: String,
      enum: ['PASS', 'FAIL', 'ABSENT'],
      default: 'PASS',
    },
    remarks: {
      type: String,
      default: '',
    },
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Calculate total and grade automatically before saving
markSchema.pre('save', function (next) {
  this.totalMarks = (this.internalMarks || 0) + (this.externalMarks || 0);
  const percentage = (this.totalMarks / (this.maxMarks || 100)) * 100;
  
  if (percentage >= 90) this.grade = 'O';
  else if (percentage >= 80) this.grade = 'A+';
  else if (percentage >= 70) this.grade = 'A';
  else if (percentage >= 60) this.grade = 'B+';
  else if (percentage >= 50) this.grade = 'B';
  else if (percentage >= 40) this.grade = 'C';
  else this.grade = 'F';

  this.resultStatus = percentage >= 40 ? 'PASS' : 'FAIL';
  next();
});

markSchema.index({ exam: 1, student: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Mark', markSchema);
