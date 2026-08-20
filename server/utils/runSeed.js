require('dotenv').config();
const { connectDB } = require('../config/db');
const seedData = require('./seed');
const mongoose = require('mongoose');

const runSeed = async () => {
  try {
    await connectDB();
    await seedData();
    console.log('Seed completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to run seed:', error);
    process.exit(1);
  }
};

runSeed();
