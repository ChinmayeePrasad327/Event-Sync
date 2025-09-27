const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Try to load .env file, but don't fail if it doesn't exist
try {
  require("dotenv").config({ path: path.resolve(__dirname, ".env") });
  console.log("✅ .env file loaded");
} catch (error) {
  console.log("⚠️  .env file not found, using defaults");
}

// Set default values if .env is missing
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/eventapp";
const JWT_SECRET = process.env.JWT_SECRET || "default-jwt-secret-change-in-production";
const PORT = process.env.PORT || 5000;

console.log("🔧 Configuration:");
console.log("MONGO_URI:", MONGO_URI);
console.log("JWT_SECRET:", JWT_SECRET ? "✅ Set" : "❌ Missing");
console.log("PORT:", PORT);

// Import routes
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Mount the routes
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Add a test route
app.get("/api/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "Main server with MongoDB is working!",
    database: "MongoDB",
    port: PORT
  });
});

// Connect MongoDB
console.log("🔌 Attempting to connect to MongoDB...");
mongoose.connect(MONGO_URI)
.then(() => {
  console.log("✅ MongoDB connected successfully!");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Test URL: http://localhost:${PORT}`);
  console.log(`🔗 API Test URL: http://localhost:${PORT}/api/test`);
})
.catch(err => {
  console.log("❌ MongoDB connection failed:");
  console.log(err.message);
  console.log("\n💡 Solutions:");
  console.log("1. Install MongoDB locally: https://www.mongodb.com/try/download/community");
  console.log("2. Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas");
  console.log("3. Or create .env file with correct MONGO_URI");
  console.log("\n🔄 Server will still start but without database...");
  
  // Start server even if MongoDB fails
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (without database)`);
    console.log("⚠️  Some features may not work without MongoDB");
  });
});
