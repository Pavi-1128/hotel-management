const mongoose = require('mongoose');
const Service = require('./models/Service');
const User = require('./models/ User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_booking');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample services data
const sampleServices = [
  {
    name: "Pick Up or Drop from Chennai Airport",
    description: "SUV (Innova or similar) Enjoy a comfortable and convenient airport transfer service with our premium SUV fleet. Professional driver, air-conditioned vehicle, and timely service guaranteed.",
    price: 1954,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "transportation"
  },
  {
    name: "Buffet Dinner",
    description: "Treat yourself to a gastronomic adventure with our extensive buffet dinner featuring international and local cuisines. Fresh ingredients, live cooking stations, and elegant dining atmosphere.",
    price: 1600,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "dining"
  },
  {
    name: "Spa Treatment",
    description: "Spa for 50 Minutes - Rejuvenate your mind and body with our signature spa treatments. Professional therapists, premium products, and a tranquil environment for ultimate relaxation.",
    price: 2900,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "spa"
  },
  {
    name: "Mercedes-Benz Airport Transfer - Premium",
    description: "Enjoy a seamless airport transfer in a Mercedes-Benz luxury sedan. Professional chauffeur, complimentary refreshments, and premium comfort for your journey.",
    price: 6410,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "transportation"
  },
  {
    name: "City Tour with Guide",
    description: "Explore the beautiful city with our knowledgeable local guide. Visit historical landmarks, cultural sites, and hidden gems. Includes transportation and refreshments.",
    price: 2500,
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "entertainment"
  },
  {
    name: "Room Service - Premium Menu",
    description: "24/7 room service with our premium menu featuring international cuisine, local specialties, and gourmet desserts. Delivered fresh to your room.",
    price: 800,
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "dining"
  },
  {
    name: "Fitness Center Access",
    description: "Access to our state-of-the-art fitness center with modern equipment, personal trainer consultation, and group fitness classes. Open 24/7 for your convenience.",
    price: 500,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "other"
  },
  {
    name: "Laundry & Dry Cleaning",
    description: "Professional laundry and dry cleaning services with same-day delivery. Premium care for all your garments with eco-friendly processes.",
    price: 300,
    image: "https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "other"
  }
];

const seedServices = async () => {
  try {
    await connectDB();
    
    // Find a manager user to assign services to
    const manager = await User.findOne({ role: 'manager' });
    if (!manager) {
      console.log('No manager found. Please create a manager user first.');
      return;
    }
    
    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');
    
    // Create sample services
    const services = sampleServices.map(serviceData => ({
      ...serviceData,
      createdBy: manager._id,
      isActive: true
    }));
    
    const createdServices = await Service.insertMany(services);
    console.log(`Created ${createdServices.length} sample services`);
    
    // Display created services
    createdServices.forEach(service => {
      console.log(`- ${service.name}: ₹${service.price} (${service.category})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding services:', error);
    process.exit(1);
  }
};

seedServices();
