import { waitFor } from '@testing-library/react';

/**
 * Waits for all pending promises to resolve
 * Useful for tests with multiple async operations
 */
export async function waitForPromises() {
    // Execute all microtasks in the queue
    await new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Creates a promise that resolves after the specified time
 * @param ms Time to wait in milliseconds
 */
export function wait(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a wrapper for async test functions to handle errors properly
 * @param fn The async test function
 * @returns A function that can be used with test/it
 */
export function withAsync(fn: (...args: any[]) => Promise<any>) {
    return async (...args: any[]) => {
        try {
            return await fn(...args);
        } catch (error) {
            console.error('Error in async test:', error);
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
    { timeout = 1000, interval = 50 }: { timeout?: number; interval?: number } = {}
): Promise<void> {
    return waitFor(assertion, { timeout, interval });
}

/**
 * Resolves when a condition function returns true
 * Useful for waiting for a specific state
 */
export async function waitForCondition(
    condition: () => boolean | Promise<boolean>,
    { timeout = 1000, interval = 50 }: { timeout?: number; interval?: number } = {}
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
export function mockConsole(...methods: Array<keyof Console>) {
    const originalMethods: Record<string, any> = {};

    methods.forEach(method => {
        originalMethods[method] = console[method];
        console[method] = jest.fn();
    });

    return () => {
        methods.forEach(method => {
            console[method] = originalMethods[method];
        });
    };
}

/**
 * Helper to test thrown errors
 * @param fn Function expected to throw
 * @param errorClass Expected error class or undefined for any error
 * @param messagePattern Optional regex or string to match against error message
 */
export async function expectToThrow(
    fn: () => any | Promise<any>,
    errorClass?: any,
    messagePattern?: RegExp | string
) {
    try {
        await fn();
        throw new Error('Expected function to throw an error, but it did not');
    } catch (error) {
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
export function mockResizeObserver() {
    window.ResizeObserver = class ResizeObserver {
        observe = jest.fn();
        unobserve = jest.fn();
        disconnect = jest.fn();
    };

    return () => {
        // @ts-ignore - we know this exists as we just defined it
        delete window.ResizeObserver;
    };
}

/**
 * Creates a mock IntersectionObserver for tests
 */
export function mockIntersectionObserver() {
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
        simulateIntersection(entries: Partial<IntersectionObserverEntry>[]) {
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
        // @ts-ignore - we know this exists as we just defined it
        delete window.IntersectionObserver;
    };
} 