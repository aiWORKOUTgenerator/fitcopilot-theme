import React from 'react';

export type BackgroundVariant = 'default' | 'grid' | 'gradient' | 'none';
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type SpacingSize = 'none' | 'sm' | 'md' | 'lg';
export type VariantKey = 'default' | 'gym' | 'sports' | 'modern' | 'registration';

export interface SectionProps {
    id?: string;
    className?: string;
    backgroundVariant?: BackgroundVariant;
    backgroundClass?: string;
    children: React.ReactNode;
    containerSize?: ContainerSize;
    spacing?: SpacingSize;
    variant?: VariantKey;
    containerClassName?: string;
}

/**
 * Standardized Section component for consistent layout across the site
 * Used to wrap content sections with proper spacing, backgrounds, and containers
 */
const Section: React.FC<SectionProps> = ({
    id,
    className = '',
    backgroundVariant = 'default',
    backgroundClass = '',
    children,
    containerSize = 'xl',
    spacing = 'lg',
    variant = 'default',
    containerClassName = '',
}) => {
    // Background class mapping
    const backgroundClasses = {
        'default': 'bg-gray-900',
        'grid': 'bg-gray-900 section-bg-grid',
        'gradient': 'bg-gray-900 section-bg-gradient',
        'none': ''
    };

    // Container size mapping
    const containerClasses = {
        'sm': 'max-w-3xl',
        'md': 'max-w-4xl',
        'lg': 'max-w-5xl',
        'xl': 'max-w-6xl',
        'full': 'w-full'
    };

    // Spacing mapping
    const spacingClasses = {
        'none': '',
        'sm': 'py-8 md:py-12',
        'md': 'py-16 md:py-20',
        'lg': 'py-20 md:py-24'
    };

    const bgClass = backgroundClass || backgroundClasses[backgroundVariant];

    return (
        <section
            id={id}
            className={`section-component ${bgClass} overflow-hidden relative ${className}`}
            data-variant={variant}
        >
            {/* Section content wrapping container */}
            <div className={`container mx-auto px-4 ${containerClasses[containerSize]} ${spacingClasses[spacing]} relative z-10 ${containerClassName}`}>
                {children}
            </div>
        </section>
    );
};

export default Section; 