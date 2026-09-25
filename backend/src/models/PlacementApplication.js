const mongoose = require('mongoose');

const placementApplicationSchema = new mongoose.Schema(
  {
    placementDrive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['APPLIED', 'SHORTLISTED', 'TECHNICAL_ROUND', 'HR_ROUND', 'SELECTED', 'REJECTED'],
      default: 'APPLIED',
    },
    notes: {
      type: String,
      default: '',
    },
    roundFeedback: [
      {
        roundName: String,
        status: String,
        feedback: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    offerDetails: {
      offeredPackage: Number,
      offerLetterUrl: String,
      joiningDate: Date,
    },
  },
  { timestamps: true }
);

placementApplicationSchema.index({ placementDrive: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('PlacementApplication', placementApplicationSchema);
