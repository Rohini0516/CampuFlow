const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    category: {
      type: String,
      enum: ['Academic', 'Infrastructure', 'Hostel', 'Transport', 'Faculty', 'Examination', 'IT Support', 'Other'],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
    },
    assignedDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Closed'],
      default: 'Submitted',
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

complaintSchema.pre('save', function (next) {
  if (!this.ticketNumber) {
    this.ticketNumber = 'GRV-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
