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
      required: true,
    },
    type: {
      type: String,
    },
    reason: {
      type: String,
    },
    purpose: {
      type: String,
    },
    remarks: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'READY', 'ISSUED'],
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
