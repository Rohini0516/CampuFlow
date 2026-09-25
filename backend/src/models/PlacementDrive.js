const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    packageLPA: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      default: 'Flexible / Hybrid',
    },
    eligibilityCriteria: {
      minCgpa: {
        type: Number,
        default: 6.5,
      },
      allowedDepartments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Department',
        },
      ],
      maxBacklogs: {
        type: Number,
        default: 0,
      },
      graduatingYear: {
        type: Number,
        default: new Date().getFullYear(),
      },
    },
    driveDate: {
      type: Date,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      default: 'Campus Placement Cell / Virtual',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'ACTIVE',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
