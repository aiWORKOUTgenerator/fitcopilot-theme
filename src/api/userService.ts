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
    login: async (email: string, _password: string): Promise<LoginResponse> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock response based on email
        if (email === 'test@example.com') {
            return {
                user: {
                    id: 'user123',
                    email: 'test@example.com',
                    name: 'Test User',
                    role: 'user'
                },
                token: 'mock-jwt-token'
            };
        }

        if (email === 'admin@example.com') {
            return {
                user: {
                    id: 'admin456',
                    email: 'admin@example.com',
                    name: 'Admin User',
                    role: 'admin'
                },
                token: 'mock-admin-jwt-token'
            };
        }

        // Error response for invalid credentials
        return {
            user: {
                id: '',
                email: '',
                name: '',
                role: ''
            },
            token: ''
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