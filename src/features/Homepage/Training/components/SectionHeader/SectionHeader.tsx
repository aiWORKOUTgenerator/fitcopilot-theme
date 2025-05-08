import React from 'react';
import { VariantKey } from '../../types';
import { createAriaProps } from '../../utils/accessibilityHelpers';
import { ThemeableComponent, applyTheme, getProgramToken } from '../../utils/themeUtils';
import './SectionHeader.scss';

/**
 * Props for the SectionHeader component
 */
export interface SectionHeaderProps {
    /**
     * Title text for the section
     */
    title: string;

    /**
     * Optional description text
     */
    description?: string;

    /**
     * Optional tag text displayed above the title
     */
    tagText?: string;

    /**
     * Theme variant
     */
    variant?: VariantKey;

    /**
     * Whether to highlight the last word of the title
     */
    highlightLastWord?: boolean;

    /**
     * Program type for gradient highlighting (strength, fatLoss, etc.)
     * Used when highlighting text with program-specific gradients
     */
    programType?: string;

    /**
     * Custom CSS class name
     */
    className?: string;

    /**
     * ID for ARIA labelling
     */
    id?: string;
}

/**
 * SectionHeader theme configuration
 */
const sectionHeaderTheme: ThemeableComponent = {
    baseClass: 'section-header',
    tokenMappings: {
        base: { category: 'background', subcategory: 'primary' },
        title: { category: 'text', subcategory: 'primary' },
        titleHighlight: { category: 'highlight', subcategory: 'primary' },
        description: { category: 'text', subcategory: 'secondary' },
        tag: { category: 'text', subcategory: 'accent' }
    }
};

/**
 * Reusable section header component with consistent styling across variants
 * 
 * @param props Component props
 * @returns React component
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    description,
    tagText,
    variant = 'default',
    highlightLastWord = true,
    programType = 'strength',
    className = '',
    id = 'section-header',
}) => {
    // Split title for highlighting if enabled
    const titleParts = highlightLastWord
        ? {
            main: title.split(' ').slice(0, -1).join(' '),
            highlight: title.split(' ').slice(-1)[0],
        }
        : { main: title, highlight: '' };

    // Apply theme tokens to the component
    const headerClasses = applyTheme(sectionHeaderTheme, variant, className);

    // Construct gradient class for highlighted text
    const gradientClass = programType ? getProgramToken(programType, 'gradient') : '';

    // Create ARIA props
    const ariaProps = createAriaProps({
        role: 'heading',
        labelledById: id
    });

    return (
        <div className={headerClasses}>
            {tagText && (
                <span className="section-header__tag">{tagText}</span>
            )}

            <h2 className="section-header__title" id={id} {...ariaProps}>
                {titleParts.main}{' '}
                {highlightLastWord && (
                    <span className={`section-header__title-highlight ${gradientClass}`}>
                        {titleParts.highlight}
                    </span>
                )}
            </h2>

            {description && (
                <p
                    className="section-header__description"
                    id={`${id}-description`}
                    aria-labelledby={id}
                >
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeader; 