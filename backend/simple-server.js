const express = require("express");
const cors = require("cors");

console.log("🚀 Starting simple server...");

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ 
    message: "Simple server is running!", 
    timestamp: new Date(),
    status: "OK"
  });
});

// Test API route
app.get("/api/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "API is working!",
    routes: {
      events: "/api/events",
      users: "/api/users",
      leaderboard: "/api/leaderboard"
    }
  });
});

// Mock events route (no database required)
app.get("/api/events", (req, res) => {
  res.json({
    success: true,
    events: [
      {
        _id: "1",
        title: "Test Event",
        description: "This is a test event",
        category: "Technology",
        date: new Date().toISOString(),
        time: "10:00",
        location: "Test Location",
        image: "https://via.placeholder.com/400x200",
        organizerId: "test-organizer",
        organizerName: "Test Organizer",
        maxAttendees: 100,
        currentAttendees: 0,
        price: 0
      }
    ]
  });
});

// Mock users route (no database required)
app.post("/api/users/signup", (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }
  
  res.json({
    success: true,
    message: "User created successfully",
    token: "mock-jwt-token",
    user: {
      id: "mock-user-id",
      name: name,
      email: email,
      isAdmin: false,
      badges: [],
      eventsAttended: [],
      points: 0
    }
  });
});

app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing email or password"
    });
  }
  
  res.json({
    success: true,
    message: "Login successful",
    token: "mock-jwt-token",
    user: {
      id: "mock-user-id",
      name: "Test User",
      email: email,
      isAdmin: false,
      badges: [],
      eventsAttended: [],
      points: 0
    }
  });
});

// Mock leaderboard route
app.get("/api/leaderboard", (req, res) => {
  res.json({
    success: true,
    leaderboard: [
      {
        _id: "1",
        name: "Test User 1",
        points: 100,
        badges: ["Beginner"]
      },
      {
        _id: "2", 
        name: "Test User 2",
        points: 80,
        badges: ["Active"]
      }
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`📡 Test URL: http://localhost:${PORT}`);
  console.log(`🔗 API Test URL: http://localhost:${PORT}/api/test`);
  console.log(`📋 Events URL: http://localhost:${PORT}/api/events`);
  console.log(`👥 Users URL: http://localhost:${PORT}/api/users/signup`);
  console.log(`🏆 Leaderboard URL: http://localhost:${PORT}/api/leaderboard`);
  console.log("\n✅ This server works WITHOUT MongoDB!");
  console.log("✅ Use this to test your frontend connection!");
});
