const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  resource: {
    type: mongoose.Schema.ObjectId,
    ref: 'Resource',
    required: true
  }
}, {
  timestamps: true
});

// Ensure a user can only bookmark a resource once
bookmarkSchema.index({ user: 1, resource: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
