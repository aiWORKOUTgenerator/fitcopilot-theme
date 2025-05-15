module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:storybook/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
        'fitcopilot', // Custom plugin
    ],
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        // Core ESLint rules
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'no-unused-vars': 'off', // Handled by TypeScript

        // React rules
        'react/react-in-jsx-scope': 'off', // Not needed in React 17+
        'react/prop-types': 'off', // Use TypeScript for prop validation
        'react/no-unescaped-entities': 'off', // Allow quotes in JSX

        // JSX specific rules
        'react/jsx-curly-spacing': ['error', { 'when': 'never', 'children': { 'when': 'never' } }],
        'react/jsx-curly-brace-presence': ['error', { 'props': 'never', 'children': 'never' }],
        'react/jsx-equals-spacing': ['error', 'never'],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-tag-spacing': ['error', {
            'closingSlash': 'never',
            'beforeSelfClosing': 'always',
            'afterOpening': 'never',
            'beforeClosing': 'never'
        }],

        // TypeScript rules
        '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
        }],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',

        // Custom rules
        'fitcopilot/use-logger': 'warn', // Warning for now until we fully transition
    },
    overrides: [
        {
            // Test files can use console freely and have unused variables
            files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}', '**/tests/**/*.{js,jsx,ts,tsx}'],
            rules: {
                'no-console': 'off',
                'fitcopilot/use-logger': 'off',
                '@typescript-eslint/no-unused-vars': 'off',
            },
        },
        {
            // Debug modules can use console with warnings
            files: ['**/debug/**/*.{js,jsx,ts,tsx}', '**/debug.{js,jsx,ts,tsx}'],
            rules: {
                'no-console': 'warn',
                'fitcopilot/use-logger': 'off',
            },
        },
        {
            // Allow more flexibility in utility files
            files: ['**/utils/**/*.{js,jsx,ts,tsx}'],
            rules: {
                '@typescript-eslint/no-unused-vars': 'warn',
            },
        },
        {
            // Special rules for test utilities to enforce proper JSX syntax
            files: ['**/tests/utils/**/*.{js,jsx,ts,tsx}'],
            rules: {
                'react/jsx-curly-spacing': ['error', { 'when': 'never' }],
                'react/jsx-equals-spacing': ['error', 'never'],
                'react/jsx-tag-spacing': ['error', {
                    'closingSlash': 'never',
                    'beforeSelfClosing': 'always',
                    'afterOpening': 'never',
                    'beforeClosing': 'never'
                }],
            }
        },
        {
            // Disable typescript-eslint in test files temporarily
            files: ['**/__tests__/**/*', '*.test.ts', '*.test.tsx'],
            rules: {
                '@typescript-eslint/no-explicit-any': 'off'
            }
        }
    ],
}; 