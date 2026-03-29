const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Note', maxlength: 200 },
  content: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: { type: [String], default: [] },
  isPinned: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  color: { type: String, default: 'default' },
}, { timestamps: true });

noteSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model('Note', noteSchema);