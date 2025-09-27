const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

console.log("🚀 Starting main server without MongoDB...");

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
    message: "Main server is working!",
    note: "Running without MongoDB for testing"
  });
});

// Start server on port 3001 to match working simple server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Main server running on port ${PORT}`);
  console.log(`📡 Test URL: http://localhost:${PORT}`);
  console.log(`🔗 API Test URL: http://localhost:${PORT}/api/test`);
  console.log("⚠️  Note: Running without MongoDB - some features may not work");
});
