import { Check, Heart } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import AccordionSection, { AccordionSectionRef } from '../../../components/AccordionSection';
import { useJourney } from '../../../components/JourneyContext';
import { MEDICAL_HISTORY_OPTIONS } from '../../constants/anthropometricsOptions';
import { MedicalClearanceSelectorProps } from '../../types';
import { getMedicalCustomizationData, updateCustomizationSection } from '../../utils/customizationStorage';
import ConfirmButton from '../shared/ConfirmButton';
import './MedicalClearanceSelector.scss';

/**
 * MedicalClearanceSelector component for collecting medical history information
 */
const MedicalClearanceSelector = forwardRef<AccordionSectionRef, MedicalClearanceSelectorProps>(({
    onValidChange,
    isCompleted = false,
    onConfirm
}, ref) => {
    const { registrationData, updateRegistrationData } = useJourney();

    // Get stored data if available
    const storedData = getMedicalCustomizationData();
    const storedMedicalClearance = storedData.medicalClearance || {};

    // Initialize state from stored data, falling back to registrationData if needed
    const [hasDisease, setHasDisease] = useState(
        storedMedicalClearance.hasDisease || registrationData.hasDisease || ''
    );

    const [additionalDetails, setAdditionalDetails] = useState(
        storedMedicalClearance.additionalDetails || registrationData.medicalDetails || ''
    );

    const [isValid, setIsValid] = useState(false);

    // Initial validation on component mount
    useEffect(() => {
        const valid = hasDisease !== '';
        setIsValid(valid);
        onValidChange(valid);
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    // Validate and update parent
    useEffect(() => {
        const valid = hasDisease !== '';
        setIsValid(valid);
        onValidChange(valid);

        // Update registration data
        updateRegistrationData({
            hasDisease,
            medicalDetails: additionalDetails
        });

        // Persist to local storage
        updateCustomizationSection('medicalClearance', {
            hasDisease: hasDisease === '' ? undefined : hasDisease as 'yes' | 'no' | 'not-sure',
            additionalDetails: additionalDetails || undefined
        });
    }, [hasDisease, additionalDetails, onValidChange, updateRegistrationData]);

    // Prepare accordion title with completion indicator
    const sectionTitle = isCompleted ? (
        <div className="flex items-center">
            Medical Clearance
            <span className="ml-2 text-xs bg-emerald-800/30 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center">
                <Check size={12} className="mr-1" />
                Completed
            </span>
        </div>
    ) : 'Medical Clearance';

    return (
        <AccordionSection
            ref={ref}
            title={sectionTitle}
            icon={<Heart size={18} className={isCompleted ? 'text-emerald-400' : 'text-purple-300'} />}
            defaultOpen={false}
        >
            <div className="medical-clearance-selector">
                <p className="section-description">
                    Please answer the following question about your medical history. This information helps us ensure your workout plan is safe for you.
                </p>

                <div className="medical-question">
                    <h4 className="question-text">
                        Have you ever suffered from renal, metabolic, or cardiovascular disease?
                    </h4>

                    <div className="options-container">
                        {MEDICAL_HISTORY_OPTIONS.map((option) => (
                            <div
                                key={option.value}
                                className={`option-item ${hasDisease === option.value ? 'selected' : ''}`}
                                onClick={() => setHasDisease(option.value)}
                                role="radio"
                                aria-checked={hasDisease === option.value}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setHasDisease(option.value);
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
                        />
                        {hasDisease === 'yes' && (
                            <p className="disclaimer-text">
                                Note: We recommend consulting with a healthcare professional before starting any new exercise program.
                            </p>
                        )}
                    </div>
                )}

                {/* Confirm button */}
                <ConfirmButton
                    isValid={isValid}
                    onConfirm={onConfirm}
                    validationMessage="Please answer the medical history question"
                    buttonText="Confirm Medical Information"
                />
            </div>
        </AccordionSection>
    );
});

MedicalClearanceSelector.displayName = 'MedicalClearanceSelector';

export default MedicalClearanceSelector; 