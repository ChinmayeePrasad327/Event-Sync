const express = require("express");
const cors = require("cors");
const path = require("path");

// Try to load environment variables
try {
  require("dotenv").config({ path: path.resolve(__dirname, ".env") });
  console.log("✅ Environment variables loaded");
  console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not set");
  console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Set" : "Not set");
  console.log("PORT:", process.env.PORT || 5000);
} catch (error) {
  console.log("❌ Error loading environment variables:", error.message);
}

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend server is running!", timestamp: new Date() });
});

// Test API route
app.get("/api/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "API is working!",
    environment: {
      mongoUri: process.env.MONGO_URI ? "Set" : "Not set",
      jwtSecret: process.env.JWT_SECRET ? "Set" : "Not set",
      port: process.env.PORT || 5000
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📡 Test URL: http://localhost:${PORT}`);
  console.log(`🔗 API Test URL: http://localhost:${PORT}/api/test`);
});
