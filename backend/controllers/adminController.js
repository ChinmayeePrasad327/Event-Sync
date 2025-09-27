// backend/controllers/adminController.js
const Event = require("../models/Event");
const User = require("../models/User");

/**
 * Get all participants of an event
 */
const getEventParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("participants", "name email points badges");
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ success: true, participants: event.participants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch participants" });
  }
};

/**
 * Get all events created by organizer
 */
const getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ creator: req.user._id }); // assuming Event has creator field
    res.json({ success: true, events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

module.exports = { getEventParticipants, getOrganizerEvents };
