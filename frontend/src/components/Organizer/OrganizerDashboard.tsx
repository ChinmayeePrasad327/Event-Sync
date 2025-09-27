import React, { useState } from 'react';
import { Plus, Calendar, Users, TrendingUp, IndianRupee } from 'lucide-react';
import CreateEvent from './CreateEvent';
import EventStats from './EventStats';
import { useApp } from '../../context/AppContext';

const OrganizerDashboard: React.FC = () => {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const { currentUser, events, deleteEvent } = useApp();

  // Debug logging
  console.log('🎯 OrganizerDashboard - Total events loaded:', events.length);
  console.log('🎯 OrganizerDashboard - Events:', events.map(e => e.title));
  console.log('🎯 OrganizerDashboard - Current user:', currentUser);

  const organizerEvents = currentUser?.role === 'organizer' && currentUser?.id === 'admin' 
    ? events // Admin sees all events
    : events.filter(event => event.organizerId === currentUser?.id);
  const totalAttendees = organizerEvents.reduce((sum, event) => sum + event.currentAttendees, 0);
  const totalRevenue = organizerEvents.reduce((sum, event) => sum + (event.price * event.currentAttendees), 0);
  const upcomingEvents = organizerEvents.filter(event => new Date(event.date) > new Date()).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 via-blue-600 to-teal-500 rounded-2xl p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Event Organizer Hub 🎯
            </h1>
            <p className="text-lg opacity-90">
              Create, manage, and track your events all in one place
            </p>
            {/* Admin Badges */}
            {currentUser?.badges && currentUser.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {currentUser.badges.slice(0, 4).map((badge, index) => (
                  <span
                    key={index}
                    className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {badge}
                  </span>
                ))}
                {currentUser.badges.length > 4 && (
                  <span className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    +{currentUser.badges.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-2xl font-bold">{currentUser?.points || 0}</p>
              <p className="text-sm opacity-80">Points</p>
            </div>
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <button
              onClick={() => setShowCreateEvent(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl font-medium transition-all backdrop-blur-sm border border-white border-opacity-30"
            >
              <Plus className="w-5 h-5 mr-2 inline" />
              Create Event
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Events</p>
              <p className="text-2xl font-bold text-blue-600">{organizerEvents.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Attendees</p>
              <p className="text-2xl font-bold text-green-600">{totalAttendees}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-purple-600">{upcomingEvents}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-orange-600">₹{totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <EventStats events={organizerEvents} />

      {/* My Events Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentUser?.role === 'organizer' && currentUser?.id === 'admin' ? 'All Events' : 'My Events'}
          </h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {organizerEvents.length} Events
          </span>
        </div>
        
        {organizerEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Yet</h3>
            <p className="text-gray-500 mb-6">Create your first event to get started!</p>
            <button
              onClick={() => setShowCreateEvent(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <Plus className="w-5 h-5 mr-2 inline" />
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizerEvents.map((event) => (
              <div key={event.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Users className="w-4 h-4 mr-2" />
                      {event.currentAttendees} / {event.maxAttendees} attendees
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <IndianRupee className="w-4 h-4 mr-2" />
                      ₹{event.price} per person
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {/* Edit functionality */}}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {/* View details */}}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      View
                    </button>
                  </div>
                  <button
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
                        try {
                          await deleteEvent(event.id);
                        } catch (error) {
                          // Error handling is done in the context
                        }
                      }
                    }}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      <CreateEvent 
        isOpen={showCreateEvent} 
        onClose={() => setShowCreateEvent(false)} 
      />
    </div>
  );
};

export default OrganizerDashboard;