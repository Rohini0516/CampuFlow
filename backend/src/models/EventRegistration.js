const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['REGISTERED', 'ATTENDED', 'CANCELLED'],
      default: 'REGISTERED',
    },
    ticketId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Auto generate ticketId
eventRegistrationSchema.pre('save', function (next) {
  if (!this.ticketId) {
    this.ticketId = 'EVT-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  }
  next();
});

eventRegistrationSchema.index({ event: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
