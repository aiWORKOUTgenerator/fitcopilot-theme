import { waitFor } from '@testing-library/react';
import { ConsoleMethods, TimeoutOptions } from '../../types/test';
import logger from '../../utils/logger';

/**
 * Waits for all pending promises to resolve
 * Useful for tests with multiple async operations
 */
export async function waitForPromises(): Promise<void> {
    // Execute all microtasks in the queue
    await new Promise<void>(resolve => setTimeout(resolve, 0));
}

/**
 * Creates a promise that resolves after the specified time
 * @param ms Time to wait in milliseconds
 */
export function wait(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a wrapper for async test functions to handle errors properly
 * @param fn The async test function
 * @returns A function that can be used with test/it
 */
export function withAsync<Args extends unknown[], Return>(
    fn: (...args: Args) => Promise<Return>
): (...args: Args) => Promise<Return> {
    return async (...args: Args) => {
        try {
            return await fn(...args);
        } catch (error) {
            logger.error('Error in async test:', error);
            throw error;
        }
    };
}

/**
 * Helper to retry an assertion multiple times before failing
 * Useful for tests with race conditions or timing issues
 */
export async function retryAssertion(
    assertion: () => void | Promise<void>,
    { timeout = 1000, interval = 50 }: TimeoutOptions = {}
): Promise<void> {
    return waitFor(assertion, { timeout, interval });
}

/**
 * Resolves when a condition function returns true
 * Useful for waiting for a specific state
 */
export async function waitForCondition(
    condition: () => boolean | Promise<boolean>,
    { timeout = 1000, interval = 50 }: TimeoutOptions = {}
): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        if (await condition()) {
            return;
        }
        await wait(interval);
    }

    throw new Error(`Condition not met within ${timeout}ms timeout`);
}

/**
 * Mocks console methods to suppress specific outputs during tests
 * @param methods Console methods to mock
 * @returns A function to restore the original methods
 */
export function mockConsole(...methods: ConsoleMethods[]): () => void {
    const originalMethods: Record<string, unknown> = {};

    methods.forEach(method => {
        // eslint-disable-next-line no-console
        originalMethods[method] = console[method];
        // eslint-disable-next-line no-console
        console[method] = jest.fn();
    });

    return () => {
        methods.forEach(method => {
            // eslint-disable-next-line no-console
            console[method] = originalMethods[method] as Console[ConsoleMethods];
        });
    };
}

/**
 * Helper to test thrown errors
 * @param fn Function expected to throw
 * @param errorClass Expected error class or undefined for any error
 * @param messagePattern Optional regex or string to match against error message
 */
export async function expectToThrow<T, E extends Error = Error>(
    fn: () => T | Promise<T>,
    errorClass?: new (...args: unknown[]) => E,
    messagePattern?: RegExp | string
): Promise<Error> {
    try {
        await fn();
        throw new Error('Expected function to throw an error, but it did not');
    } catch (error) {
        if (!(error instanceof Error)) {
            throw new Error(`Expected error to be an Error instance, but got: ${typeof error}`);
        }

        if (errorClass) {
            expect(error).toBeInstanceOf(errorClass);
        }

        if (messagePattern) {
            if (messagePattern instanceof RegExp) {
                expect(error.message).toMatch(messagePattern);
            } else {
                expect(error.message).toContain(messagePattern);
            }
        }

        return error;
    }
}

/**
 * Creates a mock ResizeObserver for tests
 */
export function mockResizeObserver(): () => void {
    window.ResizeObserver = class ResizeObserver {
        observe = jest.fn();
        unobserve = jest.fn();
        disconnect = jest.fn();
    };

    return () => {
        // @ts-expect-error - we know this exists as we just defined it
        delete window.ResizeObserver;
    };
}

/**
 * Creates a mock IntersectionObserver for tests
 */
export function mockIntersectionObserver(): () => void {
    window.IntersectionObserver = class IntersectionObserver {
        constructor(callback: IntersectionObserverCallback) {
            this.callback = callback;
        }

        callback: IntersectionObserverCallback;
        observe = jest.fn();
        unobserve = jest.fn();
        disconnect = jest.fn();
        takeRecords = jest.fn().mockReturnValue([]);
        root = null;
        rootMargin = '';
        thresholds = [];

        /**
         * Helper to trigger the callback with mock entries
         */
        simulateIntersection(entries: Partial<IntersectionObserverEntry>[]): void {
            this.callback(
                entries.map(entry => ({
                    isIntersecting: false,
                    boundingClientRect: DOMRectReadOnly.fromRect(),
                    intersectionRatio: 0,
                    intersectionRect: DOMRectReadOnly.fromRect(),
                    rootBounds: null,
                    target: document.createElement('div'),
                    time: Date.now(),
                    ...entry,
                })),
                this
            );
        }
    };

    return () => {
        // @ts-expect-error - we know this exists as we just defined it
        delete window.IntersectionObserver;
    };
} 