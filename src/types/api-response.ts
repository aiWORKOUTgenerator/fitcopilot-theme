/**
 * Enhanced API response types with discriminated unions
 *
 * This file contains refined API response types that use the discriminated union pattern
 * to provide stronger type safety and better runtime type checking.
 */

/**
 * Base API response interface
 */
export interface BaseApiResponse {
    /** HTTP status code */
    status: number;
    /** Request ID for tracing */
    requestId?: string;
}

/**
 * Success response variant
 */
export interface SuccessResponse<T> extends BaseApiResponse {
    /** Success flag - discriminator */
    success: true;
    /** Response data */
    data: T;
    /** Optional success message */
    message?: string;
}

/**
 * Error response variant
 */
export interface ErrorResponse extends BaseApiResponse {
    /** Success flag - discriminator */
    success: false;
    /** Error details */
    error: {
        /** Error code for programmatic handling */
        code: string;
        /** Human-readable error message */
        message: string;
        /** Additional error details */
        details?: Record<string, unknown>;
    };
}

/**
 * API Response discriminated union type
 *
 * Using a discriminated union allows TypeScript to narrow the type
 * based on the 'success' property, providing type safety when handling
 * different response variants.
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Paginated response metadata
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
    /** Flag indicating if there's a next page */
    hasNextPage: boolean;
    /** Flag indicating if there's a previous page */
    hasPreviousPage: boolean;
}

/**
 * Paginated success response
 */
export interface PaginatedSuccessResponse<T> extends SuccessResponse<T[]> {
    /** Pagination metadata */
    pagination: PaginationMeta;
}

/**
 * Paginated API response type
 */
export type PaginatedApiResponse<T> = PaginatedSuccessResponse<T> | ErrorResponse;

/**
 * Type guard to check if a response is a success response
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
    return response.success === true;
}

/**
 * Type guard to check if a response is an error response
 */
export function isErrorResponse<T>(response: ApiResponse<T>): response is ErrorResponse {
    return response.success === false;
}

/**
 * Type guard to check if a response is a paginated success response
 */
export function isPaginatedResponse<T>(
    response: ApiResponse<T[]> | PaginatedApiResponse<T>
): response is PaginatedSuccessResponse<T> {
    return isSuccessResponse(response) && 'pagination' in response;
}

/**
 * Helper to create a success response
 */
export function createSuccessResponse<T>(
    data: T,
    status = 200,
    message?: string,
    requestId?: string
): SuccessResponse<T> {
    return {
        success: true,
        status,
        data,
        message,
        requestId
    };
}

/**
 * Helper to create an error response
 */
export function createErrorResponse(
    code: string,
    message: string,
    status = 400,
    details?: Record<string, unknown>,
    requestId?: string
): ErrorResponse {
    return {
        success: false,
        status,
        error: {
            code,
            message,
            details
        },
        requestId
    };
}

/**
 * Helper to create a paginated success response
 */
export function createPaginatedResponse<T>(
    data: T[],
    pagination: PaginationMeta,
    status = 200,
    message?: string,
    requestId?: string
): PaginatedSuccessResponse<T> {
    return {
        success: true,
        status,
        data,
        pagination,
        message,
        requestId
    };
} 