// Database Seeding Script for Hotel Booking Application
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/ User');
const Room = require('./models/ Room');
const Offer = require('./models/ Offer');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Room.deleteMany({});
    await Offer.deleteMany({});
    console.log('Cleared existing data');

    // Create users only
    const managerUser = await User.create({
      firstName: 'Hotel',
      lastName: 'Manager',
      email: 'manager@hotel.com',
      password: 'manager123',
      role: 'manager'
    });

    const clientUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'client@hotel.com',
      password: 'client123',
      role: 'client'
    });

    console.log('Created users');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Created:');
    console.log(`- ${await User.countDocuments()} users`);
    console.log(`- ${await Room.countDocuments()} rooms (0 - managers need to create rooms)`);
    console.log(`- ${await Offer.countDocuments()} offers (0 - managers need to create offers)`);
    
    console.log('\n🔑 Demo Credentials:');
    console.log('Manager: manager@hotel.com / manager123');
    console.log('Client: client@hotel.com / client123');
    
    console.log('\n📝 Note: No predefined rooms or offers created.');
    console.log('Managers need to create rooms and offers for clients to see them.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the seeding function
seedDatabase();
