// backend/controllers/userController.js
const User = require("../models/User");
const Event = require("../models/Event"); // used for sanity checks (optional)
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 * User Controller
 * - Signup / Login
 * - Profile fetch (populated)
 * - Helpers to update user after check-in / review
 * - Enrollment helpers (enroll / unenroll)
 *
 * NOTE:
 * - This file should NOT require the eventController (avoid circular imports).
 * - eventController will import helper functions from this file when needed.
 */

/* ---------------------------- Helpers ---------------------------- */

/**
 * Generate JWT token
 * @param {ObjectId} userId
 * @param {Boolean} isAdmin
 */
const generateToken = (userId, isAdmin) => {
  return jwt.sign({ id: userId, isAdmin }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

/**
 * Utility: safe inclusion check for ObjectId arrays
 */
const includesId = (arr, id) => arr.some(x => x.toString() === id.toString());

/**
 * Assign badges to user based on simple thresholds.
 * You can later replace this with a dynamic Badge model lookup.
 * @param {User} user - Mongoose user doc (mutated in-place)
 */
const assignBadges = (user) => {
  // Example badge rules (tweak as needed)
  const eventsCount = user.eventsAttended.length || 0;
  const points = user.points || 0;

  // Starter badge
  if (eventsCount >= 1 && !user.badges.includes("Beginner")) user.badges.push("Beginner");
  // Mid-tier
  if (eventsCount >= 5 && !user.badges.includes("Intermediate")) user.badges.push("Intermediate");
  // Pro
  if (eventsCount >= 10 && !user.badges.includes("Pro Attendee")) user.badges.push("Pro Attendee");
  // Points-based example
  if (points >= 200 && !user.badges.includes("Event Master")) user.badges.push("Event Master");
  // Organizer badge (example: creator of 3+ events)
  if ((user.organizedEvents || []).length >= 3 && !user.badges.includes("Organizer")) user.badges.push("Organizer");
};

/* ---------------------------- Auth ---------------------------- */

/**
 * Signup a new user.
 * - Hashes password, creates user, returns JWT + sanitized user info.
 */
const signup = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  try {
    // check existing
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false
    });

    const token = generateToken(user._id, user.isAdmin);

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        points: user.points,
        badges: user.badges,
        eventsAttended: user.eventsAttended,
        eventsEnrolled: user.eventsEnrolled,
        organizedEvents: user.organizedEvents,
        reviews: user.reviews
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: "Signup failed", error: err.message });
  }
};

/**
 * Login existing user.
 * - Validates credentials and returns JWT + sanitized user info.
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id, user.isAdmin);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        points: user.points,
        badges: user.badges,
        eventsAttended: user.eventsAttended,
        eventsEnrolled: user.eventsEnrolled,
        organizedEvents: user.organizedEvents,
        reviews: user.reviews
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
};

/* ---------------------------- Profile ---------------------------- */

/**
 * Get the complete profile of the logged-in user.
 * - Populates eventsAttended, eventsEnrolled, organizedEvents and review event info.
 * - Protected route: requires auth middleware that sets req.user._id
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("eventsAttended", "title date location department eventCode")
      .populate("eventsEnrolled", "title date location department eventCode")
      .populate("organizedEvents", "title date location department eventCode")
      .populate("reviews.eventId", "title date location department eventCode");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        points: user.points,
        badges: user.badges,
        eventsAttended: user.eventsAttended,
        eventsEnrolled: user.eventsEnrolled,
        organizedEvents: user.organizedEvents,
        reviews: user.reviews
      }
    });
  } catch (err) {
    console.error("GetProfile error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch profile", error: err.message });
  }
};

/* ---------------------------- Enrollment ---------------------------- */

/**
 * Enroll a user for an event (register interest).
 * - Adds eventId to eventsEnrolled if not already present.
 * - Does NOT check capacity or do check-in (it's just enrollment).
 */
const enrollInEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.body;
    // optional: check event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (includesId(user.eventsEnrolled || [], eventId)) {
      return res.status(400).json({ success: false, message: "Already enrolled" });
    }

    user.eventsEnrolled.push(eventId);
    await user.save();

    return res.json({ success: true, message: "Enrolled successfully", eventsEnrolled: user.eventsEnrolled });
  } catch (err) {
    console.error("Enroll error:", err);
    return res.status(500).json({ success: false, message: "Enrollment failed", error: err.message });
  }
};

/**
 * Un-enroll (cancel enrollment) from an event.
 */
const leaveEnrollment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.eventsEnrolled = (user.eventsEnrolled || []).filter(e => e.toString() !== eventId.toString());
    await user.save();

    return res.json({ success: true, message: "Enrollment cancelled", eventsEnrolled: user.eventsEnrolled });
  } catch (err) {
    console.error("LeaveEnrollment error:", err);
    return res.status(500).json({ success: false, message: "Failed to cancel enrollment", error: err.message });
  }
};

/* ---------------------------- Post-check-in & reviews ---------------------------- */

/**
 * Update user's document after a check-in.
 * - Adds eventId to eventsAttended (if not already)
 * - Removes eventId from eventsEnrolled (if present)
 * - Adds points (10 by default)
 * - Assigns badges according to simple rules
 *
 * This is exported and should be called by eventController.checkInEvent after the event
 * participants array has been updated successfully.
 *
 * @param {ObjectId} userId
 * @param {ObjectId} eventId
 * @param {Number} [points=10]
 * @returns {User} updated user document
 */
const updateUserAfterCheckIn = async (userId, eventId, points = 10) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (!includesId(user.eventsAttended || [], eventId)) {
      user.eventsAttended.push(eventId);
    }

    // remove from enrolled if present
    user.eventsEnrolled = (user.eventsEnrolled || []).filter(e => e.toString() !== eventId.toString());

    // add points
    user.points = (user.points || 0) + points;

    // assign badges
    assignBadges(user);

    await user.save();
    return user;
  } catch (err) {
    console.error("updateUserAfterCheckIn error:", err);
    throw err;
  }
};

/**
 * Update user after they submit a review:
 * - Adds review entry to user's reviews array
 * - Grants points for review (example: 5 points)
 */
const updateUserAfterReview = async (userId, eventId, rating, comment, pointsForReview = 5) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Avoid duplicate review entries in user document (best-effort)
    const alreadyReviewed = (user.reviews || []).some(r => r.eventId.toString() === eventId.toString());
    if (!alreadyReviewed) {
      user.reviews.push({ eventId, rating, comment, date: new Date() });
      user.points = (user.points || 0) + pointsForReview;
      assignBadges(user);
      await user.save();
    }
    return user;
  } catch (err) {
    console.error("updateUserAfterReview error:", err);
    throw err;
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private (Admin or user themselves)
 */
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the logged-in user is the admin or the user being deleted
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this user" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete user", error: err.message });
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private (Admin only)
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords for security
    res.json({ success: true, users });
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch users", error: err.message });
  }
};

/* ---------------------------- Export ---------------------------- */

module.exports = {
  signup,
  login,
  getProfile,
  enrollInEvent,
  leaveEnrollment,
  updateUserAfterCheckIn,
  updateUserAfterReview, // Corrected: Remove duplicate here
  deleteUser,
  getUsers
};