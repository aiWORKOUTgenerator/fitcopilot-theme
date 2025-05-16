/**
 * Type definitions for test utilities
 * 
 * This file contains centralized type definitions for test utilities to ensure
 * type safety and eliminate 'any' types in testing code.
 */

import { RenderResult, RenderOptions as RTLRenderOptions } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event';
import { ReactElement } from 'react';
import { ApiResponse } from './api';

// ========================================================================
// GENERIC TEST UTILITY TYPES
// ========================================================================

/**
 * Generic async function type
 */
export type AsyncFunction<Args extends unknown[] = unknown[], Return = unknown> =
    (...args: Args) => Promise<Return>;

/**
 * Type for console methods that can be mocked
 */
export type ConsoleMethods = 'log' | 'warn' | 'error' | 'info' | 'debug';

/**
 * Timeout options for async utilities
 */
export interface TimeoutOptions {
    timeout?: number;
    interval?: number;
}

// ========================================================================
// TEST RENDER TYPES
// ========================================================================

/**
 * Extended render options from React Testing Library
 */
export interface TestRenderOptions extends RTLRenderOptions {
    wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

/**
 * Extended render result with utility methods
 */
export interface TestRenderResult<T = HTMLElement> extends RenderResult {
    container: T;
    user: UserEvent;
    rerender: (ui: ReactElement) => TestRenderResult<T>;
    waitForElementChange: (callback: () => Promise<void> | void) => Promise<RenderResult>;
}

/**
 * Props for component under test
 */
export type ComponentProps<T extends React.ComponentType<unknown>> =
    T extends React.ComponentType<infer P> ? P : never;

/**
 * Route options for router testing
 */
export interface RouterOptions {
    route: string;
    routerProps?: {
        initialEntries?: string[];
        initialIndex?: number;
    };
}

/**
 * State options for context/state testing
 */
export interface StateOptions {
    initialState?: Record<string, unknown>;
}

/**
 * Provider options for test rendering
 */
export interface ProviderOptions {
    providerProps?: TestProviderOptions;
}

/**
 * Combined render options type using discriminated union
 * for different testing scenarios
 */
export type CustomRenderOptions =
    TestRenderOptions &
    Partial<RouterOptions> &
    Partial<StateOptions> &
    ProviderOptions;

// ========================================================================
// MOCK SERVICE TYPES
// ========================================================================

/**
 * Base mock service type with Jest mock functions
 */
export type MockService<T> = {
    [K in keyof T]: T[K] extends (...args: infer Args) => infer Return
    ? jest.Mock<Return, Args>
    : T[K];
};

/**
 * Generic HTTP method type
 */
export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

/**
 * Mock API service HTTP method type
 */
export interface MockApiMethod {
    <T = unknown>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<ApiResponse<T>>;
}

/**
 * Mock API service type with generic response types
 */
export interface MockApiService {
    get: jest.Mock<ReturnType<MockApiMethod>, Parameters<MockApiMethod>>;
    post: jest.Mock<ReturnType<MockApiMethod>, Parameters<MockApiMethod>>;
    put: jest.Mock<ReturnType<MockApiMethod>, Parameters<MockApiMethod>>;
    delete: jest.Mock<ReturnType<MockApiMethod>, Parameters<MockApiMethod>>;
    patch: jest.Mock<ReturnType<MockApiMethod>, Parameters<MockApiMethod>>;
}

/**
 * Mock storage service type
 */
export interface MockStorageService {
    getItem: jest.Mock<string | null, [string]>;
    setItem: jest.Mock<void, [string, string]>;
    removeItem: jest.Mock<void, [string]>;
    clear: jest.Mock<void, []>;
    key: jest.Mock<string | null, [number]>;
    length: jest.SpyInstance;
    _getStore: () => Record<string, string>;
}

/**
 * Mock analytics service type
 */
export interface MockAnalyticsService {
    trackEvent: jest.Mock<void, [string, Record<string, unknown>?]>;
    trackPageView: jest.Mock<void, [string, Record<string, unknown>?]>;
    identifyUser: jest.Mock<void, [string | number, Record<string, unknown>?]>;
    setUserProperties: jest.Mock<void, [Record<string, unknown>]>;
}

/**
 * User credentials for authentication
 */
export interface UserCredentials {
    email: string;
    password: string;
}

/**
 * Authentication result with user and token
 */
export interface AuthResult {
    user: UserData;
    token: string;
}

/**
 * Mock auth service type
 */
export interface MockAuthService {
    login: jest.Mock<Promise<AuthResult>, [UserCredentials]>;
    logout: jest.Mock<Promise<void>, []>;
    register: jest.Mock<Promise<AuthResult>, [RegisterData]>;
    getCurrentUser: jest.Mock<Promise<UserData | null>, []>;
    isAuthenticated: jest.Mock<boolean, []>;
    getToken: jest.Mock<string | null, []>;
}

/**
 * Mock workout service type
 */
export interface MockWorkoutService {
    getWorkouts: jest.Mock<Promise<WorkoutData[]>, []>;
    getWorkout: jest.Mock<Promise<WorkoutData | null>, [string]>;
    createWorkout: jest.Mock<Promise<WorkoutData>, [Omit<WorkoutData, 'id'>]>;
    updateWorkout: jest.Mock<Promise<WorkoutData>, [string, Partial<WorkoutData>]>;
    deleteWorkout: jest.Mock<Promise<boolean>, [string]>;
}

/**
 * Mock fetch response options
 */
export interface MockFetchOptions {
    status?: number;
    headers?: Record<string, string>;
}

/**
 * Mock fetch response type
 */
export interface MockFetchResponse<T> {
    ok: boolean;
    status: number;
    headers: Headers;
    json: () => Promise<T>;
    text: () => Promise<string>;
}

// ========================================================================
// MEDIA TEST TYPES
// ========================================================================

/**
 * Mock media match type
 */
export interface MediaMatchObject {
    matches: boolean;
    addListener: jest.Mock;
    removeListener: jest.Mock;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
    dispatchEvent: jest.Mock;
    media: string;
}

// ========================================================================
// PROVIDER TEST TYPES
// ========================================================================

/**
 * Generic context provider props
 */
export interface TestProviderProps<T> {
    children: React.ReactNode;
    mockValues?: Partial<T>;
}

/**
 * User context mock data
 */
export interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
}

