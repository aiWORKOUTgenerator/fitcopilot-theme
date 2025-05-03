import { Check, FileText } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import AccordionSection, { AccordionSectionRef } from '../../../components/AccordionSection';
import { useJourney } from '../../../components/JourneyContext';
import { LiabilityWaiverSelectorProps } from '../../types';
import { getMedicalCustomizationData, updateCustomizationSection } from '../../utils/customizationStorage';
import ConfirmButton from '../shared/ConfirmButton';
import './LiabilityWaiverSelector.scss';

/**
 * LiabilityWaiverSelector component for collecting agreement to the liability waiver
 */
const LiabilityWaiverSelector = forwardRef<AccordionSectionRef, LiabilityWaiverSelectorProps>(({
    onValidChange,
    isCompleted = false,
    onConfirm
}, ref) => {
    const { registrationData, updateRegistrationData } = useJourney();

    // Get stored data if available
    const storedData = getMedicalCustomizationData();
    const storedLiabilityWaiver = storedData.liabilityWaiver || {};

    // Initialize state from stored data, falling back to registrationData if needed
    const [hasAgreed, setHasAgreed] = useState(
        storedLiabilityWaiver.hasAgreed || registrationData.hasAgreedToLiability || false
    );

    const [isValid, setIsValid] = useState(false);

    // Initial validation on component mount
    useEffect(() => {
        setIsValid(hasAgreed);
        onValidChange(hasAgreed);
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    // Update validation status when selections change
    useEffect(() => {
        setIsValid(hasAgreed);
        onValidChange(hasAgreed);

        // Update registration data
        updateRegistrationData({
            hasAgreedToLiability: hasAgreed
        });

        // Persist to local storage
        updateCustomizationSection('liabilityWaiver', {
            hasAgreed,
            agreementDate: hasAgreed ? new Date().toISOString() : undefined
        });
    }, [hasAgreed, onValidChange, updateRegistrationData]);

    // Prepare accordion title with completion indicator
    const sectionTitle = isCompleted ? (
        <div className="flex items-center">
            Liability Waiver
            <span className="ml-2 text-xs bg-emerald-800/30 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center">
                <Check size={12} className="mr-1" />
                Completed
            </span>
        </div>
    ) : 'Liability Waiver';

    return (
        <AccordionSection
            ref={ref}
            title={sectionTitle}
            icon={<FileText size={18} className={isCompleted ? 'text-emerald-400' : 'text-purple-300'} />}
            defaultOpen={false}
        >
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

                {/* Confirm button */}
                <ConfirmButton
                    isValid={isValid}
                    onConfirm={onConfirm}
                    validationMessage="Please agree to the liability waiver to continue"
                    buttonText="Confirm Agreement"
                />
            </div>
        </AccordionSection>
    );
});

LiabilityWaiverSelector.displayName = 'LiabilityWaiverSelector';

export default LiabilityWaiverSelector; 