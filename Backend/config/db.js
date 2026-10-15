const mongoose = require('mongoose');

/**
 * Connect to the MongoDB "Portfolio" database.
 * The connection string comes from the MONGO_URI environment variable
 */
const connectDB = async () => {
  try {
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
