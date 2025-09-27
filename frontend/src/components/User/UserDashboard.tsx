import React from 'react';
import { Calendar, Users, Trophy, Bell } from 'lucide-react';
import EventList from './EventList';
import Leaderboard from './Leaderboard';
import { useApp } from '../../context/AppContext';

const UserDashboard: React.FC = () => {
  const { currentUser, events } = useApp();

  // Debug logging
  console.log('📊 UserDashboard - Total events loaded:', events.length);
  console.log('📊 UserDashboard - Events:', events.map(e => e.title));

  const upcomingEvents = events.filter(event => 
    new Date(event.date) > new Date() && event.rsvpStatus === 'confirmed'
  ).length;

  const totalAttendees = events.reduce((sum, event) => sum + event.currentAttendees, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-teal-500 rounded-2xl p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {currentUser?.name}! 👋
            </h1>
            <p className="text-lg opacity-90">
              Ready to discover amazing events and expand your network?
            </p>
            {/* User Badges */}
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
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="text-right">
              <p className="text-2xl font-bold">{currentUser?.points || 0}</p>
              <p className="text-sm opacity-80">Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">My RSVPs</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{upcomingEvents}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Upcoming events</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Events Attended</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{currentUser?.eventsAttended || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total events joined</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Points Earned</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{currentUser?.points || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">150 points per event</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Badges</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{currentUser?.badges?.length || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Achievements unlocked</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventList />
        </div>
        <div className="lg:col-span-1">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;