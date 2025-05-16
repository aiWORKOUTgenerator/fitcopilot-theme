/**
 * Type definitions for context testing utilities
 * 
 * This file contains types specifically for testing React context providers
 * to ensure type safety and eliminate 'any' types in testing code.
 */

import { RenderOptions, RenderResult } from '@testing-library/react';
import { RenderHookOptions, RenderHookResult } from '@testing-library/react-hooks';
import { ReactNode } from 'react';

/**
 * Base props for any test context provider
 */
export interface BaseTestProviderProps {
    children?: ReactNode;
}

/**
 * Type for a context provider component with children and additional props
 */
export type ContextProvider<T = unknown> = React.ComponentType<BaseTestProviderProps & T>;

/**
 * Contextual provider wrapper configuration
 */
export interface ProviderConfig<T = unknown> {
    Provider: ContextProvider<T>;
    props: T;
}

/**
 * Type-safe render result with provider props
 */
export type ProviderRenderResult<P> = RenderResult & {
    providerProps: P;
};

/**
 * Type-safe render hook result with provider props
 */
export type ProviderRenderHookResult<P, R, A> = RenderHookResult<A, R> & {
    providerProps: P;
};

/**
 * Options for rendering with a context provider
 */
export interface RenderWithProviderOptions<P> extends Omit<RenderOptions, 'wrapper'> {
    providerProps: P;
}

/**
 * Options for rendering a hook with a context provider
 */
export interface RenderHookWithProviderOptions<P, A> extends Omit<RenderHookOptions<A>, 'wrapper'> {
    providerProps: P;
}

/**
 * Type-safe mock context value creator options
 */
export interface MockContextValueOptions<T extends Record<string, unknown>> {
    defaultValue: T;
    overrides?: Partial<T>;
    mockFunctions?: Array<keyof T>;
}

/**
 * Context mock function mapping
 */
export type MockFunctionMapping<T extends Record<string, unknown>> = {
    [K in keyof T]?: T[K] extends (...args: infer Args) => infer Return
    ? jest.Mock<Return, Args>
    : never;
};

/**
 * User context mock configuration
 */
export interface UserContextMockConfig {
    isAuthenticated?: boolean;
    userId?: string;
    displayName?: string;
    email?: string;
    roles?: string[];
    onLogin?: jest.Mock;
    onLogout?: jest.Mock;
    onProfileUpdate?: jest.Mock;
}

/**
 * Workout context mock configuration
 */
export interface WorkoutContextMockConfig {
    workouts?: Array<unknown>;
    selectedWorkout?: unknown | null;
    loading?: boolean;
    error?: string | null;
    onFetchWorkouts?: jest.Mock;
    onCreateWorkout?: jest.Mock;
    onUpdateWorkout?: jest.Mock;
    onDeleteWorkout?: jest.Mock;
    shouldFailOnLoad?: boolean;
    shouldFailOnSave?: boolean;
    shouldFailOnDelete?: boolean;
}

/**
 * Combined test providers configuration
 */
export interface TestProvidersConfig {
    userContext?: UserContextMockConfig;
    workoutContext?: WorkoutContextMockConfig;
    journeyContext?: Record<string, unknown>;
    analyticsContext?: Record<string, unknown>;
}

/**
 * Type for context provider factory functions
 */
export type ProviderFactory<P, C = unknown> = (config: C) => React.FC<BaseTestProviderProps & P>; 