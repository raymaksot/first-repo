/* eslint-disable */
const request = require('supertest');
const { app } = require('../server');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

let mem;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function sign(user) { return jwt.sign(user, JWT_SECRET); }

jest.setTimeout(120000);

beforeAll(async () => {
  mem = await MongoMemoryServer.create();
  const uri = mem.getUri();
  await mongoose.connect(uri, { dbName: 'mydeen_test' });
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
  if (mem) await mem.stop();
});

describe('Comments', () => {
  it('should create and list comments', async () => {
    const token = sign({ sub: 'u1', role: 'user' });
    const parentType = 'article';
    const parentId = 'a1';
    const created = await request(app).post('/api/comments').set('Authorization', `Bearer ${token}`).send({ parentType, parentId, text: 'Salam' });
    expect(created.status).toBe(200);
    const list = await request(app).get('/api/comments').set('Authorization', `Bearer ${token}`).query({ parentType, parentId });
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.data)).toBe(true);
    expect(list.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Events', () => {
  it('should create event and RSVP', async () => {
    const admin = sign({ sub: 'admin', role: 'admin' });
    const user = sign({ sub: 'u2', role: 'user' });
    const start = new Date(Date.now() + 3600 * 1000).toISOString();
    const ev = await request(app).post('/api/events').set('Authorization', `Bearer ${admin}`).send({ title: 'Iftar', startsAt: start });
    expect(ev.status).toBe(200);
    const id = ev.body._id;
    const rsvp = await request(app).post(`/api/events/${id}/register`).set('Authorization', `Bearer ${user}`);
    expect(rsvp.status).toBe(200);
    const get = await request(app).get(`/api/events/${id}`).set('Authorization', `Bearer ${user}`);
    expect(get.status).toBe(200);
    expect(get.body.registrationsCount).toBe(1);
  });
});