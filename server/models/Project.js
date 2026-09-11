const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    color: {
      type: String,
      default: '#6366f1', // indigo as default
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Ensure owner is always in members
projectSchema.pre('save', function (next) {
  const ownerIdStr = this.owner.toString();
  const isMember = this.members.some((m) => m.toString() === ownerIdStr);
  if (!isMember) {
    this.members.unshift(this.owner);
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
