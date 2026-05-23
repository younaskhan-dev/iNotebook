const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inotebook';

const connectToMongo = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is not defined. Using the local default MongoDB URI.');
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to Mongo Successfully');
    console.log(`MongoDB connected to database: ${mongoose.connection.name}`);
    console.log(`MongoDB host: ${mongoose.connection.host}:${mongoose.connection.port}`);
  } catch (error) {
    console.error('Failed to connect to Mongo:', error);
  }
};

module.exports = connectToMongo;
