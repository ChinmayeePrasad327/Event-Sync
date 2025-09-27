import React from 'react';
import { Calendar, Users, TrendingUp, IndianRupee, Download, FileText } from 'lucide-react';
import { Event } from '../../types';
import { formatDate, formatTime, generateMockCSV, generateMockJSON } from '../../utils/helpers';

interface EventStatsProps {
  events: Event[];
}

const EventStats: React.FC<EventStatsProps> = ({ events }) => {
  const totalRevenue = events.reduce((sum, event) => sum + (event.price * event.currentAttendees), 0);
  const totalAttendees = events.reduce((sum, event) => sum + event.currentAttendees, 0);
  const averageAttendanceRate = events.length > 0 
    ? events.reduce((sum, event) => sum + (event.currentAttendees / event.maxAttendees), 0) / events.length * 100
    : 0;

  const upcomingEvents = events.filter(event => new Date(event.date) > new Date());
  const pastEvents = events.filter(event => new Date(event.date) <= new Date());

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-blue-600">{events.length}</p>
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
              <p className="text-sm font-medium text-gray-600">Avg. Attendance</p>
              <p className="text-2xl font-bold text-purple-600">{averageAttendanceRate.toFixed(1)}%</p>
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

      {/* Export Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
          <div className="flex space-x-3">
            <button
              onClick={() => generateMockCSV(events)}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={() => generateMockJSON(events)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export JSON
            </button>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          Download your event data for analysis and reporting. CSV format is ideal for spreadsheets, 
          while JSON format is perfect for data processing.
        </p>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Events</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {events.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No events yet</h4>
              <p className="text-gray-600">Create your first event to get started</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(event.date)} at {formatTime(event.time)}
                      </p>
                      <p className="text-sm text-gray-600">{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-8 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{event.currentAttendees}</p>
                      <p className="text-sm text-gray-600">Attendees</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">
                        {((event.currentAttendees / event.maxAttendees) * 100).toFixed(0)}%
                      </p>
                      <p className="text-sm text-gray-600">Filled</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        ${(event.price * event.currentAttendees).toFixed(0)}
                      </p>
                      <p className="text-sm text-gray-600">Revenue</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        new Date(event.date) > new Date()
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {event.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventStats;