import { ChevronRight } from 'lucide-react';
import React from 'react';
import { ExtendedCSSProperties } from '../../../../types/components';
import { StepCTAProps as LocalStepCTAProps } from '../types';
import { getStepCTAUrl } from '../utils/tokenUtils';

/**
 * StepCTA - Renders the call-to-action button for journey steps
 * 
 * @param {LocalStepCTAProps} props - Properties for StepCTA
 * @returns {JSX.Element} Rendered StepCTA component 
 */
const StepCTA: React.FC<LocalStepCTAProps> = ({
    step,
    _isExpanded,
    variant = 'default',
    className,
    ...rest
}) => {
    const ctaUrl = getStepCTAUrl(step.title || '');

    // Custom CSS properties with proper typing
    const customStyle: ExtendedCSSProperties = {
        '--journey-cta-highlight': step.accentColor || 'var(--color-journey-accent)',
    };

    return (
        <div className="text-center">
            <a
                href={ctaUrl}
                className={`journey-button inline-flex items-center px-6 py-2 rounded-full text-sm font-medium ${className || ''}`}
                aria-label={`${step.ctaText} for ${step.title}`}
                data-theme={variant !== 'default' ? variant : undefined}
                style={customStyle}
                {...rest}
            >
                {step.ctaText}
                <ChevronRight size={16} className="ml-2" aria-hidden="true" />
            </a>
        </div>
    );
};

export default StepCTA; 