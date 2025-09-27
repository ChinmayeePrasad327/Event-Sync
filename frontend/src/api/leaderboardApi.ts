import { get } from './api';
import { LeaderboardEntry, ApiResponse } from '../types';

export const leaderboardApi = {
  // Get leaderboard
  getLeaderboard: async (top?: number): Promise<ApiResponse<{ leaderboard: LeaderboardEntry[] }>> => {
    const params = top ? `?top=${top}` : '';
    return get<ApiResponse<{ leaderboard: LeaderboardEntry[] }>>(`/leaderboard${params}`);
  },
};

