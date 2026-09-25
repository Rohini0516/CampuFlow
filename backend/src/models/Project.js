const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    semester: {
      type: Number,
      default: 5,
    },
    facultyMentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expectedCompletionDate: {
      type: Date,
    },
    actualCompletionDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Not Started', 'Planning', 'Development', 'Testing', 'Submitted', 'Completed'],
      default: 'Planning',
    },
    progress: {
      type: Number,
      default: 25,
      min: 0,
      max: 100,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

projectSchema.pre('save', function (next) {
  if (!this.projectId) {
    this.projectId = 'PRJ-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
