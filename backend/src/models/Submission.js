const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    content: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUBMITTED', 'LATE', 'GRADED'],
      default: 'SUBMITTED',
    },
    marksObtained: {
      type: Number,
      default: null,
    },
    facultyFeedback: {
      type: String,
      default: '',
    },
    gradedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
