import { get, post } from './api';
import { User, LoginResponse, SignupResponse, ApiResponse } from '../types';

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

export const userApi = {
  // Login user
  login: async (data: LoginData): Promise<LoginResponse> => {
    return post<LoginResponse>('/users/login', data);
  },

  // Signup user
  signup: async (data: SignupData): Promise<SignupResponse> => {
    return post<SignupResponse>('/users/signup', data);
  },

  // Get user profile
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    return get<ApiResponse<{ user: User }>>('/users/profile');
  },

  // Delete user
  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    return get<ApiResponse<void>>(`/users/${userId}`);
  },

  // Get all users (admin only)
  getUsers: async (): Promise<ApiResponse<{ users: User[] }>> => {
    return get<ApiResponse<{ users: User[] }>>('/users');
  },
};

