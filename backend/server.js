const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

console.log("MONGO_URI:", process.env.MONGO_URI); // DEBUG

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
app.use("/api/admin", adminRoutes); // New: Mount admin routes
app.use("/api/leaderboard", leaderboardRoutes); // New: Mount leaderboard routes

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));