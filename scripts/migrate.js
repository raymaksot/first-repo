/* eslint-disable */
require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mydeen';
  const dbName = process.env.MONGODB_DB || 'mydeen';
  await mongoose.connect(uri, { dbName });

  // Ensure indexes by requiring models
  require('../src/models/Comment');
  require('../src/models/Like');
  require('../src/models/ReadingGroup');
  require('../src/models/GroupMember');
  require('../src/models/GroupProgress');
  require('../src/models/GroupMessage');
  require('../src/models/Event');
  require('../src/models/Registration');
  require('../src/models/DeviceToken');

  await mongoose.connection.db.command({ ping: 1 });
  await mongoose.connection.syncIndexes();

  console.log('Migration complete: indexes synced');
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});