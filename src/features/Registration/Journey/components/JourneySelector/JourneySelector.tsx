import { Check } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import { AccordionSectionRef } from '../AccordionSection';
import './JourneySelector.scss';

// Define interface for the child component props
interface JourneySelectorChildProps {
    setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
    isValid: boolean;
}

export interface JourneySelectorProps {
    /**
     * Unique identifier for the selector
     */
    selectorId: string;

    /**
     * Title displayed in the header
     */
    title: string;

    /**
     * Icon displayed next to the title
     */
    icon?: React.ReactNode;

    /**
     * Description text
     */
    description?: string;

    /**
     * Main accent color theme
     */
    accentColor?: 'lime' | 'amber' | 'cyan' | 'violet';

    /**
     * Whether the selector requires a selection
     */
    required?: boolean;

    /**
     * Whether the selector is completed
     */
    isCompleted?: boolean;

    /**
     * Callback when validity changes
     */
    onValidChange: (isValid: boolean) => void;

    /**
     * Callback when confirm button is clicked
     */
    onConfirm: () => void;

    /**
     * Additional class names
     */
    className?: string;

    /**
     * Error message to display
     */
    error?: string | null;

    /**
     * Loading state
     */
    isLoading?: boolean;

    /**
     * Whether to show the confirm button
     */
    showConfirmButton?: boolean;

    /**
     * Children content
     */
    children: React.ReactNode;
}

/**
 * Base component for selection components in the Journey
 */
const JourneySelector = forwardRef<AccordionSectionRef, JourneySelectorProps>(({
  selectorId,
  title,
  icon,
  description,
  accentColor = 'lime',
  required = true,
  isCompleted = false,
  onValidChange,
  onConfirm,
  className = '',
  error = null,
  isLoading = false,
  showConfirmButton = true,
  children
}, _ref) => {
  const [isValid, setIsValid] = useState(false);

  // Forward validity state to parent
  useEffect(() => {
    onValidChange(isValid);
  }, [isValid, onValidChange]);

  return (
    <div
      className={`journey-selector ${accentColor}-accent ${className} ${isCompleted ? 'completed' : ''}`}
      id={`selector-${selectorId}`}
    >
      <div className="journey-selector-header">
        <div className="selector-title-area">
          {icon && <span className="selector-icon">{icon}</span>}
          <h3 className="selector-title">{title}</h3>
          {required && (
            <span className="required-badge">Required</span>
          )}
          {isCompleted && (
            <span className="completed-badge">
              <Check size={12} />
              <span>Completed</span>
            </span>
          )}
        </div>
      </div>

      <div className="journey-selector-content">
        {description && (
          <p className="selector-description">{description}</p>
        )}

        {error && (
          <div className="selector-error" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="selector-loading">
            <span>Loading...</span>
          </div>
        ) : (
          <div className="selector-content">
            {/* Pass isValid/setIsValid to children */}
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<JourneySelectorChildProps>, {
                  setIsValid,
                  isValid
                });
              }
              return child;
            })}
          </div>
        )}

        {!isLoading && !isCompleted && showConfirmButton && (
          <div className="selector-actions">
            <button
              className={`confirm-button ${isValid ? 'active' : 'disabled'}`}
              onClick={onConfirm}
              disabled={!isValid}
            >
              <Check size={16} />
              <span>Confirm Selection</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

JourneySelector.displayName = 'JourneySelector';

export default JourneySelector; 