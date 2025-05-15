/**
 * API Response Types
 * 
 * Standardized API response interfaces following a discriminated union pattern
 * for handling success and error cases with proper typing.
 */

// ===== Base Response Interface =====

/**
 * Base interface for all API responses with common attributes
 */
export interface BaseApiResponse {
    status: number;
    message?: string;
    timestamp: string;
}

// ===== Success Response =====

/**
 * Success response with typed data payload
 */
export interface ApiSuccessResponse<T> extends BaseApiResponse {
    success: true;
    data: T;
}

// ===== Error Response =====

/**
 * Error detail object for structured error reporting
 */
export interface ApiErrorDetail {
    field?: string;
    code: string;
    message: string;
}

/**
 * Error response with typed error details
 */
export interface ApiErrorResponse extends BaseApiResponse {
    success: false;
    errors: ApiErrorDetail[];
}

// ===== Discriminated Union Type =====

/**
 * Combined API response type using discriminated union pattern
 * The `success` property acts as the discriminator
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ===== Common API Data Types =====

/**
 * Pagination metadata for list responses
 */
export interface PaginationMeta {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}

/**
 * Paginated response data wrapper
 */
export interface PaginatedData<T> {
    items: T[];
    pagination: PaginationMeta;
}

/**
 * Paginated API response type
 */
export type PaginatedApiResponse<T> = ApiResponse<PaginatedData<T>>;

// ===== Type Guards =====

/**
 * Type guard to check if response is a success response
 */
export function isApiSuccessResponse<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
    return response.success === true;
}

/**
 * Type guard to check if response is an error response
 */
export function isApiErrorResponse<T>(response: ApiResponse<T>): response is ApiErrorResponse {
    return response.success === false;
}

/**
 * Type guard to check if a response is a paginated response
 */
export function isPaginatedResponse<T>(
    response: ApiSuccessResponse<T | PaginatedData<T>>
): response is ApiSuccessResponse<PaginatedData<T>> {
    return (
        'data' in response &&
        typeof response.data === 'object' &&
        response.data !== null &&
        'pagination' in response.data &&
        'items' in response.data &&
        Array.isArray((response.data as PaginatedData<T>).items)
    );
}

// ===== Example Usage =====

/*
// Example 1: Fetching a user
async function fetchUser(userId: string): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    return await response.json();
  } catch (error) {
    // Handle network errors
    return {
      success: false,
      status: 0,
      timestamp: new Date().toISOString(),
      errors: [{
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      }]
    };
  }
}

// Example 2: Using the response with type narrowing
function handleUserResponse(response: ApiResponse<User>) {
  if (isApiSuccessResponse(response)) {
    // TypeScript knows response.data is User here
    return response.data;
  } else {
    // TypeScript knows response.errors is ApiErrorDetail[] here
    throw new Error(response.errors[0]?.message || 'Unknown error');
  }
}
*/ 