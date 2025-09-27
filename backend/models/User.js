// backend/models/User.js
const mongoose = require("mongoose");

/**
 * Review Schema
 * - Embedded in the User model to track reviews a user has submitted.
 */
const reviewSchema = new mongoose.Schema({
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Event", 
    required: true 
  }, // Reference to the Event reviewed
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  }, // Rating given by user
  comment: { 
    type: String, 
    trim: true 
  }, // Optional textual review
  date: { 
    type: Date, 
    default: Date.now 
  } // Date when review was submitted
});

/**
 * User Schema
 * - Represents a user in the system: students, faculty, or organizers.
 * - Tracks events attended, enrolled, organized, reviews, points, and badges.
 */
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  }, // True for organizers/admins

  // ----------------- Engagement & Gamification -----------------
  points: { 
    type: Number, 
    default: 0 
  }, // Points earned by attending events, giving reviews, etc.
  badges: [{ 
    type: String 
  }], // Examples: "Beginner", "Event Master", "Pro Attendee"

  // ----------------- Event Participation -----------------
  eventsAttended: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Event" 
  }], // Events the user has checked in for
  eventsEnrolled: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Event" 
  }], // Events the user signed up for but not yet attended
  organizedEvents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Event" 
  }], // Events created by this user (organizer/admin)

  // ----------------- Reviews -----------------
  reviews: [reviewSchema] // Embedded reviews submitted by this user
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model("User", userSchema);
