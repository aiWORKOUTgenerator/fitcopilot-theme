/**
 * API service type definitions
 */

/**
 * Base API response interface
 */
export interface ApiResponse<T> {
    /** Response data */
    data: T;
    /** Success state */
    success: boolean;
    /** HTTP status code */
    statusCode: number;
    /** Response message */
    message?: string;
}

/**
 * Error response interface
 */
export interface ApiErrorResponse {
    /** Error code */
    code: string;
    /** Error message */
    message: string;
    /** Additional error details */
    details?: unknown;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    /** Current page number */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Total number of items */
    totalItems: number;
    /** Items per page */
    perPage: number;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> extends ApiResponse<{
    /** Array of items */
    items: T[];
    /** Pagination metadata */
    meta: PaginationMeta;
}> { }

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