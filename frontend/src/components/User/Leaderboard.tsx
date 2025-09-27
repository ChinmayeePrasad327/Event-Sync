import React, { useMemo } from 'react';
import { Trophy, Medal, Award, Star, Crown, Zap, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Leaderboard: React.FC = () => {
  const { currentUser, leaderboard, events } = useApp();

  // Static leaderboard data with dynamic updates
  const staticLeaderboard = useMemo(() => {
    const staticData = [
      { id: 'user-1', name: 'Arjun Sharma', points: 1250, eventsAttended: 8, badges: ['Event Champion', 'Tech Guru', 'Community Builder'] },
      { id: 'user-2', name: 'Priya Patel', points: 1180, eventsAttended: 7, badges: ['Active Participant', 'Knowledge Seeker', 'Social Butterfly'] },
      { id: 'user-3', name: 'Rahul Kumar', points: 1100, eventsAttended: 6, badges: ['Regular Attendee', 'Networker', 'Event Enthusiast'] },
      { id: 'user-4', name: 'Sneha Gupta', points: 950, eventsAttended: 5, badges: ['Active Participant', 'Community Builder'] },
      { id: 'user-5', name: 'Vikram Singh', points: 880, eventsAttended: 4, badges: ['Regular Attendee', 'Event Enthusiast'] },
      { id: 'user-6', name: 'Kavya Reddy', points: 750, eventsAttended: 3, badges: ['Regular Attendee', 'Event Explorer'] },
      { id: 'user-7', name: 'Amit Joshi', points: 650, eventsAttended: 2, badges: ['Event Enthusiast', 'Event Explorer'] },
      { id: 'user-8', name: 'Ananya Desai', points: 500, eventsAttended: 1, badges: ['Event Explorer', 'Getting Started'] }
    ];

    // If current user exists, add them to the leaderboard
    if (currentUser) {
      const userExists = staticData.find(user => user.id === currentUser.id);
      if (!userExists) {
        // Calculate user's points based on events attended
        const userEventsAttended = events.filter(event => 
          event.currentAttendees > 0 && event.organizerId !== currentUser.id
        ).length;
        const userPoints = userEventsAttended * 150; // 150 points per event
        
        // Generate badges based on activity
        const userBadges = [];
        if (userEventsAttended >= 5) userBadges.push('Event Champion');
        if (userEventsAttended >= 3) userBadges.push('Active Participant');
        if (userEventsAttended >= 1) userBadges.push('Event Explorer');
        if (userEventsAttended === 0) userBadges.push('Getting Started');

        staticData.push({
          id: currentUser.id,
          name: currentUser.name,
          points: userPoints,
          eventsAttended: userEventsAttended,
          badges: userBadges
        });
      }
    }

    // Sort by points descending
    return staticData.sort((a, b) => b.points - a.points);
  }, [currentUser, events]);

  const displayLeaderboard = leaderboard.length > 0 ? leaderboard : staticLeaderboard;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-6 h-6 text-blue-500" />;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
    }
  };

  const getBadgeIcon = (badge: string) => {
    if (badge.includes('Champion') || badge.includes('Master')) return <Crown className="w-4 h-4" />;
    if (badge.includes('Social') || badge.includes('Networker') || badge.includes('Community')) return <Zap className="w-4 h-4" />;
    if (badge.includes('Tech') || badge.includes('Innovation') || badge.includes('Guru')) return <Target className="w-4 h-4" />;
    if (badge.includes('Knowledge') || badge.includes('Seeker')) return <Star className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  const getBadgeColor = (badge: string) => {
    if (badge.includes('Champion') || badge.includes('Master')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (badge.includes('Social') || badge.includes('Networker') || badge.includes('Community')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (badge.includes('Tech') || badge.includes('Innovation') || badge.includes('Guru')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    if (badge.includes('Knowledge') || badge.includes('Seeker')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (badge.includes('Enthusiast') || badge.includes('Explorer')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Leaderboard</h2>
        <Trophy className="w-6 h-6 text-yellow-500" />
      </div>

      <div className="space-y-4">
        {displayLeaderboard.slice(0, 8).map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center p-4 rounded-xl transition-all ${
              currentUser?.id === user.id
                ? 'bg-blue-50 dark:bg-blue-900 border-2 border-blue-200 dark:border-blue-700'
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${getRankBg(index + 1)}`}>
              <span className="text-white font-bold text-sm">#{index + 1}</span>
            </div>

            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />

            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mr-2">{user.name}</h3>
                {currentUser?.id === user.id && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                    You
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{user.points} points • {user.eventsAttended} events</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {user.badges.slice(0, 3).map((badge) => (
                  <span
                    key={badge}
                    className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getBadgeColor(badge)}`}
                  >
                    {getBadgeIcon(badge)}
                    {badge}
                  </span>
                ))}
                {user.badges.length > 3 && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                    +{user.badges.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="ml-4">
              {getRankIcon(index + 1)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Your Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentUser?.points || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Points</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{currentUser?.badges?.length || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Badges</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;