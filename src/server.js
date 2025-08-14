/* eslint-disable */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { Comment } = require('./models/Comment');
const { Like } = require('./models/Like');
const { ReadingGroup } = require('./models/ReadingGroup');
const { GroupMember } = require('./models/GroupMember');
const { GroupProgress } = require('./models/GroupProgress');
const { GroupMessage } = require('./models/GroupMessage');
const { Event } = require('./models/Event');
const { Registration } = require('./models/Registration');
const { DeviceToken } = require('./models/DeviceToken');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mydeen';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function authRequired(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function adminRequired(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// Devices
app.post('/api/devices/register', authRequired, async (req, res) => {
  const { token, platform } = req.body || {};
  if (!token) return res.status(400).json({ message: 'token required' });
  const doc = await DeviceToken.findOneAndUpdate(
    { userId: req.user.sub, token },
    { userId: req.user.sub, token, platform: platform || 'unknown', updatedAt: new Date() },
    { upsert: true, new: true }
  );
  res.json({ success: true, device: doc });
});

// Comments
app.get('/api/comments', authRequired, async (req, res) => {
  const { parentType, parentId, page = 1, limit = 20 } = req.query;
  if (!parentType || !parentId) return res.status(400).json({ message: 'parentType and parentId required' });
  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Comment.find({ parentType, parentId, status: 'approved' }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Comment.countDocuments({ parentType, parentId, status: 'approved' }),
  ]);
  res.json({ data, page: Number(page), limit: Number(limit), total });
});

app.post('/api/comments', authRequired, async (req, res) => {
  const { parentType, parentId, text } = req.body || {};
  if (!parentType || !parentId || !text) return res.status(400).json({ message: 'Missing fields' });
  const comment = await Comment.create({ parentType, parentId, text, userId: req.user.sub, likesCount: 0, status: 'approved' });
  res.json(comment);
});

app.put('/api/comments/:id', authRequired, async (req, res) => {
  const { text } = req.body || {};
  const c = await Comment.findById(req.params.id);
  if (!c) return res.status(404).json({ message: 'Not found' });
  if (String(c.userId) !== String(req.user.sub) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  c.text = text ?? c.text;
  c.updatedAt = new Date();
  await c.save();
  res.json(c);
});

app.delete('/api/comments/:id', authRequired, async (req, res) => {
  const c = await Comment.findById(req.params.id);
  if (!c) return res.status(404).json({ message: 'Not found' });
  if (String(c.userId) !== String(req.user.sub) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  await c.deleteOne();
  res.json({ success: true });
});

app.post('/api/comments/:id/like', authRequired, async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ message: 'Not found' });
  const existing = await Like.findOne({ parentType: 'comment', parentId: id, userId: req.user.sub });
  if (existing) return res.json({ liked: true, likesCount: comment.likesCount });
  await Like.create({ parentType: 'comment', parentId: id, userId: req.user.sub });
  comment.likesCount += 1;
  await comment.save();
  res.json({ liked: true, likesCount: comment.likesCount });
});

app.post('/api/comments/:id/unlike', authRequired, async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ message: 'Not found' });
  const existing = await Like.findOne({ parentType: 'comment', parentId: id, userId: req.user.sub });
  if (!existing) return res.json({ liked: false, likesCount: comment.likesCount });
  await existing.deleteOne();
  comment.likesCount = Math.max(0, comment.likesCount - 1);
  await comment.save();
  res.json({ liked: false, likesCount: comment.likesCount });
});

// Generic Likes (for articles and qa answers)
app.post('/api/likes/toggle', authRequired, async (req, res) => {
  const { parentType, parentId } = req.body || {};
  if (!parentType || !parentId) return res.status(400).json({ message: 'Missing fields' });
  const existing = await Like.findOne({ parentType, parentId, userId: req.user.sub });
  if (existing) {
    await existing.deleteOne();
  } else {
    await Like.create({ parentType, parentId, userId: req.user.sub });
  }
  const count = await Like.countDocuments({ parentType, parentId });
  res.json({ liked: !existing, likesCount: count });
});

// Reading Groups
app.post('/api/reading-groups', authRequired, async (req, res) => {
  const { name, description, target, schedule } = req.body || {};
  if (!name) return res.status(400).json({ message: 'name required' });
  const group = await ReadingGroup.create({ name, description, createdBy: req.user.sub, target: target || { type: 'quran', scope: 'full' }, schedule: schedule || {}, createdAt: new Date() });
  await GroupMember.create({ groupId: group._id, userId: req.user.sub, role: 'owner' });
  res.json(group);
});

app.get('/api/reading-groups', authRequired, async (req, res) => {
  const groups = await ReadingGroup.find().sort({ createdAt: -1 }).limit(100);
  res.json(groups);
});

app.get('/api/reading-groups/:id', authRequired, async (req, res) => {
  const group = await ReadingGroup.findById(req.params.id);
  if (!group) return res.status(404).json({ message: 'Not found' });
  const members = await GroupMember.find({ groupId: group._id });
  res.json({ group, members });
});

app.post('/api/reading-groups/:id/join', authRequired, async (req, res) => {
  const group = await ReadingGroup.findById(req.params.id);
  if (!group) return res.status(404).json({ message: 'Not found' });
  const existing = await GroupMember.findOne({ groupId: group._id, userId: req.user.sub });
  if (existing) return res.json({ joined: true });
  await GroupMember.create({ groupId: group._id, userId: req.user.sub, role: 'member' });
  res.json({ joined: true });
});

app.post('/api/reading-groups/:id/leave', authRequired, async (req, res) => {
  await GroupMember.deleteOne({ groupId: req.params.id, userId: req.user.sub });
  res.json({ left: true });
});

app.post('/api/reading-groups/:id/assign', authRequired, async (req, res) => {
  const { assignments } = req.body || {};
  if (!Array.isArray(assignments)) return res.status(400).json({ message: 'assignments array required' });
  const group = await ReadingGroup.findById(req.params.id);
  if (!group) return res.status(404).json({ message: 'Not found' });
  // Only owner/admin can assign
  const member = await GroupMember.findOne({ groupId: group._id, userId: req.user.sub });
  if (!member || (member.role !== 'owner' && req.user.role !== 'admin')) return res.status(403).json({ message: 'Forbidden' });
  // Upsert progress assignments
  const ops = assignments.map((a) => ({
    updateOne: {
      filter: { groupId: group._id, userId: a.userId, surah: a.surah, fromAyah: a.fromAyah, toAyah: a.toAyah },
      update: { $set: { groupId: group._id, userId: a.userId, surah: a.surah, fromAyah: a.fromAyah, toAyah: a.toAyah, completed: !!a.completed, updatedAt: new Date() } },
      upsert: true,
    },
  }));
  if (ops.length) await GroupProgress.bulkWrite(ops);
  res.json({ success: true });
});

app.post('/api/reading-groups/:id/progress', authRequired, async (req, res) => {
  const { surah, fromAyah, toAyah, completed } = req.body || {};
  if (!surah || !fromAyah || !toAyah) return res.status(400).json({ message: 'Missing fields' });
  const doc = await GroupProgress.findOneAndUpdate(
    { groupId: req.params.id, userId: req.user.sub, surah, fromAyah, toAyah },
    { groupId: req.params.id, userId: req.user.sub, surah, fromAyah, toAyah, completed: !!completed, updatedAt: new Date() },
    { upsert: true, new: true }
  );
  res.json(doc);
});

app.get('/api/reading-groups/:id/progress', authRequired, async (req, res) => {
  const items = await GroupProgress.find({ groupId: req.params.id });
  res.json(items);
});

// Group Chat (basic REST)
app.get('/api/reading-groups/:id/messages', authRequired, async (req, res) => {
  const items = await GroupMessage.find({ groupId: req.params.id }).sort({ createdAt: -1 }).limit(100);
  res.json(items);
});

app.post('/api/reading-groups/:id/messages', authRequired, async (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ message: 'text required' });
  const msg = await GroupMessage.create({ groupId: req.params.id, userId: req.user.sub, text, createdAt: new Date() });
  res.json(msg);
});

// Events & registrations
app.post('/api/events', authRequired, adminRequired, async (req, res) => {
  const { title, startsAt, endsAt, location, description } = req.body || {};
  if (!title || !startsAt) return res.status(400).json({ message: 'title and startsAt required' });
  const event = await Event.create({ title, startsAt: new Date(startsAt), endsAt: endsAt ? new Date(endsAt) : undefined, location, description, createdBy: req.user.sub, createdAt: new Date() });
  res.json(event);
});

app.get('/api/events', authRequired, async (req, res) => {
  const now = new Date();
  const upcoming = await Event.find({ $or: [ { endsAt: { $exists: false } }, { endsAt: { $gte: now } } ], startsAt: { $gte: new Date(Date.now() - 7*24*3600*1000) } }).sort({ startsAt: 1 }).limit(100);
  res.json(upcoming);
});

app.get('/api/events/:id', authRequired, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Not found' });
  const count = await Registration.countDocuments({ eventId: event._id });
  res.json({ ...event.toObject(), registrationsCount: count });
});

app.post('/api/events/:id/register', authRequired, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Not found' });
  await Registration.updateOne({ eventId: event._id, userId: req.user.sub }, { $set: { eventId: event._id, userId: req.user.sub, status: 'registered', createdAt: new Date() } }, { upsert: true });
  const count = await Registration.countDocuments({ eventId: event._id });
  res.json({ registered: true, registrationsCount: count });
});

app.delete('/api/events/:id/register', authRequired, async (req, res) => {
  await Registration.deleteOne({ eventId: req.params.id, userId: req.user.sub });
  const count = await Registration.countDocuments({ eventId: req.params.id });
  res.json({ registered: false, registrationsCount: count });
});

app.get('/api/events/:id/registrations', authRequired, adminRequired, async (req, res) => {
  const regs = await Registration.find({ eventId: req.params.id });
  res.json(regs);
});

// Admin moderation
app.get('/api/admin/dashboard', authRequired, adminRequired, async (req, res) => {
  const [pendingComments, groups, events] = await Promise.all([
    Comment.countDocuments({ status: 'pending' }),
    ReadingGroup.countDocuments({}),
    Event.countDocuments({}),
  ]);
  res.json({ pendingComments, groups, events });
});

app.post('/api/admin/comments/:id/approve', authRequired, adminRequired, async (req, res) => {
  const c = await Comment.findById(req.params.id);
  if (!c) return res.status(404).json({ message: 'Not found' });
  c.status = 'approved';
  c.updatedAt = new Date();
  await c.save();
  res.json(c);
});

app.delete('/api/admin/comments/:id', authRequired, adminRequired, async (req, res) => {
  await Comment.deleteOne({ _id: req.params.id });
  res.json({ success: true });
});

async function start() {
  await mongoose.connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || 'mydeen' });
  return app.listen(PORT, () => console.log(`API listening on :${PORT}`));
}

module.exports = { app, start };

if (require.main === module) {
  start().catch((e) => {
    console.error('Failed to start server', e);
    process.exit(1);
  });
}