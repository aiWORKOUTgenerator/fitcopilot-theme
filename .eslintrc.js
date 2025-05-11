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

        // TypeScript rules
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',

        // Custom rules
        'fitcopilot/use-logger': 'warn', // Warning for now until we fully transition
    },
    overrides: [
        {
            // Test files can use console freely
            files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}', '**/tests/**/*.{js,jsx,ts,tsx}'],
            rules: {
                'no-console': 'off',
                'fitcopilot/use-logger': 'off',
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
    ],
}; 