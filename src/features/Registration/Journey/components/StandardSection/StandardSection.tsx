/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { announceToScreenReader, focusFirstTabbableElement } from '../../CustomizeExperience/utils/a11y';
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
    children,
    onOpen,
    onClose
  }, ref) => {
    const [isValid, setIsValid] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const sectionHeadingRef = useRef<HTMLDivElement>(null);

    // Report validity changes to parent
    useEffect(() => {
      onValidChange(isValid);
    }, [isValid, onValidChange]);

    // Handle section opening - focus first interactive element
    const handleOpen = useCallback(() => {
      // Announce section opening to screen readers
      announceToScreenReader(`${typeof title === 'string' ? title : 'Section'} opened`);

      // Find and focus first interactive element
      setTimeout(() => {
        focusFirstTabbableElement(contentRef.current);
      }, 100);

      if (onOpen) onOpen();
    }, [title, onOpen]);

    // Handle section closing - return focus to heading
    const handleClose = useCallback(() => {
      if (sectionHeadingRef.current) {
        sectionHeadingRef.current.focus();
      }

      if (onClose) onClose();
    }, [onClose]);

    // Create formatted section title with completion indicator
    const formattedTitle = (
      <div className="standard-section-title" ref={sectionHeadingRef}>
        {icon && <span className="section-icon">{icon}</span>}
        <span className="section-title-text">{title}</span>
        {required && (
          <span className="section-required-badge" aria-label="Required section">
            Required
          </span>
        )}
        {isCompleted && (
          <span
            className="section-completed-badge"
            aria-label="Section completed"
          >
            <Check size={12} />
            <span>Completed</span>
          </span>
        )}
      </div>
    );

    return (
      <div
        className={`standard-section ${className} ${isCompleted ? 'completed' : ''}`}
        id={`section-${sectionId}`}
      >
        <AccordionSection
          title={formattedTitle}
          ref={ref}
          className={`standard-section-accordion ${isCompleted ? 'completed' : ''}`}
          defaultExpanded={false}
          onOpenStateChange={(isOpen) => isOpen ? handleOpen() : handleClose()}
        >
          {description && (
            <p className="section-description">{description}</p>
          )}

          {/* Error message */}
          {error && (
            <div className="section-error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading ? (
            <div className="section-loading" aria-live="polite">
              <Loader2 size={24} className="animate-spin" aria-hidden="true" />
              <span>Loading...</span>
            </div>
          ) : (
            <div className="section-content" ref={contentRef}>
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
                aria-disabled={!isValid}
              >
                <Check size={16} aria-hidden="true" />
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