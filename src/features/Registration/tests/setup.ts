import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { setupMockStorage } from './utils/testSimple';

// Increase default timeout for async tests
configure({ asyncUtilTimeout: 2000 });

// Configure mocks for all tests
beforeEach(() => {
  // Setup mock storage
  setupMockStorage();

  // Clear mock function calls
  jest.clearAllMocks();
});

// Mock window matchMedia
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

// Mock window.sessionStorage
const mockSessionStorage = {
  store: {} as Record<string, string>,
  getItem: jest.fn((key: string) => mockSessionStorage.store[key] || null),
  setItem: jest.fn((key: string, value: string) => { mockSessionStorage.store[key] = value; }),
  clear: jest.fn(() => { mockSessionStorage.store = {}; })
};

Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage }); 