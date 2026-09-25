const mongoose = require('mongoose');

const certificateRequestSchema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
      unique: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    certificateType: {
      type: String,
      enum: [
        'Bonafide Certificate',
        'Study Certificate',
        'Transfer Certificate',
        'Course Completion Certificate',
        'Internship Certificate',
        'Character Certificate',
        'Other',
      ],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'READY'],
      default: 'PENDING',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    certificateNumber: {
      type: String,
      default: '',
    },
    documentUrl: {
      type: String,
      default: '',
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    processedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

certificateRequestSchema.pre('save', function (next) {
  if (!this.requestNumber) {
    this.requestNumber = 'CERT-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
  }
  next();
});

module.exports = mongoose.model('CertificateRequest', certificateRequestSchema);
