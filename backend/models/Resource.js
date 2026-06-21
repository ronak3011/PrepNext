const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  type: {
  type: String,
  required: [true, 'Please add a resource type'],
  enum: ['Notes', 'PYQs', 'Cheat Sheets', 'Important Questions', 'Assignments', 'Viva Questions']
  },
  url: {
    type: String,
    required: [true, 'Please add a URL to the resource']
  },
  subject: {
    type: mongoose.Schema.ObjectId,
    ref: 'Subject',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
