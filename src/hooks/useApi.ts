import { useCallback, useState } from 'react';
import logger from '../utils/logger';
import useEventCallback from './useEventCallback';

// Create API-specific logger
const apiLogger = logger.addContext('useApi');

// Types for API request options
export interface ApiRequestOptions extends RequestInit {
    /**
     * Request headers
     */
    headers?: Record<string, string>;
    /**
     * Optional abort signal for request cancellation
     */
    signal?: AbortSignal;
}

// Generic API request state interface
export interface ApiRequestState<T> {
    /**
     * The data returned from the API (when successful)
     */
    data: T | null;
    /**
     * Whether the request is currently loading
     */
    loading: boolean;
    /**
     * Any error that occurred during the request
     */
    error: Error | null;
}

/**
 * Generic API response interface
 */
export interface ApiResponse<T> {
    /**
     * Response data
     */
    data: T;
    /**
     * HTTP status code
     */
    status: number;
    /**
     * Response headers
     */
    headers: Headers;
}

/**
 * WordPress global data interface
 */
export interface WordPressGlobalData {
    wpData?: {
        restUrl?: string;
        nonce?: string;
    };
}

/**
 * Hook for making API requests with TypeScript type safety
 * 
 * @template T The expected response data type
 * @param initialState Optional initial state for the request
 * @returns Object containing request state and fetch function
 */
function useApi<T>(initialState?: Partial<ApiRequestState<T>>) {
    // Initialize state with default values and any provided initial state
    const [state, setState] = useState<ApiRequestState<T>>({
        data: null,
        loading: false,
        error: null,
        ...initialState
    });

    /**
     * Internal function to get WordPress REST API URL and nonce
     */
    const getWordPressApiData = useCallback(() => {
        const wpData = ((window as unknown) as WordPressGlobalData).athleteDashboardData?.wpData || {};
        return {
            restUrl: wpData.restUrl || '/wp-json',
            nonce: wpData.nonce || ''
        };
    }, []);

    /**
     * Function to make an API request
     * 
     * @param url API endpoint URL
     * @param options Request options (method, body, headers)
     * @returns Promise with the API response
     */
    const fetchApi = useEventCallback(async (
        url: string,
        options: ApiRequestOptions = {}
    ): Promise<ApiResponse<T>> => {
        const { restUrl, nonce } = getWordPressApiData();

        // Prefix relative URLs with restUrl if they don't start with http(s)://
        const fullUrl = url.startsWith('http') ? url : `${restUrl}${url}`;

        // Start request - set loading state
        setState(prev => ({ ...prev, loading: true, error: null }));

        const requestId = apiLogger.time(`API request to ${url}`);

        try {
            apiLogger.debug('Making API request', { url: fullUrl, method: options.method || 'GET' });

            // Merge default headers with provided headers
            const headers = {
                'Content-Type': 'application/json',
                'X-WP-Nonce': nonce,
                ...options.headers
            };

            // Make the request
            const response = await fetch(fullUrl, {
                ...options,
                headers
            });

            // Handle non-2xx responses
            if (!response.ok) {
                // Try to parse error response as JSON
                let errorData: { message?: string } = {};
                try {
                    errorData = await response.json();
                } catch (e) {
                    // If JSON parsing failed, use status text
                    errorData = { message: response.statusText };
                }

                const errorMessage = errorData.message || `API error: ${response.status}`;

                apiLogger.error('API request failed', {
                    url: fullUrl,
                    status: response.status,
                    statusText: response.statusText,
                    errorMessage
                });

                throw new Error(errorMessage);
            }

            // Parse successful response
            const data = await response.json() as T;

            apiLogger.debug('API request successful', {
                url: fullUrl,
                status: response.status
            });

            // Update state with successful response
            setState({
                data,
                loading: false,
                error: null
            });

            // Return full response details
            return {
                data,
                status: response.status,
                headers: response.headers
            };
        } catch (error) {
            // Handle fetch errors or errors from response handling
            const errorObj = error instanceof Error ? error : new Error('Unknown error');

            apiLogger.error('API request error', {
                url: fullUrl,
                error: errorObj.message
            });

            // Update state with error
            setState({
                data: null,
                loading: false,
                error: errorObj
            });

            throw errorObj;
        } finally {
            apiLogger.timeEnd(requestId);
        }
    }, [getWordPressApiData]);

    return {
        ...state,
        fetchApi
    };
}

export default useApi; 