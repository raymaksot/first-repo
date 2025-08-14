/* eslint-disable */
const mongoose = require('mongoose');

const ReadingGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: String, required: true },
    target: { type: Object, default: { type: 'quran', scope: 'full' } },
    schedule: { type: Object, default: {} },
    createdAt: { type: Date, default: () => new Date() },
  },
  { minimize: false }
);

ReadingGroupSchema.index({ createdAt: -1 });

module.exports.ReadingGroup = mongoose.model('ReadingGroup', ReadingGroupSchema);