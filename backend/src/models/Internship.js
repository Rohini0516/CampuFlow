const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: 'Remote / Hybrid',
    },
    duration: {
      type: String,
      default: '3 Months',
    },
    stipend: {
      type: String,
      default: '₹25,000/month',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    deadline: {
      type: Date,
    },
    description: {
      type: String,
      required: true,
    },
    skillsRequired: [
      {
        type: String,
      },
    ],
    applyUrl: {
      type: String,
      default: '',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['OPEN', 'CLOSED'],
      default: 'OPEN',
    },
    applicants: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['APPLIED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'],
          default: 'APPLIED',
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Internship', internshipSchema);
