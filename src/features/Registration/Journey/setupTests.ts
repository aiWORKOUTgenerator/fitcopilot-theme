import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock sessionStorage
if (typeof window !== 'undefined') {
    const mockStorage = (() => {
        let store: Record<string, string> = {};
        return {
            getItem: jest.fn((key: string) => store[key] || null),
            setItem: jest.fn((key: string, value: string) => {
                store[key] = value;
            }),
            removeItem: jest.fn((key: string) => {
                delete store[key];
            }),
            clear: jest.fn(() => {
                store = {};
            }),
        };
    })();

    Object.defineProperty(window, 'sessionStorage', {
        value: mockStorage,
    });
}

// Silence console errors during tests
logger.error = jest.fn(); 