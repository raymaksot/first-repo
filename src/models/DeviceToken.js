/* eslint-disable */
const mongoose = require('mongoose');

const DeviceTokenSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    token: { type: String, required: true },
    platform: { type: String },
    updatedAt: { type: Date, default: () => new Date() },
  },
  { minimize: false }
);

DeviceTokenSchema.index({ userId: 1, token: 1 }, { unique: true });

module.exports.DeviceToken = mongoose.model('DeviceToken', DeviceTokenSchema);