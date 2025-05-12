import React, { useEffect, useRef } from 'react';
import Button from '../components/UI/Button/Button';
import '../features/Homepage/PersonalTraining/PersonalTraining.scss';
import logger from '../utils/logger';

// Create a component-specific logger
const debugLogger = logger.addContext('ButtonDebug');

export const ButtonDebug: React.FC = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const personalTrainingButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (buttonRef.current) {
            // Log all applied classes
            debugLogger.debug('Base Button classes:', buttonRef.current.className);

            // Log computed styles
            const styles = window.getComputedStyle(buttonRef.current);
            debugLogger.debug('Base Button computed styles:', {
                background: styles.background,
                backgroundImage: styles.backgroundImage,
                color: styles.color,
                padding: styles.padding,
                borderRadius: styles.borderRadius,
                fontWeight: styles.fontWeight,
                transition: styles.transition
            });
        }

        if (personalTrainingButtonRef.current) {
            // Log all applied classes
            debugLogger.debug('PersonalTraining Button classes:', personalTrainingButtonRef.current.className);

            // Log computed styles
            const styles = window.getComputedStyle(personalTrainingButtonRef.current);
            debugLogger.debug('PersonalTraining Button computed styles:', {
                background: styles.background,
                backgroundImage: styles.backgroundImage,
                color: styles.color,
                padding: styles.padding,
                borderRadius: styles.borderRadius,
                fontWeight: styles.fontWeight,
                transition: styles.transition
            });

            // Check style inheritance
            debugLogger.debug('Button style inheritance:');
            let element = personalTrainingButtonRef.current;
            let level = 0;
            while (element && level < 10) {
                const classes = element.className.split(' ').join('.');
                debugLogger.debug(`- ${element.tagName}${element.id ? '#' + element.id : ''}${classes ? '.' + classes : ''}`);
                element = element.parentElement;
                level++;
            }
        }
    }, []);

    // Output CSS variables from various contexts
    useEffect(() => {
        // Root variables
        const rootVars = getCSSVariables(document.documentElement);
        debugLogger.debug('Root CSS Variables:', rootVars);

        // Body variables
        const bodyVars = getCSSVariables(document.body);
        debugLogger.debug('Body CSS Variables:', bodyVars);

        // Section variables
        const ptSection = document.querySelector('.personal-training-section');
        if (ptSection) {
            const sectionVars = getCSSVariables(ptSection as HTMLElement);
            debugLogger.debug('Personal Training Section CSS Variables:', sectionVars);
        }
    }, []);

    const getCSSVariables = (element: HTMLElement) => {
        const computedStyles = getComputedStyle(element);
        const variables = {};

        // Get all CSS variables
        Array.from(computedStyles).forEach(prop => {
            if (prop.startsWith('--')) {
                variables[prop] = computedStyles.getPropertyValue(prop).trim();
            }
        });

        return variables;
    };

    return (
        <div className="p-8 bg-gray-100">
            <h2 className="text-2xl font-bold mb-8">Button Debug Panel</h2>

            <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Base Button</h3>
                <Button
                    ref={buttonRef}
                    variant="primary"
                    size="medium"
                >
                    Base Button
                </Button>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Personal Training Button</h3>
                <div className="personal-training-section p-6 bg-black">
                    <Button
                        ref={personalTrainingButtonRef}
                        variant="primary"
                        size="medium"
                        themeContext="personal-training"
                    >
                        Personal Training Button
                    </Button>
                </div>
            </div>

            {/* Compare with styled button solution */}
            <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">InlineStyled Button (Reference)</h3>
                <button
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(to right, #8b5cf6, #6d28d9)',
                        color: 'white',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Inline Styled Button
                </button>
            </div>

            {/* CSS Class Name Comparison */}
            <div>
                <h3 className="text-xl font-bold mb-4">Class Name Generation</h3>
                <pre className="p-4 bg-gray-200 rounded overflow-auto">
                    {JSON.stringify({
                        method1: `button button--primary button--medium button--personal-training`.trim(),
                        method2: ['button', 'button--primary', 'button--medium', 'button--personal-training'].filter(Boolean).join(' ')
                    }, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default ButtonDebug; 