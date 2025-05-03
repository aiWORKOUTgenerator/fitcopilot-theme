import { ActivitySquare, Check } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import AccordionSection, { AccordionSectionRef } from '../../../components/AccordionSection';
import { useJourney } from '../../../components/JourneyContext';
import { INJURY_CATEGORIES } from '../../constants/injuriesOptions';
import { InjuriesSelectorProps } from '../../types';
import { getMedicalCustomizationData, updateCustomizationSection } from '../../utils/customizationStorage';
import ConfirmButton from '../shared/ConfirmButton';
import './InjuriesSelector.scss';

/**
 * InjuriesSelector component for selecting injuries and limitations
 */
const InjuriesSelector = forwardRef<AccordionSectionRef, InjuriesSelectorProps>(({
    onValidChange,
    isCompleted = false,
    onConfirm
}, ref) => {
    const { registrationData, updateRegistrationData } = useJourney();

    // Get stored data if available
    const storedData = getMedicalCustomizationData();
    const storedInjuries = storedData.injuries || {};

    // Initialize state from stored data, falling back to registrationData if needed
    const [selectedInjuries, setSelectedInjuries] = useState<string[]>(
        storedInjuries.selectedInjuries || registrationData.selectedInjuries || []
    );

    const [otherInjuries, setOtherInjuries] = useState<string>(
        storedInjuries.otherInjuries || registrationData.otherInjuries || ''
    );

    // Always valid even if no injuries selected (user might not have any)
    const [isValid, setIsValid] = useState(true);

    // Initial validation on component mount - always valid for injuries
    useEffect(() => {
        setIsValid(true);
        onValidChange(true);
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    // Update registration data when selections change
    useEffect(() => {
        // Update registration data
        updateRegistrationData({
            selectedInjuries,
            otherInjuries
        });

        // Persist to local storage
        updateCustomizationSection('injuries', {
            selectedInjuries,
            otherInjuries: otherInjuries || undefined
        });

        // Always valid - user can have no injuries
        setIsValid(true);
        onValidChange(true);
    }, [selectedInjuries, otherInjuries, onValidChange, updateRegistrationData]);

    // Toggle injury selection
    const toggleInjury = (injury: string) => {
        setSelectedInjuries(prev => {
            if (prev.includes(injury)) {
                return prev.filter(i => i !== injury);
            }
            return [...prev, injury];
        });
    };

    // Prepare accordion title with completion indicator
    const sectionTitle = isCompleted ? (
        <div className="flex items-center">
            Injuries & Limitations
            <span className="ml-2 text-xs bg-emerald-800/30 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center">
                <Check size={12} className="mr-1" />
                Completed
            </span>
        </div>
    ) : 'Injuries & Limitations';

    return (
        <AccordionSection
            ref={ref}
            title={sectionTitle}
            icon={<ActivitySquare size={18} className={isCompleted ? 'text-emerald-400' : 'text-purple-300'} />}
            defaultOpen={false}
        >
            <div className="injuries-selector">
                <p className="section-description">
                    Select any injuries or physical limitations that apply to you. This helps us customize your workout to avoid exercises that might cause discomfort or aggravate existing conditions.
                </p>

                {/* Injuries by category */}
                {Object.entries(INJURY_CATEGORIES).map(([categoryKey, category]) => (
                    <div key={categoryKey} className="injury-category">
                        <h4 className="category-title">{category.label}</h4>
                        <div className="category-items">
                            {category.options.map((injury, index) => (
                                <div
                                    key={index}
                                    className={`injury-item ${selectedInjuries.includes(injury) ? 'selected' : ''}`}
                                    onClick={() => toggleInjury(injury)}
                                    role="checkbox"
                                    aria-checked={selectedInjuries.includes(injury)}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            toggleInjury(injury);
                                        }
                                    }}
                                >
                                    <div className="item-checkbox">
                                        {selectedInjuries.includes(injury) && <Check size={14} />}
                                    </div>
                                    <span className="item-label">{injury}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Other injuries input */}
                <div className="other-injuries">
                    <label htmlFor="other-injuries" className="other-label">
                        Other injuries or limitations not listed
                    </label>
                    <textarea
                        id="other-injuries"
                        className="other-input"
                        placeholder="Please describe any other injuries or limitations not listed above"
                        rows={3}
                        value={otherInjuries}
                        onChange={(e) => setOtherInjuries(e.target.value)}
                    />
                </div>

                {/* Selection summary */}
                {selectedInjuries.length > 0 && (
                    <div className="selection-summary">
                        <div className="summary-text">
                            {selectedInjuries.length} {selectedInjuries.length === 1 ? 'injury' : 'injuries'} selected
                        </div>
                    </div>
                )}

                {/* Confirm button */}
                <ConfirmButton
                    isValid={isValid}
                    onConfirm={onConfirm}
                    validationMessage="Click confirm to continue (no injuries is allowed)"
                    buttonText="Confirm Injuries"
                />
            </div>
        </AccordionSection>
    );
});

InjuriesSelector.displayName = 'InjuriesSelector';

export default InjuriesSelector; 