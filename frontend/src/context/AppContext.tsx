import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Event, Notification, LeaderboardEntry } from '../types';
import { userApi } from '../api/userApi';
import { eventApi } from '../api/eventApi';
import { leaderboardApi } from '../api/leaderboardApi';
import { ApiError } from '../api/api';

interface AppContextType {
  currentUser: User | null;
  events: Event[];
  leaderboard: LeaderboardEntry[];
  notifications: Notification[];
  loading: boolean;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, isAdmin?: boolean) => Promise<void>;
  logout: () => void;
  addEvent: (event: Event) => void;
  updateEventRSVP: (eventId: string, status: 'confirmed' | 'pending' | null) => void;
  checkInEvent: (eventId: string, qrCode?: string) => Promise<void>;
  rsvpToEvent: (eventId: string) => Promise<void>;
  removeRsvpFromEvent: (eventId: string) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  addNotification: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  removeNotification: (id: string) => void;
  loadEvents: () => Promise<void>;
  loadLeaderboard: () => Promise<void>;
  refreshEvents: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUserProfile();
    }
    // Test backend connection on app start
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      if (response.ok) {
        console.log('✅ Backend connection successful');
      } else {
        console.log('⚠️ Backend responded but with error:', response.status);
      }
    } catch (error) {
      console.log('❌ Backend connection failed:', error.message);
      addNotification('Backend connection failed. Please ensure the server is running.', 'error');
    }
  };

  // Load events and leaderboard when user is logged in
  useEffect(() => {
    if (currentUser) {
      loadEvents();
      loadLeaderboard();
    }
  }, [currentUser]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userApi.getProfile();
      if (response.success && response.data) {
        // Convert backend user to frontend format
        const backendUser = response.data.user;
        const frontendUser: User = {
          id: backendUser.id,
          name: backendUser.name,
          email: backendUser.email,
          role: backendUser.isAdmin ? 'organizer' : 'user',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(backendUser.name)}&background=random`,
          badges: backendUser.badges || [],
          eventsAttended: backendUser.eventsAttended?.length || 0,
          points: backendUser.points || 0
        };
        setCurrentUser(frontendUser);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Attempting login for:', email);
      const response = await userApi.login({ email, password });
      console.log('📥 Login response:', response);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        // Convert backend user to frontend format
        const backendUser = response.user;
        const frontendUser: User = {
          id: backendUser.id,
          name: backendUser.name,
          email: backendUser.email,
          role: backendUser.isAdmin ? 'organizer' : 'user',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(backendUser.name)}&background=random`,
          badges: backendUser.badges || [],
          eventsAttended: backendUser.eventsAttended?.length || 0,
          points: backendUser.points || 0
        };
        setCurrentUser(frontendUser);
        addNotification('Login successful!', 'success');
        console.log('✅ Login successful, user set:', frontendUser);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      if (error instanceof ApiError) {
        addNotification(error.message, 'error');
      } else {
        addNotification('Login failed. Please try again.', 'error');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, isAdmin = false) => {
    try {
      setLoading(true);
      console.log('📝 Attempting signup for:', email);
      const response = await userApi.signup({ name, email, password, isAdmin });
      console.log('📥 Signup response:', response);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        // Convert backend user to frontend format
        const backendUser = response.user;
        const frontendUser: User = {
          id: backendUser.id,
          name: backendUser.name,
          email: backendUser.email,
          role: backendUser.isAdmin ? 'organizer' : 'user',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(backendUser.name)}&background=random`,
          badges: backendUser.badges || [],
          eventsAttended: backendUser.eventsAttended?.length || 0,
          points: backendUser.points || 0
        };
        setCurrentUser(frontendUser);
        addNotification('Account created successfully!', 'success');
        console.log('✅ Signup successful, user set:', frontendUser);
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      if (error instanceof ApiError) {
        addNotification(error.message, 'error');
      } else {
        addNotification('Signup failed. Please try again.', 'error');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setEvents([]);
    setLeaderboard([]);
    addNotification('Logged out successfully', 'info');
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      
      // Always add static events first for immediate display
      const staticEvents: Event[] = [
        {
          id: 'static-1',
          title: 'Tech Conference 2024',
          description: 'Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing.',
                  category: 'CSE',
          date: '2024-02-15',
          time: '09:00',
          location: 'Convention Center, Downtown',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500',
          organizerId: 'admin',
          organizerName: 'Admin User',
          maxAttendees: 200,
          currentAttendees: 45,
          price: 50,
          tags: ['technology', 'conference', 'innovation'],
          attendees: [],
          reviews: []
        },
        {
          id: 'static-2',
          title: 'Startup Pitch Competition',
          description: 'Join us for an exciting startup pitch competition where entrepreneurs showcase their innovative ideas.',
                  category: 'AI&ML',
          date: '2024-02-20',
          time: '14:00',
          location: 'Innovation Hub',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
          organizerId: 'admin',
          organizerName: 'Admin User',
          maxAttendees: 100,
          currentAttendees: 23,
          price: 25,
          tags: ['startup', 'pitch', 'entrepreneurship'],
          attendees: [],
          reviews: []
        },
        {
          id: 'static-3',
          title: 'Networking Mixer',
          description: 'Professional networking event for industry professionals to connect and collaborate.',
                  category: 'DS',
          date: '2024-02-25',
          time: '18:00',
          location: 'Grand Hotel Ballroom',
          image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500',
          organizerId: 'admin',
          organizerName: 'Admin User',
          maxAttendees: 150,
          currentAttendees: 67,
          price: 0,
          tags: ['networking', 'professional', 'social'],
          attendees: [],
          reviews: []
        },
        {
          id: 'static-4',
          title: 'AI & Machine Learning Workshop',
          description: 'Hands-on workshop covering the latest trends in artificial intelligence and machine learning.',
          category: 'AI&ML',
          date: '2024-03-01',
          time: '10:00',
          location: 'Computer Lab 101',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500',
          organizerId: 'admin',
          organizerName: 'Admin User',
          maxAttendees: 50,
          currentAttendees: 12,
          price: 100,
          tags: ['ai', 'machine-learning', 'workshop'],
          attendees: [],
          reviews: []
        },
        {
          id: 'static-5',
          title: 'Data Science Bootcamp',
          description: 'Intensive bootcamp covering data analysis, visualization, and statistical modeling.',
          category: 'DS',
          date: '2024-03-05',
          time: '09:00',
          location: 'Library Conference Room',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
          organizerId: 'admin',
          organizerName: 'Admin User',
          maxAttendees: 30,
          currentAttendees: 8,
          price: 150,
          tags: ['data-science', 'bootcamp', 'analytics'],
          attendees: [],
          reviews: []
        }
      ];
      
      // Set static events immediately - ALWAYS load these first
      console.log('📱 Loading static events for testing - Total:', staticEvents.length);
      console.log('📱 Static events:', staticEvents.map(e => e.title));
      setEvents(staticEvents);
      
      // Try to load backend events and combine them
      try {
        const response = await eventApi.getEvents();
        console.log('📡 Backend events response:', response);
        console.log('📡 Response success:', response.success);
        console.log('📡 Response data:', response.data);
        console.log('📡 Events array:', response.data?.events);
        
        if (response.success && response.data?.events) {
          // Convert backend events to frontend format
          const backendEvents = response.data.events.map((backendEvent: any) => ({
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
            price: backendEvent.price,
            tags: backendEvent.tags || [],
            attendees: [],
            reviews: []
          }));
          
          // Combine static and backend events
          const allEvents = [...staticEvents, ...backendEvents];
          console.log('📱 Combined events:', allEvents.length, 'total');
          setEvents(allEvents);
        } else {
          console.log('📱 No backend events found, using only static events');
          // Ensure static events are still set
          setEvents(staticEvents);
        }
      } catch (backendError) {
        console.log('📱 Backend error, using only static events:', backendError);
        // Ensure static events are still set even on error
        setEvents(staticEvents);
      }
      
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const response = await leaderboardApi.getLeaderboard(10);
      if (response.success && response.data) {
        // Convert backend leaderboard to frontend format
        const frontendLeaderboard = response.data.leaderboard.map((user: any, index: number) => ({
          id: user._id,
          name: user.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
          points: user.points,
          badges: user.badges,
          rank: index + 1
        }));
        setLeaderboard(frontendLeaderboard);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      
      // Fallback: Add static leaderboard for testing
      const staticLeaderboard: LeaderboardEntry[] = [
        {
          id: '1',
          name: 'John Doe',
          points: 150,
          eventsAttended: 8,
          badges: ['Tech Enthusiast', 'Networker'],
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
        },
        {
          id: '2',
          name: 'Jane Smith',
          points: 120,
          eventsAttended: 6,
          badges: ['Startup Expert', 'Speaker'],
          avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          points: 95,
          eventsAttended: 5,
          badges: ['Innovator'],
          avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=random'
        }
      ];
      
      console.log('📱 Using static leaderboard for testing');
      setLeaderboard(staticLeaderboard);
    }
  };

  const refreshEvents = async () => {
    console.log('🔄 Refreshing events...');
    await loadEvents();
  };

  const addEvent = (event: Event) => {
    setEvents(prev => [...prev, event]);
    // Also reload events to get the latest from backend
    loadEvents();
  };

  const updateEventRSVP = (eventId: string, status: 'confirmed' | 'pending' | null) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            rsvpStatus: status,
            currentAttendees: status === 'confirmed' && !event.rsvpStatus 
              ? event.currentAttendees + 1 
              : status === null && event.rsvpStatus === 'confirmed'
              ? event.currentAttendees - 1
              : event.currentAttendees
          }
        : event
    ));
  };

  const checkInEvent = async (eventId: string, qrCode?: string) => {
    try {
      setLoading(true);
      const response = await eventApi.checkInEvent(eventId, { qrCode });
      if (response.success) {
        addNotification('Check-in successful!', 'success');
        // Reload events to get updated data
        await loadEvents();
        // Reload leaderboard to get updated points
        await loadLeaderboard();
      }
    } catch (error) {
      if (error instanceof ApiError) {
        addNotification(error.message, 'error');
      } else {
        addNotification('Check-in failed. Please try again.', 'error');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rsvpToEvent = async (eventId: string) => {
    try {
      setLoading(true);
      
      // Check if it's a static event
      if (eventId.startsWith('static-')) {
        // Handle static events locally
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, currentAttendees: (event.currentAttendees || 0) + 1 }
            : event
        ));
        addNotification('RSVP successful!', 'success');
        // Update user badges and points for static events too
        if (currentUser) {
          const newEventsAttended = (currentUser.eventsAttended || 0) + 1;
          updateUserBadges(newEventsAttended);
        }
        return;
      }
      
      // For backend events, call the API
      try {
        const response = await eventApi.rsvpToEvent(eventId);
              if (response.success) {
                addNotification('RSVP successful!', 'success');
                // Update the specific event in the state
                setEvents(prev => prev.map(event => 
                  event.id === eventId 
                    ? { ...event, currentAttendees: response.data?.currentAttendees || event.currentAttendees }
                    : event
                ));
                // Update user badges and points
                if (currentUser) {
                  const newEventsAttended = (currentUser.eventsAttended || 0) + 1;
                  updateUserBadges(newEventsAttended);
                }
              }
      } catch (apiError) {
        // If API call fails, handle locally for demo purposes
        console.log('API RSVP failed, handling locally:', apiError);
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, currentAttendees: (event.currentAttendees || 0) + 1 }
            : event
        ));
        addNotification('RSVP successful!', 'success');
        // Update user badges and points
        if (currentUser) {
          const newEventsAttended = (currentUser.eventsAttended || 0) + 1;
          updateUserBadges(newEventsAttended);
        }
      }
    } catch (error) {
      if (error instanceof ApiError) {
        addNotification(error.message, 'error');
      } else {
        addNotification('RSVP failed. Please try again.', 'error');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeRsvpFromEvent = async (eventId: string) => {
    try {
      setLoading(true);
      
      // Check if it's a static event
      if (eventId.startsWith('static-')) {
        // Handle static events locally
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, currentAttendees: Math.max(0, (event.currentAttendees || 1) - 1) }
            : event
        ));
        addNotification('RSVP removed successfully!', 'success');
        return;
      }
      
      // For backend events, call the API
      try {
        const response = await eventApi.removeRsvp(eventId);
        if (response.success) {
          addNotification('RSVP removed successfully!', 'success');
          // Update the specific event in the state
          setEvents(prev => prev.map(event => 
            event.id === eventId 
              ? { ...event, currentAttendees: response.data?.currentAttendees || event.currentAttendees }
              : event
          ));
        }
      } catch (apiError) {
        // If API call fails, handle locally for demo purposes
        console.log('API remove RSVP failed, handling locally:', apiError);
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, currentAttendees: Math.max(0, (event.currentAttendees || 1) - 1) }
            : event
        ));
        addNotification('RSVP removed successfully!', 'success');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        addNotification(error.message, 'error');
      } else {
        addNotification('Failed to remove RSVP. Please try again.', 'error');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      setLoading(true);
      const response = await eventApi.deleteEvent(eventId);
      if (response.success) {
        addNotification('Event deleted successfully!', 'success');
        // Reload events to remove deleted event
        await loadEvents();
      }
    } catch (error) {
      if (error instanceof ApiError) {
        addNotification(error.message, 'error');
      } else {
        addNotification('Failed to delete event. Please try again.', 'error');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, notification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updateUserBadges = (eventsAttended: number) => {
    if (!currentUser) return;
    
    const newBadges = [];
    if (eventsAttended >= 10) newBadges.push('Event Champion');
    if (eventsAttended >= 5) newBadges.push('Active Participant');
    if (eventsAttended >= 3) newBadges.push('Regular Attendee');
    if (eventsAttended >= 1) newBadges.push('Event Explorer');
    if (eventsAttended === 0) newBadges.push('Getting Started');
    
    // Add special badges
    if (eventsAttended >= 20) newBadges.push('Event Master');
    if (eventsAttended >= 15) newBadges.push('Social Butterfly');
    if (eventsAttended >= 8) newBadges.push('Networker');
    
    // Add Indian-themed badges
    if (eventsAttended >= 12) newBadges.push('Tech Guru');
    if (eventsAttended >= 6) newBadges.push('Knowledge Seeker');
    if (eventsAttended >= 4) newBadges.push('Community Builder');
    if (eventsAttended >= 2) newBadges.push('Event Enthusiast');
    
    const updatedUser = {
      ...currentUser,
      badges: newBadges,
      eventsAttended,
      points: eventsAttended * 150 // 150 points per event
    };
    
    setCurrentUser(updatedUser);
    console.log('🏆 Updated user badges and points:', updatedUser);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      events,
      leaderboard,
      notifications,
      loading,
      setCurrentUser,
      login,
      signup,
      logout,
      addEvent,
      updateEventRSVP,
      checkInEvent,
      rsvpToEvent,
      removeRsvpFromEvent,
      deleteEvent,
      addNotification,
      removeNotification,
      loadEvents,
      loadLeaderboard,
      refreshEvents
    }}>
      {children}
    </AppContext.Provider>
  );
};