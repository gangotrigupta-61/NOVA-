// Force Node.js to use Google DNS for SRV lookups (fixes ECONNREFUSED on local DNS servers)
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const connectDB = async (attempt = 1) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error (attempt ${attempt}/${MAX_RETRIES}): ${error.message}`);

    if (attempt < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * attempt;
      console.log(`🔄 Retrying in ${delay / 1000}s...`);
      setTimeout(() => connectDB(attempt + 1), delay);
    } else {
      console.error('💀 Could not connect to MongoDB after multiple attempts. Exiting.');
      console.error('👉 Fix: MongoDB Atlas → Network Access → Add IP 0.0.0.0/0');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
