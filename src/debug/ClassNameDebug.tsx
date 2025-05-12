import React, { useEffect } from 'react';
import logger from '../utils/logger';

// Create component-specific logger
const classNameLogger = logger.addContext('ClassNameDebug');

/**
 * Debug class name generation to understand how different methods produce different results
 */
export const debugClassNames = (
    variant = 'primary',
    context?: string,
    size = 'medium',
    additionalClasses?: string
) => {
    // Method 1: Template literals with conditional
    const method1 = `button button--${variant} button--${size} ${context ? `button--${context}` : ''} ${additionalClasses || ''}`.trim().replace(/\s+/g, ' ');

    // Method 2: Array filter and join
    const method2 = [
        'button',
        `button--${variant}`,
        `button--${size}`,
        context && `button--${context}`,
        additionalClasses
    ].filter(Boolean).join(' ');

    // Method 3: React's classnames library simulation
    const classNames = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');
    const method3 = classNames(
        'button',
        `button--${variant}`,
        `button--${size}`,
        context && `button--${context}`,
        additionalClasses
    );

    return { method1, method2, method3 };
};

export const ClassNameDebug: React.FC = () => {
    useEffect(() => {
        // Test basic examples
        classNameLogger.group('Class Name Generation Tests', () => {
            classNameLogger.debug('Default (primary, medium):', debugClassNames());
            classNameLogger.debug('With context:', debugClassNames('primary', 'personal-training'));
            classNameLogger.debug('With extra classes:', debugClassNames('primary', 'personal-training', 'medium', 'my-extra-class'));
            classNameLogger.debug('With undefined context:', debugClassNames('primary', undefined, 'medium', 'my-extra-class'));
            classNameLogger.debug('With falsy context:', debugClassNames('primary', false as any, 'medium', 'my-extra-class'));
        });

        // Compare to existing button component's class name generation
        classNameLogger.group('Button Component Class Pattern Analysis', () => {
            // Example derived from Button.tsx
            const getButtonClasses = (
                variant: string = 'primary',
                size: string = 'medium',
                themeContext?: string,
                className?: string,
                fullWidth?: boolean
            ) => {
                return [
                    'button',
                    `button--${variant}`,
                    `button--${size}`,
                    themeContext && `button--${themeContext}`,
                    fullWidth && 'button--fullwidth',
                    className
                ].filter(Boolean).join(' ');
            };

            classNameLogger.debug('Button primary:', getButtonClasses('primary', 'medium'));
            classNameLogger.debug('Button personal-training:', getButtonClasses('primary', 'medium', 'personal-training'));
            classNameLogger.debug('Button full-width:', getButtonClasses('primary', 'medium', 'personal-training', '', true));
            classNameLogger.debug('Button with extra class:', getButtonClasses('primary', 'medium', 'personal-training', 'extra-class'));
        });
    }, []);

    return (
        <div className="p-6 bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Class Name Generation Analysis</h2>

            <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Current Implementation</h3>
                <pre className="bg-white p-4 rounded shadow overflow-auto">
                    {`
// From Button.tsx
const buttonClasses = [
  'button',
  \`button--\${variant}\`,
  \`button--\${size}\`,
  themeContext && \`button--\${themeContext}\`,
  fullWidth && 'button--fullwidth',
  className
].filter(Boolean).join(' ');
          `}
                </pre>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Test Cases</h3>
                <table className="w-full bg-white rounded shadow">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2 text-left">Test Case</th>
                            <th className="p-2 text-left">Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="p-2">Default (primary, medium)</td>
                            <td className="p-2 font-mono text-sm">{debugClassNames().method2}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2">With themeContext="personal-training"</td>
                            <td className="p-2 font-mono text-sm">{debugClassNames('primary', 'personal-training').method2}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2">With extra classes</td>
                            <td className="p-2 font-mono text-sm">{debugClassNames('primary', 'personal-training', 'medium', 'my-extra-class').method2}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2">With undefined context</td>
                            <td className="p-2 font-mono text-sm">{debugClassNames('primary', undefined, 'medium', 'my-extra-class').method2}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <p className="text-gray-700">
                    Check the console for more detailed class name generation analysis.
                </p>
            </div>
        </div>
    );
};

export default ClassNameDebug; 