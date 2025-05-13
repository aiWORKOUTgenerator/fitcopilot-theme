/**
 * Rule: use-logger
 * 
 * Enforces using the logger utility instead of direct console calls
 */

'use strict';

module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce using logger utility instead of console',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: 'code',
        schema: [],
        messages: {
            useLogger: 'Use the logger utility instead of console',
        }
    },

    create(context) {
        return {
            CallExpression(node) {
                // Check if this is a console call
                if (
                    node.callee.type === 'MemberExpression' &&
                    node.callee.object.type === 'Identifier' &&
                    node.callee.object.name === 'console'
                ) {
                    // Get the console method (log, warn, error, etc.)
                    const method = node.callee.property.name;

                    // Only warn about console methods, but not for allowed ones in ESLint config
                    if (['log', 'info', 'debug', 'warn', 'error'].includes(method)) {
                        context.report({
                            node,
                            messageId: 'useLogger',
                            fix(fixer) {
                                // Map console methods to logger methods
                                const loggerMethod = method === 'log' ? 'info' : method;

                                // Get the arguments
                                const args = node.arguments.map(arg => context.getSourceCode().getText(arg)).join(', ');

                                // Build the replacement text
                                const replacement = `logger.${loggerMethod}(${args})`;

                                // Check if logger is already imported
                                const importExists = context.getSourceCode()
                                    .ast.body
                                    .some(node =>
                                        node.type === 'ImportDeclaration' &&
                                        node.source.value === '../utils/logger'
                                    );

                                // Only fix if we can determine it's safe
                                if (importExists) {
                                    return fixer.replaceText(node, replacement);
                                }

                                // Otherwise just return the fix without adding the import
                                return fixer.replaceText(node, replacement);
                            }
                        });
                    }
                }
            }
        };
    }
}; 