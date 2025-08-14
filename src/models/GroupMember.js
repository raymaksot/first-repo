/* eslint-disable */
const mongoose = require('mongoose');

const GroupMemberSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReadingGroup', required: true },
    userId: { type: String, required: true },
    role: { type: String, enum: ['owner', 'member'], default: 'member' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

GroupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

module.exports.GroupMember = mongoose.model('GroupMember', GroupMemberSchema);