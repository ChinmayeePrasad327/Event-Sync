import { User, Event, LeaderboardEntry } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'user',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    badges: ['Early Bird', 'Networking Pro', 'Tech Enthusiast'],
    eventsAttended: 12,
    points: 1250
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'organizer',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    badges: ['Event Master', 'Community Builder'],
    eventsAttended: 25,
    points: 2800
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    description: 'Join the biggest technology conference of the year featuring industry leaders and cutting-edge innovations.',
    category: 'Technology',
    date: '2025-03-15',
    time: '09:00',
    location: 'San Francisco Convention Center',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    organizerId: '2',
    organizerName: 'Sarah Wilson',
    maxAttendees: 500,
    currentAttendees: 324,
    price: 199
  },
  {
    id: '2',
    title: 'Digital Marketing Summit',
    description: 'Learn the latest digital marketing strategies from top industry experts and network with professionals.',
    category: 'Marketing',
    date: '2025-02-28',
    time: '10:00',
    location: 'New York Business Center',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    organizerId: '2',
    organizerName: 'Sarah Wilson',
    maxAttendees: 200,
    currentAttendees: 156,
    price: 149
  },
  {
    id: '3',
    title: 'Startup Pitch Night',
    description: 'Watch promising startups pitch their ideas to investors and network with entrepreneurs.',
    category: 'Business',
    date: '2025-02-20',
    time: '18:00',
    location: 'Innovation Hub Downtown',
    image: 'https://images.pexels.com/photos/3184638/pexels-photo-3184638.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    organizerId: '2',
    organizerName: 'Sarah Wilson',
    maxAttendees: 150,
    currentAttendees: 89,
    price: 0
  },
  {
    id: '4',
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on workshop covering the fundamentals of AI and machine learning applications.',
    category: 'Technology',
    date: '2025-03-05',
    time: '14:00',
    location: 'Tech Campus Building A',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    organizerId: '2',
    organizerName: 'Sarah Wilson',
    maxAttendees: 50,
    currentAttendees: 32,
    price: 99
  },
  {
    id: '5',
    title: 'Creative Design Showcase',
    description: 'Explore the latest trends in creative design and meet talented designers from around the world.',
    category: 'Design',
    date: '2025-02-25',
    time: '16:00',
    location: 'Art District Gallery',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    organizerId: '2',
    organizerName: 'Sarah Wilson',
    maxAttendees: 100,
    currentAttendees: 67,
    price: 75
  },
  {
    id: '6',
    title: 'Wellness & Mindfulness Retreat',
    description: 'A day of wellness activities including meditation, yoga, and mindfulness workshops.',
    category: 'Health',
    date: '2025-03-10',
    time: '08:00',
    location: 'Serenity Wellness Center',
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    organizerId: '2',
    organizerName: 'Sarah Wilson',
    maxAttendees: 75,
    currentAttendees: 45,
    price: 125
  }
];

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    points: 1250,
    badges: ['Early Bird', 'Networking Pro', 'Tech Enthusiast'],
    rank: 1
  },
  {
    id: '3',
    name: 'Michael Chen',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    points: 1180,
    badges: ['Community Star', 'Regular Attendee'],
    rank: 2
  },
  {
    id: '4',
    name: 'Emma Davis',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    points: 1050,
    badges: ['Event Enthusiast', 'Social Connector'],
    rank: 3
  },
  {
    id: '5',
    name: 'James Rodriguez',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    points: 980,
    badges: ['Active Participant'],
    rank: 4
  },
  {
    id: '6',
    name: 'Lisa Thompson',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    points: 875,
    badges: ['Newcomer Star'],
    rank: 5
  }
];