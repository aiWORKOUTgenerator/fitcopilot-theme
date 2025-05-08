import React, { useEffect, useRef } from 'react';
import { VariantKey } from '../types';
import { applyProgramTokens, createTokenStyles } from '../utils/applyThemeTokens';

interface ProgramTokenExampleProps {
    variant?: VariantKey;
    programType: 'strength' | 'fatLoss' | 'fitness' | 'athletic';
}

/**
 * Example component demonstrating how to use the token system
 * in different ways within a React component
 */
const ProgramTokenExample: React.FC<ProgramTokenExampleProps> = ({
    variant = 'default',
    programType
}) => {
    // Reference to DOM element for direct token application
    const cardRef = useRef<HTMLDivElement>(null);

    // Apply tokens directly to DOM element on mount and variant change
    useEffect(() => {
        if (cardRef.current) {
            applyProgramTokens(programType, variant, cardRef.current);
        }
    }, [programType, variant]);

    // Create inline styles from tokens
    const titleStyles = createTokenStyles(variant, [
        `--training-text-${programType}`
    ]);

    // Create class names from token-based classes
    const gradientClass = `program-gradient-${programType}`;
    const textClass = `program-text-${programType}`;

    return (
        <div className="program-token-example">
            <h2>Program Token Usage Example</h2>

            {/* Example 1: Using CSS classes (preferred approach) */}
            <div className="example-section">
                <h3>Using CSS Classes</h3>
                <div className={`example-card ${gradientClass}`}>
                    <h4 className={textClass}>Program: {programType}</h4>
                    <p>This uses the token-based CSS classes</p>
                </div>
            </div>

            {/* Example 2: Using inline styles from tokens */}
            <div className="example-section">
                <h3>Using Inline Styles</h3>
                <div style={{
                    backgroundImage: `var(--training-gradient-${programType})`,
                    padding: '1rem',
                    borderRadius: '0.5rem'
                }}>
                    <h4 style={titleStyles}>Program: {programType}</h4>
                    <p>This uses inline styles with token values</p>
                </div>
            </div>

            {/* Example 3: Using the programmatic API */}
            <div className="example-section">
                <h3>Using Programmatic API</h3>
                <div ref={cardRef} className="example-card">
                    <h4>Program: {programType}</h4>
                    <p>This uses the applyProgramTokens() utility</p>
                </div>
            </div>

            {/* Explanation */}
            <div className="example-notes">
                <p>
                    <strong>Best Practice:</strong> Use the CSS class approach whenever possible.
                    Only use the programmatic approaches for dynamic scenarios where CSS
                    classes aren't sufficient.
                </p>
            </div>
        </div>
    );
};

export default ProgramTokenExample; 