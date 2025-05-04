import { AlertCircle, Check, Loader2 } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import AccordionSection, { AccordionSectionRef } from '../AccordionSection';
import './StandardSection.scss';
import { StandardSectionProps } from './types';

/**
 * StandardSection component provides a consistent UI pattern for sections
 * in the customization journey with built-in validation, loading states,
 * error handling, and completion indicators.
 */
const StandardSection = forwardRef<AccordionSectionRef, StandardSectionProps>(
    ({
        title,
        icon,
        description,
        sectionId,
        onValidChange,
        isCompleted = false,
        onConfirm,
        className = '',
        required = false,
        error = null,
        isLoading = false,
        children
    }, ref) => {
        const [isValid, setIsValid] = useState<boolean>(false);

        // Report validity changes to parent
        useEffect(() => {
            onValidChange(isValid);
        }, [isValid, onValidChange]);

        // Create formatted section title with completion indicator
        const formattedTitle = (
            <div className="standard-section-title">
                {icon && <span className="section-icon">{icon}</span>}
                <span className="section-title-text">{title}</span>
                {required && <span className="section-required-badge">Required</span>}
                {isCompleted && (
                    <span className="section-completed-badge">
                        <Check size={12} />
                        <span>Completed</span>
                    </span>
                )}
            </div>
        );

        return (
            <div className={`standard-section ${className} ${isCompleted ? 'completed' : ''}`} id={`section-${sectionId}`}>
                <AccordionSection
                    title={formattedTitle}
                    ref={ref}
                    className={`standard-section-accordion ${isCompleted ? 'completed' : ''}`}
                    defaultExpanded={false}
                >
                    {description && <p className="section-description">{description}</p>}

                    {/* Error message */}
                    {error && (
                        <div className="section-error">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Loading indicator */}
                    {isLoading ? (
                        <div className="section-loading">
                            <Loader2 size={24} className="animate-spin" />
                            <span>Loading...</span>
                        </div>
                    ) : (
                        <div className="section-content">
                            {/* Render children with isValid setter as a prop */}
                            {React.Children.map(children, child => {
                                if (React.isValidElement(child)) {
                                    return React.cloneElement(child as React.ReactElement<any>, {
                                        setIsValid,
                                        isValid
                                    });
                                }
                                return child;
                            })}
                        </div>
                    )}

                    {/* Confirm button shown only if not loading and not completed */}
                    {!isLoading && !isCompleted && (
                        <div className="section-actions">
                            <button
                                className={`section-confirm-btn ${isValid ? 'valid' : 'disabled'}`}
                                onClick={onConfirm}
                                disabled={!isValid}
                            >
                                <Check size={16} />
                                <span>Confirm Selection</span>
                            </button>
                        </div>
                    )}
                </AccordionSection>
            </div>
        );
    }
);

// Display name for debugging
StandardSection.displayName = 'StandardSection';

export default StandardSection; 