import React from 'react';

type ThemeVariant = 'default' | 'gym' | 'sports' | 'wellness' | 'modern' | 'classic' | 'minimalist';

interface GlobalBackgroundProps {
    variant?: ThemeVariant;
    className?: string;
    pattern?: 'grid' | 'dots' | 'none';
}

/**
 * GlobalBackground component providing a consistent theme-aware background for the application
 * 
 * This component is typically placed at the root level of the application to provide
 * a consistent background for all pages. It supports theme variants and different
 * background patterns.
 */
const GlobalBackground: React.FC<GlobalBackgroundProps> = ({
    variant = 'default',
    className = '',
    pattern = 'grid'
}) => {
    // Generate pattern classes
    const patternClass = pattern === 'grid'
        ? 'global-background-grid'
        : pattern === 'dots'
            ? 'global-background-dots'
            : '';

    return (
        <div
            className={`global-background ${patternClass} ${className}`}
            data-theme={variant !== 'default' ? variant : undefined}
            aria-hidden="true"
        />
    );
};

export default GlobalBackground; 