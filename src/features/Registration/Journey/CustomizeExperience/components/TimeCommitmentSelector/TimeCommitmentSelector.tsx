import { Check, Clock } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import AccordionSection, { AccordionSectionRef } from '../../../components/AccordionSection';
import { useJourney } from '../../../components/JourneyContext';
import { DURATION_OPTIONS, TIME_COMMITMENT_PACKAGES, TIME_OF_DAY_OPTIONS } from '../../constants/timeCommitmentOptions';
import { updateCustomizationSection } from '../../utils/customizationStorage';
import ConfirmButton from '../shared/ConfirmButton';
import './TimeCommitmentSelector.scss';

interface TimeCommitmentSelectorProps {
    onValidChange: (isValid: boolean) => void;
    isCompleted?: boolean;
    onConfirm: () => void;
}

/**
 * Enhanced time commitment selector component with smart option linking
 */
const TimeCommitmentSelector = forwardRef<AccordionSectionRef, TimeCommitmentSelectorProps>(({
    onValidChange,
    isCompleted = false,
    onConfirm
}, ref) => {
    const { registrationData, updateRegistrationData } = useJourney();

    // Initialize state from saved data
    const [timeOfDay, setTimeOfDay] = useState<string[]>(
        registrationData.preferredTimeOfDay || []
    );

    const [duration, setDuration] = useState<string>(
        registrationData.preferredDuration || ''
    );

    const [otherDuration, setOtherDuration] = useState<string>(
        registrationData.otherDuration || ''
    );

    const [selectedPackage, setSelectedPackage] = useState<string>(
        registrationData.timeCommitmentPackage || ''
    );

    const [isValid, setIsValid] = useState(false);

    // Update validation status when selections change
    useEffect(() => {
        const valid =
            (timeOfDay.length > 0 && (duration || otherDuration.trim())) ||
            !!selectedPackage;

        setIsValid(valid);
        onValidChange(valid);

        // Update registration data
        updateRegistrationData({
            preferredTimeOfDay: timeOfDay,
            preferredDuration: duration,
            otherDuration,
            timeCommitmentPackage: selectedPackage
        });

        // Persist to local storage
        updateCustomizationSection('timeCommitment', {
            preferredTimeOfDay: timeOfDay,
            preferredDuration: duration,
            otherDuration,
            timeCommitmentPackage: selectedPackage
        });
    }, [timeOfDay, duration, otherDuration, selectedPackage, onValidChange, updateRegistrationData]);

    // Toggle time of day selection
    const toggleTimeOfDay = (time: string) => {
        setTimeOfDay(prev => {
            if (prev.includes(time)) {
                return prev.filter(t => t !== time);
            }
            return [...prev, time];
        });
    };

    // Handle package selection
    const handlePackageSelect = (packageId: string) => {
        // If already selected, deselect it
        if (selectedPackage === packageId) {
            setSelectedPackage('');
            return;
        }

        setSelectedPackage(packageId);

        // Auto-select corresponding duration based on package
        const selectedPkg = TIME_COMMITMENT_PACKAGES.find(pkg => pkg.id === packageId);
        if (selectedPkg) {
            // Find closest matching duration option
            const durationMatch = DURATION_OPTIONS.find(opt =>
                opt.includes(selectedPkg.durationRange)
            );

            if (durationMatch) {
                setDuration(durationMatch);
                setOtherDuration('');
            }
        }
    };

    // Handle duration change
    const handleDurationChange = (newDuration: string) => {
        setDuration(newDuration);

        // Clear other duration if selecting a preset
        if (newDuration) {
            setOtherDuration('');
        }

        // Clear package selection since user is customizing
        if (selectedPackage) {
            setSelectedPackage('');
        }
    };

    // Handle other duration change
    const handleOtherDurationChange = (value: string) => {
        setOtherDuration(value);

        // Clear duration selection if entering custom text
        if (value.trim() && duration) {
            setDuration('');
        }

        // Clear package selection since user is customizing
        if (selectedPackage) {
            setSelectedPackage('');
        }
    };

    // Prepare accordion title with completion indicator
    const sectionTitle = isCompleted ? (
        <div className="flex items-center">
            Time Management
            <span className="ml-2 text-xs bg-emerald-800/30 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center">
                <Check size={12} className="mr-1" />
                Completed
            </span>
        </div>
    ) : 'Time Management';

    return (
        <AccordionSection
            ref={ref}
            title={sectionTitle}
            icon={<Clock size={18} className={isCompleted ? 'text-emerald-400' : 'text-cyan-300'} />}
            defaultOpen={false}
        >
            <div className="time-commitment-selector">
                {/* Quick selection package cards */}
                <div className="package-selection">
                    <h4 className="section-subtitle">Quick Selection</h4>
                    <p className="section-description">
                        Choose a pre-configured time commitment package or customize your own settings below
                    </p>

                    <div className="package-cards">
                        {TIME_COMMITMENT_PACKAGES.map((pkg) => (
                            <div
                                key={pkg.id}
                                className={`package-card ${selectedPackage === pkg.id ? 'selected' : ''}`}
                                onClick={() => handlePackageSelect(pkg.id)}
                                role="radio"
                                aria-checked={selectedPackage === pkg.id}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handlePackageSelect(pkg.id);
                                    }
                                }}
                            >
                                <div className="card-header">
                                    <div className="card-title">{pkg.label}</div>
                                    {selectedPackage === pkg.id && (
                                        <div className="card-check">
                                            <Check size={14} />
                                        </div>
                                    )}
                                </div>
                                <div className="card-description">{pkg.description}</div>
                                <div className="card-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Frequency:</span>
                                        <span className="detail-value">{pkg.frequencyRange}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Duration:</span>
                                        <span className="detail-value">{pkg.durationRange}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Weekly:</span>
                                        <span className="detail-value">{pkg.totalWeeklyTime}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="divider">
                    <span className="divider-text">Or customize</span>
                </div>

                {/* Time of Day Selection */}
                <div className="time-of-day-section">
                    <h4 className="section-subtitle">Time of Day</h4>
                    <p className="section-description">
                        When do you typically prefer to work out? (Select all that apply)
                    </p>

                    <div className="time-chips">
                        {TIME_OF_DAY_OPTIONS.map((time, index) => (
                            <div
                                key={index}
                                className={`time-chip ${timeOfDay.includes(time) ? 'selected' : ''}`}
                                onClick={() => toggleTimeOfDay(time)}
                                role="checkbox"
                                aria-checked={timeOfDay.includes(time)}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        toggleTimeOfDay(time);
                                    }
                                }}
                            >
                                {time}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Duration Selection */}
                <div className="duration-section">
                    <h4 className="section-subtitle">Duration Options</h4>
                    <p className="section-description">
                        How long do you typically prefer your workouts to be?
                    </p>

                    <div className="duration-options">
                        {DURATION_OPTIONS.map((option, index) => (
                            <div key={index} className="duration-option">
                                <input
                                    type="radio"
                                    id={`duration-${index}`}
                                    name="duration"
                                    className="radio-input"
                                    checked={duration === option}
                                    onChange={() => handleDurationChange(option)}
                                />
                                <label
                                    htmlFor={`duration-${index}`}
                                    className="radio-label"
                                >
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="other-duration">
                        <label htmlFor="other-duration" className="other-label">
                            Other preferred duration
                        </label>
                        <textarea
                            id="other-duration"
                            className="other-input"
                            placeholder="Please specify any other preferred workout duration"
                            rows={1}
                            value={otherDuration}
                            onChange={(e) => handleOtherDurationChange(e.target.value)}
                        />
                    </div>
                </div>

                {/* Selection summary */}
                {(timeOfDay.length > 0 || selectedPackage) && (
                    <div className="selection-summary">
                        {selectedPackage ? (
                            <div className="summary-text">
                                Package selected: {TIME_COMMITMENT_PACKAGES.find(pkg => pkg.id === selectedPackage)?.label || selectedPackage}
                            </div>
                        ) : timeOfDay.length > 0 && (
                            <div className="summary-text">
                                {timeOfDay.length} time preference{timeOfDay.length !== 1 ? 's' : ''} selected
                            </div>
                        )}
                    </div>
                )}

                {/* Confirm button */}
                <ConfirmButton
                    isValid={isValid}
                    onConfirm={onConfirm}
                    validationMessage="Please select a package or specify your time preferences"
                />
            </div>
        </AccordionSection>
    );
});

TimeCommitmentSelector.displayName = 'TimeCommitmentSelector';

export default TimeCommitmentSelector;