import { get, post, put, del } from './api';
import { Event, ApiResponse } from '../types';

export interface CreateEventData {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  image: string;
  maxAttendees: number;
  price: number;
  tags?: string[];
}

export interface UpdateEventData extends Partial<CreateEventData> {}

export interface CheckInData {
  qrCode?: string;
}

export interface ReviewData {
  rating: number;
  comment?: string;
}

export const eventApi = {
  // Get all events
  getEvents: async (): Promise<ApiResponse<{ events: Event[] }>> => {
    return get<ApiResponse<{ events: Event[] }>>('/events');
  },

  // Get event by ID
  getEventById: async (eventId: string): Promise<ApiResponse<{ event: Event }>> => {
    return get<ApiResponse<{ event: Event }>>(`/events/${eventId}`);
  },

  // Search events
  searchEvents: async (params: {
    title?: string;
    eventCode?: string;
    department?: string;
    date?: string;
    location?: string;
    tags?: string;
  }): Promise<ApiResponse<{ events: Event[] }>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    return get<ApiResponse<{ events: Event[] }>>(`/events/search?${queryString}`);
  },

  // Create event (organizer only)
  createEvent: async (data: CreateEventData): Promise<ApiResponse<{ event: Event }>> => {
    return post<ApiResponse<{ event: Event }>>('/events', data);
  },

  // Update event (organizer only)
  updateEvent: async (eventId: string, data: UpdateEventData): Promise<ApiResponse<{ event: Event }>> => {
    return put<ApiResponse<{ event: Event }>>(`/events/${eventId}`, data);
  },

  // Delete event (organizer only)
  deleteEvent: async (eventId: string): Promise<ApiResponse<void>> => {
    return del<ApiResponse<void>>(`/events/${eventId}`);
  },

  // Check in to event
  checkInEvent: async (eventId: string, data: CheckInData = {}): Promise<ApiResponse<{ event: Event }>> => {
    return post<ApiResponse<{ event: Event }>>(`/events/${eventId}/checkin`, data);
  },

  // RSVP to event
  rsvpToEvent: async (eventId: string): Promise<ApiResponse<{ event: Event; currentAttendees: number }>> => {
    return post<ApiResponse<{ event: Event; currentAttendees: number }>>(`/events/${eventId}/rsvp`);
  },

  // Remove RSVP from event
  removeRsvp: async (eventId: string): Promise<ApiResponse<{ event: Event; currentAttendees: number }>> => {
    return del<ApiResponse<{ event: Event; currentAttendees: number }>>(`/events/${eventId}/rsvp`);
  },

  // Add review to event
  addReview: async (eventId: string, data: ReviewData): Promise<ApiResponse<{ event: Event }>> => {
    return post<ApiResponse<{ event: Event }>>(`/events/${eventId}/review`, data);
  },
};

