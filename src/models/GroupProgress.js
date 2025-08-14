/* eslint-disable */
const mongoose = require('mongoose');

const GroupProgressSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReadingGroup', required: true },
    userId: { type: String, required: true },
    surah: { type: Number, required: true },
    fromAyah: { type: Number, required: true },
    toAyah: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    updatedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: { createdAt: 'createdAt' } }
);

GroupProgressSchema.index({ groupId: 1, userId: 1, surah: 1, fromAyah: 1, toAyah: 1 }, { unique: true });

module.exports.GroupProgress = mongoose.model('GroupProgress', GroupProgressSchema);