const express = require("express");
const router = express.Router();
const { signup, login, getProfile, deleteUser, getUsers, enrollInEvent, leaveEnrollment } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ----------------- Public Routes -----------------
router.post("/signup", signup); // Register a new user
router.post("/login", login);   // Login existing user

// ----------------- Protected Routes -----------------
router.get("/profile", authMiddleware, getProfile); // Get logged-in user's profile

// Enrollment routes
router.post("/enroll", authMiddleware, enrollInEvent); // Enroll in an event
router.post("/unenroll", authMiddleware, leaveEnrollment); // Unenroll from an event

// Protected route to delete a user by ID
router.delete("/:id", authMiddleware, deleteUser);

// Admin-only route to get all users
router.get("/", authMiddleware, adminMiddleware, getUsers);

module.exports = router;