// backend/controllers/leaderboardController.js
const User = require("../models/User");

/**
 * Get leaderboard
 * - Returns users sorted by points (descending)
 * - Optionally limit to top N users
 */
const getLeaderboard = async (req, res) => {
  try {
    const top = parseInt(req.query.top) || 10; // default top 10
    const users = await User.find()
      .sort({ points: -1 }) // highest points first
      .limit(top)
      .select("name points badges eventsAttended"); // select relevant fields

    res.json({
      success: true,
      leaderboard: users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

module.exports = { getLeaderboard };
