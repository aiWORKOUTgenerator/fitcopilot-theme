import { Check, FileText } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import { AccordionSectionRef } from '../../../components/AccordionSection';
import { SECTION_IDS } from '../../constants/sectionConstants';
import { useMedicalCustomization } from '../../context/MedicalCustomizationContext';
import { LiabilityWaiverSelectorProps, SectionComponentProps } from '../../types';
import { announceToScreenReader } from '../../utils/a11y';
import StandardSection from '../StandardSection';
import './LiabilityWaiverSelector.scss';

/**
 * LiabilityWaiverInnerForm component handles the form fields and validation
 */
const LiabilityWaiverInnerForm: React.FC<SectionComponentProps> = ({
    setIsValid,
    isValid
}) => {
    const { state, updateSectionData } = useMedicalCustomization();
    const liabilityWaiver = state.liabilityWaiver || {};

    // Initialize state from context data
    const [hasAgreed, setHasAgreed] = useState(
        liabilityWaiver.hasAgreed || false
    );

    // Update validation status when checkbox changes
    useEffect(() => {
        // Report validity to parent StandardSection
        if (setIsValid) {
            setIsValid(hasAgreed);
        }

        // Update context with debouncing
        const timeoutId = setTimeout(() => {
            updateSectionData('liabilityWaiver', {
                hasAgreed,
                agreementDate: hasAgreed ? new Date().toISOString() : undefined
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [hasAgreed, setIsValid, updateSectionData]);

    return (
        <div className="liability-waiver-selector">
            <p className="section-description">
                Please read and agree to the following liability waiver before proceeding.
            </p>

            <div className="waiver-text">
                <h4 className="waiver-title">Release of Liability</h4>

                <p>
                    By using FitCopilot's services and participating in any recommended exercise programs,
                    I acknowledge that there are certain inherent risks associated with physical activity.
                </p>

                <p>
                    I understand that FitCopilot is not a licensed healthcare provider and that the exercise
                    recommendations are algorithmic suggestions based on the information I have provided.
                </p>

                <p>
                    I hereby release FitCopilot, its partners, employees, and affiliates from any liability,
                    claims, demands, and causes of action arising from my participation in the recommended
                    exercise programs or related activities.
                </p>

                <p>
                    I understand that I should consult with a healthcare professional before beginning any
                    exercise program, especially if I have any pre-existing health conditions or concerns.
                </p>

                <p>
                    I agree to exercise according to my abilities and to discontinue activity and seek
                    medical attention if I experience unusual discomfort or physical distress.
                </p>
            </div>

            <div className="agreement-container">
                <div
                    className={`agreement-checkbox ${hasAgreed ? 'checked' : ''}`}
                    onClick={() => setHasAgreed(!hasAgreed)}
                    role="checkbox"
                    aria-checked={hasAgreed}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setHasAgreed(!hasAgreed);
                        }
                    }}
                >
                    <div className="checkbox">
                        {hasAgreed && <Check size={14} />}
                    </div>
                    <span className="agreement-text">
                        I have read and agree to the Release of Liability Waiver
                    </span>
                </div>
            </div>
        </div>
    );
};

/**
 * LiabilityWaiverSelector component for collecting agreement to the liability waiver
 * Refactored to use StandardSection and MedicalCustomizationContext
 */
const LiabilityWaiverSelector = forwardRef<AccordionSectionRef, LiabilityWaiverSelectorProps>(({
    onValidChange,
    isCompleted = false,
    onConfirm
}, ref) => {
    const { updateSectionValidity, error, isLoading, markSectionComplete } = useMedicalCustomization();

    // Handle validity change
    const handleValidChange = (isValid: boolean) => {
        updateSectionValidity(SECTION_IDS.liabilityWaiver, isValid);
        onValidChange(isValid);
    };

    // Handle confirmation
    const handleConfirm = () => {
        markSectionComplete(SECTION_IDS.liabilityWaiver);
        announceToScreenReader('Liability waiver agreement saved successfully');
        onConfirm();
    };

    return (
        <StandardSection
            ref={ref}
            sectionId={SECTION_IDS.liabilityWaiver}
            title="Liability Waiver"
            icon={<FileText size={18} />}
            description="Please review and agree to our liability terms"
            isCompleted={isCompleted}
            onValidChange={handleValidChange}
            onConfirm={handleConfirm}
            error={error}
            isLoading={isLoading}
            required={true}
        >
            <LiabilityWaiverInnerForm />
        </StandardSection>
    );
});

LiabilityWaiverSelector.displayName = 'LiabilityWaiverSelector';

export default LiabilityWaiverSelector; 