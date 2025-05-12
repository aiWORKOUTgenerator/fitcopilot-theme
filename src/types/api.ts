/**
 * Base API response structure
 */
export interface ApiResponse<T> {
    data: T;
    status: number;
    success: boolean;
    message?: string;
}

/**
 * Error response from API
 */
export interface ApiErrorResponse {
    error: string;
    status: number;
    code?: string;
    details?: Record<string, unknown>;
}

/**
 * Pagination metadata for list responses
 */
export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

/**
 * Paginated API response
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
    pagination: PaginationMeta;
}

/**
 * User profile data
 */
export interface UserProfile {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    role: string;
    preferences?: UserPreferences;
    createdAt: string;
    updatedAt: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
    theme?: 'default' | 'gym' | 'sports' | 'wellness';
    notifications?: NotificationPreferences;
    units?: 'metric' | 'imperial';
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
    email: boolean;
    push: boolean;
    sms: boolean;
}

/**
 * Workout data
 */
export interface Workout {
    id: number;
    title: string;
    description?: string;
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
    exercises: Exercise[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Exercise data
 */
export interface Exercise {
    id: number;
    name: string;
    description?: string;
    type: string;
    sets?: number;
    reps?: number;
    duration?: number;
    restTime?: number;
    videoUrl?: string;
    imageUrl?: string;
} 