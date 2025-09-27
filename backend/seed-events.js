const mongoose = require('mongoose');
const Event = require('./models/Event');
const User = require('./models/User');
require('dotenv').config();

const seedEvents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@123.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found. Please create an account first.');
      return;
    }

    console.log('👤 Found admin user:', adminUser.name);

    // Create test events
    const testEvents = [
      {
        title: "Tech Conference 2024",
        description: "Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing.",
        category: "Technology",
        date: new Date('2024-02-15'),
        time: "09:00",
        location: "Convention Center, Downtown",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
        organizerId: adminUser._id,
        organizerName: adminUser.name,
        maxAttendees: 200,
        currentAttendees: 0,
        price: 50,
        tags: ["technology", "conference", "innovation"],
        eventCode: "EVT-TECH-001"
      },
      {
        title: "Startup Pitch Competition",
        description: "Join us for an exciting startup pitch competition where entrepreneurs showcase their innovative ideas.",
        category: "Business",
        date: new Date('2024-02-20'),
        time: "14:00",
        location: "Innovation Hub",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500",
        organizerId: adminUser._id,
        organizerName: adminUser.name,
        maxAttendees: 100,
        currentAttendees: 0,
        price: 25,
        tags: ["startup", "pitch", "entrepreneurship"],
        eventCode: "EVT-STARTUP-001"
      },
      {
        title: "Networking Mixer",
        description: "Professional networking event for industry professionals to connect and collaborate.",
        category: "Networking",
        date: new Date('2024-02-25'),
        time: "18:00",
        location: "Grand Hotel Ballroom",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500",
        organizerId: adminUser._id,
        organizerName: adminUser.name,
        maxAttendees: 150,
        currentAttendees: 0,
        price: 0,
        tags: ["networking", "professional", "social"],
        eventCode: "EVT-NETWORK-001"
      }
    ];

    // Clear existing events
    await Event.deleteMany({});
    console.log('🗑️ Cleared existing events');

    // Create new events
    const createdEvents = await Event.insertMany(testEvents);
    console.log('✅ Created test events:');
    createdEvents.forEach(event => {
      console.log(`  - ${event.title} (${event.eventCode})`);
    });

    console.log('🎉 Test events created successfully!');
    console.log('📱 You can now test RSVP and check-in functionality');

  } catch (error) {
    console.error('❌ Error seeding events:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

seedEvents();
