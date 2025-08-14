/* eslint-disable */
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date },
    location: { type: String },
    description: { type: String },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
  },
  { minimize: false }
);

EventSchema.index({ startsAt: 1 });

module.exports.Event = mongoose.model('Event', EventSchema);