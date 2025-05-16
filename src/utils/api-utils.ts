/**
 * API utilities for handling errors and response processing
 */
import { ApiResponse, ErrorResponse, createErrorResponse, createSuccessResponse } from '../types/api-response';

/**
 * Standard API error codes
 */
export enum ApiErrorCode {
    BAD_REQUEST = 'BAD_REQUEST',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    SERVER_ERROR = 'SERVER_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}

/**
 * Maps HTTP status codes to error codes
 */
export const statusToErrorCode: Record<number, ApiErrorCode> = {
  400: ApiErrorCode.BAD_REQUEST,
  401: ApiErrorCode.UNAUTHORIZED,
  403: ApiErrorCode.FORBIDDEN,
  404: ApiErrorCode.NOT_FOUND,
  500: ApiErrorCode.SERVER_ERROR
};

/**
 * API Error class for standardized error handling
 */
export class ApiError extends Error {
  /** HTTP status code */
  status: number;
  /** Error code */
  code: ApiErrorCode;
  /** Error details for additional information */
  details?: Record<string, unknown>;

  constructor(
    message: string,
    status = 500,
    code = ApiErrorCode.UNKNOWN_ERROR,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Handle an error and convert it to a standardized ErrorResponse
 */
export function handleApiError(error: unknown): ErrorResponse {
  // If it's already an ApiError, use its properties
  if (isApiError(error)) {
    return createErrorResponse(
      error.code,
      error.message,
      error.status,
      error.details
    );
  }

  // If it's a standard Error, create a generic server error
  if (error instanceof Error) {
    return createErrorResponse(
      ApiErrorCode.UNKNOWN_ERROR,
      error.message || 'An unexpected error occurred',
      500
    );
  }

  // For completely unknown errors
  return createErrorResponse(
    ApiErrorCode.UNKNOWN_ERROR,
    typeof error === 'string' ? error : 'An unknown error occurred',
    500
  );
}

/**
 * Wrapper for API requests that handles errors and provides type safety
 */
export async function safeApiRequest<T>(
  requestFn: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await requestFn();
    return createSuccessResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Validates required fields in a request payload
 */
export function validateRequired<T extends Record<string, unknown>>(
  payload: T,
  requiredFields: Array<keyof T>
): ApiResponse<T> {
  const missingFields: Array<keyof T> = [];

  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    return createErrorResponse(
      ApiErrorCode.VALIDATION_ERROR,
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      { missingFields }
    );
  }

  return createSuccessResponse(payload);
} 