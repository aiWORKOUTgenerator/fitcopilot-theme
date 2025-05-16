/**
 * User Service
 * 
 * Service for user authentication and profile management
 */

import { ApiResponse } from '../types/api-response';
import { LoginResponse, User, UserPreferences } from '../types/user';
import { safeApiRequest } from '../utils/api-utils';

// Real service implementation (would connect to API)
const userService = {
    /**
     * Authenticate a user with email and password
     */
    login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
        return safeApiRequest(async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock response based on email
            if (email === 'test@example.com' && password) {
                return {
                    user: {
                        id: 'user123',
                        email: 'test@example.com',
                        displayName: 'Test User',
                        roles: ['user']
                    },
                    token: 'mock-jwt-token'
                };
            }

            if (email === 'admin@example.com' && password) {
                return {
                    user: {
                        id: 'admin456',
                        email: 'admin@example.com',
                        displayName: 'Admin User',
                        roles: ['admin']
                    },
                    token: 'mock-admin-jwt-token'
                };
            }

            throw new Error('Invalid credentials');
        });
    },

    /**
     * Log out the current user
     */
    logout: async (): Promise<ApiResponse<void>> => {
        return safeApiRequest(async () => {
            // In a real implementation, this would invalidate the token
            await new Promise<void>(resolve => setTimeout(resolve, 500));
        });
    },

    /**
     * Get the current user's profile
     */
    getProfile: async (): Promise<ApiResponse<User>> => {
        return safeApiRequest(async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // In a real implementation, this would call an API with the stored token
            return {
                id: 'user-123',
                displayName: 'Current User',
                email: 'user@example.com',
                roles: ['user']
            };
        });
    },

    /**
     * Update user profile
     */
    updateProfile: async (profile: Partial<User>): Promise<ApiResponse<User>> => {
        return safeApiRequest(async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // In a real implementation, this would update the profile via API
            return {
                id: 'user-123',
                displayName: profile.displayName || 'Current User',
                email: profile.email || 'user@example.com',
                roles: ['user'],
                ...profile
            };
        });
    },

    /**
     * Update user preferences
     */
    updatePreferences: async (preferences: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> => {
        return safeApiRequest(async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // In a real implementation, this would update preferences via API
            return {
                theme: preferences.theme || 'default',
                units: preferences.units || 'metric',
                notifications: preferences.notifications || {
                    email: true,
                    push: true,
                    sms: false,
                    inApp: true
                },
                ...preferences
            };
        });
    }
};

// Mock version for testing
export const mockUserService = {
    login: jest.fn().mockImplementation(userService.login),
    logout: jest.fn().mockImplementation(userService.logout),
    getProfile: jest.fn().mockImplementation(userService.getProfile),
    updateProfile: jest.fn().mockImplementation(userService.updateProfile),
    updatePreferences: jest.fn().mockImplementation(userService.updatePreferences)
};

export default userService; 