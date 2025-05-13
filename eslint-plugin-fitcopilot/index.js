/**
 * eslint-plugin-fitcopilot
 * 
 * Custom ESLint rules for the FitCopilot theme
 */

'use strict';

// Import rules
const useLogger = require('./rules/use-logger');

// Export plugin
module.exports = {
    rules: {
        'use-logger': useLogger
    },
    configs: {
        recommended: {
            plugins: ['fitcopilot'],
            rules: {
                'fitcopilot/use-logger': 'warn'
            }
        }
    }
}; 