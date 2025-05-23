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
        'use-logger': useLogger,
        'fitcopilot/require-react-import': {
            meta: {
                type: 'problem',
                docs: {
                    description: 'Enforce React import in files with JSX',
                    recommended: true,
                    url: null,
                },
                fixable: 'code',
            },
            create(context) {
                let hasJsx = false;
                let hasReactImport = false;

                return {
                    JSXElement() {
                        hasJsx = true;
                    },
                    ImportDeclaration(node) {
                        if (node.source.value === 'react') {
                            hasReactImport = true;
                        }
                    },
                    'Program:exit'() {
                        if (hasJsx && !hasReactImport) {
                            context.report({
                                loc: { line: 1, column: 0 },
                                message: 'React must be imported in files using JSX',
                                fix(fixer) {
                                    return fixer.insertTextBeforeRange([0, 0], 'import React from \'react\';\n');
                                }
                            });
                        }
                    }
                };
            }
        }
    },
    configs: {
        recommended: {
            plugins: ['fitcopilot'],
            rules: {
                'fitcopilot/use-logger': 'warn',
                'fitcopilot/require-react-import': 'error'
            }
        }
    }
}; 