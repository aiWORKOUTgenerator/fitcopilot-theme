import classNames from 'classnames';
import React from 'react';

// Using a simplified version of VariantKey since we can't directly access the Hero types
type VariantKey = 'default' | 'gym' | 'sports' | 'wellness' | 'modern' | 'classic' | 'minimalist';
type BackgroundColorType = 'primary' | 'secondary' | 'tertiary' | 'surface' | 'none';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    id?: string;
    variant?: VariantKey;
    backgroundColor?: BackgroundColorType;
    backgroundVariant?: 'default' | 'grid' | 'gradient' | 'none';
    containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    spacing?: 'none' | 'sm' | 'md' | 'lg';
    containerClassName?: string;
    seamless?: boolean;
    hasTopBorder?: boolean;
    hasBottomBorder?: boolean;
}

export const Section: React.FC<SectionProps> = ({
    id,
    variant = 'default',
    backgroundColor = 'primary',
    backgroundVariant = 'default',
    containerSize = 'xl',
    spacing = 'lg',
    className = '',
    containerClassName = '',
    seamless = false,
    hasTopBorder = false,
    hasBottomBorder = false,
    children,
    ...rest
}) => {
    // Background color mapping using the enhanced color system
    const backgroundColorClasses = {
        'primary': 'bg-background-primary',
        'secondary': 'bg-background-secondary',
        'tertiary': 'bg-background-tertiary',
        'surface': 'bg-surface-primary',
        'none': ''
    };

    // Background variant mapping
    const backgroundVariantClasses = {
        'default': '',
        'grid': 'section-bg-grid',
        'gradient': 'section-bg-gradient',
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

    // Border classes
    const borderClasses = classNames({
        'border-t border-border-light': hasTopBorder,
        'border-b border-border-light': hasBottomBorder
    });

    return (
        <section
            id={id}
            className={classNames(
                'section-component',
                backgroundColorClasses[backgroundColor],
                backgroundVariantClasses[backgroundVariant],
                borderClasses,
                seamless ? 'section-seamless' : '',
                'overflow-hidden relative',
                className
            )}
            data-theme={variant !== 'default' ? variant : undefined}
            {...rest}
        >
            <div className={classNames(
                'container mx-auto px-4',
                containerClasses[containerSize],
                spacingClasses[spacing],
                'relative z-10',
                containerClassName
            )}>
                {children}
            </div>
        </section>
    );
};

export default Section; 