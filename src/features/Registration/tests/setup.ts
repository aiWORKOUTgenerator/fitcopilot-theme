import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Increase default timeout for async tests
configure({ asyncUtilTimeout: 2000 });

// Mock window.sessionStorage
const mockSessionStorage = {
    store: {} as Record<string, string>,
    getItem: jest.fn((key: string) => mockSessionStorage.store[key] || null),
    setItem: jest.fn((key: string, value: string) => { mockSessionStorage.store[key] = value; }),
    clear: jest.fn(() => { mockSessionStorage.store = {}; })
};

Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage }); 