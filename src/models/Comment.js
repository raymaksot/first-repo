/* eslint-disable */
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    parentType: { type: String, enum: ['article', 'qaAnswer'], required: true },
    parentId: { type: String, required: true },
    text: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    status: { type: String, enum: ['approved', 'pending', 'removed'], default: 'approved' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

CommentSchema.index({ parentType: 1, parentId: 1, createdAt: -1 });

module.exports.Comment = mongoose.model('Comment', CommentSchema);