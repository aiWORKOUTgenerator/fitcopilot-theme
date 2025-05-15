/**
 * User Service
 * 
 * Service for user authentication and profile management
 */

// User type definition
export interface User {
    id: string;
    displayName: string;
    email: string;
    roles?: string[];
    preferences?: Record<string, any>;
}

// Login credentials
export interface LoginCredentials {
    email: string;
    password: string;
}

// Login response
export interface LoginResponse {
    user: User;
    token: string;
}

// Real service implementation (would connect to API)
const userService = {
    /**
     * Authenticate a user with email and password
     */
    login: async (email: string, password: string): Promise<LoginResponse> => {
        // In a real implementation, this would call an API
        return {
            user: {
                id: 'user-123',
                displayName: email.split('@')[0],
                email,
                roles: ['user']
            },
            token: 'mock-jwt-token'
        };
    },

    /**
     * Log out the current user
     */
    logout: async (): Promise<void> => {
        // In a real implementation, this would invalidate the token
        return Promise.resolve();
    },

    /**
     * Get the current user's profile
     */
    getProfile: async (): Promise<User> => {
        // In a real implementation, this would call an API with the stored token
        return {
            id: 'user-123',
            displayName: 'Current User',
            email: 'user@example.com',
            roles: ['user']
        };
    },

    /**
     * Update user profile
     */
    updateProfile: async (profile: Partial<User>): Promise<User> => {
        // In a real implementation, this would update the profile via API
        return {
            id: 'user-123',
            displayName: profile.displayName || 'Current User',
            email: profile.email || 'user@example.com',
            roles: ['user'],
            ...profile
        };
    }
};

// Mock version for testing
export const mockUserService = {
    login: jest.fn().mockImplementation(userService.login),
    logout: jest.fn().mockImplementation(userService.logout),
    getProfile: jest.fn().mockImplementation(userService.getProfile),
    updateProfile: jest.fn().mockImplementation(userService.updateProfile)
};

export default userService; 