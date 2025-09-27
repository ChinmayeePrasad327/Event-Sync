// backend/controllers/eventController.js
const Event = require("../models/Event");
const User = require("../models/User");
const QRCode = require("qrcode");

/**
 * Event Controller
 * ----------------
 * Handles:
 * 1. CRUD operations for events (Organizer only)
 * 2. Participant check-ins with optional QR verification
 * 3. Adding reviews
 * 4. Advanced search & filter operations
 * 
 * Designed for a college event management system with modular, professional code.
 */

// ======================== CREATE EVENT ========================
/**
 * Create a new event (Organizer only)
 * - Generates QR code automatically based on eventCode
 * - Accepts optional images, videos, tags, and maxParticipants
 */
const createEvent = async (req, res) => {
  try {
    console.log("🎯 Creating event with data:", req.body);
    console.log("🎯 User info:", { id: req.user._id, name: req.user.name });
    
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      image,
      maxAttendees,
      price,
      tags
    } = req.body;

    const organizerId = req.user._id;
    const organizerName = req.user.name;

    // Generate QR code for the event
    const eventCode = `EVT-${Date.now()}`;
    const qrCode = await QRCode.toDataURL(eventCode);

    const newEvent = new Event({
      title,
      description,
      category,
      date: new Date(date),
      time,
      location,
      image,
      organizerId,
      organizerName,
      maxAttendees,
      currentAttendees: 0,
      price: price || 0,
      qrCode,
      tags: tags || [category.toLowerCase()],
      eventCode
    });

    const savedEvent = await newEvent.save();
    console.log("✅ Event created successfully:", savedEvent.title);
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: savedEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create event" });
  }
};

// ======================== UPDATE EVENT ========================
/**
 * Update an existing event (Organizer only)
 * - Updates any field provided in req.body
 */
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: "Event not found" });

    res.json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update event" });
  }
};

// ======================== DELETE EVENT ========================
/**
 * Delete an event (Organizer only)
 */
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (!deletedEvent) return res.status(404).json({ message: "Event not found" });

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete event" });
  }
};

// ======================== GET ALL EVENTS ========================
/**
 * Fetch all events
 * - Sorted by upcoming date
 */
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    console.log('📡 Backend: Found', events.length, 'events in database');
    res.json({ success: true, data: { events } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
};

// ======================== GET SINGLE EVENT ========================
/**
 * Get event details by ID
 * - Includes participants (name, email) and reviews (user name)
 */
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("participants", "name email")
      .populate("reviews.userId", "name");
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ success: true, event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch event" });
  }
};

// ======================== SEARCH & FILTER EVENTS ========================
/**
 * Search and filter events
 * Supported query parameters:
 * - title, eventCode, department, location, date, tags
 */
const searchEvents = async (req, res) => {
  try {
    const { title, eventCode, department, date, location, tags } = req.query;

    let filter = {};
    if (title) filter.title = { $regex: title, $options: "i" };
    if (eventCode) filter.eventCode = eventCode;
    if (department) filter.department = { $regex: department, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (date) filter.date = new Date(date);
    if (tags) filter.tags = { $in: tags.split(",") };

    const events = await Event.find(filter).sort({ date: 1 });
    res.json({ success: true, events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to search events" });
  }
};

// ======================== CHECK-IN PARTICIPANT ========================
/**
 * User check-in for an event
 * - Optional QR code verification
 * - Updates event participants
 * - Validates maxParticipants
 */
const checkInEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id; // populated from auth middleware

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Prevent double check-in
    if (event.participants.includes(userId)) {
      return res.status(400).json({ message: "User already checked in" });
    }

    // Prevent exceeding max participants
    if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Optional: QR code validation
    if (req.body.qrCode && req.body.qrCode !== event.qrCode) {
      return res.status(400).json({ message: "Invalid QR code" });
    }

    // Add participant
    event.participants.push(userId);
    await event.save();

    // Add event to user's attended events
    const user = await User.findById(userId);
    user.eventsAttended.push(eventId);
    await user.save();

    res.json({ success: true, message: "Check-in successful", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to check-in" });
  }
};

// ======================== RSVP TO EVENT ========================
/**
 * User RSVP to an event
 * - Updates event attendees count
 * - Prevents double RSVP
 */
const rsvpToEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if user already RSVP'd
    if (event.attendees && event.attendees.includes(userId)) {
      return res.status(400).json({ message: "User already RSVP'd to this event" });
    }

    // Check if event is full
    if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Add user to attendees
    if (!event.attendees) event.attendees = [];
    event.attendees.push(userId);
    event.currentAttendees = (event.currentAttendees || 0) + 1;
    
    await event.save();

    res.json({ 
      success: true, 
      message: "RSVP successful", 
      event,
      currentAttendees: event.currentAttendees 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to RSVP" });
  }
};

// ======================== REMOVE RSVP ========================
/**
 * User remove RSVP from an event
 * - Updates event attendees count
 */
const removeRsvp = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if user has RSVP'd
    if (!event.attendees || !event.attendees.includes(userId)) {
      return res.status(400).json({ message: "User has not RSVP'd to this event" });
    }

    // Remove user from attendees
    event.attendees = event.attendees.filter(id => id.toString() !== userId.toString());
    event.currentAttendees = Math.max(0, (event.currentAttendees || 1) - 1);
    
    await event.save();

    res.json({ 
      success: true, 
      message: "RSVP removed successfully", 
      event,
      currentAttendees: event.currentAttendees 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to remove RSVP" });
  }
};

// ======================== ADD REVIEW ========================
/**
 * Add a review to an event
 * - Users can submit one review per event
 */
const addReview = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;
    const { rating, comment } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Prevent multiple reviews from same user
    const alreadyReviewed = event.reviews.find(r => r.userId.toString() === userId.toString());
    if (alreadyReviewed)
      return res.status(400).json({ message: "You have already reviewed this event" });

    event.reviews.push({ userId, rating, comment });
    await event.save();

    res.json({ success: true, message: "Review added successfully", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add review" });
  }
};

// ======================== EXPORT CONTROLLER ========================
module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventById,
  searchEvents,
  checkInEvent,
  rsvpToEvent,
  removeRsvp,
  addReview,
};
