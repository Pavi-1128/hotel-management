const mongoose = require('mongoose');
const User = require('./models/ User');

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_booking');
    console.log('MongoDB connected');
    
    const users = await User.find({});
    console.log('All users:', users);
    
    const manager = await User.findOne({ role: 'manager' });
    console.log('Manager found:', manager);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUsers();
