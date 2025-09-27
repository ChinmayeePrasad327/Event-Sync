import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, IndianRupee, ArrowLeft, Share2, Heart, Star } from 'lucide-react';
import { Event } from '../../types';
import { formatDate, formatTime } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import QRCodeModal from '../Common/QRCodeModal';

interface EventDetailProps {
  event: Event;
  onClose: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onClose }) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [isRSVPing, setIsRSVPing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { updateEventRSVP, addNotification, rsvpToEvent, removeRsvpFromEvent, currentUser } = useApp();
  const [hasRSVPd, setHasRSVPd] = useState(false);

  const handleRSVP = async () => {
    setIsRSVPing(true);
    
    try {
      if (hasRSVPd) {
        await removeRsvpFromEvent(event.id);
        setHasRSVPd(false);
        updateEventRSVP(event.id, null);
      } else {
        await rsvpToEvent(event.id);
        setHasRSVPd(true);
        updateEventRSVP(event.id, 'confirmed');
        setShowQRModal(true);
      }
    } catch (error) {
      // Error handling is done in the context
    } finally {
      setIsRSVPing(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      addNotification('Event link copied to clipboard!', 'success');
    }
  };

  const isEventFull = event.currentAttendees >= event.maxAttendees;
  const attendancePercentage = (event.currentAttendees / event.maxAttendees) * 100;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Events
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-colors ${
                  isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Event Image */}
            <div className="relative mb-6">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-64 md:h-80 object-cover rounded-xl"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {event.category}
                </span>
              </div>
              {event.price === 0 && (
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Free Event
                  </span>
                </div>
              )}
            </div>

            {/* Event Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                    <span className="font-medium">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 mr-3 text-purple-500" />
                    <span className="font-medium">{formatTime(event.time)}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-green-500" />
                    <span className="font-medium">{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="w-5 h-5 mr-3 text-indigo-500" />
                    <span className="font-medium">
                      {event.currentAttendees} / {event.maxAttendees} attendees
                    </span>
                  </div>
                  {event.price > 0 && (
                    <div className="flex items-center text-gray-700">
                      <IndianRupee className="w-5 h-5 mr-3 text-orange-500" />
                      <span className="font-medium">₹{event.price} per person</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">About this event</h3>
                  <p className="text-gray-700 leading-relaxed">{event.description}</p>
                </div>

                {/* Attendance Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Attendance</span>
                    <span className="text-sm text-gray-500">{Math.round(attendancePercentage)}% full</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full"
                      style={{ width: `${attendancePercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {event.currentAttendees} of {event.maxAttendees} spots taken
                  </p>
                </div>

                {/* Organizer Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Organized by</h4>
                  <p className="text-gray-700">{event.organizerName}</p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{formatTime(event.time)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">
                        {event.price === 0 ? 'Free' : `₹${event.price}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Spots left:</span>
                      <span className="font-medium text-blue-600">
                        {event.maxAttendees - event.currentAttendees}
                      </span>
                    </div>
                  </div>

                  {currentUser?.role === 'user' && (
                    <button
                      onClick={handleRSVP}
                      disabled={isEventFull || isRSVPing}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
                        isEventFull
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02]'
                      }`}
                    >
                      {isRSVPing ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {hasRSVPd ? 'Removing RSVP...' : 'Processing RSVP...'}
                        </div>
                      ) : isEventFull ? (
                        'Event Full'
                      ) : hasRSVPd ? (
                        'Remove RSVP'
                      ) : (
                        'RSVP Now'
                      )}
                    </button>
                  )}

                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowQRModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View QR Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQRModal && (
        <QRCodeModal
          qrCodeData={`event-checkin-${event.id}`}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </>
  );
};

export default EventDetail;
