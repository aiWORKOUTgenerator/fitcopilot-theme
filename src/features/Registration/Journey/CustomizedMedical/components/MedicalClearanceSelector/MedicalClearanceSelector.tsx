import { Heart } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import { AccordionSectionRef } from '../../../components/AccordionSection';
import { MEDICAL_HISTORY_OPTIONS } from '../../constants/anthropometricsOptions';
import { SECTION_IDS } from '../../constants/sectionConstants';
import { useMedicalCustomization } from '../../context/MedicalCustomizationContext';
import { MedicalClearanceSelectorProps, SectionComponentProps } from '../../types';
import { announceToScreenReader } from '../../utils/a11y';
import StandardSection from '../StandardSection';
import './MedicalClearanceSelector.scss';

/**
 * MedicalClearanceInnerForm component handles the form fields and validation
 */
const MedicalClearanceInnerForm: React.FC<SectionComponentProps> = ({
  setIsValid,
  _isValid
}) => {
  const { state, updateSectionData } = useMedicalCustomization();
  const medicalClearance = state.medicalClearance || {};

  // Initialize state from context data
  const [hasDisease, setHasDisease] = useState<'yes' | 'no' | 'not-sure' | ''>(
    medicalClearance.hasDisease || ''
  );

  const [additionalDetails, setAdditionalDetails] = useState(
    medicalClearance.additionalDetails || ''
  );

  // Validate and update context
  useEffect(() => {
    const valid = hasDisease !== '';

    // Report validity to parent StandardSection
    if (setIsValid) {
      setIsValid(valid);
    }

    // Update context with debouncing
    const timeoutId = setTimeout(() => {
      updateSectionData('medicalClearance', {
        hasDisease: hasDisease === '' ? undefined : hasDisease,
        additionalDetails: additionalDetails || undefined
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [hasDisease, additionalDetails, setIsValid, updateSectionData]);

  return (
    <div className="medical-clearance-selector">
      <p className="section-description">
        Please answer the following question about your medical history. This information helps us ensure your workout plan is safe for you.
      </p>

      <div className="medical-question">
        <h4 className="question-text">
          Have you ever suffered from renal, metabolic, or cardiovascular disease?
        </h4>

        <div className="options-container" role="radiogroup" aria-labelledby="medical-question-label">
          <span id="medical-question-label" className="sr-only">Medical history question</span>
          {MEDICAL_HISTORY_OPTIONS.map((option) => (
            <div
              key={option.value}
              className={`option-item ${hasDisease === option.value ? 'selected' : ''}`}
              onClick={() => setHasDisease(option.value as 'yes' | 'no' | 'not-sure')}
              role="radio"
              aria-checked={hasDisease === option.value}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setHasDisease(option.value as 'yes' | 'no' | 'not-sure');
                }
              }}
            >
              <div className="radio-circle">
                {hasDisease === option.value && <div className="radio-dot"></div>}
              </div>
              <span className="option-label">{option.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional details - shown if "Yes" or "Not sure" is selected */}
      {(hasDisease === 'yes' || hasDisease === 'not-sure') && (
        <div className="additional-details">
          <label htmlFor="additional-details" className="details-label">
            Please provide additional details
          </label>
          <textarea
            id="additional-details"
            className="details-input"
            placeholder="Please provide details about your condition"
            rows={3}
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            aria-label="Additional medical details"
          />
          {hasDisease === 'yes' && (
            <p className="disclaimer-text">
              Note: We recommend consulting with a healthcare professional before starting any new exercise program.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * MedicalClearanceSelector component for collecting medical history information
 * Refactored to use StandardSection and MedicalCustomizationContext
 */
const MedicalClearanceSelector = forwardRef<AccordionSectionRef, MedicalClearanceSelectorProps>(({
  onValidChange,
  isCompleted = false,
  onConfirm
}, ref) => {
  const { updateSectionValidity, error, isLoading, markSectionComplete } = useMedicalCustomization();

  // Handle validity change
  const handleValidChange = (isValid: boolean) => {
    updateSectionValidity(SECTION_IDS.medicalClearance, isValid);
    onValidChange(isValid);
  };

  // Handle confirmation
  const handleConfirm = () => {
    markSectionComplete(SECTION_IDS.medicalClearance);
    announceToScreenReader('Medical clearance information saved successfully');
    onConfirm();
  };

  return (
    <StandardSection
      ref={ref}
      sectionId={SECTION_IDS.medicalClearance}
      title="Medical Clearance"
      icon={<Heart size={18} />}
      description="Medical information to ensure your safety during workouts"
      isCompleted={isCompleted}
      onValidChange={handleValidChange}
      onConfirm={handleConfirm}
      error={error}
      isLoading={isLoading}
      required={true}
    >
      <MedicalClearanceInnerForm />
    </StandardSection>
  );
});

MedicalClearanceSelector.displayName = 'MedicalClearanceSelector';

export default MedicalClearanceSelector; 