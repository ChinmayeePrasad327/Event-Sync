export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'organizer';
  avatar: string;
  badges: string[];
  eventsAttended: number;
  points: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  image: string;
  organizerId: string;
  organizerName: string;
  maxAttendees: number;
  currentAttendees: number;
  price: number;
  rsvpStatus?: 'confirmed' | 'pending' | null;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  badges: string[];
  rank: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: Date;
}