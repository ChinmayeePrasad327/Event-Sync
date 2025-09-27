import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, MapPin, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import EventCard from './EventCard';

const EventList: React.FC = () => {
  const { events } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const categories = ['All', ...new Set(events.map(event => event.category))];
  const locations = ['All', ...new Set(events.map(event => event.location.split(',')[0].trim()))];

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      const matchesLocation = selectedLocation === 'All' || 
                             event.location.toLowerCase().includes(selectedLocation.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesLocation;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'popularity':
          return b.currentAttendees - a.currentAttendees;
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchQuery, selectedCategory, selectedLocation, sortBy]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Discover Events</h1>
        <p className="text-gray-600 dark:text-gray-300">Find and join amazing events happening near you</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Events</label>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
            <div className="relative">
              <Tag className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-3" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-3" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            <div className="flex space-x-2">
              {[
                { value: 'date', label: 'Date' },
                { value: 'popularity', label: 'Popularity' },
                { value: 'price', label: 'Price' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    sortBy === option.value
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Events Grid */}
      {filteredAndSortedEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No events found</h3>
          <p className="text-gray-600 dark:text-gray-300">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;