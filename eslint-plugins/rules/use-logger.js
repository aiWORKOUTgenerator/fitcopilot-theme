/**
 * ESLint rule to enforce using the logger utility instead of console
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Enforce using logger instead of console",
            category: "Best Practices",
            recommended: true,
        },
        fixable: "code",
        schema: [], // no options
        messages: {
            useLogger: "Use logger.{{method}} instead of console.{{method}}",
        }
    },
    create: function (context) {
        return {
            MemberExpression(node) {
                // Check if this is a console.X expression
                if (
                    node.object.type === "Identifier" &&
                    node.object.name === "console" &&
                    node.property.type === "Identifier" &&
                    ["log", "warn", "error", "info", "debug"].includes(node.property.name)
                ) {
                    // Map console methods to logger methods (console.log -> logger.debug, etc.)
                    const loggerMethod = node.property.name === "log" ? "debug" : node.property.name;

                    context.report({
                        node,
                        messageId: "useLogger",
                        data: {
                            method: node.property.name
                        },
                        fix: function (fixer) {
                            // Replace console.X with logger.Y
                            if (node.object.range && node.property.range) {
                                return [
                                    // Replace console with logger
                                    fixer.replaceText(node.object, "logger"),
                                    // Replace log with debug if needed
                                    ...(node.property.name === "log"
                                        ? [fixer.replaceText(node.property, "debug")]
                                        : [])
                                ];
                            }
                            return null;
                        }
                    });
                }
            }
        };
    }
}; 