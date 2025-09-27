import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, IndianRupee, CheckCircle } from 'lucide-react';
import { Event } from '../../types';
import { formatDate, formatTime } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import QRCodeModal from '../Common/QRCodeModal';
import EventDetail from './EventDetail';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [isRSVPing, setIsRSVPing] = useState(false);
  const { updateEventRSVP, addNotification, rsvpToEvent, removeRsvpFromEvent } = useApp();
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

  const isEventFull = event.currentAttendees >= event.maxAttendees;
  const attendancePercentage = (event.currentAttendees / event.maxAttendees) * 100;

  return (
    <>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
        onClick={() => setShowEventDetail(true)}
      >
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {event.category}
            </span>
          </div>
          {event.price === 0 && (
            <div className="absolute top-4 right-4">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Free
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {event.description}
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-3 text-blue-500" />
              <span className="text-sm">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-3 text-green-500" />
              <span className="text-sm">{formatTime(event.time)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-3 text-red-500" />
              <span className="text-sm">{event.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-3 text-purple-500" />
              <span className="text-sm">
                {event.currentAttendees} / {event.maxAttendees} attendees
              </span>
            </div>
            {event.price > 0 && (
              <div className="flex items-center text-gray-600">
                <IndianRupee className="w-4 h-4 mr-3 text-orange-500" />
                <span className="text-sm font-medium">₹{event.price}</span>
              </div>
            )}
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Attendance</span>
              <span>{Math.round(attendancePercentage)}% full</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${attendancePercentage}%` }}
              />
            </div>
          </div>

          {event.rsvpStatus === 'confirmed' ? (
            <button
              onClick={() => setShowQRModal(true)}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              RSVP Confirmed - View QR Code
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRSVP();
              }}
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

          <p className="text-xs text-gray-500 mt-2 text-center">
            Organized by {event.organizerName}
          </p>
        </div>
      </div>

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        eventTitle={event.title}
        eventId={event.id}
      />

      {showEventDetail && (
        <EventDetail
          event={event}
          onClose={() => setShowEventDetail(false)}
        />
      )}
    </>
  );
};

export default EventCard;