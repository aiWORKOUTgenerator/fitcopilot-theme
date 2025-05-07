import React from 'react';
import { SectionHeaderProps, VariantKey, isVariant } from '../types';

/**
 * Get variant-specific accent color for header using semantic CSS classes
 */
const getAccentColorClass = (variant: VariantKey): string => {
    // All variants use the same semantic CSS class which is themed properly via CSS variables
    return 'text-journey-accent';
};

/**
 * Get variant-specific header emphasis class for enhanced typography
 */
const getHeaderEmphasisClass = (variant: VariantKey): string => {
    if (isVariant(variant, 'gym')) {
        return 'font-bold';
    } else if (isVariant(variant, 'sports')) {
        return 'font-extrabold';
    } else if (isVariant(variant, 'wellness')) {
        return 'font-semibold';
    } else if (isVariant(variant, 'modern')) {
        return 'font-bold tracking-wide';
    }

    return 'font-bold';
};

/**
 * SectionHeader component for Journey section
 */
const SectionHeader: React.FC<SectionHeaderProps> = (props) => {
    const {
        title = <>How It <span className="text-journey-accent">Works</span></>,
        description = "Follow these simple steps to get started with your personalized workout program, powered by our advanced AI technology.",
        variant
    } = props;

    // If title is a string, wrap it with default formatting
    const formattedTitle = typeof title === 'string'
        ? (
            <>
                {title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className={getAccentColorClass(variant)}>{title.split(' ').slice(-1)}</span>
            </>
        )
        : title;

    const headerEmphasis = getHeaderEmphasisClass(variant);

    return (
        <div
            className="w-full text-center mb-8 md:mb-12 lg:mb-16"
            data-aos="fade-up"
            data-theme={variant !== 'default' ? variant : undefined}
        >
            <h2 className={`${headerEmphasis} mb-4 text-center text-white`}>
                {formattedTitle}
            </h2>
            <p className="w-full text-gray-400 mx-auto text-center max-w-md md:max-w-xl lg:max-w-2xl" style={{ textAlign: 'center' }}>
                {description}
            </p>
        </div>
    );
};

export default SectionHeader; 