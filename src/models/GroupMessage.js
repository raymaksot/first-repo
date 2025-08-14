/* eslint-disable */
const mongoose = require('mongoose');

const GroupMessageSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReadingGroup', required: true },
    userId: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
  },
  { minimize: false }
);

GroupMessageSchema.index({ groupId: 1, createdAt: -1 });

module.exports.GroupMessage = mongoose.model('GroupMessage', GroupMessageSchema);