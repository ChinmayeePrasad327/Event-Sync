const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventById,
  searchEvents,
  checkInEvent,
  rsvpToEvent,
  removeRsvp,
  addReview
} = require("../controllers/eventController");

// ----------------- Organizer Routes -----------------
router.post("/", authMiddleware, createEvent);  
router.put("/:id", authMiddleware, updateEvent); 
router.delete("/:id", authMiddleware, deleteEvent); 

// ----------------- User Routes -----------------
router.get("/", getEvents);                   
router.get("/search", searchEvents);           // NEW: search & filter
router.get("/:id", getEventById);            
router.post("/:id/checkin", authMiddleware, checkInEvent); 
router.post("/:id/rsvp", authMiddleware, rsvpToEvent);        // NEW: RSVP to event
router.delete("/:id/rsvp", authMiddleware, removeRsvp);      // NEW: Remove RSVP
router.post("/:id/review", authMiddleware, addReview);     

module.exports = router;
