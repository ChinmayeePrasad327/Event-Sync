const mongoose = require("mongoose");

/**
 * Event Schema
 * Represents an event in the system.
 * Compatible with both college event management and general event management.
 */
const eventSchema = new mongoose.Schema({
  // Basic information
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, required: true, trim: true }, // Technology, Business, etc.
  
  // Event logistics
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Store as string for frontend compatibility
  location: { type: String, required: true },
  
  // Media
  image: { type: String }, // Single image URL for frontend compatibility
  
  // Organizer information
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  organizerName: { type: String, required: true },
  
  // Capacity and pricing
  maxAttendees: { type: Number, required: true },
  currentAttendees: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  
  // Participants (references to User model)
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  
  // Reviews submitted by attendees
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    date: { type: Date, default: Date.now }
  }],
  
  // QR code for check-ins
  qrCode: { type: String },
  
  // Optional tags for search/filter
  tags: [{ type: String, trim: true }],
  
  // Legacy fields for college system compatibility
  eventCode: { type: String, unique: true, sparse: true },
  department: { type: String, trim: true },
  facultyCoordinators: [{ type: String, trim: true }],
  studentCoordinators: [{ type: String, trim: true }],
  images: [{ type: String }], 
  videos: [{ type: String }],
  maxParticipants: { type: Number }
}, { timestamps: true });

// Text index for search functionality
eventSchema.index({ title: "text", description: "text", category: "text", location: "text", tags: "text" });

module.exports = mongoose.model("Event", eventSchema);
