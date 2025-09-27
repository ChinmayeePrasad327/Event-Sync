// backend/models/Badge.js
const mongoose = require("mongoose");

/**
 * Badge Schema
 * - Represents a badge in the system.
 * - Can be awarded based on user points, number of events attended, or other criteria.
 */
const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  minPoints: { type: Number, default: 0 }, // Minimum points required to earn
  minEvents: { type: Number, default: 0 }, // Minimum events attended
  iconUrl: { type: String } // Optional image/icon for badge
}, { timestamps: true });

module.exports = mongoose.model("Badge", badgeSchema);
