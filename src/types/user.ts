/**
 * User-related type definitions
 */

/**
 * User theme preference
 */
export type UserTheme = 'default' | 'dark' | 'light' | 'gym' | 'sports' | 'wellness';

/**
 * Unit system preference
 */
export type UnitSystem = 'metric' | 'imperial';

/**
 * Notification channel settings
 */
export interface NotificationSettings {
    /** Email notifications enabled */
    email: boolean;
    /** Push notifications enabled */
    push: boolean;
    /** SMS notifications enabled */
    sms: boolean;
    /** In-app notifications enabled */
    inApp: boolean;
}

/**
 * Workout reminder settings
 */
export interface ReminderSettings {
    /** Whether reminders are enabled */
    enabled: boolean;
    /** Reminder frequency in days */
    frequency: number;
    /** Preferred time of day for reminders (24h format) */
    preferredTime?: string;
}

/**
 * Privacy settings
 */
export interface PrivacySettings {
    /** Whether profile is public */
    publicProfile: boolean;
    /** Whether to share activity */
    shareActivity: boolean;
    /** Whether to allow friend requests */
    allowFriendRequests: boolean;
}

/**
 * User preferences with strongly typed fields
 */
export interface UserPreferences {
    /** Theme preference */
    theme?: UserTheme;
    /** Unit system preference */
    units?: UnitSystem;
    /** Notification settings */
    notifications?: NotificationSettings;
    /** Reminder settings */
    reminders?: ReminderSettings;
    /** Privacy settings */
    privacy?: PrivacySettings;
    /** Custom user preferences */
    custom?: Record<string, string | number | boolean>;
}

/**
 * User role type
 */
export type UserRole = 'user' | 'admin' | 'trainer' | 'guest';

/**
 * User profile information
 */
export interface User {
    /** User ID */
    id: string;
    /** Display name shown in the UI */
    displayName: string;
    /** User's email address */
    email: string;
    /** User role(s) */
    roles?: UserRole[];
    /** User preferences */
    preferences?: UserPreferences;
    /** First name */
    firstName?: string;
    /** Last name */
    lastName?: string;
    /** Profile image URL */
    profileImage?: string;
    /** Account creation date */
    createdAt?: string;
    /** Last login date */
    lastLogin?: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
    /** User email */
    email: string;
    /** User password */
    password: string;
    /** Remember me option */
    remember?: boolean;
}

/**
 * Login response
 */
export interface LoginResponse {
    /** User data */
    user: User;
    /** Authentication token */
    token: string;
    /** Token expiration time in seconds */
    expiresIn?: number;
    /** Refresh token for getting a new token */
    refreshToken?: string;
}

/**
 * Registration data
 */
export interface RegistrationData {
    /** Email address */
    email: string;
    /** Password */
    password: string;
    /** Password confirmation */
    passwordConfirm: string;
    /** First name */
    firstName?: string;
    /** Last name */
    lastName?: string;
    /** Display name */
    displayName?: string;
    /** Whether user accepted terms */
    acceptedTerms: boolean;
}

/**
 * Password change data
 */
export interface PasswordChangeData {
    /** Current password */
    currentPassword: string;
    /** New password */
    newPassword: string;
    /** New password confirmation */
    confirmPassword: string;
}

/**
 * Type guard to check if an object is a User
 */
export function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'email' in obj &&
        'displayName' in obj
  );
} 