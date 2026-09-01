const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log('=================================');
    console.log('MongoDB connected successfully');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log('=================================');

    return conn;
  } catch (error) {
    console.error('=================================');
    console.error('MongoDB connection failed');
    console.error(error.message);
    console.error('=================================');

    throw error;
  }
};

module.exports = connectDB;