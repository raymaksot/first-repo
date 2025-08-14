/* eslint-disable */
const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    parentType: { type: String, enum: ['comment', 'article', 'qaAnswer'], required: true },
    parentId: { type: String, required: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

LikeSchema.index({ userId: 1, parentType: 1, parentId: 1 }, { unique: true });

module.exports.Like = mongoose.model('Like', LikeSchema);