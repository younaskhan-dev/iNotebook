const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inotebook');
    console.log('db:', mongoose.connection.name);
    console.log('collections:', Object.keys(mongoose.connection.collections));
    const User = require('./models/User');
    const Note = require('./models/Notes');
    const userCount = await User.countDocuments();
    const noteCount = await Note.countDocuments();
    console.log('userCount', userCount);
    console.log('noteCount', noteCount);
    const userCollInfo = await mongoose.connection.db.listCollections({ name: 'users' }).toArray();
    console.log('usersCollectionExists', userCollInfo.length > 0);
    const allUsers = await mongoose.connection.db.collection('users').find({}).limit(5).toArray();
    console.log('sampleUsers', allUsers);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
