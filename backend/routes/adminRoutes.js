// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getEventParticipants, getOrganizerEvents } = require("../controllers/adminController");

// Organizer only
router.get("/events/:id/participants", authMiddleware, adminMiddleware, getEventParticipants);
router.get("/my-events", authMiddleware, adminMiddleware, getOrganizerEvents);

module.exports = router;