/**
 * Register data type
 */
export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

/**
 * Exercise data type
 */
export interface ExerciseData {
    id: string;
    name: string;
    type: string;
    sets?: number;
    reps?: number;
    duration?: number;
    [key: string]: unknown;
}

/**
 * Workout data type
 */
export interface WorkoutData {
    id: string;
    name: string;
    exercises: ExerciseData[];
    [key: string]: unknown;
}

/**
 * Generic provider options for combined test providers
 */
export interface TestProviderOptions {
    userContext?: Partial<UserContextType>;
    workoutContext?: Partial<WorkoutContextType>;
    analyticsContext?: Partial<AnalyticsContextType>;
    customProviders?: React.FC<{ children: React.ReactNode }>[];
}

/**
 * User context type
 */
export interface UserContextType {
    user: UserData | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: Error | null;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<UserData>) => Promise<void>;
}

/**
 * Workout context type
 */
export interface WorkoutContextType {
    workouts: WorkoutData[];
    currentWorkout: WorkoutData | null;
    isLoading: boolean;
    error: Error | null;
    fetchWorkouts: () => Promise<void>;
    createWorkout: (workout: Omit<WorkoutData, 'id'>) => Promise<void>;
    updateWorkout: (id: string, workout: Partial<WorkoutData>) => Promise<void>;
    deleteWorkout: (id: string) => Promise<void>;
    setCurrentWorkout: (workout: WorkoutData | null) => void;
}

/**
 * Analytics context type
 */
export interface AnalyticsContextType {
    trackEvent: (name: string, properties?: Record<string, unknown>) => void;
    trackPageView: (path: string, properties?: Record<string, unknown>) => void;
    identifyUser: (id: string | number, traits?: Record<string, unknown>) => void;
} 