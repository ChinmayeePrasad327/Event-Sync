import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, IndianRupee, Image, X } from 'lucide-react';
import { Event } from '../../types';
import { useApp } from '../../context/AppContext';
import { eventApi } from '../../api/eventApi';

interface CreateEventProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEvent: React.FC<CreateEventProps> = ({ isOpen, onClose }) => {
  const { addEvent, currentUser, addNotification } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'CSE',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    price: '0',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1'
  });

  const categories = ['CSE', 'AI&ML', 'DS', 'ECE', 'EEE', 'ME', 'CE', 'IT'];
  const sampleImages = [
    'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    'https://images.pexels.com/photos/3184638/pexels-photo-3184638.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        image: formData.image,
        maxAttendees: parseInt(formData.maxAttendees),
        price: parseFloat(formData.price),
        tags: [formData.category.toLowerCase()]
      };

      const response = await eventApi.createEvent(eventData);
      
      if (response.success && response.data) {
        // Convert backend event to frontend format
        const backendEvent = response.data.event;
        const newEvent: Event = {
          id: backendEvent._id,
          title: backendEvent.title,
          description: backendEvent.description,
          category: backendEvent.category,
          date: new Date(backendEvent.date).toISOString().split('T')[0],
          time: backendEvent.time,
          location: backendEvent.location,
          image: backendEvent.image,
          organizerId: backendEvent.organizerId,
          organizerName: backendEvent.organizerName,
          maxAttendees: backendEvent.maxAttendees,
          currentAttendees: backendEvent.currentAttendees,
          price: backendEvent.price
        };

        addEvent(newEvent);
        addNotification(`Event "${formData.title}" created successfully!`, 'success');
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: 'CSE',
          date: '',
          time: '',
          location: '',
          maxAttendees: '',
          price: '0',
          image: sampleImages[0]
        });

        // Close modal and refresh events
        onClose();
        // Force refresh events to show the new event
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      addNotification('Failed to create event. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Event Image</label>
            <div className="grid grid-cols-3 gap-2">
              {sampleImages.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image }))}
                  className={`relative rounded-lg overflow-hidden border-2 transition-colors ${
                    formData.image === image ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Sample ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter event title"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe your event"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Max Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees *</label>
              <div className="relative">
                <Users className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="number"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="100"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
              <div className="relative">
                <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter event location"
                />
              </div>
            </div>

            {/* Price */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (INR)</label>
              <div className="relative">
                <IndianRupee className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Set to 0 for free events</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </div>
              ) : (
                'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;