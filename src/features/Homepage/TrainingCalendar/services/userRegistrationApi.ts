/**
 * User Registration API Service
 * 
 * Handles API calls for user registration during event booking
 * Connects frontend forms with WordPress REST API endpoints
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { CalendarEvent, RegisteredUser, UserRegistrationData } from '../interfaces';

/**
 * API Error Response Interface
 */
interface ApiError {
  code: string;
  message: string;
  data?: {
    status: number;
    [key: string]: any;
  };
}

/**
 * Registration Response Interface
 */
interface RegistrationResponse {
  success: boolean;
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  welcome_email_sent: boolean;
  event_association?: {
    status: string;
    event_type: string;
    message: string;
  };
  message: string;
}

/**
 * Email Check Response Interface
 */
interface EmailCheckResponse {
  exists: boolean;
  user_id?: number;
  message: string;
}

/**
 * Get API base URL and nonce from WordPress localized data
 */
const getApiConfig = () => {
  const calendarData = (window as any).fitcopilotTrainingCalendarData;
  
  if (!calendarData) {
    console.error('Training Calendar data not found. API calls may fail.');
    return {
      baseUrl: '/wp-json/fitcopilot/v1',
      nonce: '',
      hasValidConfig: false
    };
  }
  
  return {
    baseUrl: '/wp-json/fitcopilot/v1',
    nonce: calendarData.nonce || calendarData.api?.restNonce || '',
    hasValidConfig: Boolean(calendarData.nonce || calendarData.api?.restNonce),
    userRegistration: calendarData.api?.userRegistration || {}
  };
};

/**
 * Create request headers with authentication
 */
const createHeaders = (includeAuth: boolean = true): HeadersInit => {
  const config = getApiConfig();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth && config.nonce) {
    headers['X-WP-Nonce'] = config.nonce;
  }
  
  return headers;
};

/**
 * Generic API request handler with error handling
 */
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = true
): Promise<T> => {
  const config = getApiConfig();
  
  // Warn if configuration is invalid
  if (!config.hasValidConfig && requireAuth) {
    console.warn('API configuration invalid. Request may fail due to missing nonce.');
  }
  
  const url = `${config.baseUrl}${endpoint}`;
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...createHeaders(requireAuth),
      ...options.headers,
    },
  };
  
  try {
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `API request failed: ${response.status} ${response.statusText}`
      );
    }
    
    const data = await response.json();
    console.log(`✅ API Response: ${endpoint}`, data);
    
    return data;
  } catch (error) {
    console.error(`❌ API Error: ${endpoint}`, error);
    throw error;
  }
};

/**
 * Check if email exists in WordPress
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await apiRequest<EmailCheckResponse>(
      '/users/check-email',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      },
      false // Public endpoint, no auth required
    );
    
    return response.exists;
  } catch (error) {
    console.error('Email check failed:', error);
    // Return false on error to allow registration attempt
    return false;
  }
};

/**
 * Register a new user with optional event association
 */
export const registerUser = async (
  userData: UserRegistrationData,
  eventData?: Partial<CalendarEvent>
): Promise<RegisteredUser> => {
  const requestData = {
    email: userData.email,
    firstName: userData.firstName,
    acceptsPrivacyPolicy: userData.acceptsPrivacyPolicy,
    ...(eventData && { eventData })
  };
  
  try {
    const response = await apiRequest<RegistrationResponse>(
      '/users/register',
      {
        method: 'POST',
        body: JSON.stringify(requestData),
      },
      false // Public endpoint for registration
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Registration failed');
    }
    
    // Transform API response to RegisteredUser interface
    const registeredUser: RegisteredUser = {
      id: response.user_id,
      username: response.username,
      email: response.email,
      firstName: response.first_name
    };
    
    console.log('✅ User registered successfully:', registeredUser);
    
    return registeredUser;
  } catch (error) {
    console.error('User registration failed:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to create account. Please try again.'
    );
  }
};

/**
 * Send welcome email to user
 */
export const sendWelcomeEmail = async (userId: number): Promise<boolean> => {
  try {
    const response = await apiRequest<{ success: boolean; message: string }>(
      '/users/send-welcome-email',
      {
        method: 'POST',
        body: JSON.stringify({ user_id: userId }),
      }
    );
    
    return response.success;
  } catch (error) {
    console.error('Welcome email failed:', error);
    return false;
  }
};

/**
 * Get user profile data
 */
export const getUserProfile = async (): Promise<any> => {
  try {
    const response = await apiRequest<any>('/users/profile', {
      method: 'GET',
    });
    
    return response;
  } catch (error) {
    console.error('Get user profile failed:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (profileData: {
  firstName?: string;
  lastName?: string;
  phone?: string;
}): Promise<boolean> => {
  try {
    const response = await apiRequest<{ success: boolean }>(
      '/users/profile',
      {
        method: 'POST',
        body: JSON.stringify(profileData),
      }
    );
    
    return response.success;
  } catch (error) {
    console.error('Update user profile failed:', error);
    return false;
  }
};

/**
 * Utility function to validate registration data
 */
export const validateRegistrationData = (data: UserRegistrationData): string[] => {
  const errors: string[] = [];
  
  if (!data.email?.trim()) {
    errors.push('Email address is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.firstName?.trim()) {
    errors.push('First name is required');
  } else if (data.firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters');
  }
  
  if (!data.acceptsPrivacyPolicy) {
    errors.push('Privacy policy acceptance is required');
  }
  
  return errors;
};

/**
 * Check API health and configuration
 */
export const checkApiHealth = async (): Promise<{
  healthy: boolean;
  hasConfig: boolean;
  hasNonce: boolean;
  endpoints: string[];
}> => {
  const config = getApiConfig();
  
  const healthCheck = {
    healthy: false,
    hasConfig: config.hasValidConfig,
    hasNonce: Boolean(config.nonce),
    endpoints: [
      '/users/check-email',
      '/users/register',
      '/users/send-welcome-email',
      '/users/profile'
    ]
  };
  
  try {
    // Test a simple endpoint to check if API is responsive
    const response = await fetch(`${config.baseUrl}/users/check-email`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify({ email: 'test@example.com' })
    });
    
    healthCheck.healthy = response.status !== 404;
  } catch (error) {
    console.warn('API health check failed:', error);
  }
  
  return healthCheck;
};

/**
 * Debug function to log API configuration
 */
export const debugApiConfig = () => {
  const config = getApiConfig();
  
  console.group('🔍 User Registration API Debug');
  console.log('Configuration:', config);
  console.log('Window data:', (window as any).fitcopilotTrainingCalendarData);
  console.groupEnd();
  
  return config;
}; 