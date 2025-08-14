/* eslint-disable */
const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: String, required: true },
    status: { type: String, enum: ['registered'], default: 'registered' },
    createdAt: { type: Date, default: () => new Date() },
  },
  { minimize: false }
);

RegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports.Registration = mongoose.model('Registration', RegistrationSchema);