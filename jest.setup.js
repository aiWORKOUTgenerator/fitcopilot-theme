// Add Jest extended matchers
require('@testing-library/jest-dom');

// Silence console errors during tests
beforeAll(() => {
    // Mock console.error to suppress React warnings (for cleaner test output)
    jest.spyOn(console, 'error').mockImplementation(() => { });
});

afterAll(() => {
    // Restore console error
    jest.restoreAllMocks();
});

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
}); 