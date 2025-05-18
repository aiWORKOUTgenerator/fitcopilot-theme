/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/context/ThemeContext$': '<rootDir>/src/__mocks__/context/ThemeContext.tsx',
        '^../context/ThemeContext$': '<rootDir>/src/__mocks__/context/ThemeContext.tsx',
        '^../../context/ThemeContext$': '<rootDir>/src/__mocks__/context/ThemeContext.tsx',
        '^../../../context/ThemeContext$': '<rootDir>/src/__mocks__/context/ThemeContext.tsx',
        '^../../../../context/ThemeContext$': '<rootDir>/src/__mocks__/context/ThemeContext.tsx',
        '^../../../Homepage/Hero/components/HeroButton$': '<rootDir>/src/__mocks__/features/Homepage/Hero/components/HeroButton',
        '^../../../Homepage/Hero/components/HeroButton/HeroButton$': '<rootDir>/src/__mocks__/features/Homepage/Hero/components/HeroButton'
    },
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/__fixtures__/',
        '/__mocks__/',
        '/__tests__/utils/'
    ],
    setupFilesAfterEnv: ['<rootDir>/src/features/Registration/tests/setup.ts', '<rootDir>/jest.setup.js'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
            isolatedModules: true,
        }],
    },
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/tests/**/*',
        '!src/**/*.stories.*',
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
}; 