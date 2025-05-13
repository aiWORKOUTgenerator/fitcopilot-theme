/**
 * API type definitions
 */

/**
 * Base API response structure
 */
export interface ApiResponse<T> {
    /** Response data */
    data: T;
    /** HTTP status code */
    status: number;
    /** Success state */
    success: boolean;
    /** Response message */
    message?: string;
}

/**
 * Error response from API
 */
export interface ApiErrorResponse {
    /** Error message */
    error: string;
    /** HTTP status code */
    status: number;
    /** Error code */
    code?: string;
    /** Additional error details */
    details?: Record<string, unknown>;
}

/**
 * Pagination metadata for list responses
 */
export interface PaginationMeta {
    /** Current page number */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Total number of items */
    totalItems: number;
    /** Items per page */
    itemsPerPage: number;
    /** Whether there is a next page */
    hasNextPage: boolean;
    /** Whether there is a previous page */
    hasPreviousPage: boolean;
}

/**
 * Paginated API response
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
    /** Pagination metadata */
    pagination: PaginationMeta;
}

/**
 * WordPress REST API specific types
 */
export interface WordPressRestRequest {
    /** REST endpoint path */
    path: string;
    /** HTTP method */
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    /** Request headers */
    headers?: Record<string, string>;
    /** Query parameters */
    params?: Record<string, string | number | boolean>;
    /** Request body */
    data?: unknown;
}

/**
 * WordPress REST API response
 */
export interface WordPressRestResponse<T> {
    /** Response body */
    body: T;
    /** Response headers */
    headers: Headers;
    /** HTTP status code */
    status: number;
    /** Status text */
    statusText: string;
}

/**
 * WordPress post base type
 */
export interface WordPressPost {
    /** Post ID */
    id: number;
    /** Post title */
    title: {
        /** Rendered title */
        rendered: string;
    };
    /** Post content */
    content: {
        /** Rendered content */
        rendered: string;
        /** Protected status */
        protected: boolean;
    };
    /** Post excerpt */
    excerpt: {
        /** Rendered excerpt */
        rendered: string;
        /** Protected status */
        protected: boolean;
    };
    /** Post slug */
    slug: string;
    /** Post status */
    status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
    /** Post type */
    type: string;
    /** Post link */
    link: string;
    /** Modified date */
    modified: string;
    /** Created date */
    date: string;
}

/**
 * User profile data
 */
export interface UserProfile {
    /** User ID */
    id: number;
    /** Username */
    username: string;
    /** Email address */
    email: string;
    /** First name */
    firstName: string;
    /** Last name */
    lastName: string;
    /** Avatar URL */
    avatarUrl?: string;
    /** User role */
    role: string;
    /** User preferences */
    preferences?: UserPreferences;
    /** Creation timestamp */
    createdAt: string;
    /** Last update timestamp */
    updatedAt: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
    /** Theme preference */
    theme?: 'default' | 'gym' | 'sports' | 'wellness';
    /** Notification preferences */
    notifications?: NotificationPreferences;
    /** Unit system preference */
    units?: 'metric' | 'imperial';
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
    /** Email notifications enabled */
    email: boolean;
    /** Push notifications enabled */
    push: boolean;
    /** SMS notifications enabled */
    sms: boolean;
}

/**
 * Workout data
 */
export interface Workout {
    /** Workout ID */
    id: number;
    /** Workout title */
    title: string;
    /** Workout description */
    description?: string;
    /** Duration in minutes */
    duration: number;
    /** Difficulty level */
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    /** Workout type */
    type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
    /** List of exercises */
    exercises: Exercise[];
    /** Creation timestamp */
    createdAt: string;
    /** Last update timestamp */
    updatedAt: string;
}

/**
 * Exercise data
 */
export interface Exercise {
    /** Exercise ID */
    id: number;
    /** Exercise name */
    name: string;
    /** Exercise description */
    description?: string;
    /** Exercise type */
    type: string;
    /** Number of sets */
    sets?: number;
    /** Number of repetitions */
    reps?: number;
    /** Duration in seconds */
    duration?: number;
    /** Rest time in seconds */
    restTime?: number;
    /** Video URL */
    videoUrl?: string;
    /** Image URL */
    imageUrl?: string;
} 